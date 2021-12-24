var Imported = Imported || {};
Imported.sp_Animations = 'sp_Animations';

var standardPlayer = standardPlayer || { params: {} };
standardPlayer.sp_Animations = standardPlayer.sp_Animations || { animations: [], active: true };

standardPlayer.sp_Animations.Parameters = PluginManager.parameters('standardPlayer.sp_Animations');

standardPlayer.sp_Core.addBaseUpdate(() => {
    let thisObject = standardPlayer.sp_Animations;
    if (thisObject.active)
        thisObject.run();
})

standardPlayer.sp_Animations.createAnimation = function (target) {
    let anim = new spAnimation(target);

    this.addAnim(anim);
    return anim;
}

standardPlayer.sp_Animations.addAnim = function (anim) {
    this.animations.push(anim);
    this.active = true;
}

standardPlayer.sp_Animations.run = function () {
    let list = this.animations;
    let length = list.length;

    console.log('running animations master')

    for (let i = 0; i < length; i++) {
        this.runActions(list[i])
    }
}

standardPlayer.sp_Animations.runActions = function (animation) {
    let actions = animation.actions;

    actions.forEach(action => this.playAction(action))
}

standardPlayer.sp_Animations.playAction = function (action) {
    if (action.isCompleted()) {
        console.log('action completed')
        action.active = false;
    } else if (action.active && action.passesRunConditions()) {
        action.play();
    }
}

class spAnimation {
    constructor(target) {
        this.target = target;
        this.cacheProps();
        this.actions = [];
        this.steps = [];
    }

    cacheProps() {
        this.initialCache = this.extractInitialProps();
        this.currentPosition = this.extractInitialProps();
    }

    extractInitialProps() {
        let target = this.target;
        let props = {
            'x': target.x,
            'y': target.y,
            'width': target.width,
            'height': target.height,
            'scale': {},
            'alpha': target.alpha,
            'rotation': target.rotation
        }
        props.scale.x = target.scale._x;
        props.scale.y = target.scale._y;
        return props;
    }

    action(index) {
        if (index > this.actions.length - 1) {
            return this.addNewAction();
        } else {
            return this.actions[index]
        }
    }

    addNewAction() {
        let action = new sp_Action(this)

        this.actions.push(action);
        return action;
    }

    activate() {
        this.active = true;
        this.actions.forEach(action => action.activate())
    }

}

/* ===================================================================================================
        sp_Action Class
 ===================================================================================================*/

class sp_Action {
    constructor(animation) {
        this.animation = animation;
        this.steps = [{}];
        this.stepTemplate = [{}];
        this.dur = [];
        this.pad = [];
        this.index = 0;
        this.tick = 0;
        this.active = false;
        this.repeat = [0];
        this.repeatCache = [0]
        this.masterRepeat = 0;
        this.runCondition = [() => { return true }];
        this.masterRunCondition = () => { return true };
    }

    step() {
        return this.steps[this.index]
    }

    template() {
        return this.stepTemplate[this.index]
    }

    currentDur() {
        return this.dur[this.index] + this.pad[this.index]
    }

    target() {
        return this.animation.target;
    }

    moveXY(x, y, dur, pad) {
        let step = this.template();

        step.x = x;
        step.y = y;

        this.dur[this.index] = dur;
        this.pad[this.index] = pad;
        return this;
    }

    moveXYRel(x, y, dur, pad) {
        let cache = this.getPositionData();
        let step = this.template();

        step.x = this.getLastPropValue('x') + x;
        step.y = this.getLastPropValue('y') + y;

        this.dur[this.index] = dur;
        this.pad[this.index] = pad;
        return this;
    }

    setRotation(value, dur, pad) {
        let step = this.template();

        step.rotation = value;
        

        this.dur[this.index] = dur;
        this.pad[this.index] = pad;
        return this;
    }

    setAlpha(value, dur, pad) {
        let step = this.template();

        step.alpha = value

        this.dur[this.index] = dur;
        this.pad[this.index] = pad;
        return this;
    }

    setDimensions(width, height, dur, pad) {
        this.setWidth(width, dur, pad)
        this.setHeight(height, dur, pad)
        return this;
    }

    setWidth(value, dur, pad) {
        let step = this.template();

        step.width = value

        this.dur[this.index] = dur;
        this.pad[this.index] = pad;
        return this;
    }

    setHeight(value, dur, pad) {
        let step = this.template();

        step.height = value

        this.dur[this.index] = dur;
        this.pad[this.index] = pad;
        return this;
    }

    setScale(x, y, dur, pad) {
        let step = this.template();

        step.scale = {};
        step.scale.x = x;
        step.scale.y = y;

        this.dur[this.index] = dur;
        this.pad[this.index] = pad;
        return this;
    }

    setCustomProp(prop, value, dur, pad) {
        let step = this.template();

        step[prop] = value;

        this.animation.initialCache[prop] = this.target()[prop]

        this.dur[this.index] = dur;
        this.pad[this.index] = pad;
        return this;
    }

    setWait(dur) {
        let profile = {
            'wait': dur
        }

        console.log('calling set wait')
        console.log(this.steps[this.index])
        this.steps[this.index] = Object.assign({}, this.step(), profile);
        console.log(this.steps[this.index])
        this.dur[this.index] = dur;
        return this.then();
    }

    resetPosition(dur, pad) {
        let step = this.template();

        this.stepTemplate[this.index] = Object.assign({}, this.animation.initialCache);
        this.dur[this.index] = dur;
        this.pad[this.index] = pad;
        return this
    }

    prepareStep() {
        let template = this.template();
        let positionData = this.getPositionData();
        let keys = Object.keys(template)
        let length = keys.length;
        let step = this.step();
        let current;

        for (let i = 0; i < length; i++) {
            current = keys[i];
            if(current == 'scale'){
                step[current] = {x:[], y:[]}
                step[current].x = standardPlayer.sp_Core.plotLinearPath(
                    this.getLastPropValue('scale').x,
                    template[current].x,
                    this.dur[this.index],
                    this.pad[this.index]
                )

                step[current].y = standardPlayer.sp_Core.plotLinearPath(
                    this.getLastPropValue('scale').y,
                    template[current].y,
                    this.dur[this.index],
                    this.pad[this.index]
                )
                continue
            }
            
            step[current] = standardPlayer.sp_Core.plotLinearPath
                (
                    this.getLastPropValue(current),
                    template[current],
                    this.dur[this.index],
                    this.pad[this.index]
                )
        }
        return this
    }

    setRunCondition(cb) {
        this.runCondition[this.index] = cb;
        return this;
    }

    setMasterRunCondition(cb) {
        this.masterRunCondition = cb;
        return this;
    }

    setRepeat(numberOfTimes) {
        this.repeat[this.index] = numberOfTimes;
        this.repeatCache[this.index] = numberOfTimes;
        return this;
    }

    setMasterRepeat(numberOfTimes) {
        this.masterRepeat = numberOfTimes;
        return this;
    }

    getRepeat() {
        return this.repeat[this.index];
    }


    checkRepeat() {
        if (this.masterRepeat <= -1 || this.masterRepeat--) {
            this.tick = 0;
            this.index = 0;
            this.resetForRepeat();
            return true
        }
        return false;
    }

    checkStepRepeat() {
        if (this.getRepeat() === -1 || this.repeat[this.index]--) {
            this.tick = 0;
            return true;
        }

        return false;
    }

    resetForRepeat() {
        let list = this.steps;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            this.repeat[i] = this.repeatCache[i];
        }
    }

    getRunCondition() {
        return this.runCondition[this.index];
    }

    passesRunConditions() {
        return this.getRunCondition()() && this.masterRunCondition()
    }

    getPositionData() {
        if (!this.index) {
            console.log('return this.animation.initialCache')
            console.log(this.animation.initialCache)
            return this.animation.initialCache
        }
        else {
            console.log('return this.stepTemplate[this.indedx - 1 ')
            return this.stepTemplate[this.index - 1]
        }
    }

    getLastPropValue(prop) {
        let templates = this.stepTemplate;
        for(let i = this.index - 1; i >= 0; i--){
            if(typeof templates[i][prop] != 'undefined')
                return templates[i][prop]
        }

        return this.animation.initialCache[prop]
    }

    getLastSubPropValue(obj, prop){
        let templates = this.stepTemplate;
        for(let i = this.index; i >= 0; i--){
            if(typeof templates[i][obj] != 'undefined')
                return 
        }
    }

    hasWait() {
        let step = this.step();

        if (step.wait) {
            if (step.wait-- > 0) {
                return true;
            }
        }
        return false;
    }

    play() {
        let step = this.step();
        let target = this.target();
        let props = Object.keys(step);
        let paths = Object.values(step);
        let length = props.length;
        let index = ++this.tick;

        if (this.hasWait())
            return;

        for (let i = 0; i < length; i++) {
            if (props[i] === 'scale') {
                this.updateScale(paths[i], index)
            } else {
                target[props[i]] = paths[i][index];
            }

        }

    }

    isCompleted() {
        return this.index < this.steps.length && this.isCompletedStep() && this.index >= this.steps.length && !this.checkRepeat();
    }

    isCompletedStep() {
        if (this.tick + 1 >= this.currentDur()) {
            if (this.checkStepRepeat())
                return false;
            this.index++;
            this.tick = 0;
            this.updateCache();
            return true;
        }

        return false;
    }

    updateCache() {
        let target = this.target();
        let props = {
            'x': target.x,
            'y': target.y,
            'width': target.width,
            'height': target.height,
            'scale': target.scale,
            'alpha': target.alpha
        }

        this.animation.currentPosition = props;
    }

    updateScale(props, index) {
        this.target().scale.set(props.x[index], props.y[index])
    }

    activate() {
        this.tick = 0;
        this.index = 0;
        this.active = true;
    }

    then() {
        this.prepareStep()
        this.index++;
        this.repeat.push(0);
        this.repeatCache.push(0);
        this.steps[this.index] = {}//this.getPositionData()
        this.stepTemplate[this.index] = {}//Object.assign({}, this.stepTemplate[this.index - 1]);
        this.runCondition.push(() => { return true })
        return this;
    }

}



function testScript() {
    window.grph = new PIXI.Graphics(); grph.beginFill(0xFFFFFF); grph.drawRect(0, 0, 100, 100);
    SceneManager._scene.addChild(grph)
    let anim = standardPlayer.sp_Animations.createAnimation(grph);
    anim
        .action(0)
        .moveXY(Graphics.width * .4, Graphics.height * .5, 100, 0)
        .setScale(1.4, 2.1, 100, 0)
        .then()
        .setRotation(10, 100, 0)
        .then()
        // .setWait(100)
        .moveXYRel(100, 100, 100, 0)
        .setScale(.8, 1.1, 100, 0)
        .then()
        .moveXYRel(200, 50, 30, 0)
        .setScale(2.4, 3.1, 30, 0)
        .then()
        .setRotation(14, 100, 0)
        .moveXYRel(100, -50, 100, 0)
        .setScale(4.4, 3.5, 100, 0)
        .then()
        
        .resetPosition(100, 0)
        .prepareStep();
        

    // anim
    //     .action(1)
    //     .setRotation(15, 100, 0)
    //     .then()
    //     .setRotation(-15, 100, 0)
    //     .then()
    //     .resetPosition(100, 0)
    // .setMasterRunCondition(()=>{return $gamePlayer.x == 8})

    anim.activate();
    return anim
}







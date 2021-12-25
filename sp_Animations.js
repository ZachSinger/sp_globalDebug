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
        this.initalCache = this.extractInitialProps();
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
        this.steps = [];
        this.dur = [];
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

    currentDur() {
        return this.dur[this.index]
    }

    target() {
        return this.animation.target;
    }

    moveXY(x, y, dur, pad) {
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
            'x': standardPlayer.sp_Core.plotLinearPath(cache['x'], x, dur, pad),
            'y': standardPlayer.sp_Core.plotLinearPath(cache['y'], y, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    moveXYRel(x, y, dur, pad) {
        console.log('calling moveXYREL')
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let curX = cache['x'];
        let curY = cache['y'];
        let profile = {
            'x': standardPlayer.sp_Core.plotLinearPath(cache['x'], curX + x, dur, pad),
            'y': standardPlayer.sp_Core.plotLinearPath(cache['y'], curY + y, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setRotation(value, dur, pad) {
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let rotation; 
        if (typeof cache.rotation == 'undefined') {
            console.log('no rotation on cache for this action, yet, using ')
            rotation = this.animation.initalCache.rotation;
        } else {
            if(Array.isArray(cache.rotation)){
                rotation = cache.rotation.slice(-1)[0];
                
            } else {
                rotation = cache.rotation;
                
            }
            
        }
        let profile = {
            'rotation': standardPlayer.sp_Core.plotLinearPath(rotation, value, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);
        console.log(this.steps[this.index])
        this.dur[this.index] = dur;
        return this;
    }

    setAlpha(value, dur, pad) {
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
            'alpha': standardPlayer.sp_Core.plotLinearPath(cache['alpha'], value, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setDimensions(width, height, dur, pad) {
        this.setWidth(width, dur, pad)
        this.setHeight(height, dur, pad)
        return this;
    }

    setWidth(value, dur, pad) {
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
            'width': standardPlayer.sp_Core.plotLinearPath(cache['width'], value, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setHeight(value, dur, pad) {
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
            'height': standardPlayer.sp_Core.plotLinearPath(cache['height'], value, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setScale(x, y, dur, pad) {
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let ox, oy;
        console.log('calling set scale')
        if (typeof cache.scale == 'undefined') {
            console.log('no scale on cache for this action, yet, using ')
            ox = this.animation.initalCache.x;
            oy = this.animation.initalCache.y;
        } else {
            if(Array.isArray(cache.scale.x)){
                ox = cache.scale.x.slice(-1)[0];
                oy = cache.scale.y.slice(-1)[0];
            } else {
                ox = cache.scale.x;
                oy = cache.scale.y;
            }
            
        }
        console.log(`x:${ox}, y:${oy}`)
        let profile = {
            scale: {
                'x': standardPlayer.sp_Core.plotLinearPath(ox, x, dur, pad),
                'y': standardPlayer.sp_Core.plotLinearPath(oy, y, dur, pad),
            }
        }

        console.log(this.steps[this.index])
        this.steps[this.index].scale = Object.assign({}, cache.scale, profile.scale);
        console.log(this.step())

        this.dur[this.index] = dur;
        return this;
    }

    setCustomProp(prop, value, dur, pad) {
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let target = this.target();
        if (typeof cache[prop] == 'undefined') {
            console.log('initializing prop')
            cache[prop] = target[prop];
        }

        let profile = {
        }

        profile[prop] = standardPlayer.sp_Core.plotLinearPath(cache[prop], value, dur, pad)

        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setWait(dur){
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
        let cache = this.getPositionData()
        let props = Object.keys(cache);
        let values = Object.values(cache);
        let length = props.length;
        let target = this.target();
        let initial = this.animation.initalCache;
        let profile = {};
        let current = {};

        console.log('calling reset position==================================')
        for (let i = 0; i < length; i++) {
            current = props[i];
            if (current == 'scale') {
                console.log(values[i])
                this.setScale(initial.scale.x, initial.scale.y, dur, pad)
            } else {
                profile[current] = standardPlayer.sp_Core.plotLinearPath(cache[current], initial[current], dur, pad)
            }
        } 

        this.steps[this.index] = Object.assign({}, this.step(), profile);
        console.log(this.steps[this.index])
        this.dur[this.index] = dur;
        return this;
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
        let step = this.steps[this.index - 1]
        let keys = Object.keys(step);
        let values = Object.values(step);
        let index = values[0].length - 1;
        let obj = {};
        
        console.log('last position step data')
        console.log(step)
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == 'scale') {
                obj.scale = {};
                obj.scale.x = values[i].x//[index]
                obj.scale.y = values[i].y//[index]
                continue
            } else if(keys[i] == 'wait'){
                console.log('found wait, not including in position data')
                continue
            }

            

            if(Array.isArray(values[i])){
                obj[keys[i]] = values[i].slice(-1)[0];
            } else {
                obj[keys[i]] = values[i];
            }
                
                
            
            
        }

        console.log('returning this position data')
        console.log(obj)

        return obj

    }

    hasWait() {
        let step = this.step();

        if(step.wait){
            if(step.wait-- > 0){
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

        if(this.hasWait())
            return;

        for (let i = 0; i < length; i++) {
            if (props[i] === 'scale') {
                this.updateScale(target, paths[i], index)
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

    updateScale(target, props, index) {

        target.scale.set(props.x[index], props.y[index])
    }

    activate() {
        this.tick = 0;
        this.index = 0;
        this.active = true;
    }

    then() {
        this.index++;
        this.repeat.push(0);
        this.repeatCache.push(0);
        this.steps[this.index] = {}//this.getPositionData()
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
        .moveXY(Graphics.width * .4, Graphics.height * .5, 30, 0)
        .setScale(1.4, 2.1, 30)
        .then()
        .setRotation(10, 100, 0)
        .then()
        // .setWait(100)
        .moveXYRel(100, 100, 100, 0)
        .setScale(.8, 1.1, 100)
        .then()
        .moveXYRel(200, 50, 30, 0)
        .setScale(2.4, 3.1, 30)
        .then()
        // .setRotation(14, 100, 0)
        .moveXYRel(100, -50, 100, 0)
        .setScale(4.4, 3.5, 100)
        .then()
        .resetPosition(100, 0)
        
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







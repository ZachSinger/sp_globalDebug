var Imported = Imported || {};
Imported.sp_Animations = 'sp_Animations';

var standardPlayer = standardPlayer || {params: {}};
standardPlayer.sp_Animations = standardPlayer.sp_Animations || {animations:[], active:true};

standardPlayer.sp_Animations.Parameters = PluginManager.parameters('standardPlayer.sp_Animations');

standardPlayer.sp_Core.addBaseUpdate(()=>{
    let thisObject = standardPlayer.sp_Animations;
    if(thisObject.active)
        thisObject.run();
})

standardPlayer.sp_Animations.createAnimation = function(target){
    let anim = new spAnimation(target);
    
    this.addAnim(anim);
    return anim;
}

standardPlayer.sp_Animations.addAnim = function(anim){
    this.animations.push(anim);
    this.active = true;
}

standardPlayer.sp_Animations.run = function(){
    let list = this.animations;
    let length = list.length;

    console.log('running animations master')

    for(let i = 0; i < length; i++){
        this.runActions(list[i])
    }
}

standardPlayer.sp_Animations.runActions = function(animation){
    let actions = animation.actions;

    actions.forEach(action => this.playAction(action))
}

standardPlayer.sp_Animations.playAction = function(action){
    if(action.isCompleted()){
        console.log('action completed') 
        action.active = false;
    } else if(action.active){
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

    cacheProps(){
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
           'scale': target.scale,
           'alpha': target.alpha,
           'rotation': target.rotation
        }
        
        return props;
    }

    action(index){
        if(index > this.actions.length - 1){
            return this.addNewAction();
        } else{
            return this.actions[index]
        }
    }

    addNewAction(){
        let action = new sp_Action(this)

        this.actions.push(action);
        return action;
    }

    activate(){
        this.active = true;
        this.actions.forEach(action => action.activate())
    }

}

class sp_Action{
    constructor(animation){
        this.animation = animation;
        this.steps = [];
        this.dur = [];
        this.index = 0;
        this.tick = 0;
        this.active = false;
        this.repeat = [0];
        this.repeatCache = [0]
        this.masterRepeat = 0;
    }

    step(){
        return this.steps[this.index]
    }

    currentDur(){
        return this.dur[this.index]
    }

    target(){
        return this.animation.target;
    }

    moveXY(x, y, dur, pad){
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
            'x': standardPlayer.sp_Core.plotLinearPath(cache['x'], x, dur, pad),
            'y': standardPlayer.sp_Core.plotLinearPath(cache['y'], y, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    moveXYRel(x, y, dur, pad){
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

    setRotation(value, dur, pad){
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
            'rotation': standardPlayer.sp_Core.plotLinearPath(cache['rotation'], value, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setAlpha(value, dur, pad){
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
            'alpha': standardPlayer.sp_Core.plotLinearPath(cache['alpha'], value, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setDimensions(width, height, dur, pad){
        this.setWidth(width, dur, pad)
        this.setHeight(height, dur, pad)
        return this;
    }

    setWidth(value, dur, pad){
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
            'width': standardPlayer.sp_Core.plotLinearPath(cache['width'], value, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setHeight(value, dur, pad){
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
            'height': standardPlayer.sp_Core.plotLinearPath(cache['height'], value, dur, pad)
        }
        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setScale(x, y, dur, pad){
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let profile = {
                scale: {
                    'x': standardPlayer.sp_Core.plotLinearPath(cache['scale'].x, x, dur, pad),
                    'y': standardPlayer.sp_Core.plotLinearPath(cache['scale'].y, y, dur, pad),
                }
        }

        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setCustomProp(prop, value, dur, pad){
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let target = this.target();
        if(typeof cache[prop] == 'undefined'){
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

    resetPosition(dur, pad){
        let cache = this.index ? this.getPositionData() : this.animation.initalCache;
        let props = Object.keys(cache);
        let values = Object.values(cache);
        let length = props.length;
        let target = this.target();
        let initial = this.animation.initalCache;
        let profile = {};
        let current = {};

        console.log(this.index)
        console.log(cache)
        console.log(initial)
        for(let i = 0; i < length; i++){
            current = props[i];
            if(current == 'scale'){
                this.setScale(values[i].x, values[i].y, dur, pad)
            } else {
                profile[current] = standardPlayer.sp_Core.plotLinearPath(cache[current], initial[current], dur, pad)
            }
        }

        this.steps[this.index] = Object.assign({}, this.step(), profile);

        this.dur[this.index] = dur;
        return this;
    }

    setRepeat(numberOfTimes){
        this.repeat[this.index] = numberOfTimes;
        this.repeatCache[this.index] = numberOfTimes;
        return this;
    }

    setMasterRepeat(numberOfTimes){
        this.masterRepeat = numberOfTimes;
        return this;
    }

    getRepeat(){
        return this.repeat[this.index];
    }


    checkRepeat(){
        if(this.masterRepeat <= -1 || this.masterRepeat--){
            this.tick = 0;
            this.index = 0;
            this.resetForRepeat();
            return true
        } 
        return false;
    }

    checkStepRepeat(){
        if(this.getRepeat() === -1 || this.repeat[this.index]--){
            this.tick = 0;
            return true;
        }

        return false;
    }

    resetForRepeat(){
        let list = this.steps;
        let length = list.length;

        for(let i = 0; i < length; i++){
            this.repeat[i] = this.repeatCache[i];
        }
    }

    getPositionData(){
        let step = this.steps[this.index - 1]
        let keys = Object.keys(step);
        let values = Object.values(step);
        let index = values[0].length - 1;
        let obj = {};

        for(let i = 0; i < keys.length; i++){
            obj[keys[i]] = values[i][index];
        }

        return obj

    }

    play(){
        let step = this.step();
        let target = this.target();
        let props = Object.keys(step);
        let paths = Object.values(step);
        let length = props.length;
        let index = ++this.tick;

        for(let i = 0; i < length; i++){
            if(props[i] === 'scale'){
                this.updateScale(target, paths[i], index)
            } else {
                target[props[i]] = paths[i][index];
            }
            
        }
    }

    isCompleted(){
        return this.index < this.steps.length && this.isCompletedStep() && this.index >= this.steps.length && !this.checkRepeat();
    }

    isCompletedStep(){
        if(this.tick + 1 >= this.currentDur()){
            if(this.checkStepRepeat())
                return false;
            this.index++;
            this.tick = 0;
            this.updateCache();
            return true;
        }

        return false;
    }

    updateCache(){
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

    updateScale(target, props, index){
        
        target.scale.set(props.x[index], props.y[index])
    }

    activate(){
        this.tick = 0;
        this.index = 0;
        this.active = true;
    }

    then(){
        this.index++;
        this.repeat.push(0);
        this.repeatCache.push(0);
        return this;
    }

}
    


function testScript(){
    window.grph = new PIXI.Graphics();grph.beginFill(0xFFFFFF);grph.drawRect(0, 0, 100, 100);
    SceneManager._scene.addChild(grph)
    let anim = standardPlayer.sp_Animations.createAnimation(grph)
                .action(0)
                .moveXY(Graphics.width * .4, Graphics.height * .5, 30, 0)
                .then()
                .moveXYRel(100, 100, 100, 0)
                .then()
                .moveXYRel(200, 50, 30, 0)
                .then()
                .moveXYRel(100, -50, 100, 0)
                .then()
                .resetPosition(100, 0);
    
    anim.activate();
    return anim
}







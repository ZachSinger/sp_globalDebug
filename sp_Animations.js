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
           'alpha': target.alpha
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

    // myAnim.action(1).moveXY(100, 200, 50)                          //add an action that moves the target to x100, y200 over 50 frames, as part of action 1
    // myAnim.action(2).setScale(['width', 'height'], [1.3, 1.5], 60) //add an acti0on that changes target width/height over 60 frames, as part of action 2. Will play simultaneously with action 1.
    // myAnim.action(3).moveXYRel(30, 20, 20).waitForStep(1)          //add an action that moves 30 x andn 20 y from the position the target is at when this step begins. will wait for action 1 to complete
    // myAnim.action(1).setAlpha(.2, 30)                              //Adds to original action 1, so that in addition to original moveXY, it will also now change alpha. however, the duration has been rewritten from 30 to 50, since an arg was provided
    // myAnim.action(2).then().setVisible(false)                      //Adds an additional step after the original step from action 2 completes. Once the first step completes, target's visible property will be set to false

}

class sp_Action{
    constructor(animation){
        this.animation = animation;
        this.steps = [];
        this.dur = [];
        this.index = 0;
        this.tick = 0;
        this.active = false;
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
            this.target()[props[i]] = paths[i][index];
        }
    }

    isCompleted(){
        return this.index < this.steps.length && this.isCompletedStep() && this.index >= this.steps.length;
    }

    isCompletedStep(){
        if(this.tick + 1 >= this.currentDur()){
            this.index++;
            this.tick = 0;
            this.updateCache();
            return true;
        }
            
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

    activate(){
        this.tick = 0;
        this.index = 0;
        this.active = true;
    }

    then(){
        this.index++;
        return this;
    }

}
    

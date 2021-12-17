var Imported = Imported || {};
Imported.sp_Timers = 'sp_Timers';

var standardPlayer = standardPlayer || {params: {}};
standardPlayer.sp_Timers = standardPlayer.sp_Timers || {timers:[], active:true};

standardPlayer.sp_Timers.Parameters = PluginManager.parameters('standardPlayer.sp_Timer');

standardPlayer.sp_Timers.run = function(){
    let timers = [];
    let list = this.timers;
    let length = list.length;

    for(let i = 0; i < length; i++){
        let item = list[i];

        if(item.kill)
            continue;
        
        item.run();

        if(item.completed)
            continue

        timers.push(item)
    }

    this.timers = timers;
}

standardPlayer.sp_Core.addBaseUpdate(()=>{
    let thisObject = standardPlayer.sp_Timers;
    if(thisObject.active) {
        thisObject.run()
    }
});

/* ===================================================================================================
        sp_Timer Class
 ===================================================================================================*/ 

class sp_Timer{
    constructor(time, ...args){ //time, ...callback/s
        this.tick = 0;
        this.target = time;
        this.callbacks = args || [];
        this.kill = false;
        this.repeat = 0;
        this.pause = false;
        this.completed = false;
        this.runCondition = () => {return true};
        this.completeCondition = () => {return true};
    }

    setRunCondition(cb){
        this.runCondition = cb;
    }

    setCompleteCondition(cb){
        this.completeCondition = cb;
    }

    setRepeat(numberOfTimes){
        this.repeat = numberOfTimes;
    }

    run(){
        if(this.runCondition() && !this.pause){
            if(this.tick++ >= this.target)
                this.runCompleted()
        }
    }

    runCompleted(){
        console.log(this)
        this.completed = true;
        if(this.completeCondition()){
            this.callbacks.forEach(cb => cb())
        }
    }

}
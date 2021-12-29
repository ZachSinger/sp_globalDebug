function shipMiniScene(){
    this.initialize.apply(this, arguments)
}

shipMiniScene.prototype = Object.create(Scene_Base.prototype);
shipMiniScene.prototype.constructor = shipMiniScene;

shipMiniScene.prototype.initialize = function(){
    let arr = Array.apply(null, Array(30)).map(()=>{return 'pictures/enemyShip'});
    arr.push('pictures/playerShip');
    arr.push('pictures/playerFire');
    this.preload(arr)
    Scene_Base.prototype.initialize.call(this)
}

shipMiniScene.prototype.onPreloaded = function(){
    let stubs = this._loadedStubs;
    let enemies = stubs.slice(0, 30)
    let playerStub = stubs[30];
    let player = playerStub.retrieve()
    let x, y;
    let sWidth = (Graphics.width * .1);
    let sHeight = (Graphics.height * .4) / 3;
    let xPadding = enemies[0].retrieve().width / 2
    let odd = false;

    for(let i = 0; i < enemies.length; i++){
        odd = Math.floor(i / 10) % 2 == 0;
        x = sWidth * (i % 10) + xPadding;
        y = sHeight * Math.floor(i / 10);
        enemies[i].retrieve().position.set(x, y)

        this.addChild(enemies[i].retrieve())
        if(odd){
            standardPlayer.sp_Animations.createAnimation(enemies[i].retrieve())
            .action(0)
            .moveXYRel(-10, 0, 60, 0)
            .then()
            .moveXYRel(10, 0, 60, 0)
            .setMasterRepeat(-1)
            .finalize()
        } else {
            standardPlayer.sp_Animations.createAnimation(enemies[i].retrieve())
            .action(0)
            .moveXYRel(10, 0, 60, 0)
            .then()
            .moveXYRel(-10, 0, 60, 0)
            .setMasterRepeat(-1)
            .finalize()
        }
        
        this.addChild(player);
        player.x = (Graphics.width / 2) - (player.width / 2)  
        player.y = Graphics.height - player.height * 1.1
        this.player = playerStub;
        this.enemies = enemies;
    }
    this.setControls()
}

shipMiniScene.prototype.setControls = function(){
    this.leftCb = ()=>{
        if(Input.isPressed('left'))
            this.moveLeft()
    }

    this.rightCb = ()=>{
        if(Input.isPressed('right'))
            this.moveRight()
    }

    this.fireCb = ()=>{
        if(Input.isTriggered('ok'))
            this.playerFire()
    }

    standardPlayer.sp_Core.addBaseUpdate(this.leftCb)
    standardPlayer.sp_Core.addBaseUpdate(this.rightCb)
    standardPlayer.sp_Core.addBaseUpdate(this.fireCb)
}

shipMiniScene.prototype.moveLeft = function(){
    let player = this.player.retrieve();
    if(player.x > 0)
        player.x-=5
}

shipMiniScene.prototype.moveRight = function(){
    let player = this.player.retrieve();
    if(player.x < Graphics.width - player.width)
        player.x+=5
}

shipMiniScene.prototype.playerShotIsCollided = function(){
    let scn = SceneManager._scene;
    let list = scn.enemies;
    let length = list.length;
    for(let i = 0; i < length; i++){
        if(standardPlayer.sp_Core.collision(this.target(), list[i].retrieve())){
            scn.removeChild(list[i].retrieve())
            list[i].retrieve().anim.kill = true;
            list[i].delete();
            this.kill = true;
            scn.removeChild(this.target())
            list.splice(i, 1);
            return true
        }
            
    }

    return false
}

shipMiniScene.prototype.getTargetGrouping = function(){
    let player = this.player.retrieve();
    let width = player.width;
    let moving = this.playerIsMoving()
    let x = moving ? moving == 'right' ? player.x + width : player.x - (width * 1.5) : player.x - (width * .5)
    let grph = new PIXI.Graphics;

    console.log(moving)

    grph.lineStyle(1, 0xFFFFFF, 1)
    grph.drawRect(x, 0, width * 2, Graphics.height)
    if(this.boxGrouping)
        this.removeChild(this.boxGrouping)
    this.addChild(grph)
    this.boxGrouping = grph;
}

shipMiniScene.prototype.playerIsMoving = function(){
    return Input.isPressed('left') ? 'left' : Input.isPressed('right') ? 'right' : false
}

shipMiniScene.prototype.playerFire = function(){
    this.getTargetGrouping()
    let result = standardPlayer.sp_Animations.reserveAnimation('pictures/playerFire', (anim)=>{
        let origin = this.player.retrieve();
        anim.target().position.set(origin.x, origin.y)
        anim.cacheProps()

        this.addChild(anim.target());
        anim
            .action(0)
            .moveXY(origin.x, 0, 30, 0)
            .setThroughCb(()=>{
                this.playerShotIsCollided.call(anim)                    
            })
            .setMasterCb(()=>{
                this.removeChild(anim.target())
            })
            .finalize()
    })
}
function shipMiniScene() {
    this.initialize.apply(this, arguments)
}

shipMiniScene.prototype = Object.create(Scene_Base.prototype);
shipMiniScene.prototype.constructor = shipMiniScene;

shipMiniScene.prototype.initialize = function () {
    let arr = Array.apply(null, Array(30)).map(() => { return 'pictures/enemyShip' });
    arr.push('pictures/playerShip');
    arr.push('pictures/playerFire');
    this.preload(arr)
    Scene_Base.prototype.initialize.call(this)
    this._runner = Game_Runner;
}

shipMiniScene.prototype.onPreloaded = function () {
    let stubs = this._loadedStubs;
    let enemies = stubs.slice(0, 30)
    let playerStub = stubs[30];
    let player = playerStub.retrieve()

    this.addChild(player);
    player.y = (Graphics.height / 2) - (player.height / 2)
    player.setGridData(3, 2)
    this._runner.player = playerStub;
    this.enemies = []
    this.moveCount = 0;
    this._runner.initialize()
}




shipMiniScene.prototype.setEnemyFireTimer = function () {
    let timer = standardPlayer.sp_Timers.createTimer(100, () => { this.getTargetGrouping() });

    timer.setRepeat(-1)
        .activate()
    this.enemyShotTimer = timer;
}


shipMiniScene.prototype.enemyShotIsCollided = function () {
    let scn = SceneManager._scene;


    if (standardPlayer.sp_Core.collision(this.target(), scn.player.retrieve())) {

    }
}


shipMiniScene.prototype.enemyFire = function (enemy) {
    standardPlayer.sp_Animations.reserveAnimation('pictures/playerFire', (anim) => {
        let origin;
        try {
            origin = enemy.retrieve();

            anim.target().position.set(origin.x + (origin.width * .5), origin.y)
            anim.cacheProps()

            this.addChild(anim.target());
            anim
                .action(0)
                .moveXY(origin.x + (origin.width * .5), Graphics.height, 20, 0)
                .setThroughCb(() => {
                    this.enemyShotIsCollided.call(anim)
                })
                .setMasterCb(() => {
                    this.removeChild(anim.target())
                    anim.target().sp_image_cache_stub.delete()
                })
                .finalize()
        } catch (e) {
            console.log('CAUGHT ERROR')
            console.log(e)
            anim.kill = true
        }
    })
}




class shipWeapon {
    constructor(imageName) {
        this._imageName = imageName;
        this.stage = 0;
    }

    image() {
        return this._imageName[Math.min(this.stage, this._imageName.length - 1)]
    }
}

class machineGun extends shipWeapon {
    constructor() {
        super(['pictures/playerFire', 'pictures/playerFire2'])
        this.autoFireInterval = 20;
    }

    fire() {
        let scn = SceneManager._scene;
        let buff,
            startY;

        for (let i = 0; i <= this.stage; i++) {
            standardPlayer.sp_Animations.reserveAnimationShared(this.image(), (anim) => {
                let origin = scn._runner.player.retrieve();
                let graphicHeightPadding = anim.target().height / 2;
                buff = anim.target().height;
                startY = this.stage ? ((buff * this.stage) * -1) + (buff * .5 * this.stage) : 0
                anim.target().position.set(origin.x + origin.width, (startY + buff * i) + origin.y + (origin.height / 2) - graphicHeightPadding)
                anim.cacheProps()

                scn.addChild(anim.target());
                anim
                    .action(0)
                    .moveXY(Graphics.width, (startY + buff * i) + origin.y + (origin.height * .5), 30, 0)
                    .setThroughCb(() => {
                        scn._runner.playerShotIsCollided.call(anim)
                    })
                    .setMasterCb(() => {
                        scn.removeChild(anim.target())
                        anim.target().sp_image_cache_stub.delete()
                    })
                    .finalize()
            })
        }
    }
}

class spreader extends shipWeapon {
    constructor() {
        super(['pictures/playerFire', 'pictures/playerFire2'])
    }

    fire() {
        let scn = SceneManager._scene;
        let buff,
            startY;

        //top shot
        standardPlayer.sp_Animations.reserveAnimationShared(this.image(), (anim) => {
            let origin = scn.player.retrieve();
            let graphicHeightPadding = anim.target().height / 2;
            let xDist = Graphics.width - (origin.x + origin.width);
            let factor = xDist / Graphics.width;
            let speed = 30 * factor

            anim.target().position.set(origin.x + origin.width, (origin.y + (origin.height / 2) - graphicHeightPadding))
            anim.cacheProps()

            scn.addChild(anim.target());
            anim
                .action(0)
                .moveXYRel(xDist, ((Graphics.height * .1) * -1) * factor, speed, 0)
                .setThroughCb(() => {
                    scn.playerShotIsCollided.call(anim)
                })
                .setMasterCb(() => {
                    scn.removeChild(anim.target())
                    anim.target().sp_image_cache_stub.delete()
                })
                .finalize()
        })

        //middle shot
        standardPlayer.sp_Animations.reserveAnimationShared(this.image(), (anim) => {
            let origin = scn.player.retrieve();
            let graphicHeightPadding = anim.target().height / 2;
            let xDist = Graphics.width - (origin.x + origin.width);
            let speed = 30 * (xDist / Graphics.width)

            anim.target().position.set(origin.x + origin.width, origin.y + (origin.height / 2) - graphicHeightPadding)
            anim.cacheProps()

            scn.addChild(anim.target());
            anim
                .action(0)
                .moveXYRel(xDist, 0, speed, 0)
                .setThroughCb(() => {
                    scn.playerShotIsCollided.call(anim)
                })
                .setMasterCb(() => {
                    scn.removeChild(anim.target())
                    anim.target().sp_image_cache_stub.delete()
                })
                .finalize()
        })

        //bottom shot 
        standardPlayer.sp_Animations.reserveAnimationShared(this.image(), (anim) => {
            let origin = scn.player.retrieve();
            let graphicHeightPadding = anim.target().height / 2;
            let xDist = Graphics.width - (origin.x + origin.width);
            let factor = xDist / Graphics.width;
            let speed = 30 * factor

            anim.target().position.set(origin.x + origin.width, origin.y + (origin.height / 2) - graphicHeightPadding)
            anim.cacheProps()

            scn.addChild(anim.target());
            anim
                .action(0)
                .moveXYRel(xDist, (Graphics.height * .1) * factor, speed, 0)
                .setThroughCb(() => {
                    scn.playerShotIsCollided.call(anim)
                })
                .setMasterCb(() => {
                    scn.removeChild(anim.target())
                    anim.target().sp_image_cache_stub.delete()
                })
                .finalize()
        })

    }
}


//ControlHandler
Input._onKeyDown = function (event) {
    if (this._shouldPreventDefault(event.keyCode)) {
        event.preventDefault();
    }
    if (event.keyCode === 144) {
        // Numlock
        this.clear();
    }
    const buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = true;
        this.updateLatestAxis(buttonName)
    }
    this._lastKeyCode = event.keyCode
};

Input._onKeyUp = function (event) {
    const buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = false;
        this.pollLatestAxis(buttonName)
    }
};

Input.updateLatestAxis = function (buttonName) {
    if (buttonName == 'left' || buttonName == 'right') {
        this.latestHorizontal = buttonName
    }
    else if (buttonName == 'up' || buttonName == 'down') {
        this.latestVertical = buttonName
    }

}

Input.pollLatestAxis = function (buttonName) {
    if (buttonName == 'left') {
        this.latestHorizontal = this.isPressed('right') ? 'right' : null
    } else if (buttonName == 'right') {
        this.latestHorizontal = this.isPressed('left') ? 'left' : null
    } else if (buttonName == 'up') {
        this.latestVertical = this.isPressed('down') ? 'down' : null
    } else if (buttonName == 'down') {
        this.latestVertical = this.isPressed('up') ? 'up' : null
    }

}

function Game_Runner() {
    throw new Error('This is a static class')
}

Game_Runner.setController = function () {
    this.controller = Game_Controller;
    this.controller.createControlProfile()
    this.controller.setControls()
}

Game_Runner.initialize = function(){
    this.enemies = []
    this.weapon = new machineGun()
    this.setController()
}

Game_Runner.playerFire = function () {
    this.weapon.fire();
}



Game_Runner.playerShotIsCollided = function () {
    let scn = SceneManager._scene;
    let list = scn._runner.enemies;
    let length = list.length;
    for (let i = 0; i < length; i++) {
        if (standardPlayer.sp_Core.collision(this.target(), list[i].retrieve())) {
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






function Game_Controller(){
    throw new Error('This is a static class')
}

Game_Controller.createControlProfile = function(){
    Input.keyMapper["32"] = 'autofire'

    this._autoFirePressedTime = 0;
    //below object, ship game control name : Input.keymapper control name
    this.controlProfile = {
        'up':'up',
        'down':'down',
        'right':'right',
        'left':'left',
        'fire':'ok',
        'autofire':'autofire',
        'pause' : 'cancel'
    }
}

Game_Controller.input = function(input){
    return this.controlProfile[input]
}




Game_Controller.setControls = function(){
    this.rightCb = ()=>{
        let input = this.input('right')
        if (Input.isPressed(input) && Input.latestHorizontal == input)
            this.moveRight();
    }
    
    this.leftCb = ()=>{
        let input = this.input('left')
        if (Input.isPressed(input) && Input.latestHorizontal == input)
            this.moveLeft();
    }
    
    this.upCb = ()=>{
        let input = this.input('up')
        if (Input.isPressed(input) && Input.latestVertical == input)
            this.moveUp()
    }
    
    this.downCb = ()=>{
        let input = this.input('down')
        if (Input.isPressed(input) && Input.latestVertical == input)
            this.moveDown()
    }
    
    this.fireCb = ()=>{
        let input = this.input('fire')
        if (Input.isTriggered(input))
            Game_Runner.playerFire()
    }

    this.autofireCb = ()=>{
        let input = this.input('autofire')
        let interval = Game_Runner.weapon.autoFireInterval;

        if(Input.isPressed(input)){
            if(this._autoFirePressedTime < interval){
                this._autoFirePressedTime++
            } else {
                this._autoFirePressedTime = 0
                Game_Runner.playerFire()
            }
        } else {
            this._autoFirePressedTime = 20
        }
    }

    standardPlayer.sp_Core.addBaseUpdate(this.leftCb)
    standardPlayer.sp_Core.addBaseUpdate(this.rightCb)
    standardPlayer.sp_Core.addBaseUpdate(this.upCb)
    standardPlayer.sp_Core.addBaseUpdate(this.downCb)
    standardPlayer.sp_Core.addBaseUpdate(this.fireCb)
    standardPlayer.sp_Core.addBaseUpdate(this.autofireCb)
}

Game_Controller.moveUp = function () {
    let player = Game_Runner.player.retrieve();

    if (player.y > 0)
        player.y -= 5

}

Game_Controller.moveDown = function () {
    let player = Game_Runner.player.retrieve();

    if (player.y < Graphics.height - player.height)
        player.y += 5

}

Game_Controller.moveRight = function () {
    let player = Game_Runner.player.retrieve();

    if (player.x + 7 < Graphics.width - player.width)
        player.x += 7

    this.thrust = true
}

Game_Controller.moveLeft = function () {
    let player = Game_Runner.player.retrieve();

    if (player.x - 7 > 0)
        player.x -= 7

}

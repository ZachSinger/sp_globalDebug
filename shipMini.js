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
}

shipMiniScene.prototype.onPreloaded = function () {
    let stubs = this._loadedStubs;
    let enemies = stubs.slice(0, 30)
    let playerStub = stubs[30];
    let player = playerStub.retrieve()
    let x, y;
    let sWidth = (Graphics.width * .1);
    let sHeight = (Graphics.height * .4) / 3;
    let xPadding = enemies[0].retrieve().width / 2
    let odd = false;

    // for (let i = 0; i < enemies.length; i++) {
    //     odd = Math.floor(i / 10) % 2 == 0;
    //     x = sWidth * (i % 10) + xPadding;
    //     y = sHeight * Math.floor(i / 10);
    //     enemies[i].retrieve().position.set(x, y)

    //     this.addChild(enemies[i].retrieve())
    //     if (odd) {
    //         standardPlayer.sp_Animations.createAnimation(enemies[i].retrieve())
    //             .action(0)
    //             .moveXYRel(-10, 0, 60, 0)
    //             .then()
    //             .moveXYRel(10, 0, 60, 0)
    //             .setMasterRepeat(-1)
    //             .finalize()
    //     } else {
    //         standardPlayer.sp_Animations.createAnimation(enemies[i].retrieve())
    //             .action(0)
    //             .moveXYRel(10, 0, 60, 0)
    //             .then()
    //             .moveXYRel(-10, 0, 60, 0)
    //             .setMasterRepeat(-1)
    //             .finalize()
    //     }


    // }
    this.weapon = new machineGun()
    this.addChild(player);
    // player.x = (Graphics.width / 2) - (player.width / 2)
    player.y = (Graphics.height / 2) - (player.height / 2)
    player.setGridData(3, 2)
    this.player = playerStub;
    this.enemies = []//enemies;
    this.moveCount = 0;
    this.setControls()
    // this.setEnemyFireTimer()
}

shipMiniScene.prototype.setControls = function () {
    this.rightCb = () => {
        if (Input.isPressed('right') && !Input.isPressed('left'))
            this.moveRight();
    }

    this.leftCb = () => {
        if (Input.isPressed('left') && !Input.isPressed('right'))
            this.moveLeft();
    }

    this.upCb = () => {

        if (Input.isPressed('up') && !Input.isPressed('down'))
            this.moveUp()
    }

    this.downCb = () => {
        if (Input.isPressed('down') && !Input.isPressed('up'))
            this.moveDown()
    }

    this.fireCb = () => {
        if (Input.isTriggered('ok'))
            this.playerFire()
    }

    standardPlayer.sp_Core.addBaseUpdate(this.leftCb)
    standardPlayer.sp_Core.addBaseUpdate(this.rightCb)
    standardPlayer.sp_Core.addBaseUpdate(this.upCb)
    standardPlayer.sp_Core.addBaseUpdate(this.downCb)
    standardPlayer.sp_Core.addBaseUpdate(this.fireCb)
    standardPlayer.sp_Core.addBaseUpdate(this.playerMoveCounter.bind(this))
}

shipMiniScene.prototype.playerMoveCounter = function () {
    let moving = false //this.playerIsMoving()
    let moveCount = this.moveCount;
    if (moving && Math.abs(moveCount) + 1 < 14) {
        this.moveCount = moving == 'up' ? moveCount - 1 : moveCount + 1
    } else if (!moving && moveCount != 0) {
        this.moveCount = moveCount > 0 ? moveCount - 1 : moveCount + 1
        this.updatePlayerSprite()

    } else if (!moving) {
        this.player.retrieve().setRowCol(0, this.thrust ? 1 : 0)
        this.thrust = false;
    }
}

shipMiniScene.prototype.updatePlayerSprite = function () {
    let player = this.player.retrieve()

    player.setRowCol(player.gridData.row, Math.abs(this.moveCount) > 7 ? 1 : 0)
}

shipMiniScene.prototype.moveUp = function () {
    let player = this.player.retrieve();
    let col = this.moveCount < -7 ? 1 : 0;
    let row = 2;
    if (player.y > 0)
        player.y -= 5

    // if(Input.isPressed('left')){
    //     col = 0;
    //     row = 0;
    // }

    // player.setRowCol(row, col)
}

shipMiniScene.prototype.moveDown = function () {
    let player = this.player.retrieve();
    let col = this.moveCount > 7 ? 1 : 0;
    let row = 1;

    if (player.y < Graphics.height - player.height)
        player.y += 5

    // if(Input.isPressed('left')){
    //     col = 0;
    //     row = 0;
    // }


    // player.setRowCol(row, col)
}

shipMiniScene.prototype.moveRight = function () {
    let player = this.player.retrieve();
    let row, col;
    if (player.x + 7 < Graphics.width - player.width)
        player.x += 7


    // if(this.moveCount != 0){
    //     col = this.moveCount > 7 ? 1 : 0;
    //     row = player.gridData.row;
    // } else {
    //     col = 1;
    //     row = 0;
    // }

    this.thrust = true
    // player.setRowCol(row, col)
}

shipMiniScene.prototype.moveLeft = function () {
    let player = this.player.retrieve();
    let row, col;
    if (player.x - 7 > 0)
        player.x -= 7


    // if(this.moveCount != 0){
    //     col = this.moveCount > 7 ? 1 : 0;
    //     row = player.gridData.row;
    // } else {
    //     col = 0;
    //     row = 0;
    // }


    // player.setRowCol(row, col)
}



shipMiniScene.prototype.setEnemyFireTimer = function () {
    let timer = standardPlayer.sp_Timers.createTimer(100, () => { this.getTargetGrouping() });

    timer.setRepeat(-1)
        .activate()
    this.enemyShotTimer = timer;
}

shipMiniScene.prototype.playerShotIsCollided = function () {
    let scn = SceneManager._scene;
    let list = scn.enemies;
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

shipMiniScene.prototype.enemyShotIsCollided = function () {
    let scn = SceneManager._scene;


    if (standardPlayer.sp_Core.collision(this.target(), scn.player.retrieve())) {

        //68 204
        //66
    }
}

shipMiniScene.prototype.getTargetGrouping = function () {
    if (!this.enemies.length)
        this.enemyShotTimer.kill;

    let player = this.player.retrieve();
    let width = player.width;
    let moving = this.playerIsMoving()
    let x = moving ? moving == 'right' ? player.x + width : player.x - (width * 1.5) : player.x - (width * .5)
    let rectangle = new Rectangle(x, 0, width * 2, Graphics.height);
    let list = this.enemies;
    let length = list.length;
    let result = [];

    // let grph = new PIXI.Graphics;

    // console.log(moving)

    // grph.lineStyle(1, 0xFFFFFF, 1)
    // grph.drawRect(x, 0, width * 2, Graphics.height)
    // if(this.boxGrouping)
    //     this.removeChild(this.boxGrouping)
    // this.addChild(grph)

    for (let i = 0; i < length; i++) {
        if (standardPlayer.sp_Core.collision(list[i].retrieve(), rectangle))
            result.push(list[i]);
    }

    if (result.length) {
        this.enemyFire(result[standardPlayer.sp_Core.rndBetween(0, result.length)])
        this.enemyShotTimer.setTarget(standardPlayer.sp_Core.rndBetween(30, 100))
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


shipMiniScene.prototype.playerIsMoving = function () {
    return Input.isPressed('up') ? 'up' : Input.isPressed('down') ? 'down' : false
}

shipMiniScene.prototype.playerFire = function () {
    // let result = standardPlayer.sp_Animations.reserveAnimationShared('pictures/playerFire', (anim) => {
    //     let origin = this.player.retrieve();
    //     let graphicHeightPadding = anim.target().height / 2;
    //     anim.target().position.set(origin.x + origin.width, origin.y + (origin.height / 2) - graphicHeightPadding)
    //     anim.cacheProps()

    //     this.addChild(anim.target());
    //     anim
    //         .action(0)
    //         .moveXY(Graphics.width, origin.y + (origin.height * .5), 30, 0)
    //         .setThroughCb(() => {
    //             this.playerShotIsCollided.call(anim)
    //         })
    //         .setMasterCb(() => {
    //             this.removeChild(anim.target())
    //             console.log(anim.target())
    //             anim.target().sp_image_cache_stub.delete()
    //         })
    //         .finalize()
    // })

    this.weapon.fire();
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
    }

    fire() {
        let scn = SceneManager._scene;
        let buff,
            startY;

        for (let i = 0; i <= this.stage; i++) {
            standardPlayer.sp_Animations.reserveAnimationShared(this.image(), (anim) => {
                let origin = scn.player.retrieve();
                let graphicHeightPadding = anim.target().height / 2;
                buff = anim.target().height;
                startY = this.stage ? ((buff * this.stage) * -1) + (buff * .5 * this.stage): 0
                anim.target().position.set(origin.x + origin.width, (startY + buff * i) + origin.y + (origin.height / 2) - graphicHeightPadding)
                anim.cacheProps()

                scn.addChild(anim.target());
                anim
                    .action(0)
                    .moveXY(Graphics.width, (startY + buff * i) + origin.y + (origin.height * .5), 30, 0)
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

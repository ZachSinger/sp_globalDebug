

/*~struct~Animations:
 * @param name
 * @type text
 * 
 * @param actions
 * @type struct<AnimationAction>[]
 *
 */

/*~struct~AnimationAction:
 * @param name
 * @type text
 * @desc name of action
 *
 * @param steps
 * @type struct<AnimationStep>[]
 * @desc List of steps for this action
 */

/*~struct~AnimationStep:
 * @param name
 * @text Name
 * @type text
 * @default Animation Step
 * @desc name of step
 * 
 * @param condition
 * @type struct<Condition>[]
 * @text Conditions
 * @desc List of conditions that must pass for this step to run
 * 
 * @param dur
 * @text Duration(frames)
 * @type number
 * @default 1
 * @desc Length of time in frames for this step to complete
 * 
 * @param reset
 * @text Reset
 * @type boolean
 * @default false
 * @desc If true, will animate to original preanimation state over specified duration
 *
 * @param setMove
 * @text Set Location
 * @type boolean
 * @default false
 * 
 * @param x
 * @type number
 * @parent setMove
 * 
 * @param y
 * @type number
 * @parent setMove
 * 
 * @param moveRelative
 * @type boolean
 * @parent setMove
 * @default false
 * 
 * @param setScale
 * @text Set Scale
 * @type boolean
 * @default false
 * 
 * @param scaleX
 * @type number
 * @decimals 2
 * @parent setScale
 * @default 1.00
 * 
 * @param scaleY
 * @type number
 * @decimals 2
 * @parent setScale
 * @default 1.00
 * 
 * @param setRotation
 * @text Set Rotation
 * @type boolean
 * @default false
 * 
 * @param rotation
 * @type number
 * @desc values are in radians, PI * 2 is equal to one full rotation
 * @decimals 3
 * @parent setRotation
 * 
 * @param angle
 * @type number
 * @desc values are in degrees, 360 is equal to one full rotation
 * @parent setRotation
 * 
 * @param setAlpha
 * @text Set Alpha
 * @type boolean
 * @default false
 * 
 * @param alpha
 * @type number
 * @decimals 2
 * @parent setAlpha
 * @default 1
 * 
 * @param setDimensions
 * @text Set Dimensions
 * @type boolean
 * @default false
 * 
 * @param width
 * @type number
 * @parent setDimensions
 * 
 * @param height
 * @type number
 * @parent setDimensions
 */


/*~struct~Condition:
 * @param name
 * @type text
 * @text Name
 * @desc can be used in debugging to determine what condition is passing or failing
 * 
 * @param ==variableSection
 * @text =====Variables=====
 * @default
 * 
 * @param gameVariableLeft
 * @type variable
 * @text Variable A
 * @parent ==variableSection
 * 
 * @param gameVarComparator
 * @text Comparator
 * @type select
 * @option equals
 * @option >
 * @option <
 * @option >=
 * @option <=
 * @default equals
 * @parent ==variableSection
 * 
 * @param gameVariableRight
 * @type variable
 * @text Variable B
 * @parent ==variableSection
 * 
 * @param gameVariableExplicit
 * @type number
 * @text Value
 * @parent ==variableSection
 * 
 * @param ==switchSection
 * @text =====Game Switches=====
 * @default
 * 
 * @param switch
 * @type switch
 * @text Switch
 * @parent ==switchSection
 * 
 * @param switchValue
 * @type boolean
 * @text Is
 * @parent ==switchSection
 * @default true
 *
 * 
 * @param ==itemSection
 * @text =====Items=====
 * @default
 * 
 * @param item
 * @type item
 * @text Item
 * @parent ==itemSection
 * 
 * @param itemComparator
 * @text Operation
 * @type select
 * @option in posession
 * @option amount
 * @parent ==itemSection
 * 
 * @param itemAmount
 * @type number
 * @min 0
 * @text Amount
 * @desc only applicable if 'amount' operation is selected
 * @parent ==itemSection
 * 
 * 
 * @param ==actorSection
 * @text =====Actor=====
 * @default
 * 
 * 
 * @param actor
 * @type actor
 * @text Actor
 * @parent ==actorSection
 * 
 * @param inParty
 * @type boolean
 * @text Is In Party
 * @parent ==actorSection
 * 
 * @param hasClass
 * @type class
 * @text Has Class
 * @parent ==actorSection
 * 
 * @param hasWeapon
 * @type weapon
 * @text Has Weapon
 * @parent ==actorSection
 * 
 * @param hasArmor
 * @type armor
 * @text Has Armor
 * @parent ==actorSection
 * 
 * @param hasSkill
 * @type skill
 * @text Has Skill
 * @parent ==actorSection
 * 
 * @param hasState
 * @type state
 * @text Has State
 * @parent ==actorSection
 * 
 * @param ==playerSection
 * @text =====Player=====
 * @default
 * 
 * @param playerX
 * @text Player X
 * @type number
 * @default -1
 * @parent ==playerSection
 * 
 * @param playerY
 * @text Player Y
 * @type number
 * @default -1
 * @parent ==playerSection
 * 
 * @param playerCanMove
 * @text Can Move
 * @type boolean
 * @desc Evaluates event.canMove function
 * @parent ==playerSection
 * 
 * @param ==eventSection
 * @text =====Event=====
 * @default
 * 
 * @param event
 * @type number
 * @text EventId
 * @min 0
 * @parent ==eventSection
 * 
 * @param eventX
 * @text Event X
 * @type number
 * @parent ==eventSection
 * 
 * @param eventY
 * @text Event Y
 * @type number
 * @parent ==eventSection
 * 
 * @param eventCanMove
 * @text Can Move
 * @type boolean
 * @desc Evaluates event.canMove function
 * @parent ==eventSection
 * 
 * @param selfSwitch
 * @text Self Switch
 * @type select
 * @option none
 * @option A
 * @option B
 * @option C
 * @option D
 * @parent ==eventSection
 * 
 * @param ==goldSection
 * @text =====Gold=====
 * @default
 * 
 * @param goldComparator
 * @text Gold is 
 * @type select
 * @option equals
 * @option >
 * @option <
 * @option >=
 * @option <=
 * @option mod
 * @parent ==goldSection
 * 
 * 
 * @param goldValue
 * @type number
 * @default 0
 * @text Value
 * @parent ==goldSection
 * 
 * @param weapon
 * @type weapon
 * @text Weapon in Posession:
 * @default 0
 * 
 * 
 * @param armor
 * @type armor
 * @text Armor in Posession:
 * @default 0
 * 
 * @param ==enemySection
 * @text =====Enemy=====
 * @default
 * 
 * @param enemy
 * @type enemy
 * @text Enemy
 * @parent ==enemySection
 * 
 * @param enemyHasAppeared
 * @type boolean
 * @text Has Appeared
 * @parent ==enemySection
 *
 * @param enemyState
 * @type state
 * @text Has State
 * @parent ==enemySection
 * 
 * @param vehicle
 * @type vehicle
 * @text Driving Vehicle: 
 * 
 */


/*:
 * @plugindesc shipMinigame
 * @base sp_Core
 * @orderAfter sp_Animations
 *
 * @param Animations
 * @type struct<Animations>[]
 * @desc List of all animations
 *
 *
 * @help
 * ===========================================
 *             Desc
 * ===========================================
 *
 *
 * 
 */

// standardPlayer.sp_Core.addDatabaseFile('$shipWeapons', 'ShipWeapons.json')

function shipMiniScene() {
    this.initialize.apply(this, arguments)
}

shipMiniScene.prototype = Object.create(Scene_Base.prototype);
shipMiniScene.prototype.constructor = shipMiniScene;

shipMiniScene.prototype.initialize = function () {
    let arr = []
    arr.push('pictures/playerShip');
    // arr.push('pictures/playerFire');
    this.preload(arr)
    Scene_Base.prototype.initialize.call(this)
    this._runner = Game_Runner;
}

shipMiniScene.prototype.onPreloaded = function () {
    let stubs = this._loadedStubs;
    // let enemies = stubs.slice(0, 30)
    let playerStub = stubs[0];
    let player = playerStub.retrieve()

    // this._runner.stage.add(playerStub);
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

shipMiniScene.prototype.parseAnimation = function(animation){
    let temp = standardPlayer.sp_Animations.createTemplate();
    let list = animation.actions;
    let length = list.length;

    for(let i = 0; i < length; i++){
        let action = temp.action(i)
        for(let j = 0; j < list[i].steps.length; j++){
            let step = list[i].steps[j];
            let dur = step.dur;
            let pad = 0;
            if(step.setMove){
                if(step.moveRelative){
                    action = action.moveXYRel(step.x, step.y, dur, pad)
                } else {
                    action = action.moveXY(step.x, step.y, dur, pad)
                }
            }

            if(step.setScale)
                action = action.setScale(step.scaleX, step.scaleY, dur, pad)

            if(step.setAlpha)
                action = action.setAlpha(step.alpha, dur, pad)

            if(step.setDimensions)
                action = action.setDimensions(step.width, step.height, dur, pad)
            
            if(step.setRotation)
                action = action.setRotation(step.rotation, dur, pad)

            if(step.reset)
                action = action.resetPosition(dur, pad)

            if(j + 1 < list[i].steps.length){
                console.log('running then')
                action = action.then()
            }
            
        }
            
    }

    return temp
}




class shipWeapon {
    constructor(imageName) {
        this._imageName = imageName;
        this.stage = 0;
        this.autoFireInterval = 20;
        this.chargeTime = 30;
    }

    image() {
        return this._imageName[Math.min(this.stage, this._imageName.length - 1)]
    }
}

class machineGun extends shipWeapon {
    constructor() {
        super(['pictures/spreader', 'pictures/spreader'])
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
        super(['pictures/spreader', 'pictures/spreader'])
    }

    fire() {
        let scn = SceneManager._scene;
        let buff,
            startY;

        //top shot
        standardPlayer.sp_Animations.reserveAnimationShared(this.image(), (anim) => {
            let origin = scn._runner.player.retrieve();
            let graphicHeightPadding = anim.target().height / 2;
            let xDist = Graphics.width - (origin.x + origin.width);
            let factor = xDist / Graphics.width;
            let speed = 50 * factor

            anim.target().position.set(origin.x + origin.width, (origin.y + (origin.height / 2) - graphicHeightPadding))
            anim.cacheProps()

            scn.addChild(anim.target());
            anim
                .action(0)
                .moveXYRel(xDist, ((Graphics.height * .1) * -1) * factor, speed, 0)
                .setThroughCb(() => {
                    scn._runner.playerShotIsCollided.call(anim)
                })
                .setMasterCb(() => {
                    scn.removeChild(anim.target())
                    anim.target().sp_image_cache_stub.delete()
                })
                .finalize()
        })

        //middle shot
        standardPlayer.sp_Animations.reserveAnimationShared(this.image(), (anim) => {
            let origin = scn._runner.player.retrieve();
            let graphicHeightPadding = anim.target().height / 2;
            let xDist = Graphics.width - (origin.x + origin.width);
            let speed = 50 * (xDist / Graphics.width)

            anim.target().position.set(origin.x + origin.width, origin.y + (origin.height / 2) - graphicHeightPadding)
            anim.cacheProps()

            scn.addChild(anim.target());
            anim
                .action(0)
                .moveXYRel(xDist, 0, speed, 0)
                .setThroughCb(() => {
                    scn._runner.playerShotIsCollided.call(anim)
                })
                .setMasterCb(() => {
                    scn.removeChild(anim.target())
                    anim.target().sp_image_cache_stub.delete()
                })
                .finalize()
        })

        //bottom shot 
        standardPlayer.sp_Animations.reserveAnimationShared(this.image(), (anim) => {
            let origin = scn._runner.player.retrieve();
            let graphicHeightPadding = anim.target().height / 2;
            let xDist = Graphics.width - (origin.x + origin.width);
            let factor = xDist / Graphics.width;
            let speed = 50 * factor

            anim.target().position.set(origin.x + origin.width, origin.y + (origin.height / 2) - graphicHeightPadding)
            anim.cacheProps()

            scn.addChild(anim.target());
            anim
                .action(0)
                .moveXYRel(xDist, (Graphics.height * .1) * factor, speed, 0)
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

TouchInput._onLeftButtonDown = function(event) {
    const x = Graphics.pageToCanvasX(event.pageX);
    const y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._mousePressed = true;
        this._pressedTime = 0;
        this._onTrigger(x, y);
    }
    Game_Controller.leftPressed = true;
};


TouchInput._onRightButtonDown = function(event) {
    const x = Graphics.pageToCanvasX(event.pageX);
    const y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._onCancel(x, y);
    }

    Game_Controller._charging = true;
    Game_Controller.rightPressed = true;
};


TouchInput._onMouseUp = function(event) {
    if (event.button === 0) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        this._mousePressed = false;
        this._onRelease(x, y);
    } else if (event.button === 1){
        Game_Controller.leftPressed = false;
    } else if (event.button === 2){
        Game_Controller._charging = false;
        Game_Controller.rightPressed = false;
    }
};

TouchInput._onMouseMove = function(event) {
    const x = Graphics.pageToCanvasX(event.pageX);
    const y = Graphics.pageToCanvasY(event.pageY);
    if (this._mousePressed) {
        this._onMove(x, y);
    } else if (Graphics.isInsideCanvas(x, y)) {
        this._onHover(x, y);
    }
};






function Game_Runner() {
    throw new Error('This is a static class')
}

Game_Runner.setController = function () {
    this._mouseOnlyMode = false;
    this.playerSpeed = 15
    this.controller = Game_Controller;
    this.controller.createControlProfile()
    this.controller.setControls()
}

Game_Runner.setMouseMode = function(useMouseMode){
    this._mouseOnlyMode = useMouseMode
}

Game_Runner.scn = function(){
    return SceneManager._scene
}

Game_Runner.createContainers = function(){
    this.createStage()
    this.createStageElementsContainer()
    this.createParticipantsContainer()
    this.createPickupsContainer()
    this.createProjectilesContainer()
}

Game_Runner.createStage = function(){
    this.stage = standardPlayer.sp_ImageCache.createContainer();
    this.scn().addChild(this.stage.retrieve())
}

Game_Runner.createStageElementsContainer = function(){
    let options = {position:true}
    this.stageElementsContainer = standardPlayer.sp_ImageCache.createContainer(true, 10, options)
    this.stage.add(this.stageElementsContainer)
}

Game_Runner.createParticipantsContainer = function(){
    let options = {position:true, tint:true, rotation:true, vertices:true}
    this.participantsContainer = standardPlayer.sp_ImageCache.createContainer(true, 100, options)
    this.stage.add(this.participantsContainer)
}

Game_Runner.createPickupsContainer = function(){
    let options = {position:true, tint:true, rotation:false, vertices:false}
    this.pickupsContainer = standardPlayer.sp_ImageCache.createContainer(true, 5, options)
    this.stage.add(this.pickupsContainer)
}

Game_Runner.createProjectilesContainer = function(){
    let options = {position:true, tint:true, rotation:true, vertices:true}
    this.projectilesContainer = standardPlayer.sp_ImageCache.createContainer(true, 5, options)
    this.stage.add(this.projectilesContainer)
}

Game_Runner.initialize = function(){
    this.enemies = []
    this.weapon = new machineGun()
    this.createContainers()
    this.setController()
}

Game_Runner.playerFire = function (chargeTime) {
    this.weapon.fire(chargeTime);
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
    Input.keyMapper["32"] = 'autofire'; //space bar
    Input.keyMapper["67"] = 'smartbomb' //c button

    this._autoFirePressedTime = 0;
    this._firePressedTime = 0;
    //below object, ship game control name : Input.keymapper control name
    this.controlProfile = {
        'up':'up',
        'down':'down',
        'right':'right',
        'left':'left',
        'fire':'ok',
        'smartbomb': 'smartbomb',
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
        let chargeTime = Game_Runner.weapon.chargeTime;
        let autofire = this.input('autofire')

        if (Input.isTriggered(input) || TouchInput.isCancelled()){
            Game_Runner.playerFire()
        } else if(Input.isPressed(input) || Game_Controller._charging){
            console.log('charging')
            if(this._firePressedTime < chargeTime){
              this._firePressedTime++
            } 

            if(TouchInput.isTriggered() || Input.isTriggered(autofire)){
                console.log('triggering smart bomb')
            }
        } else if(this._firePressedTime == chargeTime){
            console.log('releasing')
            this.releaseCb()
        }
            
    }

    this.releaseCb = ()=>{
        Game_Runner.playerFire(this._firePressedTime)
        this._firePressedTime = 0;
    }

    this.autofireCb = ()=>{
        let input = this.input('autofire')
        let interval = Game_Runner.weapon.autoFireInterval;

        if(Game_Controller._charging)   
            return
        if(Input.isPressed(input) || TouchInput.isPressed()){
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

    this.mouseMoveCb = ()=>{
        if(!Game_Runner._mouseOnlyMode)
            return

        let player = Game_Runner.player.retrieve();
        let speed = Game_Runner.playerSpeed
        let tX = TouchInput._x;
        let tY = TouchInput._y;
        let pX = player.x + player.width * .5;
        let pY = player.y + player.height * .5;
        let distX = Math.abs(tX - pX) > speed ? tX - pX > 0 ? speed : -speed : tX - pX
        let distY = Math.abs(tY - pY) > speed ? tY - pY > 0 ? speed : -speed : tY - pY
        
        console.log(distX, distY)
        player.x += distX;
        player.y += distY;
    }
    

    standardPlayer.sp_Core.addBaseUpdate(this.leftCb)
    standardPlayer.sp_Core.addBaseUpdate(this.rightCb)
    standardPlayer.sp_Core.addBaseUpdate(this.upCb)
    standardPlayer.sp_Core.addBaseUpdate(this.downCb)
    standardPlayer.sp_Core.addBaseUpdate(this.fireCb)
    standardPlayer.sp_Core.addBaseUpdate(this.autofireCb)
    standardPlayer.sp_Core.addBaseUpdate(this.mouseMoveCb)
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



function Game_ShipEnemy(){
    this.initialize.apply(this, arguments)
}

Game_ShipEnemy.prototype.initialize = function(id){
    let en = $dataEnemies(id)
}


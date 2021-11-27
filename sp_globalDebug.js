let spDebugProfile = {};
spDebugProfile.aliasUpdate = Scene_Base.prototype.update;
spDebugProfile.aliasPlayerCanMove = Game_Player.prototype.canMove;
spDebugProfile.active = false;

Scene_Base.prototype.update = function(){
    spDebugProfile.aliasUpdate.call(this);
    if(Input.isPressed('shift') && Input.isTriggered('pageup')){
        spDebugProfile.debugWindow = spDebug.open();
    }
}

Game_Player.prototype.canMove = function(){
    if(spDebugProfile.active)
        return false;

    return spDebugProfile.aliasPlayerCanMove.call(this)
}

function spDebug(){
    this.initialize.apply(this, arguments)
}

spDebug.prototype = Object.create(Window_Command.prototype)
spDebug.prototype.constructor = spDebug;

spDebug.prototype.initialize = function(){
    let rect = new Rectangle(0, 0, Graphics.width * .3, Graphics.height * .4)
    Window_Command.prototype.initialize.call(this, rect)
}

spDebug.prototype.makeCommandList = function(){
    this.addCommand('Watch Windows', 'watchWindow');
    this.addCommand('Object Browser', 'objectBrowser');
    this.setHandler('watchWindow', this.openWatchWindow.bind(this));
    this.setHandler('objectBrowser', this.openObjectBrowser.bind(this));
}

spDebug.prototype.openWatchWindow = function(){
    console.log(this)
    this.close();
    spWatchWindowFactory.openMenu();

}

spDebug.prototype.openObjectBrowser = function(){
    console.log('opening object browser')
}

spDebug.prototype.close = function(){
    Window_Command.prototype.close.call(this);
    // SceneManager._scene._windowLayer.removeChild(this);
}

spDebug.open = function(){
    let instance = new spDebug();
    SceneManager._scene.addWindow(instance);
    spDebugProfile.active = true;
    $gameSystem.disableMenu()
    return instance;
}




/*===========================================================================================================================================================
    Watch Window
===========================================================================================================================================================*/

let spWatchWindowFactory = {
    active: false,
    windows: [],
    stage: new PIXI.Container,
    state: {
        width: .5,
        height: .1,
        alpha: 1,
        backAlpha: .8,
        clipLeft: false,
        clipTop: false,
        xOffset: 0,
        yOffset: 0
    },
    _aliasSceneUpdate : Scene_Base.prototype.update
};

spWatchWindowFactory.createWatchWindow = function(cb){
    cb = cb ? cb : ()=>{ return "test"}
    let window = new spWatchWindow(cb, this.getWindowDimensions());
    this.windows.push(window);
    this.stage.addChild(window);
    return window
}

spWatchWindowFactory.getWindowDimensions = function(index){
    let state = this.state;
    let gWidth = Graphics.width;
    let gHeight = Graphics.height;
    let width = state.width * gWidth;
    let height = state.height * gHeight;
    let xOffset = gWidth * state.xOffset;
    let yOffset = gHeight * state.yOffset;
    let xPos = state.clipLeft ? xOffset : gWidth - width - xOffset;
    let yPos = state.clipTop ? yOffset : gHeight - height - yOffset;

    index = index == undefined ? this.windows.length : index

    yPos += state.clipTop ? index * height : (index * height) * -1;
    return new Rectangle(xPos, yPos, width, height);
}

spWatchWindowFactory.execute = function(){
    if(!this.active){
        return;
    }
    this.refreshAllWindows();
}

spWatchWindowFactory.refreshAllWindows = function(){
    this.windows.forEach((element)=> element.drawContent())
}

spWatchWindowFactory.updateGlobalTransform = function(){
    let windows = this.windows;
    for(let i = 0; i < windows.length; i++){
        windows[i].updateGlobalTransform(this.getWindowDimensions(i));
    }
}

spWatchWindowFactory.activate = function(){
    this.active = true;
    SceneManager._scene.addWindow(this.stage)
}

spWatchWindowFactory.deactivate = function(){
    this.active = false;
    SceneManager._scene.removeWindow(this.stage)
}

spWatchWindowFactory.openMenu = function(){
    this.menu = this.menu || new spWatchWindowMenu()
    SceneManager._scene.addChild(this.menu)
    this.menu.open();
    this.activate();
}


Scene_Base.prototype.update = function(){
    spWatchWindowFactory._aliasSceneUpdate.call(this);
    spWatchWindowFactory.execute();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function spWatchWindow(){
    this.initialize.apply(this, arguments)
}

spWatchWindow.prototype = Object.create(Window_Base.prototype);
spWatchWindow.prototype.constructor = spWatchWindow;

spWatchWindow.prototype.initialize = function(cb, rect){
    Window_Base.prototype.initialize.call(this, rect)
    this.setContent = cb;
    this.setStyles()
}

spWatchWindow.prototype.drawContent = function(){
    this.contents.clear(); 
    this.drawTextEx(this.setContent() + "", 0, 0)
}

spWatchWindow.prototype.setStyles = function(){
    let state = spWatchWindowFactory.state;
    this.frameVisible = false;
    this.alpha = state.alpha;
    this._backSprite.alpha = state.backAlpha;
}

spWatchWindow.prototype.updateGlobalTransform = function(rect){
    this.width = rect.width;
    this.height = rect.height;
    this.x = rect.x;
    this.y = rect.y;
    
    this.contents.clear();
    this.createContents();
    this.setStyles();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function spWatchWindowMenu(){
    this.initialize.apply(this, arguments)
}

spWatchWindowMenu.prototype = Object.create(Window_Command.prototype);
spWatchWindowMenu.prototype.constructor = spWatchWindowMenu;

spWatchWindowMenu.prototype.initialize = function(){
    let rect = new Rectangle(0, 0, 200, (this.itemHeight() * 3) + Window_Command.prototype.itemPadding() * 4)
    
    Window_Command.prototype.initialize.call(this, rect)

    this.selection = -1;
    this.configWindow = new spWatchWindowConfig();
    this.configWindow.close();
   this.addChild(this.configWindow);
}

spWatchWindowMenu.prototype.makeCommandList = function(){
    this.addCommand("Add", "add")
    this.addCommand("Remove", "remove")
    this.addCommand("Config", "config")
    
    this.setHandler("config", this.openConfigWindow.bind(this))
    this.setHandler('cancel', this.cancel.bind(this))
    this.setHandler('add', this.add.bind(this))
}

spWatchWindowMenu.prototype.add = function(){
    spWatchWindowFactory.createWatchWindow()
    this.activate()
}

spWatchWindowMenu.prototype.cancel = function(){
    this.close();
    spDebugProfile.debugWindow.open();
    spDebugProfile.debugWindow.activate();
}

spWatchWindowMenu.prototype.openConfigWindow = function(){
    this.close()
    this.configWindow.open()
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function spWatchWindowConfig(){
    this.initialize.apply(this, arguments)
}

spWatchWindowConfig.prototype = Object.create(Window_Command.prototype);
spWatchWindowConfig.prototype.constructor = spWatchWindowConfig;

spWatchWindowConfig.prototype.initialize = function(){
    let rect = new Rectangle(0, 0, 200, 400)
    
    Window_Command.prototype.initialize.call(this, rect)

    this.selection = -1;
    
}

spWatchWindowConfig.prototype.makeCommandList = function(){
    let state = spWatchWindowFactory.state;

    this.addCommand(`Snap Left: ${state.clipLeft}`, 'execute')
    this.addCommand(`Snap Top: ${state.clipTop}`, 'execute')
    this.addCommand(`Width: ${state.width.toFixed(2)}`, 'execute')
    this.addCommand(`Height: ${state.height.toFixed(2)}`, 'execute')
    this.addCommand(`X Offset: ${state.xOffset.toFixed(2)}`, 'execute')
    this.addCommand(`Y Offset: ${state.yOffset.toFixed(2)}`, 'execute')
    this.addCommand(`Alpha: ${state.alpha.toFixed(2)}`, 'execute')
    this.addCommand(`Back Alpha: ${state.backAlpha.toFixed(2)}`, 'execute')

    this.setHandler('execute', this.execute.bind(this))
    this.setHandler('cancel', this.cancel.bind(this))
}

spWatchWindowConfig.prototype.execute = function(){
    this.activate();
}

spWatchWindowConfig.prototype.onLeft = function(){
    let state = spWatchWindowFactory.state;
    console.log(this._index)
    switch(this._index){
        case 0: 
            state.clipLeft = !state.clipLeft;
            break;
        case 1: 
            state.clipTop = !state.clipTop;        
            break;
        case 2:
            state.width = Math.max(state.width - .05, 0);
            break;
        case 3:
            state.height = Math.max(state.height - .05, 0);
            break;
        case 4:
            state.xOffset -= .05;
            break;
        case 5:
            state.yOffset -= .05;
            break;
        case 6 :
            state.alpha -= .05;
            break;
        case 7:
            state.backAlpha -= .05;
            break;
    }

    this.refreshCommandList();
    spWatchWindowFactory.updateGlobalTransform();
}

spWatchWindowConfig.prototype.onRight = function(){
    let state = spWatchWindowFactory.state;
    console.log(this._index)
    switch(this._index){
        case 0: 
            state.clipLeft = !state.clipLeft;
            break;
        case 1: 
            state.clipTop = !state.clipTop;        
            break;
        case 2:
            state.width = Math.min(state.width + .05, 1);
            break;
        case 3:
            state.height = Math.min(state.height + .05, 1)
            break;
        case 4:
            state.xOffset += .05;
            break;
        case 5:
            state.yOffset += .05;
            break;
        case 6 :
            state.alpha += .05;
            break;
        case 7:
            state.backAlpha += .05;
            break;
    }

    this.refreshCommandList();
    spWatchWindowFactory.updateGlobalTransform();
}

spWatchWindowConfig.prototype.refreshCommandList = function(){
    this.clearCommandList();
    this.makeCommandList();
    this.contents.clear();
    this.createContents();
    this.drawAllItems();
}


spWatchWindowConfig.prototype.cancel = function(){
    this.close();
    this.parent.open()
    this.parent.activate()
}

spWatchWindowConfig.prototype.update = function(){
    Window_Command.prototype.update.call(this);
    if(Input.isTriggered('left')){
        this.onLeft();
    }

    if(Input.isTriggered('right')){
        this.onRight();
    }
}

    


//Add individual display window, use factory model to manage instances of windows and their content/updating.

/**
 * User presses button
 * Head menu opens
 * -OPTION Watch windows
 * -OPTION Object browser
 * 
 * WATCH WINDOWS
 * -OPTION Clear Windows
 * -OPTION Add Window
 * -OPTION Remove Window 
 * -OPTION Window Config
 * 
 * -Add window opens object browser, user selects data to watch
 * 
 * -Window Config opens CONFIG window
 * 
 * CONFIG WINDOW
 * -OPTION Width
 * -OPTION Height
 * -OPTION Alpha
 * -OPTION BackAlpha
 * -OPTION Frame
 * -OPTION X offset
 * -Option Y offset
 * -Option refreshRate
 * 
 * OBJECT BROWSER
 * Opens master list of Objects to browse
 * --SceneManager
 * --OPTIONS All $gameObjects
 * --OPTIONS All $dataObjects
 * 
 * Should identify if something is an ENDPOINT, FUNCTION, or DRILLPOINT
 * -Endpoints are values like $gamePlayer.x, where the property is a value 
 * -Functions are values like $gamePlayer.moveLeft, where the property is a function
 * -Drillpoints are things like $gamePlayer._followers, where the value returned is another object
 * 
 * Should allow User to modify values of Endpoints and run Functions
 */



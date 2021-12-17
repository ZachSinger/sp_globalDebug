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

    this.setHandler('cancel', this.onCancel.bind(this))
}

spDebug.prototype.makeCommandList = function(){
    this.addCommand('Watch Windows', 'watchWindow');
    this.addCommand('Object Browser', 'objectBrowser');
    this.setHandler('watchWindow', this.openWatchWindow.bind(this));
    this.setHandler('objectBrowser', this.openObjectBrowser.bind(this));
}

spDebug.prototype.onCancel = function(){
    this.close();
    spDebugProfile.debugWindow = null;
    spDebugProfile.active = false;
    $gameSystem.enableMenu()


spDebug.prototype.openWatchWindow = function(){
    console.log(this)
    this.close();
    spWatchWindowFactory.openMenu();

}

spDebug.prototype.openObjectBrowser = function(){
    this.browserWindow = new spObjectBrowserWindow();
    this.browserDescWindow = new spObjectDescWindow();
    this.close();
    SceneManager._scene.addChild(this.browserWindow)
    SceneManager._scene.addChild(this.browserDescWindow)
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
    scene: null,
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
    let length = this.windows.length;
    let f = prompt("enter your function")
    cb = cb ? cb : ()=>{return eval(f)}

    let window = new spWatchWindow(cb, this.getWindowDimensions());

    this.windows.push(window);
    this.stage.addChild(window);
    this.scene = SceneManager._scene;

    return window
}

spWatchWindowFactory.removeWatchWindow = function(index){
    let win = this.windows.splice(index, 1)[0];
    
    this.stage.removeChild(win);
    this.updateGlobalTransform()
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
    if(SceneManager._scene !== this.scene)
        return
    this.windows.forEach((element)=> {
        element.drawContent();
        this.stage.addChild(element)
    })
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

    this.selection = 0;
    this.configWindow = new spWatchWindowConfig();
    this.configWindow.close();
    this.configWindow.deactivate();
    this.addChild(this.configWindow);
}

spWatchWindowMenu.prototype.makeCommandList = function(){
    this.addCommand("Add", "add")
    this.addCommand("Remove", "remove")
    this.addCommand("Config", "config")
    
    this.setHandler("config", this.openConfigWindow.bind(this))
    this.setHandler('cancel', this.cancel.bind(this))
    this.setHandler('add', this.add.bind(this))
    this.setHandler('remove', this.remove.bind(this))
}

spWatchWindowMenu.prototype.remove = function(){
    spWatchWindowFactory.removeWatchWindow(this.selection)
    this.selection = Math.min(this.selection + 1, spWatchWindowFactory.windows.length - 1);
    if(spWatchWindowFactory.windows.length)
        spWatchWindowFactory.windows[this.selection].frameVisible = true;

    this.activate()
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
    this.configWindow.activate()
    this.configWindow.open()
}

spWatchWindowMenu.prototype.listenForSelectionControls = function(){
    let length = spWatchWindowFactory.windows.length;
    let selection = this.selection;

    spWatchWindowFactory.windows[this.selection].frameVisible = false;

    if(Input.isTriggered('right')){
        this.selection = selection - 1 >= 0 ? selection - 1 : length - 1;
    } else if(Input.isTriggered('left')){
        this.selection = selection + 1 < length ? selection + 1 : 0;
    }

    spWatchWindowFactory.windows[this.selection].frameVisible = true;
}

spWatchWindowMenu.prototype.update = function(){
    Window_Command.prototype.update.call(this)
    if(this._index == 1 && spWatchWindowFactory.windows.length > 0)
        this.listenForSelectionControls()
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
    if(!this.active)
        return 

    console.log('listening on config')
    if(Input.isTriggered('left')){
        this.onLeft();
    }

    if(Input.isTriggered('right')){
        this.onRight();
    }
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function spObjectBrowserWindow(){
    this.initialize.apply(this, arguments)
}

spObjectBrowserWindow.prototype = Object.create(Window_Command.prototype)
spObjectBrowserWindow.prototype.constructor = spObjectBrowserWindow;

spObjectBrowserWindow.prototype.initialize = function(){
    let rect = new Rectangle(0, 0, 200, Graphics.height)
    Window_Command.prototype.initialize.call(this, rect)
}

spObjectBrowserWindow.prototype.makeCommandList = function(){
    let obj = this.getCurrentObject()
    let keys = Object.keys(obj);

    keys.forEach((item)=>{
        if(obj === window ){
            if(item.contains("$"))
                this.addCommand(item, "confirmSelect")
        } else  {
            this.addCommand(item, "confirmSelect")
        }
    })

    this.setHandler('confirmSelect', this.confirmSelect.bind(this))
}

spObjectBrowserWindow.prototype.getCurrentObject = function(){
    this.currentObject = this.currentObject ? this.currentObject : window;
    return this.currentObject
}

spObjectBrowserWindow.prototype.getCurrentPropName = function(){
    return this._list[this._index].name
}

spObjectBrowserWindow.prototype.confirmSelect = function(){
    let obj = this.getCurrentObject()
    let data = obj[this.getCurrentPropName()];
    this.currentObject = this.currentObject[this.getCurrentPropName()];
    console.log(data)
    this.remakeCommandList()
    this.select(0)
    this.activate()
}

spObjectBrowserWindow.prototype.remakeCommandList = function(){
    this.clearCommandList();
    this.contents.clear();
    this.makeCommandList();
    this.drawAllItems();
}
    








function spObjectDescWindow(){
    this.initialize.apply(this, arguments)
}

spObjectDescWindow.prototype = Object.create(Window_Base.prototype)
spObjectDescWindow.prototype.constructor = spObjectDescWindow;

spObjectDescWindow.prototype.initialize = function(){
    let rect = new Rectangle(Graphics.width - 400, 0, 400, 100)
    Window_Base.prototype.initialize.call(this, rect)
}

spObjectDescWindow.prototype.display = function(data){
    this.contents.clear();
    this.drawTextEx(data.toString())
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



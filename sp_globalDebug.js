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
    this.setHandler('watchWindow', this.openWatchWindow);
    this.setHandler('objectBrowser', this.openObjectBrowser);
}

spDebug.prototype.openWatchWindow = function(){
    spWatchWindowFactory.openMenu();
}

spDebug.prototype.openObjectBrowser = function(){
    console.log('opening object browser')
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
    let yOffset = gHeight * state.xOffset;
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
    let rect = new Rectangle(0, 0, 200, this.itemHeight() * 3)
    
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
}

spWatchWindowMenu.prototype.openConfigWindow = function(){
    console.log('running config callback')
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

    this.addCommand(`Snap Left: ${state.clipLeft}`, 'changeSnapLeft')
    this.addCommand(`Snap Top: ${state.clipTop}`, 'changeSnapTop')
    this.addCommand(`Width: ${state.width}`, 'changeWidth')
    this.addCommand(`Height: ${state.height}`, 'changeHeight')
    this.addCommand(`X Offset: ${state.xOffset}`, 'changeXOffset')
    this.addCommand(`Y Offset: ${state.yOffset}`, 'changeYOffset')
    this.addCommand(`Alpha: ${state.alpha}`, 'changeAlpha')
    this.addCommand(`Back Alpha: ${state.backAlpha}`, 'changeBackAlpha')

    this.setHandler('changeSnapLeft', this.changeSnapLeft)
    this.setHandler('changeSnapTop', this.changeSnapTop)
    this.setHandler('changeWidth', this.changeWidth)
    this.setHandler('changeHeight', this.changeHeight)
    this.setHandler('changeXOffset', this.changeXOffset)
    this.setHandler('changeYOffset', this.changeYOffset)
    this.setHandler('changeAlpha', this.changeAlpha)
    this.setHandler('changeBackAlpha', this.changeBackAlpha)
}

spWatchWindowConfig.prototype.changeSnapLeft = function(){

}

spWatchWindowConfig.prototype.changeSnapTop = function(){

}

spWatchWindowConfig.prototype.changeWidth = function(){

}

spWatchWindowConfig.prototype.changeHeight = function(){

}

spWatchWindowConfig.prototype.changeXOffset = function(){

}

spWatchWindowConfig.prototype.changeYOffset = function(){

}

spWatchWindowConfig.prototype.changeAlpha = function(){

}

spWatchWindowConfig.prototype.changeBackAlpha = function(){

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



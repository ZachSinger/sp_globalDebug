var Imported = Imported || {};
Imported.sp_Core = 'sp_Core';

var standardPlayer = standardPlayer || { params: {} };
standardPlayer.sp_Core = standardPlayer.sp_Core || {};

standardPlayer.sp_Core.Parameters = PluginManager.parameters('standardPlayer.sp_Core');


/* ===================================================================================================
        Update Handlers
 ===================================================================================================*/
standardPlayer.sp_Core.updateContainer = {
    _sceneBaseUpdatesPre: [],
    _sceneMenuUpdatesPre: [],
    _sceneMapUpdatesPre: [],
    _sceneBaseUpdatesPost: [],
    _sceneMenuUpdatesPost: [],
    _sceneMapUpdatesPost: []
}

standardPlayer.sp_Core._aliasSceneBase = Scene_Base.prototype.update;
standardPlayer.sp_Core._aliasSceneMenu = Scene_MenuBase.prototype.update;
standardPlayer.sp_Core._aliasSceneMap = Scene_Map.prototype.update;

standardPlayer.sp_Core.addBaseUpdate = function (method, post, index) {
    let updates = post ?
        this.updateContainer._sceneBaseUpdatesPost :
        this.updateContainer._sceneBaseUpdatesPre;

    this.addUpdate(updates, method, index)
}

standardPlayer.sp_Core.addMapUpdate = function (method, post, index) {
    console.log(this === standardPlayer)
    console.log(this === standardPlayer.sp_Core)
    let updates = post ?
        this.updateContainer._sceneMapUpdatesPost :
        this.updateContainer._sceneMapUpdatesPre;

    this.addUpdate(updates, method, index)
}

standardPlayer.sp_Core.addMenuUpdate = function (method, post, index) {
    let updates = post ?
        this.updateContainer._sceneMenuUpdatesPre :
        this.updateContainer._sceneMenuUpdatesPost;

    this.addUpdate(updates, method, index)
}

standardPlayer.sp_Core.addUpdate = function (location, method, index) {

    index = typeof index !== 'undefined' ?
        arguments[1] <= location.length ?
            arguments[1] :
            location.length :
        location.length;

    location.splice(index, 0, method);
}

standardPlayer.sp_Core.removeBaseUpdate = function (method, post) {
    let updates = post ?
        '_sceneBaseUpdatesPost' :
        '_sceneBaseUpdatesPre';

    this.removeUpdate(updates, method)
}

standardPlayer.sp_Core.removeMapUpdate = function (method, post) {
    let updates = post ?
        '_sceneMapUpdatesPost' :
        '_sceneMapUpdatesPre';

    this.removeUpdate(updates, method)
}

standardPlayer.sp_Core.removeMenuUpdate = function (method, post) {
    let updates = post ?
        '_sceneMenuUpdatesPost' :
        '_sceneMenuUpdatesPre';

    this.removeUpdate(updates, method)
}

standardPlayer.sp_Core.removeUpdate = function (locationName, method) {
    let location = this.updateContainer[locationName];

    this.updateContainer[locationName] = location.filter(item => item != method);

}

Scene_Base.prototype.update = function () {
    standardPlayer.sp_Core.updateContainer._sceneBaseUpdatesPre.forEach(
        item => item()
    )

    standardPlayer.sp_Core._aliasSceneBase.call(this);

    standardPlayer.sp_Core.updateContainer._sceneBaseUpdatesPost.forEach(
        item => item()
    )
}


Scene_Map.prototype.update = function () {
    let thisObject = this;

    standardPlayer.sp_Core.updateContainer._sceneMapUpdatesPre.forEach(
        item => item()
    )

    standardPlayer.sp_Core._aliasSceneMap.call(this);

    standardPlayer.sp_Core.updateContainer._sceneMapUpdatesPost.forEach(
        item => item()
    )
}

Scene_MenuBase.prototype.update = function () {
    let thisObject = this;

    standardPlayer.sp_Core.updateContainer._sceneMenuUpdatesPre.forEach(
        item => item()
    )

    standardPlayer.sp_Core._aliasSceneMenu.call(this);

    standardPlayer.sp_Core.updateContainer._sceneMenuUpdatesPost.forEach(
        item => item()
    )
}



/* ===================================================================================================
        Movement Handlers
 ===================================================================================================*/

standardPlayer.sp_Core.allowPlayerMovement = true;
standardPlayer.sp_Core.allowEventMovement = true;
standardPlayer.sp_Core.aliasPlayerCanMove = Game_Player.prototype.canMove;
standardPlayer.sp_Core.aliasEventSelfMovement = Game_Event.prototype.updateSelfMovement;

Game_Player.prototype.canMove = function () {
    if (standardPlayer.sp_Core.allowPlayerMovement)
        return standardPlayer.sp_Core.aliasPlayerCanMove.call(this);
}

Game_Event.prototype.canMove = function () {
    return standardPlayer.sp_Core.allowEventMovement;
}

Game_Event.prototype.updateSelfMovement = function () {
    if (this.canMove())
        standardPlayer.sp_Core.aliasEventSelfMovement.call(this);
}

standardPlayer.sp_Core.togglePlayerMovement = function (canMove) {
    this.allowPlayerMovement = arguments.length > 0 ?
        canMove :
        !this.allowPlayerMovement;
}

standardPlayer.sp_Core.toggleEventMovement = function (canMove) {
    this.allowEventMovement = arguments.length > 0 ?
        canMove :
        !this.allowEventMovement;
}


/* ===================================================================================================
        Input Handlers
 ===================================================================================================*/

standardPlayer.sp_Core.inputCache = JSON.parse(JSON.stringify(Input.keyMapper));

standardPlayer.sp_Core.toggleAction = function (action, enable) {
    let keys = Object.keys(Input.keyMapper);
    let vals = Object.values(Input.keyMapper);
    let disabled = 'temp' + action;
    let process = typeof enable == 'undefined' ? 2 : enable ? 0 : 1;

    for (i in keys) {
        if (process == 0) {
            //enabled
            if (vals[i] == disabled)
                Input.keyMapper[keys[i]] = action;
        } else if (process == 1) {
            //disabled
            if (vals[i] == action)
                Input.keyMapper[keys[i]] = disabled;
        } else {
            //toggled
            if (vals[i] == disabled)
                Input.keyMapper[keys[i]] = action;
            else if (vals[i] == action)
                Input.keyMapper[keys[i]] = disabled;
        }


    }
}

standardPlayer.sp_Core.toggleInput = function (enable) {
    let vals = ["ok", "cancel", "shift", "control", "pageup", "pagedown", "up", "down", "right", "left", "tab", "escape"];

    this.toggleKeys(vals, enable);
}

standardPlayer.sp_Core.toggleMovementKeys = function (enable) {
    let vals = ["up", "down", "left", "right"];

    this.toggleKeys(vals, enable);
}

standardPlayer.sp_Core.toggleSelectKey = function (enable) {
    this.toggleKeys(["ok"], enable)
}

standardPlayer.sp_Core.toggleKeys = function (vals, enable) {
    vals.forEach(item => this.toggleAction(item, enable));
}


/* ===================================================================================================
       Character Sprite tools
===================================================================================================*/

standardPlayer.sp_Core.getCharactersSpriteset = function () {
    return SceneManager._scene._spriteset.children[0].children[2].children;
}

standardPlayer.sp_Core.getCharacterFromSpriteset = function (character) {
    let spriteset = this.getCharactersSpriteset();

    for (sprite of spriteset) {
        if (sprite._character == character)
            character.sprite = sprite;
            
    }
}

standardPlayer.sp_Core.setSpriteReferences = function () {
    let evs = $gameMap.events().concat($gamePlayer._followers._data);

    evs.forEach(ev => standardPlayer.sp_Core.getCharacterFromSpriteset(ev))
}


standardPlayer.sp_Core._aliasMapStart = Scene_Map.prototype.start;
Scene_Map.prototype.start = function () {
    standardPlayer.sp_Core.setSpriteReferences();
    standardPlayer.sp_Core.getCharacterFromSpriteset($gamePlayer)

    standardPlayer.sp_Core._aliasMapStart.call(this)
}

Game_CharacterBase.prototype.setRow = function(row){
    let sprite = this.sprite;
    let singleHeight = sprite.height;
    let singleWidth = sprite.width;

    if(!this.gridData)
        this.gridData = {row:0, col:0, rowMax:3, colMax:2}
    console.log(Math.min(row, this.gridData.rowMax))
    row = Math.max(Math.min(row, this.gridData.rowMax), 0);    
    this.gridData.row = row;

    sprite.texture.frame = new Rectangle(sprite.texture.frame.x, singleHeight * row, singleWidth, singleHeight)
}

Game_CharacterBase.prototype.setCol = function(col){
    let sprite = this.sprite;
    let singleHeight = sprite.height;
    let singleWidth = sprite.width;

    if(!this.gridData)
        this.gridData = {row:0, col:0, rowMax:3, colMax:2}
    console.log(Math.min(col, this.gridData.colMax))
    col = Math.max(Math.min(col, this.gridData.colMax), 0);    
    this.gridData.col = col;

    sprite.texture.frame = new Rectangle( singleWidth * col, sprite.texture.frame.y, singleWidth, singleHeight)
}

Game_CharacterBase.prototype.setRowCol = function(row, col){
    this.setRow(row);
    this.setCol(col);
}

Game_CharacterBase.prototype.setGridData = function(rows, cols){
    let sprite = this.sprite;

    if(!this.gridData)
        this.gridData = {row:0, col:0, rowMax:rows - 1, colMax:cols - 1}

    sprite.texture.frame = new Rectangle(0, 0, sprite.texture.baseTexture.width / cols, sprite.texture.baseTexture.height / rows)
        return this;
}



/* ===================================================================================================
       Common Utility Functions
===================================================================================================*/

standardPlayer.sp_Core.plotLinearPath = function (orig, dest, frames, pad) {
    let dist = dest - orig;
    let inc = dist / frames;
    let result = [];

    pad = pad ? pad : 0;
    for (let i = 0; i < pad; i++) {
        result[i] = orig;
    }


    let length = result.length - 1;
    for (let i = 1; i <= frames; i++) {
        result[length + i] = orig + inc * i
    }

    return result
}

standardPlayer.sp_Core.retrieveFromList = function (list, condition) {
    let length = list.length;

    for (let i = 0; i < length; i++) {
        if (condition(list[i])) {
            return [i, list[i]]
        }
    }

    return false;
}

standardPlayer.sp_Core.collision = function(spriteA, spriteB) {
    if(!spriteB)
    spriteB = {x:TouchInput.x, y:TouchInput.y, width:1, height:1}
    return !(
        ((spriteA.y + spriteA.height) < (spriteB.y)) ||
        (spriteA.y > (spriteB.y + spriteB.height)) ||
        ((spriteA.x + spriteA.width) < spriteB.x) ||
        (spriteA.x > (spriteB.x + spriteB.width))
    );
}

standardPlayer.sp_Core.rndBetween = function(min, max, includingMax) {
    max = includingMax ? max + 1 : max;
  return Math.floor(Math.random() * (max - min) ) + min;
}
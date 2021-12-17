let sp_Core = {
    _sceneBaseUpdates:[],
    _sceneMenuUpdates:[],
    _sceneMapUpdates:[],
    _aliasSceneBase: Scene_Base.prototype.update,
    _aliasSceneMenu: Scene_MenuBase.prototype.update,
    _aliasSceneMap: Scene_Map.prototype.update
}

sp_Core.addBaseUpdate = function(method, index){
    let updates = this._sceneBaseUpdates;
    
    this.addUpdate(updates, method, index)
}

sp_Core.addMapUpdate = function(method, index){
    let updates = this._sceneMapUpdates;
    
    this.addUpdate(updates, method, index)
}

sp_Core.addMenuUpdate = function(method, index){
    let updates = this._sceneMenuUpdates;

    this.addUpdate(updates, method, index)
}

sp_Core.addUpdate = function(location, method, index){
    
    index = typeof index !== 'undefined' ? 
        arguments[1] <= location.length ? 
            arguments[1] : 
                location.length : 
        location.length;

    location.splice(index, 0, method);
}
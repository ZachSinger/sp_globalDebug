let sp_Core = {
    _sceneBaseUpdatesPre:[],
    _sceneMenuUpdatesPre:[],
    _sceneMapUpdatesPre:[],
    _sceneBaseUpdatesPost:[],
    _sceneMenuUpdatesPost:[],
    _sceneMapUpdatesPost:[],
    _aliasSceneBase: Scene_Base.prototype.update,
    _aliasSceneMenu: Scene_MenuBase.prototype.update,
    _aliasSceneMap: Scene_Map.prototype.update
}

sp_Core.addBaseUpdate = function(method, post, index){
    let updates = post ? 
    this._sceneBaseUpdatesPost:
    this._sceneBaseUpdatesPre;
    
    this.addUpdate(updates, method, index)
}

sp_Core.addMapUpdate = function(method, post, index){
    let updates = post ? 
    this._sceneMapUpdatesPost:
    this._sceneMapUpdatesPre;
    
    this.addUpdate(updates, method, index)
}

sp_Core.addMenuUpdate = function(method, post, index){
    let updates = post ? 
    this._sceneMenuUpdatesPre:
    this._sceneMenuUpdatesPost;

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

sp_Core.removeBaseUpdate = function(method){
    let updates = '_sceneBaseUpdates';
    
    this.removeUpdate(updates, method)
}

sp_Core.removeMapUpdate = function(method){
    let updates =  '_sceneMapUpdates';

    this.removeUpdate(updates, method)
}

sp_Core.removeMenuUpdate = function(method){
    let updates = '_sceneMenuUpdates'

    this.removeUpdate(updates, method)
}

sp_Core.removeUpdate = function(locationName, method){
    let location = this[locationName];
    
    this[locationName] = location.filter(item => item != method);
    
}

Scene_Base.prototype.update = function(){
    let thisObject = this;

    sp_Core._sceneBaseUpdatesPre.forEach(
        item => item.call(thisObject)
    )

    sp_Core._aliasSceneBase.call(this);

    sp_Core._sceneBaseUpdatesPost.forEach(
        item => item.call(thisObject)
    )
}


Scene_Map.prototype.update = function(){
    let thisObject = this;

    sp_Core._sceneMapUpdatesPre.forEach(
        item => item.call(thisObject)
    )

    sp_Core._aliasSceneMap.call(this);

    sp_Core._sceneMapUpdatesPost.forEach(
        item => item.call(thisObject)
    )
}

Scene_MenuBase.prototype.update = function(){
    let thisObject = this;

    sp_Core._sceneMenuUpdatesPre.forEach(
        item => item.call(thisObject)
    )

    sp_Core._aliasSceneMenu.call(this);

    sp_Core._sceneMenuUpdatesPost.forEach(
        item => item.call(thisObject)
    )
}

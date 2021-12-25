var Imported = Imported || {};
Imported.sp_ImageCache = 'sp_ImageCache';

var standardPlayer = standardPlayer || { params: {} };
standardPlayer.sp_ImageCache = standardPlayer.sp_ImageCache || {
    containers: [],
    sprites: [],
    graphics: [],
    text: [],
    isLoaded: false,
    active: true
};

standardPlayer.sp_Core.addBaseUpdate(() => {
    let thisObject = standardPlayer.sp_ImageCache;
    if (thisObject.active)
        thisObject.run();
})

standardPlayer.sp_ImageCache.Parameters = PluginManager.parameters('standardPlayer.sp_ImageCache');

standardPlayer.sp_ImageCache.loadSprite = function (url, cb, args) {
    let id = `sprite:${this.generateUUID()}`
    let stub = new spriteStub(id);
    let spr = new PIXI.Sprite.from(`img/${url}.png`);

    spr.cacheId = id;
    spr.onCacheLoad = cb;
    spr.onCacheArgs = args;
    this.sprites.push(spr)
    this.active = true

    return stub;
}


standardPlayer.sp_ImageCache.createContainer = function(){
    let container = new PIXI.Container;
    let id = `container:${this.generateUUID()}`
    let stub = new containerStub(id)

    container.cacheId = id;
    this.containers.push(container)
    return stub;
}

standardPlayer.sp_ImageCache.retrieveEntity = function (cacheId) {
    switch (true) {
        case cacheId.contains('sprite'):
            return this.retrieveSprite(cacheId)[1]

        case cacheId.contains('container'):
            return this.retrieveContainer(cacheId)[1]

        case cacheId.contains('graphic'):
            return this.retreiveGraphic(cacheId)[1]

        case cacheId.contains('text'):
            return this.retreiveText(cacheId)[1]

        default:
            console.log('not recognized id')
    }
}

standardPlayer.sp_ImageCache.retrieveSprite = function (cacheId) {
    return standardPlayer.sp_Core.retrieveFromList(this.sprites, (sprite) => {
        return sprite.cacheId == cacheId
    })
}

standardPlayer.sp_ImageCache.retrieveContainer = function (cacheId) {
    return standardPlayer.sp_Core.retrieveFromList(this.containers, (container) => {
        return container.cacheId == cacheId
    })
}

standardPlayer.sp_ImageCache.retreiveGraphic = function (cacheId) {
    return standardPlayer.sp_Core.retrieveFromList(this.graphics, (graphic) => {
        return graphic.cacheId == cacheId
    })
}

standardPlayer.sp_ImageCache.retreiveText = function (cacheId) {
    return standardPlayer.sp_Core.retrieveFromList(this.text, (text) => {
        return text.cacheId == cacheId
    })
}

standardPlayer.sp_ImageCache.generateUUID = function(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
    return uuid
}

standardPlayer.sp_ImageCache.run = function(){
    console.log('image cache running')
    this.isReady();
    if(this.isLoaded)
        this.active = false;
}

standardPlayer.sp_ImageCache.isReady = function(){
    this.isLoaded = this.allSpritesLoaded()
}

standardPlayer.sp_ImageCache.allSpritesLoaded = function(){
    let list = this.sprites;
    let length = list.length;
    let loaded = true;
    let current;

    for(let i = 0; i < length; i++){
        current = list[i]
        if(typeof current.sp_image_loaded == 'undefined'){
            loaded = false;
            if(current.texture.baseTexture.valid){
                current.sp_image_loaded = true;
                current.onCacheLoad(current.onCacheArgs);
            }
        } 
    }
    return loaded;
}


class cacheStub {
    constructor(id) {
        this.cacheId = id
    }

    retrieve() {
        return standardPlayer.sp_ImageCache.retrieveEntity(this.cacheId)
    }
}


class spriteStub extends cacheStub {
    constructor(id){
        super(id)
    }

class containerStub extends cacheStub {
    constructor(id){
        super(id)
    }
}
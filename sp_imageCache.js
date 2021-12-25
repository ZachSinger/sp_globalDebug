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

standardPlayer.sp_ImageCache.loadSharedSprite = function (url, cb, args) {
    let id = `sprite:${this.generateUUID()}`
    let stub = new spriteStub(id);
    let spr = new PIXI.Sprite.from(`img/${url}.png`);
    
    if(typeof cb == 'undefined')
        cb = ()=>{};

    spr.sp_image_cacheId = id;
    spr.onCacheLoad = cb
    spr.onCacheArgs = args;
    this.sprites.push(spr)
    this.active = true

    return stub;
}

standardPlayer.sp_ImageCache.loadSprite = function(url, cb, args){
    let id = `sprite:${this.generateUUID()}`
    let stub = new spriteStub(id);
    let spr = new PIXI.Sprite.from(this.createTexture(`img/${url}.png`));

    if(typeof cb == 'undefined')
        cb = ()=>{};

    spr.sp_image_cacheId = id;
    spr.onCacheLoad = cb;
    spr.onCacheArgs = args;
    this.sprites.push(spr)
    this.active = true

    return stub;


}

standardPlayer.sp_ImageCache.createTexture = function(url){
    if(typeof PIXI.utils.TextureCache[url] != 'undefined'){
        return new PIXI.Texture(PIXI.utils.TextureCache[url])
    }
    return new PIXI.Texture.from(url)
}

standardPlayer.sp_ImageCache.createContainer = function(){
    let container = new PIXI.Container;
    let id = `container:${this.generateUUID()}`
    let stub = new containerStub(id)

    container.sp_image_cacheId = id;
    this.containers.push(container)
    return stub;
}

standardPlayer.sp_ImageCache.createGraphic = function(){
    let graphic = new PIXI.Graphics;
    let id = `graphic:${this.generateUUID()}`
    let stub = new graphicStub(id)

    graphic.sp_image_cacheId = id;
    this.graphics.push(graphic)
    return stub;
}

standardPlayer.sp_ImageCache.retrieveEntity = function (sp_image_cacheId) {
    switch (true) {
        case sp_image_cacheId.contains('sprite'):
            return this.retrieveSprite(sp_image_cacheId)[1]

        case sp_image_cacheId.contains('container'):
            return this.retrieveContainer(sp_image_cacheId)[1]

        case sp_image_cacheId.contains('graphic'):
            return this.retreiveGraphic(sp_image_cacheId)[1]

        case sp_image_cacheId.contains('text'):
            return this.retreiveText(sp_image_cacheId)[1]

        default:
            console.log('not recognized id')
    }
}

standardPlayer.sp_ImageCache.retrieveSprite = function (sp_image_cacheId) {
    return standardPlayer.sp_Core.retrieveFromList(this.sprites, (sprite) => {
        return sprite.sp_image_cacheId == sp_image_cacheId
    })
}

standardPlayer.sp_ImageCache.retrieveContainer = function (sp_image_cacheId) {
    return standardPlayer.sp_Core.retrieveFromList(this.containers, (container) => {
        return container.sp_image_cacheId == sp_image_cacheId
    })
}

standardPlayer.sp_ImageCache.retreiveGraphic = function (sp_image_cacheId) {
    return standardPlayer.sp_Core.retrieveFromList(this.graphics, (graphic) => {
        return graphic.sp_image_cacheId == sp_image_cacheId
    })
}

standardPlayer.sp_ImageCache.retreiveText = function (sp_image_cacheId) {
    return standardPlayer.sp_Core.retrieveFromList(this.text, (text) => {
        return text.sp_image_cacheId == sp_image_cacheId
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
        this.sp_image_cacheId = id
    }

    retrieve() {
        return standardPlayer.sp_ImageCache.retrieveEntity(this.sp_image_cacheId)
    }
}


class spriteStub extends cacheStub {
    constructor(id){
        super(id)
    }
}

class containerStub extends cacheStub {
    constructor(id){
        super(id)
    }
}

class graphicStub extends cacheStub {
    constructor(id){
        super(id)
    }
}
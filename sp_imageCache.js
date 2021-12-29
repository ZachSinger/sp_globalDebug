var Imported = Imported || {};
Imported.sp_ImageCache = 'sp_ImageCache';

var standardPlayer = standardPlayer || { params: {} };
standardPlayer.sp_ImageCache = standardPlayer.sp_ImageCache || {
    containers: [],
    sprites: [],
    graphics: [],
    text: [],
    batches: [],
    batchCbs: {},
    batchArgs:[],
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

standardPlayer.sp_ImageCache.loadBatch = function(name, list, cb, args){
    let length = list.length;
    let stubs = [];
    if(!cb){
        cb = ()=> {}
    }

    for(let i = 0; i < length; i++){
        stubs.push(this.loadSprite(list[i]))
        stubs[i].retrieve().sp_image_cache_batch = name;
    }
    this.batches.push(name)
    this.batchCbs.push(cb)
    this.batchArgs.push(args)

    return stubs;
}

standardPlayer.sp_ImageCache.loadSharedBatch = function(name, list, cb, args){
    let length = list.length;
    let stubs = [];
    if(!cb){
        cb = ()=> {}
    }

    for(let i = 0; i < length; i++){
        stubs.push(this.loadSharedSprite(list[i]))
        stubs[i].retrieve().sp_image_cache_batch = name;
    }
    this.batches.push(name)
    this.batchCbs.push(cb)
    this.batchArgs.push(args)

    return stubs;
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

standardPlayer.sp_ImageCache.createText = function(content){
    let text = new PIXI.Text(content);
    let id = `text:${this.generateUUID()}`
    let stub = new textStub(id)

    text.sp_image_cacheId = id;
    this.text.push(text)
    return stub;
}

//returns true if it find the same texture as the sprite on the stub provided, but on a different sprite in the cache
standardPlayer.sp_ImageCache.textureInUse = function(stub){
    let texture = stub.retrieve().texture;
    let baseTexture = texture.baseTexture;
    let list = this.sprites;
    let length = list.length;

    for(let i = 0; i < length; i++){
        if(list[i].texture.baseTexture === baseTexture && list[i].texture !== texture){ 
            if(list[i].parent){
                return true
            }
        }
    }

    return false
}

standardPlayer.sp_ImageCache.deleteSprite = function(stub){
    let list = this.sprites;
    let length = list.length;
    let newList = [];
    let toDelete = [];

    for(let i = 0; i < length; i++){
        if(list[i].sp_image_cacheId == stub.sp_image_cacheId){
            console.log(this.textureInUse(stub)) 
            list[i].destroy(!this.textureInUse(stub)) 
            list[i] = undefined
        } else {
            newList.push(list[i])
        }
    }

    this.sprites = newList;
}

standardPlayer.sp_ImageCache.deleteGraphic = function(stub){
    let list = this.graphics;
    let index = standardPlayer.sp_Core.retrieveFromList(list, (item)=>{
        return item == stub.retrieve();
    })[0]

    list[index].destroy(true)
    list.splice(index, 1)
    
}

standardPlayer.sp_ImageCache.deleteText = function(stub){
    let list = this.text;
    let index = standardPlayer.sp_Core.retrieveFromList(list, (item)=>{
        return item == stub.retrieve();
    })[0]

    list[index].destroy(true)
    list.splice(index, 1)
}


standardPlayer.sp_ImageCache.deleteContainer = function(stub){
    let list = this.containers;
    let length = list.length;
    let newList = [];
    let toDelete = [];

    for(let i = 0; i < length; i++){
        if(list[i].sp_image_cacheId == stub.sp_image_cacheId){
            console.log('found container')
            this.destroyContainerChildren(list[i]);
            list[i].destroy(true) 
            list[i] = undefined
        } else {
            newList.push(list[i])
        }
    }
    console.log(newList)
    this.containers = newList;
}

standardPlayer.sp_ImageCache.destroyContainerChildren = function(container){
    let spr;

    while(container.children.length > 0){
        spr = container.removeChildAt(0);
        this.deleteSprite(
            {retrieve: ()=>{
                return spr;
            },
            sp_image_cacheId: spr.sp_image_cacheId
            })
        spr = undefined;
    }
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
    let batches = [];

    for(let i = 0; i < length; i++){
        current = list[i]
        if(typeof current.sp_image_loaded == 'undefined'){
            loaded = false;
            if(current.sp_image_cache_batch){
                    batches[current.sp_image_cache_batch] = true;
                }
            if(current.texture.baseTexture.valid){
                current.sp_image_loaded = true;
                current.onCacheLoad(current.onCacheArgs);
            } else {
                console.log('reaching')
                if(current.sp_image_cache_batch){
                    batches[current.sp_image_cache_batch] = true;
                }
            }
        } 
    }

    this.checkBatches(batches);
    return loaded;
}

//the batches arg contains a list of batch names that are NOT READY to be called 
standardPlayer.sp_ImageCache.checkBatches = function(batches){
    let list = this.batches;
    let cbs = this.batchCbs;
    let args = this.batchArgs;
    let length = list.length;
    let fleeceList = [];

    for(let i = 0; i < length; i++)   {
        if(batches[list[i]])
            continue
        
        cbs[i](args[i])
        fleeceList.push(i)
    }

    this.fleeceCallbacks(fleeceList)
}

standardPlayer.sp_ImageCache.fleeceCallbacks = function(fleeceList){
    let batches = this.batches;
    let cbs = this.batchCbs;
    let args = this.batchArgs; 
    let length = batches.length;
    let newBatches = []
    let newCbs = [];
    let newArgs = [];


    for(let i = 0; i < length; i++){
        if(fleeceList.contains(i))
            continue;

        newBatches.push(batches[i])
        newCbs.push(cbs[i])
        newArgs.push(args[i])
    }

    this.batches = newBatches;
    this.batchCbs = newCbs;
    this.batchArgs = newArgs;

}


class cacheStub {
    constructor(id) {
        this.sp_image_cacheId = id
        this.ref = this.retrieve.bind(this)
    }

    retrieve() {
        return standardPlayer.sp_ImageCache.retrieveEntity(this.sp_image_cacheId)
    }

}


class spriteStub extends cacheStub {
    constructor(id){
        super(id)
    }

    delete(){
        standardPlayer.sp_ImageCache.deleteSprite(this)
    }
}

class containerStub extends cacheStub {
    constructor(id){
        super(id)
    }

    delete(){
        standardPlayer.sp_ImageCache.deleteContainer(this)
    }
}

class graphicStub extends cacheStub {
    constructor(id){
        super(id)
    }

    delete(){
        standardPlayer.sp_ImageCache.deleteGraphic(this)
    }
}

class textStub extends cacheStub {
    constructor(id){
        super(id)
    }

    delete(){
        standardPlayer.sp_ImageCache.deleteText(this)
    }
}
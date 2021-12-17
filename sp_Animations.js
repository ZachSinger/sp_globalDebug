class spAnimation {
    constructor(target) {
        this.target = target;
    }

    cacheProps(){
        this.initalCache = this.extractInitialProps();
        this.currentPosition = this.extractInitialProps();
    }

    extractInitialProps() {
        let target = this.target;
        let props = {
           'x': target.x,
           'y': target.y,
           'width': target.width,
           'height': target.height,
           'scale': target.scale,
           'alpha': target.alpha
        }
        
        return props;
    }
}
var EventBusBehavior = (function(){
  function getEventBus(ele) {
    if( ele.EVENT_BUS && window[ele.EVENT_BUS] ) {
      return window[ele.EVENT_BUS];
    }
    return window.EventBus;
  }

  return {
    attached : function() {
      this._eventBus = getEventBus(this);
      
      if( !this._eventBus || !this.ebBind ) return;
      for( var key in this.ebBind ) {
        if( !this[this.ebBind[key]] ) {
          console.warn(`${this.nodeName} could not bind event ${key} to ${this.ebBind[key]}`);
          continue;
        }
        this._eventBus.on(key, this[this.ebBind[key]].bind(this));
      }
    },
    detached : function() {
      if( !this._eventBus || !this.ebBind ) return;
      for( var key in this.ebBind ) {
        if( !this[this.ebBind[key]] ) continue;
        this._eventBus.removeListener(key, this[this.ebBind[key]]);
      }
    }
  }

})();
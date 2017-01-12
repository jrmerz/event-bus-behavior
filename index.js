var EventBusBehavior = (function(){
  function getEventBus(ele) {
    if( ele.EVENT_BUS && window[ele.EVENT_BUS] ) {
      return window[ele.EVENT_BUS];
    }
    return window.EventBus;
  }

  function init() {
    if( this._eb_handlersSet ) return;

    this._eventBus = getEventBus(this);
    this._eb_handlersSet = true;
    
    if( !this._eventBus || !this.ebBind ) return;
    for( var key in this.ebBind ) {
      if( !this[this.ebBind[key]] ) {
        console.warn(`${this.nodeName} could not bind event ${key} to ${this.ebBind[key]}`);
        continue;
      }
      this._eventBus.on(key, this[this.ebBind[key]].bind(this));
    }
  }

  function ebChain(events, done) {
    triggerEbChainEvent(0, events, [], this._eventBus, done);
  }

  function triggerEbChainEvent(index, events, results, eventBus, done) {
    var e = events[index];

    if( typeof e === 'string' ) {
      e = {event: e};
    }

    if( !e.payload ) e.payload = {};

    if( e.stream ) {
      for( var key in e.stream ) {
        e.payload[key] = e.stream[key](results);
      }
    }

    e.payload.handler = (result) => {
      results.push(result);
      index++;

      if( index === events.length ) done(results);
      else triggerEbChainEvent(index, events, results, eventBus, done);
    }

    eventBus.emit(e.event, e.payload);
  }

  return {
    // have we initialized the handlers?
    _eb_handlersSet : false,
    // do we want to detach listeners when element is detached
    // (prevent memory leaks)
    _eb_unregisterOnDetach : true,

    ready : init,
    
    attached : init,
    
    detached : function() {
      if( !this._eb_unregisterOnDetach ) return;

      this._eb_handlersSet = false;
      if( !this._eventBus || !this.ebBind ) return;
      
      for( var key in this.ebBind ) {
        if( !this[this.ebBind[key]] ) continue;
        this._eventBus.removeListener(key, this[this.ebBind[key]]);
      }
    },

    ebChain : ebChain
  }

})();
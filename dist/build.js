'use strict';

var EventBusBehavior = function () {
  function init() {
    if (this._eb_handlersSet) return;

    this._eb_handlersSet = true;

    if (!this.getEventBus() || !this.ebBind) return;
    for (var key in this.ebBind) {
      if (!this[this.ebBind[key]]) {
        console.warn(this.nodeName + ' could not bind event ' + key + ' to ' + this.ebBind[key]);
        continue;
      }

      this[this.ebBind[key]] = this[this.ebBind[key]].bind(this);
      this.getEventBus().on(key, this[this.ebBind[key]]);
    }
  }

  function ebChain(events, done) {
    triggerEbChainEvent(0, events, [], this.getEventBus(), done);
  }

  function triggerEbChainEvent(index, events, results, eventBus, done) {
    var e = events[index];

    if (typeof e === 'string') {
      e = { event: e };
    }

    if (!e.payload) e.payload = {};

    if (e.stream) {
      for (var key in e.stream) {
        e.payload[key] = e.stream[key](results);
      }
    }

    e.payload.handler = function (result) {
      results.push(result);
      index++;

      if (index === events.length) {
        if (done) done(results);
      } else {
        triggerEbChainEvent(index, events, results, eventBus, done);
      }
    };

    eventBus.emit(e.event, e.payload);
  }

  return {
    // have we initialized the handlers?
    _eb_handlersSet: false,
    // do we want to detach listeners when element is detached
    // (prevent memory leaks)
    _eb_unregisterOnDetach: true,

    ready: init,

    attached: init,

    detached: function detached() {
      if (!this._eb_unregisterOnDetach) return;

      this._eb_handlersSet = false;
      if (!this.getEventBus() || !this.ebBind) return;

      for (var key in this.ebBind) {
        if (!this[this.ebBind[key]]) continue;
        this.getEventBus().removeListener(key, this[this.ebBind[key]]);
      }
    },

    getEventBus: function getEventBus() {
      if (this.EVENT_BUS && window[this.EVENT_BUS]) {
        return window[this.EVENT_BUS];
      }
      return window.EventBus;
    },

    ebEmit: function ebEmit(event, payload) {
      this.getEventBus().emit(event, payload);
    },

    ebChain: ebChain
  };
}();


"use strict";

var EventBusBehavior = function () {
  function getEventBus(ele) {
    if (ele.EVENT_BUS && window[ele.EVENT_BUS]) {
      return window[ele.EVENT_BUS];
    }
    return window.EventBus;
  }

  return {
    attached: function attached() {
      this._eventBus = getEventBus(this);

      if (!this._eventBus || !this.ebBind) return;
      for (var key in this.ebBind) {
        if (!this[ebBind[key]]) {
          console.warn(this.nodeName + " could not bind event " + key + " to " + ebBind[key]);
          continue;
        }
        this._eventBus.on(key, this[ebBind[key]].bind(this));
      }
    },
    detached: function detached() {
      if (!this._eventBus || !this.ebBind) return;
      for (var key in this.ebBind) {
        if (!this[ebBind[key]]) continue;
        this._eventBus.removeListener(key, this[ebBind[key]]);
      }
    }
  };
}();


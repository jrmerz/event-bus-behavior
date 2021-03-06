# event-bus-behavior
Polymer Behavior for using a global event bus with your element


## Install

```bash
bower install --save jrmerz\event-bus-behavior
```

Example Usage:

In your window namespace have a NodeJS [events](https://nodejs.org/api/events.html) object.

```JavaScript
// used Browserify, Webpack, etc to roll this into browserland...
var events = require('events').EventEmitter;
window.EventBus = new events();
```

Then in your polymer element

```JavaScript
Polymer({
  is : 'my-element',

  // By default the behavior will look for window.EventBus
  // if you want to used a different variable name in the 
  // window scope, you can provide it here:
  // EVENT_BUS : 'MyEventBus',
  
  /**
   * include the event-bus-behavior
   */
  behaviors : [EventBusBehavior],

  /**
   * autobind methods to EventBus
   */
  ebBind : {
    'my-remote-event': 'doStuff',
    'my-other-remote-event': 'doMoreStuff'
  },

  doStuff : function(e) {
    // do stuff
  },

  doMoreStuff : function(e) {
    // do more stuff
  },

  /**
   * send events
   */
  sendMyEvent : function(e) {
    // this._eventsBus is a reference to window.EventBus
    this._eventBus.emit('my-element-event', {payload: 'something'});
  }
});
```

## Advanced Stuff

So this is about separating the view from the rest of your code.
You may run into situations where your need to call an external bit of
code.  You can use events to do this as well.

```JavaScript
Polymer({
  is : 'my-element',
  
  behaviors : [EventBusBehavior],

  // call via event
  getData : function(callback) {
    this._eventBus.emit('get-data', {handler: callback});
  }
});
```

then in your external module

```JavaScript
// this should be shared with browser
var eventBus = require('./eventBus');

function MyCollection() {
  this.getData = function() {
    return this.data;
  }

  eventBus.on('get-data', (e) => {
    e.handler(this.getData());
  });
}
```

Finally, if you need to chain together a lot of these method calls
you can use the provided helper.

```JavaScript
Polymer({
  is : 'my-element',
  
  behaviors : [EventBusBehavior],

  // call via event
  getStuff : function(callback) {
    this.sbChain(
      [
        {event: 'get-data'},
        // payload is the event payload
        {event: 'get-data-with-input', payload : {input: foo}},
        // sometimes you may want to stream the result of one event
        // into the following function call.  For this you can use
        // the 'stream' property.  It will be passed the 'results'
        // array of all prior event responses.  It will set the key
        // to the payload with the returned value of the function.
        {event: 'get-data-with-input', stream : {input: (results) => results[1]}},
        
        // you and also short hand {event: 'get-data'} with no payload as:
        // 'get-data',
      ],
      function(results) {
        callback.apply(this, results);
      }
    );
  }
});
```
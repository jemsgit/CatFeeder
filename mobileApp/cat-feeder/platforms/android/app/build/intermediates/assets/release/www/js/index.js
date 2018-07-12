var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    modules: {},

    eventCallbacks:{
      selectDevice: function(e, success){
        var id = $(e.target).attr('data-id');
        if(id){
            app.modules.bluetooth.connectDevice(id, success)
        }
      },
      buttonClick: function(e){
        var id = $(e.target).attr('id');
        switch (id) {
          case 'feed':
            app.modules.markup.addMessage('outcome', 'Feeeding')
            break;
          default:
            app.modules.markup.addMessage('outcome', '...')

        }
      }
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        if(this.modules){
            this.modules.bluetooth.getDeviceList(this.modules.markup.showDevices);
            this.modules.markup.attachEvents(this.eventCallbacks)
        }


    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    modules: {},

    eventCallbacks:{
      selectDevice: function(e, success){
        var id = $(e.target).attr('data-id');
        var name = $(e.target).attr('data-name');
        if(id){
            app.modules.bluetooth.connectDevice(id, this.connectSuccess, function(e){
              console.log(e)
            });
            app.activeDevice = {
              id: id,
              name: name
            }
        }
      },
      connectSuccess: function(){
        app.modules.bluetooth.subscribeOnReply(function(data){
          app.modules.markup.addMessage('income', data)
        });
        app.modules.markup.showDevices(false);
        app.modules.markup.showDeviceInfo(app.activeDevice);
        app.modules.markup.enableTabs(true);
      },
      disconnectCallback: function(){
        app.modules.markup.clearChat();
        app.modules.markup.showDeviceInfo(false);
        app.activeDevice = null;
        app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices);
        app.modules.markup.enableTabs(true);
      },
      buttonClick: function(e){
        var id = $(e.target).attr('id');
        switch (id) {
          case 'feed':
            app.modules.bluetooth.sendData('feed', function(){
              app.modules.markup.addMessage('outcome', 'Feeeding')
            }, function(err){
              app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices);
            })
            break;
          case 'clear':
            app.modules.markup.clearChat();
            break;
          default:
            app.modules.bluetooth.disconnectDevices(function(){
              disconnectCallback();
            })

        }
      },
      refresh: function(){
        app.modules.bluetooth.disconnectDevices(function(){
          app.modules.markup.clearChat();
          app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices);
      })
      },
      disconnect: function(){
        app.modules.bluetooth.disconnectDevices(function(){
          disconnectCallback();
        });
      }
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        this.modules.markup.createUI();
        this.modules.bluetooth.getDeviceList(this.modules.markup.showDevices);
        this.modules.markup.attachEvents(this.eventCallbacks)
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }
};

app.initialize();

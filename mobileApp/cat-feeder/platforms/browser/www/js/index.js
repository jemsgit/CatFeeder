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
            app.modules.bluetooth.connectDevice(id, this.connectSuccess);
        }
      },
      connectSuccess: function(){
        app.modules.bluetooth.subscribeOnReply(function(data){
          app.modules.markup.addMessage('income', data)
        });
        app.modules.markup.showDevices(false);
        app.modules.markup.showChat(true);
      },
      buttonClick: function(e){
        var id = $(e.target).attr('id');
        switch (id) {
          case 'feed':
            app.modules.bluetooth.sendData('feed', function(){
              app.modules.markup.addMessage('outcome', 'Feeeding')
            }, function(err){
              app.modules.markup.showChat(false);
              app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices);
            })
            break;
          case 'clear':
            app.modules.markup.clearChat();
            break;
          case 'dis':
            app.modules.bluetooth.disconnectDevices(function(){
              app.modules.markup.clearChat();
              app.modules.markup.showChat(false);
              app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices);
            });
            break;
          default:
            app.modules.bluetooth.disconnectDevices(function(){
              app.modules.markup.clearChat();
              app.modules.markup.showChat(false);
            })

        }
      },
      refresh: function(){
        app.modules.bluetooth.disconnectDevices(function(){
          app.modules.markup.clearChat();
          app.modules.markup.showChat(false);
          app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices);
      })
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

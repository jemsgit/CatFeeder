var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    processReply: function(data){
        console.log(data);
        if(!data.indexOf('woke')){
          console.log('woke')
        } else if(app.bleReplyHandler){
          app.bleReplyHandler(data)
        }
    },
    updateSettings: function(){
      app.sendBLEData('getTime', function(){
        app.bleReplyHandler = app.messageHandlers.getTime;
        app.modules.markup.showSpinner('timeSpinner', true);
        app.modules.markup.showSpinner('alarmListSpinner', true);
        app.modules.markup.addMessage('outcome', 'get Alarm');
      });
    },

    messageHandlers: {
      getAlarms: function(data){
        console.log('getAlarms');
        var alarms = data.split('\r\n');
        var result = []
        alarms.forEach(function(el) {
          el = el.replace(/[\r\n]/g, '');
          if(!el){
            return;
          }
          var isActive = false;
            if(el.indexOf('*') != -1){
              isActive = true;
              el = el.slice(el.lastIndexOf('*') + 2);
            }
            var parts = el.split(' - ');
            result.push({active: isActive, id: parts[0], time: parts[1]})
        }, this);
        app.modules.markup.showAlarms(result);
        app.modules.markup.showSpinner('alarmListSpinner', false);
        app.bleReplyHandler = null;
      },
      setActiveAlarm: function(data){
        console.log('setActiveAlarm');
        console.log(data);
        app.bleReplyHandler = null;
        app.sendBLEData('getAlarms', function(){
          app.bleReplyHandler = app.messageHandlers.getAlarms;
          app.modules.markup.addMessage('outcome', 'get Alarm');
        });
      },
      addAlarm: function(data){
        console.log('addAlarm');
        console.log(data);
        app.bleReplyHandler = null;
        app.sendBLEData('getAlarms', function(){
          app.bleReplyHandler = app.messageHandlers.getAlarms;
          app.modules.markup.addMessage('outcome', 'get Alarm');
        });
      },
      deleteAlarm: function(data){
        console.log('deleteAlarm');
        console.log(data);
        app.bleReplyHandler = null;
        app.sendBLEData('getAlarms', function(){
          app.bleReplyHandler = app.messageHandlers.getAlarms;
          app.modules.markup.addMessage('outcome', 'get Alarm');
        });
      },
      getTime: function(data){
        console.log('getTime');
        console.log(data);
        app.modules.markup.showTime(data);
        app.bleReplyHandler = null;
        app.modules.markup.showSpinner('timeSpinner', false);
        app.sendBLEData('getAlarms', function(){
          app.bleReplyHandler = app.messageHandlers.getAlarms;
          app.modules.markup.addMessage('outcome', 'get Alarm');
        });
      }
    },
    sendBLEData: function(data, callback){
      app.modules.bluetooth.wakeSignal('wake', function(){
        setTimeout(function(){ app.modules.bluetooth.sendData(data, callback); }, 2000)
      })
    },

    modules: {},

    eventCallbacks:{
      selectDevice: function(id, name){
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
          app.modules.markup.addMessage('income', data);
          app.processReply(data);
        });
        app.updateSettings();
        app.modules.markup.showCurrentDevice(app.activeDevice);
      },
      disconnectCallback: function(){
        app.modules.markup.clearChat();
        app.modules.markup.showDeviceInfo(false);
        app.modules.markup.enableTabs(false);
        app.activeDevice = null;
        app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices.bind(app.modules.markup));
      },
      clearChart: function(e){
        app.modules.markup.clearChat();
      },
      feed: function(e){
        app.sendBLEData('feed', function(){
          app.modules.markup.addMessage('outcome', 'feed');
        });
      },
      deleteAlarm: function(data){
        app.sendBLEData('deleteAlarm-' + data, function(){
          app.bleReplyHandler = app.messageHandlers.deleteAlarm;
          app.modules.markup.showSpinner('alarmListSpinner', true);
          app.modules.markup.addMessage('outcome', 'delete Alarm');
        });
      },
      addAlarm: function(data){
        app.sendBLEData('addAlarm-' + data, function(){
          app.bleReplyHandler = app.messageHandlers.addAlarm;
          app.modules.markup.showSpinner('addSpinner', true);
          app.modules.markup.addMessage('outcome', 'add Alarm');
        });
      },
      activateAlarm: function(data){
        app.sendBLEData('setActiveAlarm-' + data, function(){
          app.bleReplyHandler = app.messageHandlers.setActiveAlarm;
          app.modules.markup.showSpinner('alarmListSpinner', true);
          app.modules.markup.addMessage('outcome', 'activate Alarm');
        });
      },
      consoleSend: function(data){
        app.sendBLEData(data, function(){
          app.modules.markup.addMessage('outcome', data);
        });
      },
      refreshParams: function(){
        app.updateSettings();
      },
      refresh: function(){
        app.modules.bluetooth.disconnectDevices(function(){
          app.modules.markup.clearChat();
          app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices.bind(app.modules.markup));
      })
      },
      disconnect: function(){
        app.modules.bluetooth.disconnectDevices(function(){
          app.eventCallbacks.disconnectCallback();
        });
      }
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        this.modules.markup.createUI();
        this.modules.bluetooth.getDeviceList(this.modules.markup.showDevices.bind(app.modules.markup));
        this.modules.markup.attachEvents(this.eventCallbacks)
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }
};

app.initialize();

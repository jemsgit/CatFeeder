(function(){
  if(!app.modules){
    app.modules = {}
  }

  app.modules.bluetooth = {
    getDeviceList: function(success, failure){
        if(!success){
          return new Error('provide callbacks');
        }
        bluetoothSerial.list(success, failure);
    },
    connectDevice: function(macAddress_or_uuid, success, failure){
      if(!macAddress_or_uuid || !success){
        return new Error('provide id and callbacks');
      }
      bluetoothSerial.connect(macAddress_or_uuid, success, failure);
    },
    disconnectDevices: function(success, failure){
      bluetoothSerial.disconnect(success, failure);
    },
    sendData: function(data, success, failure){
      if(!success){
        return new Error('provide callbacks');
      }
      bluetoothSerial.write(data, success, failure);
    },
    subscribeOnReply: function(success, failure){
      if(!success){
        return new Error('provide callbacks');
      }
      bluetoothSerial.subscribeRawData(success, failure);
    }
  }
})()

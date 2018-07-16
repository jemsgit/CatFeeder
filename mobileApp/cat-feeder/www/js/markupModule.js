(function(){
  if(!app.modules){
    app.modules = {}
  }

  var devicesTempate = _.template('<div class="device-item" data-id="<%- id %>" data-name="<%- name %>"><%- name %><span class="loader button-loader"></span></div>');
  var incomeMessage = _.template('<div class="income"> >>> <%- message %></div>');
  var outcomeMessage = _.template('<div class="outcome"> <<< <%- message %></div>');
  var alarmTempate = _.template('<% if(active) { %>' +
    '<div class="alarm-item alarm-active" data-id="<%- id %>">' +
    '<% } else { %>' +
    '<div class="alarm-item" data-id="<%- id %>">' + 
    '<% } %> <div class="alarm-time"><%- time %></div><span class="loader"></span><div class="alarm-delete">' + 
    '<% if(!active) { %>' +
    '<div class="button" id="activateAlarm" data-id="<%- id %>"> Active </div>' +
    '<% } %>' +
    '<div class="button" id="deleteAlarm" data-id="<%- id %>"> X </div></div></div>');

  function getInputValue(e){
      return $(e.target).parent().find('input').val();
  }

  function setInputValue(e, val){
    $(e.target).parent().find('input').val(val);
  }

  app.modules.markup = {
    createUI: function() {
      $( "#tabs" ).tabs();
      this.enableTabs(false);
      this.setButtonVisibility('#dis', false);
    },
    enableTabs: function(flag) {
      var list = flag ? [] : [1, 2];
      $( "#tabs" ).tabs('option', 'disabled', list);
    },
    showSpinner: function(id, flag){
      $(id).css('display', flag ? 'inline-block' : 'none');
    },
    showCurrentDevice: function(device) {
      this.showDevices(false);
      this.showDeviceInfo(device);
      this.enableTabs(true);
      this.setButtonVisibility('#dis', true);
      this.setButtonVisibility('#refresh', false);
    },
    showDeviceInfo: function(device){
      var $markup = device ? $('<div>' + device.name + ' - connected </div>') : '';
      $('#device-info').html($markup);
    },
    setButtonVisibility: function(id, flag){
      $(id).css('display', flag ? 'inline-block' : 'none');
    },
    showDevices: function(list){
      $('#device-info').html('');
      this.setButtonVisibility('#dis', false);
      this.setButtonVisibility('#refresh', true);
      var $markup = $('<div></div>')
      if(list){
        list.forEach(function(item){
          var template = devicesTempate({id: item.id, name: item.name})
          $markup.append(template);
        })
      }
      $('#devices').html($markup);
    },
    showTime: function(time){
      var $markup = $('<div>' + time + '</div>')
      $('#currentTime').html($markup);
    },
    showAlarms: function(alarms){
      var $markup = $('<div></div>')
      if(alarms){
        alarms.forEach(function(item){
          var template = alarmTempate({id: item.id, time: item.time, active: item.active})
          $markup.append(template);
        })
      }
      $('#alarms').html($markup);
    },
    addMessage: function(type, message){
      var mes = ''
      switch (type) {
        case 'income':
          mes = incomeMessage({message: message})
          break;
        case 'outcome':
            mes = outcomeMessage({message: message})
            break;
        default:
          mes = outcomeMessage({message: message})
      }
      $('.chat').append(mes);
    },
    clearChat: function(){
      $('.chat').html('');
    },
    attachEvents: function(callbacks){
      var that = this;
      $('#devices').on('click', '.device-item', function(e){
          if(callbacks && callbacks.selectDevice){
            var id = $(e.target).attr('data-id');
            var name = $(e.target).attr('data-name');
            callbacks.selectDevice(id, name)
          }
      })
      $('#clear').on('click', function(e){
        if(callbacks && callbacks.clearChart){
          callbacks.clearChart(e);
        }
    })
      $('#refresh').on('click', function(e){
          if(callbacks && callbacks.refresh){
            callbacks.refresh(e)
          }
      })
      $('#refreshParams').on('click', function(e){
        if(callbacks && callbacks.refreshParams){
          callbacks.refreshParams(e)
        }
    })
      $('#dis').on('click', function(e){
        if(callbacks && callbacks.disconnect){
          callbacks.disconnect(e)
        }
    })
    $('.settings-item')
    .on('click', '#activateAlarm', function(e){
      if(callbacks && callbacks.activateAlarm){
        var id = $(e.target).attr('data-id')
        callbacks.activateAlarm(id)
      }
    }).on('click', '#deleteAlarm', function(e){
      if(callbacks && callbacks.deleteAlarm){
        var id = $(e.target).attr('data-id')
        callbacks.deleteAlarm(id)
      }
    })
    .on('click', '#setTime', function(e){
      if(callbacks && callbacks.setTime){
        var val = getInputValue(e)
        setInputValue(e, '')
        callbacks.setTime(val)
      }
    })
      .on('click', '#addAlarm', function(e){
        if(callbacks && callbacks.addAlarm){
          var val = getInputValue(e);
          setInputValue(e, '')
          callbacks.addAlarm(val)
        }
    }).on('click', '#feed', function(e){
      if(callbacks && callbacks.feed){
        callbacks.feed();
      }
  })

    $('#send').on('click', function(e){
      if(callbacks && callbacks.consoleSend){
        var val = getInputValue(e)
        setInputValue(e, '')
        callbacks.consoleSend(val)
      }
  })
    }
  }
})()

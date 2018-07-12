(function(){
  if(!app.modules){
    app.modules = {}
  }

  var devicesTempate = _.template('<div class="device-item" data-id="<%- id %>"><%- name %></div>');
  var incomeMessage = _.template('<div class="income"> >>> <%- message %></div>');
  var outcomeMessage = _.template('<div class="outcome"> <<< <%- message %></div>');

  app.modules.markup = {
    createUI: function() {
      $( "#tabs" ).tabs();
    },
    showDevices: function(list){
      var $markup = $('<div></div>')
      if(list){
        list.forEach(function(item){
          var template = devicesTempate({id: item.id, name: item.name})
          $markup.append(template);
        })
      }
      $('#devices').html($markup);
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
      $('.commands .chat').append(mes);
    },

    showChat: function(flag){
      flag ? $('.commands').addClass('visible') : $('.commands').removeClass('visible')
    },

    clearChat: function(){
      $('.commands .chat').html('');
    },

    attachEvents: function(callbacks){
      var that = this;
      $('#devices').on('click', '.device-item', function(e){
          if(callbacks && callbacks.selectDevice){
            callbacks.selectDevice(e)
          }
      })
      $('.manage-buttons').on('click', 'button', function(e){
          if(callbacks && callbacks.buttonClick){
            callbacks.buttonClick(e);
          }
      })
      $('#refresh').on('click', function(e){
          if(callbacks && callbacks.refresh){
            callbacks.refresh(e)
          }
      })
    }
  }
})()

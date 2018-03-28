define([
  'hyprlive',
  'underscore',
  'modules/jquery-mozu',
  'vendor/remodal'
], function(Hypr, _, $) {
  var log = function (value) {
    var pageContext = require.mozuData('pageContext');
    if (!pageContext || !pageContext.isDebugMode) return value;
    console.log(value);
    return value;
  }
  var Modal = function(options) {
    this.modalOptions = options;
  };
  Modal.prototype = {
    initialize: function() {
      if(this.elemMissing()) return;
      this.modal = $(this.$el).remodal(this.modalOptions || {});
      this.isInit = true;
      if(this.modalOptions.fullWidth) {
        this.$el.addClass('full-width');
      }
      $(document).on('opened', '.remodal', _.debounce(this.bindClose.bind(this, null), 500, true));
    },
    bindClose: function(closeEl) {
      if(!(closeEl || this.modalOptions.closeEl)) return;
      $(closeEl || this.modalOptions.closeEl).off().click(this.close.bind(this));
    },
    open: function() {
      if(this.modalMissing()) return;
      this.modal.open();
    },
    close: function() {
      if(this.modalMissing()) return;
      if(this.modalOptions.fullWidth) {
        this.$el.removeClass('full-width');
      }
      this.modal.close();
    },
    getSate: function() {
      if(this.modalMissing()) return;
      return this.modal.getState();
    },
    destroy: function() {
      if(this.modalMissing()) return;
      this.modal.destroy();
    },
    bindEvent: function(on, event, fun) {
      if(this.elemMissing()) return;
      var onOrOff = on ? 'on' : 'off';
      this.$el[onOrOff](event, fun);
    },
    elemMissing: function() {
      if(!this.$el || !this.$el.length) return log('no element');
      return false;
    },
    modalMissing: function() {
      if(!this.isInit) return log('not initialized');
      if(!this.modal) return log('no modal instance');
      if(this.elemMissing()) return;
      if(!this.modal.open) return log('invalid modal instance');
      return false;
    }
  };

  Modal.create = function(options) {
    return new Modal(options);
  };

  return Modal;
});

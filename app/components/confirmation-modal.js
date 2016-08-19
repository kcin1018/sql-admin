import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal-content'],

  saveText: 'Save',
  saveBtnClass: 'primary',
  saveAction: 'save',

  cancelText: 'Cancel',
  cancelBtnClass: 'secondary',
  cancelAction: 'cancel',

  actions: {
    cancel() {
      this.sendAction('cancelAction');
    },
    save() {
      this.sendAction('saveAction');
    }
  }

});

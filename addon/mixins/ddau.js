import Ember from 'ember';

export default Ember.Mixin.create({
  /**
   * Provide a DDAU "action" or "mut" response
   * @param  {string } action The name of the exposed action property
   * @param  {hash}    hash   A hash of attributes that are passed back to a "action"
   * @param  {mixed}   value  A value that is passed to the "update" function (aka, mut helper) if available
   * @return {boolean}        Pass back true if `mut` not used; if used then proxies mut's response back
   */
  ddau(action, hash, value) {
    if (this.attrs[action] && this.attrs[action].update) {
      this.attrs[action].update(value);
      return true;
    } else if (this.attrs[action]) {
      return this.attrs[action](hash);
    } else {
      return false;
    }
  }
});

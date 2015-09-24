import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
const camelize = thingy => {
  return thingy ? Ember.String.camelize(thingy) : thingy;
};

export default Ember.Mixin.create({
  // REGISTRY
  _registry: computed(function() {
    return new A();
  }),
  _register(child, type='unspecified') {
    const {_registry} = this.getProperties('_registry');
    _registry.pushObject({type:type, child: child});
  },
  _registerSelf: on('didInitAttrs', function() {
    const {_parentalProperty,_componentType} = this.getProperties('_parentalProperty', '_componentType');
    if(get(this,_parentalProperty) && get(this,_parentalProperty + '._register')) {
      get(this,_parentalProperty)._register(this, _componentType);
    }
  }),
  // CHILDREN
  _tellChild(childId, msg, options) {
    let {_childIdProperty,_registry} = this.getProperties('_childIdProperty', '_registry');
    _childIdProperty = _childIdProperty ? `child.${_childIdProperty}`  : 'child.elementId';
    let item = _registry.findBy(_childIdProperty,childId);
    item.child._message(msg, options);
  },
  _tellChildren(msg, options) {
    let {_registry} = this.getProperties( '_registry');
    _registry.forEach( item => {
      item.child._message(msg, options);
    });
  },
  _tellDescendants(msg, options) {
    let {_registry} = this.getProperties( '_registry');
    _registry.forEach( item => {
      item.child._message(msg, options);
      item.child._curryDown(msg, options);
    });
  },
  // ANCESTORS
  _tellParent(msg,options) {
    let {_parentalProperty} = this.getProperties('_parentalProperty');
    _parentalProperty = _parentalProperty ? _parentalProperty  : 'parentView';
    if(get(this,_parentalProperty)._message) {
      get(this,_parentalProperty)._message(msg,options);
    } else {
      this.sendAction(msg, options);
    }
  },
  _tellAncestors(msg,options) {
    let {_parentalProperty} = this.getProperties('_parentalProperty');
    _parentalProperty = _parentalProperty ? _parentalProperty  : 'parentView';
    get(this,_parentalProperty)._message(msg,options);
    get(this,_parentalProperty)._curryUp(msg,options);
  },
  // CURRYING
  _curryUp(msg,options) {
    this.tellParent(msg,options);
  },
  _curryDown(msg,options) {
    this.tellChildren(msg, options);
  },
  // MESSAGE LISTENING
  _message(msg,options) {
    const msgHandler = get(this, camelize(msg));
    if(msgHandler && typeOf(msgHandler) === 'function') {
      this[msgHandler](options);
    }
  }
});

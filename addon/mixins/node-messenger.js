import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
const camelize = thingy => {
  return thingy ? Ember.String.camelize(thingy) : thingy;
};

export default Ember.Mixin.create({
  // DEFAULT VALUES
  _parentalProperty: '_parent_component_',
  _parentalPropertyHistoric: null,
  _componentType: 'undefined',
  _componentNameProperty: 'name',
  // BOOLEAN FLAGS
  _hasChildren: computed('_registry.length', function() {
    return this.get('_registry.length') > 0;
  }),
  _hasParent: computed('_parentalProperty','_parentalPropertyDidChange', function() {
    const {_parentalProperty} = this.getProperties('_parentalProperty');
    return _parentalProperty && get(this,_parentalProperty);
  }),
  _hasMessagingParent: computed('_parentalProperty','_parentalPropertyDidChange', function() {
    const {_parentalProperty} = this.getProperties('_parentalProperty');
    return _parentalProperty && get(this,_parentalProperty) && get(this,_parentalProperty + '._message');
  }),
  // REGISTRY
  _registry: computed(function() {
    return new A();
  }),
  register(child, type='unspecified', name='unspecified') {
    const {_registry} = this.getProperties('_registry');
    if(child) {
      _registry.pushObject({type:type, child: child, name: name});
    }
  },
  _registerSelf: on('didInitAttrs', function() {
    const {_parentalProperty,_componentType,_componentNameProperty} = this.getProperties('_parentalProperty', '_componentType','_componentNameProperty');
    if(_parentalProperty && get(this,_parentalProperty + '.register')) {
      get(this,_parentalProperty).register(this, _componentType, get(this,_componentNameProperty));
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
      if(item.child._message(msg, options) !== false) {
        item.child._curryDown(msg, options);
      }
    });
  },
  // // ANCESTORS
  _tellParent(msg,options) {
    let {_parentalProperty} = this.getProperties('_parentalProperty');
    _parentalProperty = _parentalProperty ? _parentalProperty  : 'parentView';
    try {
      get(this,_parentalProperty)._message(msg,options);
    } catch(e) {
      this.sendAction(msg, options);
    }
  },
  _tellAncestors(msg,options) {
    let {_parentalProperty} = this.getProperties('_parentalProperty');
    _parentalProperty = _parentalProperty ? _parentalProperty  : 'parentView';
    try {
      if(get(this,_parentalProperty)._message(msg,options) !== false) {
        get(this,_parentalProperty)._curryUp(msg,options);
      }
    } catch(e) {
      this.sendAction(msg, options);
    }
  },
  // CURRYING
  _curryUp(msg,options) {
    this._tellParent(msg,options);
  },
  _curryDown(msg,options) {
    this._tellChildren(msg, options);
  },
  // // MESSAGE LISTENING
  _message(msg,options) {
    const method = camelize(msg);
    if(method && typeOf(get(this,method)) === 'function') {
      this[method](options);
    }
  },
  // OBSERVERS
  _parentalPropertyObserver: on('init', observer('_parentalProperty', function() {
    const {_parentalProperty,_parentalPropertyHistoric} = this.getProperties('_parentalProperty','_parentalPropertyHistoric');
    if(_parentalPropertyHistoric) {
      this.removeObserver(_parentalPropertyHistoric);
    }
    if(_parentalProperty) {
      this.set('_parentalPropertyHistoric', _parentalProperty);
      this.addObserver(_parentalProperty, () => {
        run.next(() => {
          this.notifyPropertyChange('_parentalPropertyDidChange');
        });
      });
    }
  }))
});

import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, A, run, on } = Ember;  // jshint ignore:line
const { typeOf, debug, defineProperty, isPresent } = Ember;  // jshint ignore:line
const { get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const camelize = thingy => {
  return thingy ? Ember.String.camelize(thingy) : thingy;
};

let NodeMessenger = Ember.Mixin.create({
  // CSS CLASS BINDING
  classNameBindings: ['_name','_hasChildren:has-children:no-children','_hasParent:has-parent:no-parent'],
  // DEFAULT VALUES
  _parentalProperty: 'parentView', // change this on component where possible
  _parentalPropertyHistoric: null,
  _componentType: 'undefined',
  _componentNameProperty: 'name',
  _childIdProperty: 'elementId',
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
    return this._hasParent() && get(this,_parentalProperty + '._message');
  }),
  // REGISTRY
  _registry: computed(function() {
    return new A();
  }),
  register(child, type='unspecified', name='unspecified') {
    const {_registry} = this.getProperties('_registry');
    if(child) {
      _registry.pushObject({type:type, child: child, name: name});
      this.trigger('didRegister');
    }
  },
  _deRegister: on('willDestroyElement', function() {
    const {_parentalProperty} = this.getProperties('_parentalProperty');
    if(_parentalProperty) {
      this.removeObserver(_parentalProperty);
    }
  }),
  _registerSelf: on('didInitAttrs', function() {
    const {_parentalProperty,_componentType,_componentNameProperty} =
      this.getProperties('_parentalProperty', '_componentType','_componentNameProperty');
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
    _registry.forEach( item => item.child._message(msg, options) );
  },
  _tellDescendants(msg, options) {
    let {_registry} = this.getProperties( '_registry');
    _registry.forEach( item => {
      if(item.child._message(msg, options) !== false) {
        item.child._tellDescendants(msg, options);
      }
    });
  },
  // ANCESTORS
  _getParent() {
    let {_parentalProperty} = this.getProperties('_parentalProperty');
    _parentalProperty = _parentalProperty ? _parentalProperty  : 'parentView';
    return this.get(_parentalProperty);
  },
  _tellParent(msg,options) {
    const parent = this._getParent();
    if(!parent) {
      return false;
    }
    options = merge(options, {
      originator: this,
      curriedBy: [],
      call: 'tell-parent'
    });
    if(this._hasMessagingParent()) {
      parent._message(msg,options);
    } else {
      this.sendAction(msg, options);
    }
  },

  _tellAncestors(msg, options) {
    if(!options.curriedBy) {
      options.curriedBy = [];
    }
    new A(options.curriedBy).pushObject(this);
    let response = this._message(msg,options);
    if(response !== false) {
      options = typeOf(response) === 'object' ? merge(options,response) : options;
    }
    else {
      return;
    }
    let parent = this._getParent();
    if(parent) {
      parent._tellAncestors(msg,options);
    }
    else {
      this.sendAction(msg, options);
    }
  },
  /**
   * Takes in a message from another component with the goal of either:
   *
   * a) passes execution control to the method specified by the camelized "msg"
   * b) if there is no handler function but a parent still exists; pass back `true` to continue bubbling
   * c) if there are no parents to this component then sendAction to any listening container object
   *
   * @param  {string} msg     dasherized message name (coverted to camelized)
   * @param  {object} options hash of properties to pass on
   * @return {BOOLEAN}
   */
  _message(msg,options) {
    const method = camelize(msg);
    if(isPresent(method) && typeOf(get(this,method)) === 'function') {
      return this[method](options);
    }
    else if(this._hasParent()){
      return true;
    }
    else {
      this.sendAction(method, options); // end of event chain, send to container
      return false;
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

NodeMessenger[Ember.NAME_KEY] = 'Node Messenger';
export default NodeMessenger;

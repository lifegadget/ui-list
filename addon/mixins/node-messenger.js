import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  
const camelize = thingy => {
  return thingy ? Ember.String.camelize(thingy) : thingy;
};

let NodeMessenger = Ember.Mixin.create({
  // CSS CLASS BINDING
  classNameBindings: ['_name','_hasChildren:has-children:no-children','_hasParent:has-parent:no-parent'],
  // DEFAULT VALUES
  _parentalProperty: null, // change this on component where possible
  _parentalPropertyHistoric: null,
  _componentType: 'undefined',
  _componentNameProperty: 'name',
  _childIdProperty: 'elementId',
  // BOOLEAN FLAGS
  _hasChildren: computed('_registry.length', function() {
    return this.get('_registry.length') > 0;
  }),
  _hasParent: computed('_parentalPropertyDidChange', function() {
    const {_parentalProperty} = this.getProperties('_parentalProperty');
    return _parentalProperty && get(this,_parentalProperty);
  }),
  _hasMessagingParent: computed('_parentalPropertyDidChange', function() {
    const {_parentalProperty, _hasParent} = this.getProperties('_parentalProperty', '_hasParent');
    return _hasParent && get(this,_parentalProperty + '._message');
  }),
  // REGISTRY
  _registry: computed(function() {
    return a();
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
  _registerSelf: on('didInsertElement', function() {
    run.schedule('afterRender', ()  => {
      const {_parentalProperty,_componentType,_componentNameProperty} =
        this.getProperties('_parentalProperty', '_componentType','_componentNameProperty');
      if(_parentalProperty && get(this,_parentalProperty + '.register')) {
        get(this,_parentalProperty).register(this, _componentType, get(this,_componentNameProperty));
      }
    });
  }),
  _findInRegistry(...args) {
    let property = 'elementId';
    let value;
    if(args.length===2) {
      [ property, value ] = args;
    } else {
      [ value ] = args;
    }
    let result = this.get('_registry').find(i=>get(i, 'child.' + property) === value);
    return result && result.child ? result.child : {};
  },
  _filterByRegistry(...args) {
    let property = 'elementId';
    let value;
    if(args.length===2) {
      [ property, value ] = args;
    } else {
      [ value ] = args;
    }
    value = typeOf(value) === 'array' ? a(value) : a([value]);
    return this._getRegistryItems().filter( i => value.includes(get(i,property)) );
  },
  /**
   * Returns the register objects (without other meta that was captured in registration)
   */
  _getRegistryItems() {
    return this.get('_registry').map(i=>i.child);
  },
  // CHILDREN
  _tellChild(childId, msg, options) {
    let {_childIdProperty,_registry} = this.getProperties('_childIdProperty', '_registry');
    _childIdProperty = _childIdProperty ? `child.${_childIdProperty}`  : 'child.elementId';
    let item = _registry.findBy(_childIdProperty,childId);
    item.child._message(msg, options);
  },
  _tellChildren(msg, options) {
    let {_registry} = this.getProperties( '_registry');
    _registry.map( item => item.child._message(msg, options) );
  },
  _tellDescendants(msg, options) {
    let {_registry} = this.getProperties( '_registry');
    _registry.map( item => {
      if(item.child._message(msg, options) !== false) {
        item.child._tellDescendants(msg, options);
      }
      else {
        // End of ecosystem, no need to sendAction when descending
      }
    });
  },
  // ANCESTORS
  _getParent() {
    const _parentalProperty = this.get('_parentalProperty');
    return _parentalProperty ? this.get(_parentalProperty) : null;
  },
  _tellParent(msg,options={}) {
    const parent = this._getParent();
    if(!parent) {
      return false;
    }
    options = merge(options, {
      originatedBy: this,
      call: 'tell-parent'
    });
    if(this._hasMessagingParent) {
      parent._message(msg,options);
    } else {
      this.sendAction(msg, options);
    }
  },
  _tellAncestors(msg, options={}) {
    const parent = this._getParent();
    const response = this.get('_hasMessagingParent') ? parent._message(msg,options) : false;
    options = typeOf(options)==='object' ? merge(options,response) : options;
    if(isPresent(options.curriedBy)) {
      a(options.curriedBy).pushObject(parent);
    } else {
      options = merge(options, {
        originatedBy: this,
        curriedBy: a(),
        call: 'tell-ancestors'
      });
    }
    // Pass up the chain
    if(response !== false) {
      parent._tellAncestors(msg,options);
    }
    else {
      // End of component ecosystem, send out to container
      this.sendAction(msg,options);
    }
  },
  /**
   * Takes in a message from another component with the goal of either:
   *
   * a) passes execution control to the method specified by the camelized "msg" (off of _messages hash)
   * b) if there is no handler function but a parent still exists; pass back `true` to continue bubbling
   * c) if there are no parents to this component then sendAction to any listening container object
   *
   * @param  {string} msg     dasherized message name (coverted to camelized)
   * @param  {object} options hash of properties to pass on
   * @return {BOOLEAN}
   */
  _message(msg,options) {
    const method = '_messages.' + camelize(msg);
    if(isPresent(method) && typeOf(get(this, method)) === 'function') {
      let contextualized = this.get(method).bind(this);
      return contextualized(options);
    }
    else if(this._hasParent){
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

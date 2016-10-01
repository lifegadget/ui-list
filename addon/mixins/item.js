import Ember from 'ember';
const { computed } = Ember;

export default Ember.Mixin.create({

  classy: computed('hovering', 'focused', 'selected', 'disabled', function() {
    const { hovering, focused, selected, disabled } = this.getProperties('hovering', 'focused', 'selected', 'disabled');
    return `ui-item ${hovering ? ' hovering' : ''}${focused ? ' focused' : ''}${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`;
  }),
  role: 'listitem',
  tabindex: 1,

  actions: {
    onSelected(id) {
      console.log('selected', id);
      this.attrs.onSelected(id, this);
    },
    onHover(id, isHovering) {
      this.set('hovering', isHovering);

    },
    onFocus(id, isFocused) {
      this.set('focused', isFocused);
    }
  }
});

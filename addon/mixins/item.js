import Ember from 'ember';
import ddau from 'ui-list/mixins/ddau';
const { computed, get } = Ember;

export default Ember.Mixin.create(ddau, {

  classy: computed('hovering', 'focused', 'selected', 'disabled', function() {
    const { hovering, focused, selected, disabled } = this.getProperties('hovering', 'focused', 'selected', 'disabled');
    return `ui-item ${hovering ? ' hovering' : ''}${focused ? ' focused' : ''}${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`;
  }),
  role: 'listitem',
  tabindex: 1,

  actions: {
    onClick(id) {
      this.ddau('onClick', {
        id,
        item: this
      }, get(this, 'item.value') || get(this, 'item'));
    },
    onHover(id, isHovering) {
      this.set('hovering', isHovering);

    },
    onFocus(id, isFocused) {
      this.set('focused', isFocused);
    }
  }
});

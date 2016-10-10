import Ember from 'ember';
import ddau from 'ui-list/mixins/ddau';
const { computed, get } = Ember;
const classProps = [ 'hovering', 'focused', 'selected', 'disabled', 'reversed' ];

export default Ember.Mixin.create(ddau, {

  classy: computed(...classProps, function() {
    const { hovering, focused, selected, disabled, reversed } = this.getProperties(...classProps);
    return `ui-item ${hovering ? ' hovering' : ''}${focused ? ' focused' : ''}${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}${reversed ? ' reversed' : ' normal'}`;
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

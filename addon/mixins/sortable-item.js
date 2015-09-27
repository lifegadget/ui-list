import Ember from 'ember';
import computed from 'ember-new-computed';
const { Mixin, $, run } = Ember;
const { Promise } = Ember.RSVP;

export default Mixin.create({
  classNames: ['sortable-item'],
  classNameBindings: ['isDragging', 'isDropping'],

  /**
    Model which the item represents.
    @property model
    @type Object
    @default null
  */
  model: null,

  /**
    Selector for the element to use as handle.
    If unset, the entire element will be used as the handle.
    @property handle
    @type String
    @default null
  */
  handle: null,

  /**
    True if the item is currently being dragged.
    @property isDragging
    @type Boolean
    @default false
  */
  isDragging: false,

  /**
    True if the item is currently dropping.
    @property isDropping
    @type Boolean
    @default false
  */
  isDropping: false,

  /**
    True if the item was dropped during the interaction
    @property wasDropped
    @type Boolean
    @default false
  */
  wasDropped: false,


  /**
    @property isBusy
    @type Boolean
  */
  isBusy: computed.or('isDragging', 'isDropping'),

  /**
    The frequency with which the group is informed
    that an update is required.
    @property updateInterval
    @type Number
    @default 125
  */
  updateInterval: 125,

  /**
    True if the item transitions with animation.
    @property isAnimated
    @type Boolean
  */
  isAnimated: computed(function() {
    let el = this.$();
    let property = el.css('transition-property');

    return /all|transform/.test(property);
  }).volatile(),

  /**
    The current transition duration in milliseconds.
    @property transitionDuration
    @type Number
  */
  transitionDuration: computed(function() {
    let el = this.$();
    let rule = el.css('transition-duration');
    let match = rule.match(/([\d\.]+)([ms]*)/);

    if (match) {
      let value = parseFloat(match[1]);
      let unit = match[2];

      if (unit === 's') {
        value = value * 1000;
      }

      return value;
    }

    return 0;
  }).volatile(),

  /**
    Horizontal position of the item.
    @property x
    @type Number
  */
  x: computed({
    get() {
      if (this._x === undefined) {
        let marginLeft = parseFloat(this.$().css('margin-left'));
        this._x = this.element.scrollLeft + this.element.offsetLeft - marginLeft;
      }

      return this._x;
    },
    set(_, value) {
      if (value !== this._x) {
        this._x = value;
        this._scheduleApplyPosition();
      }
    },
  }).volatile(),

  /**
    Vertical position of the item relative to its offset parent.
    @property y
    @type Number
  */
  y: computed({
    get() {
      if (this._y === undefined) {
        this._y = this.element.offsetTop;
      }

      return this._y;
    },
    set(key, value) {
      if (value !== this._y) {
        this._y = value;
        this._scheduleApplyPosition();
      }
    }
  }).volatile(),

  /**
    Width of the item.
    @property height
    @type Number
  */
  width: computed(function() {
    let el = this.$();
    let width = el.outerWidth(true);

    width += getBorderSpacing(el).horizontal;

    return width;
  }).volatile(),

  /**
    Height of the item including margins.
    @property height
    @type Number
  */
  height: computed(function() {
    let el = this.$();
    let height = el.outerHeight();

    let marginBottom = parseFloat(el.css('margin-bottom'));
    height += marginBottom;

    height += getBorderSpacing(el).vertical;

    return height;
  }).volatile(),

  /**
    @method mouseDown
  */
  mouseDown(event) {
    this._primeDrag(event);
  },

  /**
    @method touchStart
  */
  touchStart(event) {
    this._primeDrag(event);
  },

  /**
    @method freeze
  */
  freeze() {
    let el = this.$();
    if (!el) { return; }

    this.$().css({ transition: 'none' });
    this.$().height(); // Force-apply styles
  },

  /**
    @method reset
  */
  reset() {
    let el = this.$();
    if (!el) { return; }

    delete this._y;
    delete this._x;

    el.css({ transform: '' });
  },

  /**
    @method thaw
  */
  thaw() {
    let el = this.$();
    if (!el) { return; }

    el.css({ transition: '' });
  },

  /**
    @method _primeDrag
    @private
  */
  _primeDrag(event) {
    let handle = this.get('handle');

    if (handle && !$(event.target).closest(handle).length) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let startDragListener = this._startDrag.bind(this);

    function cancelStartDragListener() {
      $(window).off('mousemove touchmove', startDragListener);
    }

    $(window).one('mousemove touchmove', startDragListener);
    $(window).one('mouseup touchend', cancelStartDragListener);
  },

  /**
    @method _startDrag
    @private
  */
  _startDrag(event) {
    $('body').addClass('no-select');
    if (this.get('isBusy')) { return; }

    let drag = this._makeDragHandler(event);

    let drop = () => {
      $(window)
        .off('mousemove touchmove', drag)
        .off('mouseup touchend', drop);

      this._drop();
    };

    $(window)
      .on('mousemove touchmove', drag)
      .on('mouseup touchend', drop);

    this._tellParent('prepare');
    this.set('isDragging', true);
  },

  /**
    @method _makeDragHandler
    @param {Event} startEvent
    @return {Function}
    @private
  */
  _makeDragHandler(startEvent) {
    const listDirection = this.get('list.direction');
    let dragOrigin;
    let elementOrigin;

    if (listDirection === 'x') {
      dragOrigin = getX(startEvent);
      elementOrigin = this.get('x');

      return event => {
        let dx = getX(event) - dragOrigin;
        let x = elementOrigin + dx;

        this._drag(x);
      };
    }

    if (listDirection === 'y') {
      dragOrigin = getY(startEvent);
      elementOrigin = this.get('y');

      return event => {
        let dy = getY(event) - dragOrigin;
        let y = elementOrigin + dy;

        this._drag(y);
      };
    }
  },

  /**
    @method _scheduleApplyPosition
    @private
  */
  _scheduleApplyPosition() {
    run.scheduleOnce('render', this, '_applyPosition');
  },

  /**
    @method _applyPosition
    @private
  */
  _applyPosition() {
    if (!this.element) { return; }

    const listDirection = this.get('list.direction');

    if (listDirection === 'x') {
      let x = this.get('x');
      let dx = x - this.element.offsetLeft + parseFloat(this.$().css('margin-left'));

      this.$().css({
        transform: `translateX(${dx}px)`
      });
    }
    if (listDirection === 'y') {
      let y = this.get('y');
      let dy = y - this.element.offsetTop;

      this.$().css({
        transform: `translateY(${dy}px)`
      });
    }
  },

  /**
    @method _drag
    @private
  */
  _drag(dimension) {
    let updateInterval = this.get('updateInterval');
    const listDirection = this.get('list.direction');

    if (listDirection === 'x') {
      this.set('x', dimension);
    }
    if (listDirection === 'y') {
      this.set('y', dimension);
    }

    run.throttle(this, '_tellParent', 'update', updateInterval);
  },

  /**
    @method _drop
    @private
  */
  _drop() {
    $('body').removeClass('no-select');
    if (!this.element) { return; }

    this._preventClick(this.element);

    this.set('isDragging', false);
    this.set('isDropping', true);

    this._tellParent('update');

    this._waitForTransition()
      .then(run.bind(this, '_complete'));
  },

  /**
    @method _preventClick
    @private
  */
  _preventClick(element) {
    $(element).one('click', function(e){ e.stopImmediatePropagation(); } );
  },

  /**
    @method _waitForTransition
    @private
    @return Promise
  */
  _waitForTransition() {
    return new Promise(resolve => {
      run.next(() => {
        let duration = 0;

        if (this.get('isAnimated')) {
          duration = this.get('transitionDuration');
        }

        run.later(this, resolve, duration);
      });
    });
  },

  /**
    @method _complete
    @private
  */
  _complete() {
    this.set('isDropping', false);
    this.set('wasDropped', true);
    this._tellParent('commit');
  }
});

/**
  Gets the y offset for a given event.
  Work for touch and mouse events.
  @method getY
  @return {Number}
  @private
*/
function getY(event) {
  let originalEvent = event.originalEvent;
  let touches = originalEvent && originalEvent.changedTouches;
  let touch = touches && touches[0];

  if (touch) {
    return touch.screenY;
  } else {
    return event.pageY;
  }
}

/**
  Gets the x offset for a given event.
  @method getX
  @return {Number}
  @private
*/
function getX(event) {
  let originalEvent = event.originalEvent;
  let touches = originalEvent && originalEvent.changedTouches;
  let touch = touches && touches[0];

  if (touch) {
    return touch.screenX;
  } else {
    return event.pageX;
  }
}

/**
  Gets a numeric border-spacing values for a given element.

  @method getBorderSpacing
  @param {Element} element
  @return {Object}
  @private
*/
function getBorderSpacing(el) {
  el = $(el);

  let css = el.css('border-spacing'); // '0px 0px'
  let [horizontal, vertical] = css.split(' ');

  return {
    horizontal: parseFloat(horizontal),
    vertical: parseFloat(vertical)
  };
}

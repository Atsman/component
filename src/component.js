import { isString, isObject, map } from 'lodash';

function resolveEl(el) {
  if (isString(el)) {
    return document.querySelector(el);
  } else if (isObject(el)) {
    return el;
  }

  return document.createElement('div');
}

function parseEventBindingMap(eventBindingMap) {
  return map(eventBindingMap, (method, k) => {
    const [event, selector] = k.split(' ');
    return { event, selector, method };
  });
}

function attachEvent(el, event, selector, cb) {
  el.addEventListener(event, (e) => {
    if (e.target === el.querySelector(selector)) {
      cb(e);
    }
  });
}

/**
 * Abstract component. Inspired by Backbone.View.
 * @class Component
 */
export class Component {
  /**
   * @constructor
   * @param {String|Element} el - The element component bounds to.
   */
  constructor(options = {}) {
    const { el } = options;
    this.el = resolveEl(el);

    if (this.getEvents) {
      this.bindEventHandlers();
    }

    if (this.initialize) {
      this.initialize(Object.assign({}, options));
    }
  }

  bindEventHandlers() {
    const eventBindingMap = this.getEvents();
    if (!eventBindingMap) {
      throw new Error('getEvents returned null!!!');
    }

    const events = parseEventBindingMap(eventBindingMap);
    events.forEach(({ event, selector, method }) => {
      attachEvent(this.el, event, selector, this[method].bind(this));
    });
  }

  /**
   * Abstact lifecycle method, initializes component.
   * @abstract
   */
  initialize() { // eslint-disable-line
  }
}

export default Component;

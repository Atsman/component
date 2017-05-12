import { isString, isObject, map } from 'lodash-es';

/**
 * Resolves el for component.
 * If passed string, it looking for element throw querySelector.
 * If passed Element, it just returns it.
 * If passed null, it creates new element div.
 *
 * @function resolveEl
 * @param {String|Element|Null} el - the element container for component.
 * @returns {Element} - element container
 */
function resolveEl(el) {
  if (isString(el)) {
    return document.querySelector(el);
  } else if (isObject(el)) {
    return el;
  }

  return document.createElement('div');
}

/**
 * Parses event binding map like this:
 * {
 *   'click button': 'onClick'
 * }
 * into:
 * [{
 *   'event': 'click',
 *   'selector': 'button',
 *   'method': 'onClick',
 * }]
 *
 * @function parseEventBindingMap
 * @param {Object} eventBindingMap
 */
function parseEventBindingMap(eventBindingMap) {
  return map(eventBindingMap, (method, k) => {
    const [event, selector] = k.split(' ');
    return { event, selector, method };
  });
}

/**
 * Attaches event handler to el and litens for event of given type.
 * On each event, if event target satisfies to given selector, calls cb.
 *
 * @function attachEvent
 * @param {Element} el
 * @param {String} eventType
 * @param {String} selector
 * @param {Function} cb
 */
function attachEvent(el, eventType, selector, cb) {
  el.addEventListener(eventType, (event) => {
    if (event.target === el.querySelector(selector)) {
      cb(event);
    }
  });
}

/**
 * Binds event handlers to el.
 * Uses array that returned from parseEventBindingMap.
 *
 * @function bindEventHandlers
 * @param {Element} el
 * @param {Object} eventBindingMap
 * @param {Object} methods
 * @param {Object} context
 */
function bindEventHandlers(el, eventBindingMap, methods, context) {
  if (!el || !eventBindingMap || !methods) {
    throw new Error('el and eventBindingMap are required');
  }

  const events = parseEventBindingMap(eventBindingMap);
  events.forEach(({ event, selector, method }) => {
    attachEvent(el, event, selector, methods[method].bind(context));
  });
}

/**
 * Creates component constructor.
 * Takes care of event binding of the following format:
 * {
 *   'clicl button': 'onClick',
 * }
 * Component has one lifecycle method initialize. It is called during component creation.
 *
 * @function createComponent
 * @param {Object} config
 * @returns {Function} component constructor
 */
export default function createComponent(config) {
  if (!config) {
    throw new Error('config must be provided');
  }

  function ComponentConstructor(options = {}) {
    const { el } = options;
    this.el = resolveEl(el);

    if (config.events) {
      bindEventHandlers(this.el, config.events, config, this);
    }

    if (config.initialize) {
      config.initialize.apply(this, [Object.assign({}, options)]);
    }
  }
  ComponentConstructor.prototype = config;

  return ComponentConstructor;
}

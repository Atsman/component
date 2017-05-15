function isString(x) {
  return typeof x === 'string' || x instanceof String;
}

function isObject(x) {
  return x !== null && typeof x === 'object';
}

export default {
  isString,
  isObject,
};

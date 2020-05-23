const { Arr, Obj, Fn } = require("@masaeedu/fp");

const isPrim = c =>
  c == null || (typeof c !== "function" && typeof c !== "object");

const match = ({ array, object, literal }) => v =>
  isPrim(v) ? literal(v) : Array.isArray(v) ? array(v) : object(v);

const expandDotted = ({ ["."]: x, ...xs }) => (x ? { ...xs, ...x } : xs);

const expand = m =>
  match({
    literal: v => [v],
    array: Arr.chain(expand),
    object: Fn.pipe([Obj.traverse(Arr)(expand), Arr.map(expandDotted)])
  })(m);

const indexDottedPath = (path, obj) =>
  path.split(".").reduce((o, i) => o[i], obj);

const interpolate = config => {
  const pattern = /\{([^\{\}]+)\}/;
  const interpolees = Object.keys(config).filter(k => pattern.test(config[k]));

  return interpolees.reduce((prev, curr) => {
    const template = config[curr];
    let result = template;
    while (pattern.test(result)) {
      result = result.replace(new RegExp(pattern, "g"), (_, dotpath) =>
        indexDottedPath(dotpath, config)
      );
    }

    return Object.assign({}, prev, { [curr]: result });
  }, config);
};

module.exports = {
  expand,
  interpolate
};

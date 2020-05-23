const product = require("cartesian-product");
const _ = require("lodash");

const expand = config => {
  if (
    config == null ||
    (typeof config !== "function" && typeof config !== "object")
  )
    return [config];
  if (Array.isArray(config)) return _.flatMap(config, expand);

  const axes = Object.keys(config);
  const combinations = product(axes.map(k => expand(config[k])));

  return combinations.map(combo =>
    combo.reduce(
      (prev, curr, i) =>
        Object.assign({}, prev, axes[i] === "." ? curr : { [axes[i]]: curr }),
      {}
    )
  );
};

const indexDottedPath = (path, obj) => {
  return path.split(".").reduce((o, i) => o[i], obj);
};

const interpolate = config => {
  const pattern = /\{([^\{\}]+)\}/;
  const interpolees = Object.keys(config).filter(k => pattern.test(config[k]));

  return interpolees.reduce((prev, curr) => {
    const template = config[curr];
    let result = template;
    while (pattern.test(result)) {
      result = result.replace(new RegExp(pattern, "g"), (match, dotpath) =>
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

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var eslint = require('eslint');

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const defaultOptions = {
  options: {
    cache: true,
    cacheStrategy: 'content',
    fix: false
  },
  globs: [],
  formatter: 'stylish'
};
let logger;

const plugin = (_, pluginOptions) => {
  const opts = _objectSpread2(_objectSpread2({}, defaultOptions), pluginOptions);

  const eslint$1 = new eslint.ESLint(opts.options);

  const runLint = async () => {
    const lintResult = await eslint$1.lintFiles(opts.globs);
    const formatter = typeof opts.formatter === 'function' ? opts.formatter : await eslint$1.loadFormatter(opts.formatter);
    const resultText = formatter.format(lintResult);
    if (opts.options.fix && lintResult) eslint.ESLint.outputFixes(lintResult);

    if (resultText.length === 0) {
      logger('WORKER_MSG', {
        msg: `No lint errors found.`
      });
    } else {
      logger('WORKER_MSG', {
        msg: resultText.replace('\n', '')
      });
    }
  };

  return {
    name: '@canarise/snowpack-eslint-plugin',

    run({
      log
    }) {
      logger = log;
      return runLint();
    },

    onChange() {
      logger('WORKER_RESET', {});
      return runLint();
    }

  };
};

exports.default = plugin;
//# sourceMappingURL=index.js.map

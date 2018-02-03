(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.biu = factory());
}(this, (function () { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  var isRegExp = require('./_is-regexp');

  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';

  if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it

    $split = function $split(separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return []; // If `separator` is not a regex, use native split

      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0; // Make `global` and avoid `lastIndex` issues by working with a copy

      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i; // Doesn't need flags gy, but they don't hurt

      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);

      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];

        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index)); // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func

          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }

        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }

      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));

      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    }; // Chakra, V8

  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function $split(separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  } // 21.1.3.17 String.prototype.split(separator, limit)


  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

var global = require('./_global');

var has = require('./_has');

var DESCRIPTORS = require('./_descriptors');

var $export = require('./_export');

var redefine = require('./_redefine');

var META = require('./_meta').KEY;

var $fails = require('./_fails');

var shared = require('./_shared');

var setToStringTag = require('./_set-to-string-tag');

var uid = require('./_uid');

var wks = require('./_wks');

var wksExt = require('./_wks-ext');

var wksDefine = require('./_wks-define');

var enumKeys = require('./_enum-keys');

var isArray = require('./_is-array');

var anObject = require('./_an-object');

var isObject = require('./_is-object');

var toIObject = require('./_to-iobject');

var toPrimitive = require('./_to-primitive');

var createDesc = require('./_property-desc');

var _create = require('./_object-create');

var gOPNExt = require('./_object-gopn-ext');

var $GOPD = require('./_object-gopd');

var $DP = require('./_object-dp');

var $keys = require('./_object-keys');

var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;

var _stringify = $JSON && $JSON.stringify;

var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject; // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild; // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function get() {
      return dP(this, 'a', {
        value: 7
      }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function wrap(tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);

  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && _typeof($Symbol.iterator) == 'symbol' ? function (it) {
  return _typeof(it) == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);

  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, {
        enumerable: createDesc(0, false)
      });
    }

    return setSymbolDesc(it, key, D);
  }

  return dP(it, key, D);
};

var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;

  while (l > i) {
    $defineProperty(it, key = keys[i++], P[key]);
  }

  return it;
};

var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};

var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};

var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;

  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }

  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;

  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  }

  return result;
}; // 19.4.1.1 Symbol([description])


if (!USE_NATIVE) {
  $Symbol = function _Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);

    var $set = function $set(value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };

    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, {
      configurable: true,
      set: $set
    });
    return wrap(tag);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });
  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {
  Symbol: $Symbol
});

for (var es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
  wks(es6Symbols[j++]);
}

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) {
  wksDefine(wellKnownSymbols[k++]);
}

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function _for(key) {
    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');

    for (var key in SymbolRegistry) {
      if (SymbolRegistry[key] === sym) return key;
    }
  },
  useSetter: function useSetter() {
    setter = true;
  },
  useSimple: function useSimple() {
    setter = false;
  }
});
$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
}); // 24.3.2 JSON.stringify(value [, replacer [, space]])

$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol(); // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols

  return _stringify([S]) != '[null]' || _stringify({
    a: S
  }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;

    while (arguments.length > i) {
      args.push(arguments[i++]);
    }

    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

    if (!isArray(replacer)) replacer = function replacer(key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
}); // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)

$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf); // 19.4.3.5 Symbol.prototype[@@toStringTag]

setToStringTag($Symbol, 'Symbol'); // 20.2.1.9 Math[@@toStringTag]

setToStringTag(Math, 'Math', true); // 24.3.3 JSON[@@toStringTag]

setToStringTag(global.JSON, 'JSON', true);

var $iterators = require('./es6.array.iterator');

var getKeys = require('./_object-keys');

var redefine$1 = require('./_redefine');

var global$1 = require('./_global');

var hide = require('./_hide');

var Iterators = require('./_iterators');

var wks$1 = require('./_wks');

var ITERATOR = wks$1('iterator');
var TO_STRING_TAG = wks$1('toStringTag');
var ArrayValues = Iterators.Array;
var DOMIterables = {
  CSSRuleList: true,
  // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true,
  // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true,
  // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global$1[NAME];
  var proto = Collection && Collection.prototype;
  var key;

  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) {
      if (!proto[key]) redefine$1(proto, key, $iterators[key], true);
    }
  }
}

var asyncFunction = (function (fn) {
  return {}.toString.call(fn) === '[object AsyncFunction]';
});

var isFunction = (function (fn) {
  return {}.toString.call(fn) === '[object Function]' || asyncFunction(fn);
});

var isPromise = (function (p) {
  return p && isFunction(p.then);
});

var Promise$1 =
/*#__PURE__*/
function () {
  function Promise(fn) {
    _classCallCheck(this, Promise);

    if (!(this instanceof Promise)) {
      throw new TypeError(this + ' is not a promise ');
    }

    if (!isFunction(fn)) {
      throw new TypeError('Promise resolver ' + fn + ' is not a function');
    }

    this['[[PromiseStatus]]'] = 'pending';
    this['[[PromiseValue]]'] = null;
    this['[[PromiseThenables]]'] = [];

    try {
      fn(promiseResolve.bind(null, this), promiseReject.bind(null, this));
    } catch (e) {
      if (this['[[PromiseStatus]]'] === 'pending') {
        promiseReject.bind(null, this)(e);
      }
    }
  }

  _createClass(Promise, [{
    key: "then",
    value: function then(resolved, rejected) {
      var promise = new Promise(function () {});
      this['[[PromiseThenables]]'].push({
        resolve: isFunction(resolved) ? resolved : null,
        reject: isFunction(rejected) ? rejected : null,
        called: false,
        promise: promise
      });
      if (this['[[PromiseStatus]]'] !== 'pending') promiseExecute(this);
      return promise;
    }
  }, {
    key: "catch",
    value: function _catch(reject) {
      return this.then(null, reject);
    }
  }]);
  return Promise;
}();

Promise$1.resolve = function (value) {
  if (!isFunction(this)) {
    throw new TypeError('Promise.resolve is not a constructor');
  }
  /**
   * @todo
   * check if the value need to return the resolve( value )
   */


  return new Promise$1(function (resolve) {
    resolve(value);
  });
};

Promise$1.reject = function (reason) {
  if (!isFunction(this)) {
    throw new TypeError('Promise.reject is not a constructor');
  }

  return new Promise$1(function (resolve, reject) {
    reject(reason);
  });
};

Promise$1.all = function (promises) {
  var rejected = false;
  var res = [];
  return new Promise$1(function (resolve, reject) {
    var remaining = 0;

    var then = function then(p, i) {
      if (!isPromise(p)) {
        p = Promise$1.resolve(p);
      }

      p.then(function (value) {
        res[i] = value;

        if (--remaining === 0) {
          resolve(res);
        }
      }, function (reason) {
        if (!rejected) {
          reject(reason);
          rejected = true;
        }
      });
    };

    var i = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = promises[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _promise = _step.value;
        then(_promise, remaining = i++);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
};

Promise$1.race = function (promises) {
  var resolved = false;
  var rejected = false;
  return new Promise$1(function (resolve, reject) {
    function onresolved(value) {
      if (!resolved && !rejected) {
        resolve(value);
        resolved = true;
      }
    }

    function onrejected(reason) {
      if (!resolved && !rejected) {
        reject(reason);
        rejected = true;
      }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = promises[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _promise2 = _step2.value;

        if (!isPromise(_promise2)) {
          _promise2 = Promise$1.resolve(_promise2);
        }

        _promise2.then(onresolved, onrejected);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });
};

function promiseExecute(promise) {
  var thenable, p;
  if (promise['[[PromiseStatus]]'] === 'pending') return;
  if (!promise['[[PromiseThenables]]'].length) return;

  var then = function then(p, t) {
    p.then(function (value) {
      promiseResolve(t.promise, value);
    }, function (reason) {
      promiseReject(t.promise, reason);
    });
  };

  while (promise['[[PromiseThenables]]'].length) {
    thenable = promise['[[PromiseThenables]]'].shift();
    if (thenable.called) continue;
    thenable.called = true;

    if (promise['[[PromiseStatus]]'] === 'resolved') {
      if (!thenable.resolve) {
        promiseResolve(thenable.promise, promise['[[PromiseValue]]']);
        continue;
      }

      try {
        p = thenable.resolve.call(null, promise['[[PromiseValue]]']);
      } catch (e) {
        then(Promise$1.reject(e), thenable);
        continue;
      }

      if (p && (typeof p === 'function' || _typeof(p) === 'object') && p.then) {
        then(p, thenable);
        continue;
      }
    } else {
      if (!thenable.reject) {
        promiseReject(thenable.promise, promise['[[PromiseValue]]']);
        continue;
      }

      try {
        p = thenable.reject.call(null, promise['[[PromiseValue]]']);
      } catch (e) {
        then(Promise$1.reject(e), thenable);
        continue;
      }

      if ((typeof p === 'function' || _typeof(p) === 'object') && p.then) {
        then(p, thenable);
        continue;
      }
    }

    promiseResolve(thenable.promise, p);
  }

  return promise;
}

function promiseResolve(promise, value) {
  if (!(promise instanceof Promise$1)) {
    return new Promise$1(function (resolve) {
      resolve(value);
    });
  }

  if (promise['[[PromiseStatus]]'] !== 'pending') return;

  if (value === promise) {
    /**
     * thie error should be thrown, defined ES6 standard
     * it would be thrown in Chrome but not in Firefox or Safari
     */
    throw new TypeError('Chaining cycle detected for promise #<Promise>');
  }

  if (value !== null && (typeof value === 'function' || _typeof(value) === 'object')) {
    var then;

    try {
      then = value.then;
    } catch (e) {
      return promiseReject(promise, e);
    }

    if (typeof then === 'function') {
      then.call(value, promiseResolve.bind(null, promise), promiseReject.bind(null, promise));
      return;
    }
  }

  promise['[[PromiseStatus]]'] = 'resolved';
  promise['[[PromiseValue]]'] = value;
  promiseExecute(promise);
}

function promiseReject(promise, value) {
  if (!(promise instanceof Promise$1)) {
    return new Promise$1(function (resolve, reject) {
      reject(value);
    });
  }

  promise['[[PromiseStatus]]'] = 'rejected';
  promise['[[PromiseValue]]'] = value;
  promiseExecute(promise);
}

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

var isString = (function (str) {
  return typeof str === 'string' || str instanceof String;
});

var url = (function (url) {
  if (!isString(url)) return false;
  if (!/^(https?|ftp):\/\//i.test(url)) return false;
  var a = document.createElement('a');
  a.href = url;
  return /^(https?|ftp):/i.test(a.protocol);
});

function supportIterator() {
  try {
    return !!Symbol.iterator;
  } catch (e) {
    return false;
  }
}

var decode = function decode(str) {
  return decodeURIComponent(String(str).replace(/\+/g, ' '));
};

var URLSearchParams =
/*#__PURE__*/
function () {
  function URLSearchParams(init) {
    _classCallCheck(this, URLSearchParams);

    if (window.URLSearchParams) {
      return new window.URLSearchParams(init);
    } else {
      this.dict = [];
      if (!init) return;

      if (URLSearchParams.prototype.isPrototypeOf(init)) {
        return new URLSearchParams(init.toString());
      }

      if (Array.isArray(init)) {
        throw new TypeError('Failed to construct "URLSearchParams": The provided value cannot be converted to a sequence.');
      }

      if (typeof init === 'string') {
        if (init.charAt(0) === '?') {
          init = init.slice(1);
        }

        var pairs = init.split(/&+/);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = pairs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _item = _step.value;

            var index = _item.indexOf('=');

            this.append(index > -1 ? _item.slice(0, index) : _item, index > -1 ? _item.slice(index + 1) : '');
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return;
      }

      for (var attr in init) {
        this.append(attr, init[attr]);
      }
    }
  }

  _createClass(URLSearchParams, [{
    key: "append",
    value: function append(name, value) {
      this.dict.push([decode(name), decode(value)]);
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      var dict = this.dict;

      for (var i = 0, l = dict.length; i < l; i += 1) {
        if (dict[i][0] == name) {
          dict.splice(i, 1);
          i--;
          l--;
        }
      }
    }
  }, {
    key: "get",
    value: function get(name) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.dict[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _item2 = _step2.value;

          if (_item2[0] == name) {
            return _item2[1];
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return null;
    }
  }, {
    key: "getAll",
    value: function getAll(name) {
      var res = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.dict[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _item3 = _step3.value;

          if (_item3[0] == name) {
            res.push(_item3[1]);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return res;
    }
  }, {
    key: "has",
    value: function has(name) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.dict[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _item4 = _step4.value;

          if (_item4[0] == name) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return false;
    }
  }, {
    key: "set",
    value: function set(name, value) {
      var set = false;

      for (var i = 0, l = this.dict.length; i < l; i += 1) {
        var item = this.dict[i];

        if (item[0] == name) {
          if (set) {
            this.dict.splice(i, 1);
            i--;
            l--;
          } else {
            item[1] = String(value);
            set = true;
          }
        }
      }
    }
  }, {
    key: "sort",
    value: function sort() {
      this.dict.sort(function (a, b) {
        var nameA = a[0].toLowerCase();
        var nameB = b[0].toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    }
  }, {
    key: "entries",
    value: function entries() {
      var dict = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.dict[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _item5 = _step5.value;
          dict.push([_item5[0], _item5[1]]);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return !supportIterator() ? dict : _defineProperty({}, Symbol.iterator, function () {
        return {
          next: function next() {
            var value = dict.shift();
            return {
              done: value === undefined,
              value: value
            };
          }
        };
      });
    }
  }, {
    key: "keys",
    value: function keys() {
      var keys = [];
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.dict[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _item6 = _step6.value;
          keys.push(_item6[0]);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return !supportIterator() ? keys : _defineProperty({}, Symbol.iterator, function () {
        return {
          next: function next() {
            var value = keys.shift();
            return {
              done: value === undefined,
              value: value
            };
          }
        };
      });
    }
  }, {
    key: "values",
    value: function values() {
      var values = [];
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.dict[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _item7 = _step7.value;
          values.push(_item7[1]);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      return !supportIterator() ? values : _defineProperty({}, Symbol.iterator, function () {
        return {
          next: function next() {
            var value = values.shift();
            return {
              done: value === undefined,
              value: value
            };
          }
        };
      });
    }
  }, {
    key: "toString",
    value: function toString() {
      var pairs = [];
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.dict[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _item8 = _step8.value;
          pairs.push(encodeURIComponent(_item8[0]) + '=' + encodeURIComponent(_item8[1]));
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      return pairs.join('&');
    }
  }]);
  return URLSearchParams;
}();

var attrs = ['href', 'origin', 'host', 'hash', 'hostname', 'pathname', 'port', 'protocol', 'search', 'username', 'password', 'searchParams'];

var URL$1 = function URL(path, base) {
  _classCallCheck(this, URL);

  if (window.URL) {
    var url$$1;

    if (typeof base === 'undefined') {
      url$$1 = new window.URL(path);
    } else {
      url$$1 = new window.URL(path, base);
    }

    if (!('searchParams' in url$$1)) {
      url$$1.searchParams = new URLSearchParams(url$$1.search);
    }

    return url$$1;
  } else {
    if (URL.prototype.isPrototypeOf(path)) {
      return new URL(path.href);
    }

    if (URL.prototype.isPrototypeOf(base)) {
      return new URL(path, base.href);
    }

    path = String(path);

    if (base !== undefined) {
      if (!url(base)) {
        throw new TypeError('Failed to construct "URL": Invalid base URL');
      }

      if (/^[a-zA-Z][0-9a-zA-Z.-]*:/.test(path)) {
        base = null;
      }
    } else {
      if (!/^[a-zA-Z][0-9a-zA-Z.-]*:/.test(path)) {
        throw new TypeError('Failed to construct "URL": Invalid URL');
      }
    }

    if (base) {
      base = new URL(base);

      if (path.charAt(0) === '/' && path.charAt(1) === '/') {
        path = base.protocol + path;
      } else if (path.charAt(0) === '/') {
        path = base.origin + path;
      } else {
        path = base.origin + base.pathname.replace(/\/[^/]+\/?$/, '') + '/' + path;
      }
    }

    var dotdot = /([^/])\/[^/]+\/\.\.\//;
    var dot = /\/\.\//g;
    path = path.replace(dot, '/');

    while (path.match(dotdot)) {
      path = path.replace(dotdot, '$1/');
    }

    var node = document.createElement('a');
    node.href = path;

    for (var _i = 0; _i < attrs.length; _i++) {
      var attr = attrs[_i];
      this[attr] = attr in node ? node[attr] : '';
    }

    this.searchParams = new URLSearchParams(this.search);
  }
};

var id = 0;
var prefix = 'biu_jsonp_callback_' + +new Date() + '_' + Math.random().toString().substr(2);

function createScriptTag(src, id) {
  var target = document.getElementsByTagName('script')[0] || document.head.firstChild;
  var script = document.createElement('script');
  script.src = src;
  script.id = id;
  return target.parentNode.insertBefore(script, target);
}

function jsonp(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var params = options.data || {};
  var callback = prefix + '_' + id++;
  var r1, r2;
  var promise = new Promise$1(function (resolve, reject) {
    r1 = resolve;
    r2 = reject;
  });
  params.callback || (params.callback = callback);
  var querystring = new URLSearchParams(params).toString();
  url += (url.indexOf('?') >= 0 ? '&' : '?') + querystring;

  window[params.callback] = function (response) {
    r1(response);
    window[params.callback] = null;
    delete window[params.callback];
    var script = document.getElementById(params.callback);
    script && script.parentNode.removeChild(script);
  };

  var script = createScriptTag(url, params.callback);
  script.addEventListener('error', function (e) {
    r2(e);
  });
  return promise;
}

function isUndefined () {
  return arguments.length > 0 && typeof arguments[0] === 'undefined';
}

function isURLSearchParams(obj) {
  if (window.URLSearchParams.prototype.isPrototypeOf(obj)) return true;
  return URLSearchParams.prototype.isPrototypeOf(obj);
}

function mergeParams(dest, src) {
  if (!isURLSearchParams(dest)) {
    dest = new URLSearchParams(dest);
  }

  if (!src) return dest;

  if (isURLSearchParams(src)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = src.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _item = _step.value;
        dest.append(_item[0], _item[1]);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else {
    var keys = Object.keys(src);

    for (var _i = 0; _i < keys.length; _i++) {
      var _item2 = keys[_i];
      dest.append(_item2, src[_item2]);
    }
  }

  return dest;
}

var LIBRARY = require('./_library');

var global$2 = require('./_global');

var ctx = require('./_ctx');

var classof = require('./_classof');

var $export$1 = require('./_export');

var isObject$1 = require('./_is-object');

var aFunction = require('./_a-function');

var anInstance = require('./_an-instance');

var forOf = require('./_for-of');

var speciesConstructor = require('./_species-constructor');

var task = require('./_task').set;

var microtask = require('./_microtask')();

var newPromiseCapabilityModule = require('./_new-promise-capability');

var perform = require('./_perform');

var promiseResolve$1 = require('./_promise-resolve');

var PROMISE = 'Promise';
var TypeError$1 = global$2.TypeError;
var process = global$2.process;
var $Promise = global$2[PROMISE];
var isNode = classof(process) == 'process';

var empty = function empty() {
  /* empty */
};

var Internal;
var newGenericPromiseCapability;
var OwnPromiseCapability;
var Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;
var USE_NATIVE$1 = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);

    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    }; // unhandled rejections tracking support, NodeJS Promise without it fails @@species test


    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) {
    /* empty */
  }
}(); // helpers

var isThenable = function isThenable(it) {
  var then;
  return isObject$1(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function notify(promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;

    var run = function run(reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;

      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }

          if (handler === true) result = value;else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }

          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };

    while (chain.length > i) {
      run(chain[i++]);
    } // variable length - can't use forEach


    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};

var onUnhandled = function onUnhandled(promise) {
  task.call(global$2, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;

    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global$2.onunhandledrejection) {
          handler({
            promise: promise,
            reason: value
          });
        } else if ((console = global$2.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      }); // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should

      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    }

    promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};

var isUnhandled = function isUnhandled(promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};

var onHandleUnhandled = function onHandleUnhandled(promise) {
  task.call(global$2, function () {
    var handler;

    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global$2.onrejectionhandled) {
      handler({
        promise: promise,
        reason: promise._v
      });
    }
  });
};

var $reject = function $reject(value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap

  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};

var $resolve = function $resolve(value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap

  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");

    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = {
          _w: promise,
          _d: false
        }; // wrap

        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({
      _w: promise,
      _d: false
    }, e); // wrap
  }
}; // constructor polyfill


if (!USE_NATIVE$1) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);

    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  }; // eslint-disable-next-line no-unused-vars


  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions

    this._a = undefined; // <- checked in isUnhandled reactions

    this._s = 0; // <- state

    this._d = false; // <- done

    this._v = undefined; // <- value

    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled

    this._n = false; // <- notify
  };

  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;

      this._c.push(reaction);

      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });

  OwnPromiseCapability = function OwnPromiseCapability() {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };

  newPromiseCapabilityModule.f = newPromiseCapability = function newPromiseCapability(C) {
    return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
  };
}

$export$1($export$1.G + $export$1.W + $export$1.F * !USE_NATIVE$1, {
  Promise: $Promise
});

require('./_set-to-string-tag')($Promise, PROMISE);

require('./_set-species')(PROMISE);

Wrapper = require('./_core')[PROMISE]; // statics

$export$1($export$1.S + $export$1.F * !USE_NATIVE$1, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export$1($export$1.S + $export$1.F * (LIBRARY || !USE_NATIVE$1), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve$1(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export$1($export$1.S + $export$1.F * !(USE_NATIVE$1 && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

// 19.1.3.1 Object.assign(target, source)
var $export$2 = require('./_export');

$export$2($export$2.S + $export$2.F, 'Object', {
  assign: require('./_object-assign')
});

var isArguments = (function (obj) {
  return {}.toString.call(obj) === '[object Arguments]';
});

var array = (function (obj) {
  return Array.isArray(obj);
});

var arrowFunction = (function (fn) {
  if (!isFunction(fn)) return false;
  return /^(?:function)?\s*\(?[\w\s,]*\)?\s*=>/.test(fn.toString());
});

var isBoolean = (function (s) {
  return typeof s === 'boolean';
});

var isDate = (function (date) {
  return {}.toString.call(date) === '[object Date]';
});

var email = (function (str) {
  return /^(([^#$%&*!+-/=?^`{|}~<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(str);
});

var isObject$2 = (function (obj) {
  return obj && _typeof(obj) === 'object' && !Array.isArray(obj);
});

var empty$1 = (function (obj) {
  if (array(obj) || isString(obj)) {
    return !obj.length;
  }

  if (isObject$2(obj)) {
    return !Object.keys(obj).length;
  }

  return !obj;
});

var error = (function (e) {
  return {}.toString.call(e) === '[object Error]';
});

var isFalse = (function (obj) {
  var generalized = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (isBoolean(obj) || !generalized) return !obj;

  if (isString(obj)) {
    return ['false', 'no', '0', '', 'nay', 'n', 'disagree'].indexOf(obj.toLowerCase()) > -1;
  }

  return !obj;
});

var isNumber = (function (n) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if ({}.toString.call(n).toLowerCase() === '[object number]') {
    return true;
  }

  if (strict) return false;
  return !isNaN(parseFloat(n)) && isFinite(n) && !/\.$/.test(n);
});

var integer = (function (n) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (isNumber(n, true)) return n % 1 === 0;
  if (strict) return false;

  if (isString(n)) {
    if (n === '-0') return true;
    return n.indexOf('.') < 0 && String(parseInt(n)) === n;
  }

  return false;
});

var iterable = (function (obj) {
  try {
    return isFunction(obj[Symbol.iterator]);
  } catch (e) {
    return false;
  }
});

// https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/test/data/jquery-1.9.1.js#L480
var plainObject = (function (obj) {
  if (!isObject$2(obj)) {
    return false;
  }

  try {
    if (obj.constructor && !{}.hasOwnProperty.call(obj, 'constructor') && !{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }
  } catch (e) {
    return false;
  }

  var key;

  for (key in obj) {} // eslint-disable-line


  return key === undefined || {}.hasOwnProperty.call(obj, key);
});

var isRegExp = (function (reg) {
  return {}.toString.call(reg) === '[object RegExp]';
});

var isTrue = (function (obj) {
  var generalized = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (isBoolean(obj) || !generalized) return !!obj;

  if (isString(obj)) {
    return ['true', 'yes', 'ok', '1', 'yea', 'yep', 'y', 'agree'].indexOf(obj.toLowerCase()) > -1;
  }

  return !!obj;
});

var node = (function (s) {
  return (typeof Node === "undefined" ? "undefined" : _typeof(Node)) === 'object' ? s instanceof Node : s && _typeof(s) === 'object' && typeof s.nodeType === 'number' && typeof s.nodeName === 'string';
});

var textNode = (function (node$$1) {
  return node(node$$1) && node$$1.nodeType === 3;
});

var elementNode = (function (node$$1) {
  return node(node$$1) && node$$1.nodeType === 1;
});

var isWindow = (function (obj) {
  return obj && obj === obj.window;
});

var is = {
  arguments: isArguments,
  array: array,
  arrowFunction: arrowFunction,
  asyncFunction: asyncFunction,
  boolean: isBoolean,
  date: isDate,
  email: email,
  empty: empty$1,
  error: error,
  false: isFalse,
  function: isFunction,
  integer: integer,
  iterable: iterable,
  number: isNumber,
  object: isObject$2,
  plainObject: plainObject,
  promise: isPromise,
  regexp: isRegExp,
  string: isString,
  true: isTrue,
  undefined: isUndefined,
  url: url,
  node: node,
  textNode: textNode,
  elementNode: elementNode,
  window: isWindow
};

var Response =
/*#__PURE__*/
function () {
  function Response(_ref) {
    var _ref$status = _ref.status,
        status = _ref$status === void 0 ? 200 : _ref$status,
        _ref$statusText = _ref.statusText,
        statusText = _ref$statusText === void 0 ? 'OK' : _ref$statusText,
        _ref$url = _ref.url,
        url = _ref$url === void 0 ? '' : _ref$url,
        _ref$body = _ref.body,
        body = _ref$body === void 0 ? null : _ref$body,
        _ref$headers = _ref.headers,
        headers = _ref$headers === void 0 ? {} : _ref$headers;
    _classCallCheck(this, Response);

    if (!is.string(body)) {
      return new TypeError('Response body must be a string "' + body + '"');
    }

    Object.assign(this, {
      body: body,
      status: status,
      statusText: statusText,
      url: url,
      headers: headers,
      ok: status >= 200 && status < 300 || status === 304
    });
  }

  _createClass(Response, [{
    key: "text",
    value: function text() {
      return Promise.resolve(this.body);
    }
  }, {
    key: "json",
    value: function json() {
      try {
        var json = JSON.parse(this.body);
        return Promise.resolve(json);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "uncompress",
    value: function uncompress() {}
  }, {
    key: "compress",
    value: function compress() {}
  }]);
  return Response;
}();

var ajax = (function (url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var data = options.data,
      params = options.params,
      timeout = options.timeout,
      _options$asynchronous = options.asynchronous,
      asynchronous = _options$asynchronous === void 0 ? true : _options$asynchronous,
      _options$method = options.method,
      method = _options$method === void 0 ? 'GET' : _options$method,
      _options$headers = options.headers,
      headers = _options$headers === void 0 ? {} : _options$headers,
      onprogress = options.onprogress,
      _options$credentials = options.credentials,
      credentials = _options$credentials === void 0 ? 'omit' : _options$credentials,
      _options$responseType = options.responseType,
      responseType = _options$responseType === void 0 ? 'text' : _options$responseType,
      _options$xhr = options.xhr,
      xhr = _options$xhr === void 0 ? new XMLHttpRequest() : _options$xhr;
  method = method.toUpperCase();
  xhr.timeout = timeout;
  return new Promise$1(function (resolve, reject) {
    xhr.withCredentials = credentials === 'include';

    var onreadystatechange = function onreadystatechange() {
      if (xhr.readyState != 4) return;
      if (xhr.status === 0) return;
      var response = new Response({
        body: responseType !== 'text' ? xhr.response : xhr.responseText,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders()
      });
      resolve(response);
      xhr = null;
    };

    url = new URL$1(url, location.href);
    mergeParams(url.searchParams, params);
    xhr.open(method, url.href, asynchronous);

    xhr.onerror = function (e) {
      reject(e);
      xhr = null;
    };

    xhr.ontimeout = function () {
      reject('Timeout');
      xhr = null;
    };

    if (isFunction(onprogress)) {
      xhr.onprogress = onprogress;
    }

    var isFormData = FormData.prototype.isPrototypeOf(data);

    for (var key in headers) {
      if ((isUndefined(data) || isFormData) && key.toLowerCase() === 'content-type') {
        // if the data is undefined or it is an instance of FormData
        // let the client to set "Content-Type" in header
        continue;
      }

      xhr.setRequestHeader(key, headers[key]);
    }

    asynchronous && (xhr.onreadystatechange = onreadystatechange);
    xhr.send(isUndefined(data) ? null : data);
    asynchronous || onreadystatechange();
  });
});

var EventEmitter =
/*#__PURE__*/
function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
    this.__listeners = {};
  }

  _createClass(EventEmitter, [{
    key: "alias",
    value: function alias(name, to) {
      this[name] = this[to].bind(this);
    }
  }, {
    key: "on",
    value: function on(evt, handler) {
      var listeners = this.__listeners;
      listeners[evt] ? listeners[evt].push(handler) : listeners[evt] = [handler];
      return this;
    }
  }, {
    key: "once",
    value: function once(evt, handler) {
      var _this = this;

      var _handler = function _handler() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        handler.apply(_this, args);

        _this.removeListener(evt, _handler);
      };

      return this.on(evt, _handler);
    }
  }, {
    key: "removeListener",
    value: function removeListener(evt, handler) {
      var listeners = this.__listeners,
          handlers = listeners[evt];

      if (!handlers || !handlers.length) {
        return this;
      }

      for (var i = 0; i < handlers.length; i += 1) {
        handlers[i] === handler && (handlers[i] = null);
      }

      setTimeout(function () {
        for (var _i = 0; _i < handlers.length; _i += 1) {
          handlers[_i] || handlers.splice(_i--, 1);
        }
      }, 0);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(evt) {
      var handlers = this.__listeners[evt];

      if (handlers) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        for (var i = 0, l = handlers.length; i < l; i += 1) {
          var _handlers$i;

          handlers[i] && (_handlers$i = handlers[i]).call.apply(_handlers$i, [this].concat(args));
        }

        return true;
      }

      return false;
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(rule) {
      var checker;

      if (isString(rule)) {
        checker = function checker(name) {
          return rule === name;
        };
      } else if (isFunction(rule)) {
        checker = rule;
      } else if (isRegExp(rule)) {
        checker = function checker(name) {
          rule.lastIndex = 0;
          return rule.test(name);
        };
      }

      var listeners = this.__listeners;

      for (var attr in listeners) {
        if (checker(attr)) {
          listeners[attr] = null;
          delete listeners[attr];
        }
      }
    }
  }]);
  return EventEmitter;
}();

function config() {
  return {
    promises: [],
    results: [],
    index: 0,
    steps: [],
    busy: false,
    promise: Promise$1.resolve()
  };
}
/**
 * new Sequence( false, [] )
 * new Sequence( [] )
 */


var Sequence =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Sequence, _EventEmitter);

  function Sequence(steps) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Sequence);
    _this = _possibleConstructorReturn(this, (Sequence.__proto__ || Object.getPrototypeOf(Sequence)).call(this));
    _this.__resolve = null;
    _this.running = false;
    _this.suspended = false;
    _this.suspendTimeout = null;
    _this.interval = options.interval || 0;
    Object.assign(_assertThisInitialized(_this), config());
    steps && _this.append(steps);
    options.autorun !== false && setTimeout(function () {
      _this.run();
    }, 0);
    return _this;
  }
  /**
   * to append new steps to the sequence
   */


  _createClass(Sequence, [{
    key: "append",
    value: function append(steps) {
      var dead = this.index >= this.steps.length;

      if (isFunction(steps)) {
        this.steps.push(steps);
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = steps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step2 = _step.value;
            this.steps.push(_step2);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      this.running && dead && this.next(true);
    }
  }, {
    key: "go",
    value: function go(n) {
      if (isUndefined(n)) return;
      this.index = n;

      if (this.index > this.steps.length) {
        this.index = this.steps.length;
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      Object.assign(this, config());
    }
  }, {
    key: "next",
    value: function next() {
      var _this2 = this;

      var inner = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!inner && this.running) {
        console.warn('Please do not call next() while the sequence is running.');
        return Promise$1.reject(new Sequence.Error({
          errno: 2,
          errmsg: 'Cannot call next during the sequence is running.'
        }));
      }
      /**
       * If there is a step that is running,
       * return the promise instance of the running step.
       */


      if (this.busy || this.suspended) return this.promise;
      /**
       * If already reached the end of the sequence,
       * return a rejected promise instance with a false as its reason.
       */

      if (!this.steps[this.index]) {
        return Promise$1.reject(new Sequence.Error({
          errno: 1,
          errmsg: 'no more step can be executed.'
        }));
      }

      this.busy = true;
      return this.promise = this.promise.then(function () {
        var step = _this2.steps[_this2.index];
        var promise = step(_this2.results[_this2.results.length - 1], _this2.index, _this2.results);
        /**
         * if the step function doesn't return a promise instance,
         * create a resolved promise instance with the returned value as its value
         */

        if (!isPromise(promise)) {
          promise = Promise$1.resolve(promise);
        }

        return promise.then(function (value) {
          var result = {
            status: Sequence.SUCCEEDED,
            index: _this2.index,
            value: value,
            time: +new Date()
          };

          _this2.results.push(result);

          _this2.emit('success', result, _this2.index, _this2);

          return result;
        }).catch(function (reason) {
          var result = {
            status: Sequence.FAILED,
            index: _this2.index,
            reason: reason,
            time: +new Date()
          };

          _this2.results.push(result);

          _this2.emit('failed', result, _this2.index, _this2);

          return result;
        }).then(function (result) {
          _this2.index++;
          _this2.busy = false;

          if (!_this2.steps[_this2.index]) {
            _this2.emit('end', _this2.results, _this2);
          } else {
            setTimeout(function () {
              _this2.running && _this2.next(true);
            }, _this2.interval);
          }

          return result;
        });
      });
    }
  }, {
    key: "run",
    value: function run() {
      if (this.running) return;
      this.running = true;
      this.next(true);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.running = false;
    }
  }, {
    key: "suspend",
    value: function suspend() {
      var _this3 = this;

      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
      this.suspended = true;
      this.suspendTimeout && clearTimeout(this.suspendTimeout);
      this.suspendTimeout = setTimeout(function () {
        _this3.suspended = false;
        _this3.running && _this3.next(true);
      }, duration);
    }
  }]);
  return Sequence;
}(EventEmitter);

Sequence.SUCCEEDED = 1;
Sequence.FAILED = 0;

Sequence.all = function (steps) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var sequence = new Sequence(steps, {
    interval: interval
  });
  return new Promise$1(function (resolve, reject) {
    sequence.on('end', function (results) {
      resolve(results);
    });
    sequence.on('failed', function () {
      sequence.stop();
      reject(sequence.results);
    });
  });
};

Sequence.chain = function (steps) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var sequence = new Sequence(steps, {
    interval: interval
  });
  return new Promise$1(function (resolve) {
    sequence.on('end', function (results) {
      resolve(results);
    });
  });
};

Sequence.any = function (steps) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var sequence = new Sequence(steps, {
    interval: interval
  });
  return new Promise$1(function (resolve, reject) {
    sequence.on('success', function () {
      resolve(sequence.results);
      sequence.stop();
    });
    sequence.on('end', function () {
      reject(sequence.results);
    });
  });
};

Sequence.Error =
/*#__PURE__*/
function () {
  function _class(options) {
    _classCallCheck(this, _class);
    Object.assign(this, options);
  }

  return _class;
}();

var ctx$1 = require('./_ctx');

var $export$3 = require('./_export');

var toObject = require('./_to-object');

var call = require('./_iter-call');

var isArrayIter = require('./_is-array-iter');

var toLength = require('./_to-length');

var createProperty = require('./_create-property');

var getIterFn = require('./core.get-iterator-method');

$export$3($export$3.S + $export$3.F * !require('./_iter-detect')(function (iter) {
  
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike
  /* , mapfn = undefined, thisArg = undefined */
  ) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx$1(mapfn, aLen > 2 ? arguments[2] : undefined, 2); // if object isn't iterable or it's array with default iterator - use simple case

    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);

      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }

    result.length = index;
    return result;
  }
});

var md5 = (function () {
  var safe_add = function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
  };

  var bit_rol = function bit_rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  };

  var md5_cmn = function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
  };

  var md5_ff = function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn(b & c | ~b & d, a, b, x, s, t);
  };

  var md5_gg = function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn(b & d | c & ~d, a, b, x, s, t);
  };

  var md5_hh = function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  };

  var md5_ii = function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
  };
  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   */


  var binl_md5 = function binl_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;
    var a = 1732584193,
        b = -271733879,
        c = -1732584194,
        d = 271733878;

    for (var i = 0, l = x.length; i < l; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      a = md5_ff(a, b, c, d, x[i], 7, -680876936);
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5_gg(b, c, d, a, x[i], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5_hh(d, a, b, c, x[i], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5_ii(a, b, c, d, x[i], 6, -198630844);
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }

    return [a, b, c, d];
  };
  /*
   * Convert an array of little-endian words to a string
   */


  var binl2rstr = function binl2rstr(input) {
    var output = '';

    for (var i = 0, l = input.length * 32; i < l; i += 8) {
      output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
    }

    return output;
  };
  /*
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */


  var rstr2binl = function rstr2binl(input) {
    var output = Array.from({
      length: input.length >> 2
    }).map(function () {
      return 0;
    });

    for (var i = 0, l = input.length; i < l * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << i % 32;
    }

    return output;
  };

  var rstr_md5 = function rstr_md5(s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
  };

  var str2rstr_utf8 = function str2rstr_utf8(input) {
    return window.unescape(encodeURIComponent(input));
  };

  return function (string) {
    var output = '';
    var hex_tab = '0123456789abcdef';
    var input = rstr_md5(str2rstr_utf8(string));

    for (var i = 0, l = input.length; i < l; i += 1) {
      var x = input.charCodeAt(i);
      output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
    }

    return output;
  };
})();

var Storage =
/*#__PURE__*/
function () {
  function Storage(name) {
    _classCallCheck(this, Storage);

    if (!name) {
      throw new TypeError("Expect a name for the storage, but a(n) ".concat(name, " is given."));
    }

    this.name = "#LC-STORAGE-V-1.0#".concat(name, "#");
    var abstracts = ['set', 'get', 'delete', 'clear', 'keys'];

    for (var _i = 0; _i < abstracts.length; _i++) {
      var method = abstracts[_i];

      if (!isFunction(this[method])) {
        throw new TypeError("The method \"".concat(method, "\" must be declared in every class extends from Cache"));
      }
    }
  }

  _createClass(Storage, [{
    key: "format",
    value: function format(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var string = true;

      if (!isString(data)) {
        string = false;
        data = JSON.stringify(data);
      }

      var input = {
        data: data,
        type: options.type || 'localcache',
        mime: options.mime || 'text/plain',
        string: string,
        priority: options.priority === undefined ? 50 : options.priority,
        ctime: +new Date(),
        lifetime: options.lifetime || 0
      };

      if (options.extra) {
        input.extra = JSON.stringify(options.extra);
      }

      if (options.md5) {
        input.md5 = md5(data);
      }

      if (options.cookie) {
        input.cookie = md5(document.cookie);
      }

      return input;
    }
  }, {
    key: "validate",
    value: function validate(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var result = true;

      if (data.lifetime) {
        if (new Date() - data.ctime >= data.lifetime) {
          result = false;
        }
      }

      if (data.cookie) {
        if (data.cookie !== md5(document.cookie)) {
          result = false;
        }
      }

      if (data.md5 && options.md5) {
        if (data.md5 !== options.md5) {
          result = false;
        }

        if (md5(data.data) !== options.md5) {
          result = false;
        }
      }

      if (options.validate) {
        return options.validate(data, result);
      }

      return result;
    }
  }, {
    key: "clean",
    value: function clean(check) {
      var _this = this;

      return this.keys().then(function (keys) {
        var steps = [];

        var _loop = function _loop(key) {
          steps.push(function () {
            return _this.get(key).then(function (data) {
              if (check(data, key) === true) {
                return _this.delete(key);
              }
            });
          });
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            _loop(key);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return Sequence.chain(steps).then(function (results) {
          var removed = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _result = _step2.value;

              if (_result.status === Sequence.FAILED) {
                removed.push(keys[_result.index]);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return removed;
        });
      });
    }
  }, {
    key: "output",
    value: function output(data) {
      if (!data.string) {
        data.data = JSON.parse(data.data);
      }

      if (data.extra) {
        data.extra = JSON.parse(data.extra);
      }

      return data;
    }
  }]);
  return Storage;
}();

var Memory =
/*#__PURE__*/
function (_Storage) {
  _inherits(Memory, _Storage);

  function Memory(name) {
    var _this;

    _classCallCheck(this, Memory);
    _this = _possibleConstructorReturn(this, (Memory.__proto__ || Object.getPrototypeOf(Memory)).call(this, name));
    _this.data = {};
    return _this;
  }

  _createClass(Memory, [{
    key: "set",
    value: function set(key, data) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      data = this.format(data, options);
      this.data[key] = data;
      return Promise$1.resolve(data);
    }
  }, {
    key: "get",
    value: function get(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var data = this.data[key];
      if (!data) return Promise$1.reject();

      if (this.validate(data, options) === false) {
        options.autodelete !== false && this.delete(key);
        return Promise$1.reject();
      }

      return Promise$1.resolve(this.output(data));
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      this.data[key] = null;
      delete this.data[key];
      return Promise$1.resolve();
    }
  }, {
    key: "keys",
    value: function keys() {
      return Promise$1.resolve(Object.keys(this.data));
    }
  }, {
    key: "clear",
    value: function clear() {
      this.data = {};
      return Promise$1.resolve();
    }
  }]);
  return Memory;
}(Storage);

var dP$1 = require('./_object-dp').f;

var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME$1 = 'name'; // 19.2.4.2 name

NAME$1 in FProto || require('./_descriptors') && dP$1(FProto, NAME$1, {
  configurable: true,
  get: function get() {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

var SessionStorage =
/*#__PURE__*/
function (_Storage) {
  _inherits(SessionStorage, _Storage);

  function SessionStorage(name) {
    _classCallCheck(this, SessionStorage);
    return _possibleConstructorReturn(this, (SessionStorage.__proto__ || Object.getPrototypeOf(SessionStorage)).call(this, name));
  }

  _createClass(SessionStorage, [{
    key: "set",
    value: function set(key, data) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      data = this.format(data, options);

      try {
        sessionStorage.setItem(this.name + key, JSON.stringify(data));
        return Promise$1.resolve(data);
      } catch (e) {
        return Promise$1.reject(e);
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var data;

      try {
        data = JSON.parse(sessionStorage.getItem(this.name + key));
        if (!data) return Promise$1.reject();

        if (this.validate(data, options) === false) {
          options.autodelete !== false && this.delete(key);
          return Promise$1.reject();
        }
      } catch (e) {
        this.delete(key);
        return Promise$1.reject();
      }

      return Promise$1.resolve(this.output(data));
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      sessionStorage.removeItem(this.name + key);
      return Promise$1.resolve();
    }
  }, {
    key: "clear",
    value: function clear() {
      sessionStorage.clear();
      return Promise$1.resolve();
    }
  }, {
    key: "keys",
    value: function keys() {
      var keys = [];
      var name = this.name;
      var l = this.name.length;

      for (var key in sessionStorage) {
        if (key.indexOf(name)) continue;
        keys.push(key.substr(l));
      }

      return Promise$1.resolve(keys);
    }
  }]);
  return SessionStorage;
}(Storage);

var IDB =
/*#__PURE__*/
function (_Storage) {
  _inherits(IDB, _Storage);

  function IDB(name) {
    var _this;

    _classCallCheck(this, IDB);
    _this = _possibleConstructorReturn(this, (IDB.__proto__ || Object.getPrototypeOf(IDB)).call(this, name));
    _this.idb = null;
    _this.ready = _this.open().then(function () {
      _this.idb.onerror = function (e) {
        console.warn('IDB Error', e);
      };

      return _this.idb;
    });
    return _this;
  }

  _createClass(IDB, [{
    key: "open",
    value: function open() {
      var _this2 = this;

      var request = window.indexedDB.open(this.name);
      return new Promise(function (resolve, reject) {
        request.onsuccess = function (e) {
          _this2.idb = e.target.result;
          resolve(e);
        };

        request.onerror = function (e) {
          reject(e);
        };

        request.onupgradeneeded = function (e) {
          _this2.onupgradeneeded(e);
        };
      });
    }
  }, {
    key: "onupgradeneeded",
    value: function onupgradeneeded(e) {
      var os = e.target.result.createObjectStore('storage', {
        keyPath: 'key'
      });
      os.createIndex('key', 'key', {
        unique: true
      });
      os.createIndex('data', 'data', {
        unique: false
      });
      os.createIndex('type', 'type', {
        unique: false
      });
      os.createIndex('string', 'string', {
        unique: false
      });
      os.createIndex('ctime', 'ctime', {
        unique: false
      });
      os.createIndex('md5', 'md5', {
        unique: false
      });
      os.createIndex('lifetime', 'lifetime', {
        unique: false
      });
      os.createIndex('cookie', 'cookie', {
        unique: false
      });
      os.createIndex('priority', 'priority', {
        unique: false
      });
      os.createIndex('extra', 'extra', {
        unique: false
      });
      os.createIndex('mime', 'mime', {
        unique: false
      });
    }
  }, {
    key: "store",
    value: function store() {
      var write = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.idb.transaction(['storage'], write ? 'readwrite' : 'readonly').objectStore('storage');
    }
  }, {
    key: "set",
    value: function set(key, data) {
      var _this3 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      data = this.format(data, options);
      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this3.store(true); // don't manipulate the origin data


          var request = store.put(Object.assign({
            key: key
          }, data));

          request.onsuccess = function () {
            resolve(data);
          };

          request.onerror = function (e) {
            reject(e);
          };
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _this4 = this;

      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this4.store(true);

          var request = store.delete(key);

          request.onsuccess = function () {
            resolve();
          };

          request.onerror = function (e) {
            reject(e);
          };
        });
      });
    }
  }, {
    key: "get",
    value: function get(key) {
      var _this5 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this5.store();

          var request = store.get(key);

          request.onsuccess = function () {
            var data = request.result;

            if (!data) {
              return reject();
            }

            if (_this5.validate(data, options) === false) {
              options.autodelete !== false && _this5.delete(key);
              return reject();
            }

            delete data.key;
            resolve(_this5.output(data));
          };

          request.onerror = function (e) {
            reject(e);
          };
        });
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this6 = this;

      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this6.store(true);

          var request = store.clear();

          request.onsuccess = function () {
            resolve();
          };

          request.onerror = function (e) {
            reject(e);
          };
        });
      });
    }
  }, {
    key: "keys",
    value: function keys() {
      var _this7 = this;

      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this7.store();

          if (store.getAllKeys) {
            var request = store.getAllKeys();

            request.onsuccess = function () {
              resolve(request.result);
            };

            request.onerror = function () {
              reject();
            };
          } else {
            try {
              var _request = store.openCursor();

              var keys = [];

              _request.onsuccess = function () {
                var cursor = _request.result;

                if (!cursor) {
                  resolve(keys);
                  return;
                }

                keys.push(cursor.key);
                cursor.continue();
              };
            } catch (e) {
              reject(e);
            }
          }
        });
      });
    }
  }]);
  return IDB;
}(Storage);

var Persistent = Storage;

if (window.indexedDB) {
  Persistent = IDB;
}

var Persistent$1 = Persistent;

/**
 * please don't change the order of items in this array.
 */

var LocalCache =
/*#__PURE__*/
function () {
  function LocalCache(name) {
    _classCallCheck(this, LocalCache);

    if (!name) {
      throw new TypeError('Expect a name for your storage');
    }

    this.page = new Memory(name);
    this.session = new SessionStorage(name);
    this.persistent = new Persistent$1(name);
    this.clean();
  }

  _createClass(LocalCache, [{
    key: "set",
    value: function set(key, data, options) {
      var _this = this;

      var steps = [];

      var _loop = function _loop(mode) {
        if (!options[mode]) return "continue";
        var opts = options[mode];
        if (opts === false) return "continue";

        if (!isObject$2(opts)) {
          opts = {};
        }

        if (!isUndefined(options.type)) {
          opts.type = options.type;
        }

        if (!isUndefined(options.extra)) {
          opts.extra = options.extra;
        }

        if (!isUndefined(options.mime)) {
          opts.mime = options.mime;
        }

        steps.push(function () {
          return _this[mode].set(key, data, opts);
        });
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = LocalCache.STORAGES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var mode = _step.value;

          var _ret = _loop(mode);

          if (_ret === "continue") continue;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!steps.length) {
        throw new TypeError("You must specify at least one storage mode in [".concat(LocalCache.STORAGES.join(', '), "]"));
      }

      return Sequence.all(steps).then(function () {
        return data;
      });
    }
  }, {
    key: "get",
    value: function get(key, modes) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      modes || (modes = LocalCache.STORAGES);
      var steps = [];

      var _loop2 = function _loop2(mode) {
        if (!_this2[mode]) {
          throw new TypeError("Unexcepted storage mode \"".concat(mode, "\", excepted one of: ").concat(LocalCache.STORAGES.join(', ')));
        }

        steps.push(function () {
          return _this2[mode].get(key, options);
        });
      };

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = modes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var mode = _step2.value;

          _loop2(mode);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return Sequence.any(steps).then(function (results) {
        return results[results.length - 1].value;
      });
    }
  }, {
    key: "delete",
    value: function _delete(key, modes) {
      var _this3 = this;

      modes || (modes = LocalCache.STORAGES);
      var steps = [];

      var _loop3 = function _loop3(mode) {
        if (!_this3[mode]) {
          throw new TypeError("Unexcepted mode \"".concat(mode, "\", excepted one of: ").concat(LocalCache.STORAGES.join(', ')));
        }

        steps.push(function () {
          return _this3[mode].delete(key);
        });
      };

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = modes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var mode = _step3.value;

          _loop3(mode);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return Sequence.all(steps);
    }
  }, {
    key: "clear",
    value: function clear(modes) {
      var _this4 = this;

      modes || (modes = LocalCache.STORAGES);
      var steps = [];

      var _loop4 = function _loop4(mode) {
        if (!_this4[mode]) {
          throw new TypeError("Unexcepted mode \"".concat(mode, "\", excepted one of: ").concat(LocalCache.STORAGES.join(', ')));
        }

        steps.push(function () {
          return _this4[mode].clear();
        });
      };

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = modes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var mode = _step4.value;

          _loop4(mode);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return Sequence.all(steps);
    }
  }, {
    key: "clean",
    value: function clean() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var check = function check(data, key) {
        var remove = false;
        var priority = options.priority,
            length = options.length,
            ctime = options.ctime,
            type = options.type;

        if (!isUndefined(priority)) {
          if (data.priority < priority) {
            remove = true;
          }
        }

        if (!remove && !isUndefined(length)) {
          var content = data.data;

          if (isNumber(length)) {
            if (content.length >= length) {
              remove = true;
            }
          } else if (Array.isArray(length)) {
            if (content.length >= length[0] && content.length <= length[1]) {
              remove = true;
            }
          }
        }

        if (!remove && !isUndefined(ctime)) {
          if (isDate(ctime) || isNumber(ctime)) {
            if (data.ctime < +ctime) {
              remove = true;
            }
          } else if (Array.isArray(ctime)) {
            if (data.ctime > ctime[0] && data.ctime < ctime[1]) {
              remove = true;
            }
          }
        }

        if (!remove) {
          if (Array.isArray(type)) {
            if (type.indexOf(data.type) > -1) {
              remove = true;
            }
          } else if (type == data.type) {
            remove = true;
          }
        }

        if (!remove && isFunction(options.remove)) {
          if (options.remove(data, key) === true) {
            remove = true;
          }
        }

        return remove;
      };

      var steps = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = LocalCache.STORAGES[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _mode = _step5.value;
          steps.push(this[_mode].clean(check));
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return Promise.all(steps);
    }
  }]);
  return LocalCache;
}();

LocalCache.STORAGES = ['page', 'session', 'persistent'];

var localcache = new LocalCache('BIU-REQUEST-VERSION-1.0.0');

function set(key, data, options) {
  var url = new URL(key);
  url.searchParams.sort();
  localcache.set(url.toString(), data, options);
}

function get(key) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var url = new URL(key);
  url.searchParams.sort();
  var storages = options.storages || LocalCache.STORAGES;
  url = url.toString();
  return localcache.get(url, storages, options.get).then(function (result) {
    var response = new Response({
      url: url,
      body: result.data,
      status: 200,
      statusText: 'From LocalCache',
      headers: {
        'Content-Type': result.mime
      }
    });
    return response;
  });
}

var localcache$1 = {
  localcache: localcache,
  set: set,
  get: get
};

function resJSON(response) {
  return response.headers['Content-Type'] === 'application/json';
}

function request(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (options.auth) {
    if (!options.headers) {
      options.headers = {};
    }

    var username = options.auth.username || '';
    var password = options.auth.password || '';
    options.headers.Authorization = 'Basic ' + btoa(username + ':' + password);
  }

  return ajax(url, options).then(function (response) {
    var status = response.status;

    if (status < 200 && status >= 300) {
      throw response;
    }

    if (options.fullResponse) {
      return response;
    }

    if (options.rawBody) {
      return response.body;
    }

    if (resJSON(response) || options.type === 'json') {
      return response.json();
    }

    return response.body;
  });
}

function get$1(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options = options,
      _options$cache = _options.cache,
      cache = _options$cache === void 0 ? false : _options$cache,
      _options$fullResponse = _options.fullResponse,
      fullResponse = _options$fullResponse === void 0 ? false : _options$fullResponse,
      _options$rawBody = _options.rawBody,
      rawBody = _options$rawBody === void 0 ? false : _options$rawBody;
  options = Object.assign({}, options, {
    method: 'GET'
  });
  url = new URL$1(url, location.href);
  mergeParams(url.searchParams, options.params);
  options.params = {};

  if (cache === false) {
    options.params['_' + +new Date()] = '_';
  }

  if (!options.localcache) {
    return request(url, options);
  }

  var _options$localcache$s = options.localcache.set,
      set = _options$localcache$s === void 0 ? false : _options$localcache$s;
  return localcache$1.get(url, options.localcache).catch(function () {
    if (!set) {
      return request(url, options);
    }

    options.fullResponse = true;
    return request(url, options).then(function (response) {
      var isJSON = resJSON(response) || options.type === 'json';

      if (isJSON && !set.mime) {
        set.mime = 'application/json';
      }

      localcache$1.set(url.toString(), response.body, set);

      if (fullResponse) {
        return response;
      }

      if (rawBody) {
        return response.body;
      }

      if (isJSON) {
        return response.json();
      }

      return response.body;
    });
  });
}

function post(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options.method = 'POST';
  var _options$contentType = options.contentType,
      contentType = _options$contentType === void 0 ? true : _options$contentType;

  if (!options.headers) {
    options.headers = {};
  }

  if (contentType && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  }

  return request(url, options);
}

var index = {
  request: request,
  get: get$1,
  post: post,
  ajax: ajax,
  jsonp: jsonp
};

return index;

})));

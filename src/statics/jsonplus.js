var UID_LENGTH          = 16;
var UID                 = generateUID();
var PLACE_HOLDER_REGEXP = new RegExp('(\\\\)?"@__(F|R|D|M|S|A|U|I|B|L)-' + UID + '-(\\d+)__@"', 'g');

var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
var IS_PURE_FUNCTION = /function.*?\(/;
var IS_ARROW_FUNCTION = /.*?=>.*?/;
var UNSAFE_CHARS_REGEXP   = /[<>\/\u2028\u2029]/g;

var RESERVED_SYMBOLS = ['*', 'async'];

var ESCAPED_CHARS = {
    '<'     : '\\u003C',
    '>'     : '\\u003E',
    '/'     : '\\u002F',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};

function escapeUnsafeChars(unsafeChar) {
    return ESCAPED_CHARS[unsafeChar];
}

//生成随机字符串
function generateUID() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'.split(''),
        stringLength = UID_LENGTH,
        result = '';
    while (stringLength-- > 0) {
        result += chars[(chars.length * Math.random()) << 0];
    }
    return result;
}

function deleteFunctions(obj){
    var functionKeys = [];
    for (var key in obj) {
        if (typeof obj[key] === "function") {
            functionKeys.push(key);
        }
    }
    for (var i = 0; i < functionKeys.length; i++) {
        delete obj[functionKeys[i]];
    }
}

function serialize(obj, options) {
    options || (options = {});

    if (typeof options === 'number' || typeof options === 'string') {
        options = {space: options};
    }

    var functions = [];
    var regexps   = [];
    var dates     = [];
    var maps      = [];
    var sets      = [];
    var arrays    = [];
    var undefs    = [];
    var infinities= [];
    var bigInts = [];
    var urls = [];

    function replacer(key, value) {
        if(options.ignoreFunction){
            deleteFunctions(value);
        }

        if (!value && value !== undefined && value !== BigInt(0)) {
            return value;
        }

        var origValue = this[key];
        var type = typeof origValue;

        if (type === 'object') {
            if(origValue instanceof RegExp) {
                return '@__R-' + UID + '-' + (regexps.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Date) {
                return '@__D-' + UID + '-' + (dates.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Map) {
                return '@__M-' + UID + '-' + (maps.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Set) {
                return '@__S-' + UID + '-' + (sets.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Array) {
                var isSparse = origValue.filter(function(){return true}).length !== origValue.length;
                if (isSparse) {
                    return '@__A-' + UID + '-' + (arrays.push(origValue) - 1) + '__@';
                }
            }

            if(origValue instanceof URL) {
                return '@__L-' + UID + '-' + (urls.push(origValue) - 1) + '__@';
            }
        }

        if (type === 'function') {
            return '@__F-' + UID + '-' + (functions.push(origValue) - 1) + '__@';
        }

        if (type === 'undefined') {
            return '@__U-' + UID + '-' + (undefs.push(origValue) - 1) + '__@';
        }

        if (type === 'number' && !isNaN(origValue) && !isFinite(origValue)) {
            return '@__I-' + UID + '-' + (infinities.push(origValue) - 1) + '__@';
        }

        if (type === 'bigint') {
            return '@__B-' + UID + '-' + (bigInts.push(origValue) - 1) + '__@';
        }

        return value;
    }

    function serializeFunc(fn) {
      var serializedFn = fn.toString();
      if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
          throw new TypeError('Serializing native function: ' + fn.name);
      }

      if(IS_PURE_FUNCTION.test(serializedFn)) {
          return serializedFn;
      }

      if(IS_ARROW_FUNCTION.test(serializedFn)) {
          return serializedFn;
      }

      var argsStartsAt = serializedFn.indexOf('(');
      var def = serializedFn.substr(0, argsStartsAt)
        .trim()
        .split(' ')
        .filter(function(val) { return val.length > 0 });

      var nonReservedSymbols = def.filter(function(val) {
        return RESERVED_SYMBOLS.indexOf(val) === -1
      });

      if(nonReservedSymbols.length > 0) {
          return (def.indexOf('async') > -1 ? 'async ' : '') + 'function'
            + (def.join('').indexOf('*') > -1 ? '*' : '')
            + serializedFn.substr(argsStartsAt);
      }

      return serializedFn;
    }

    if (options.ignoreFunction && typeof obj === "function") {
        obj = undefined;
    }
    if (obj === undefined) {
        return String(obj);
    }

    var str;

    if (options.isJSON && !options.space) {
        str = JSON_stringify(obj);
    } else {
        str = JSON_stringify(obj, options.isJSON ? null : replacer, options.space);
    }

    if (typeof str !== 'string') {
        return String(str);
    }

    if (options.unsafe !== true) {
        str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
    }

    if (functions.length === 0 && regexps.length === 0 && dates.length === 0 && maps.length === 0 && sets.length === 0 && arrays.length === 0 && undefs.length === 0 && infinities.length === 0 && bigInts.length === 0 && urls.length === 0) {
        return str;
    }

    return str.replace(PLACE_HOLDER_REGEXP, function (match, backSlash, type, valueIndex) {
        if (backSlash) {
            return match;
        }

        if (type === 'D') {
            return "new Date(\"" + dates[valueIndex].toISOString() + "\")";
        }

        if (type === 'R') {
            return "new RegExp(" + serialize(regexps[valueIndex].source) + ", \"" + regexps[valueIndex].flags + "\")";
        }

        if (type === 'M') {
            return "new Map(" + serialize(Array.from(maps[valueIndex].entries()), options) + ")";
        }

        if (type === 'S') {
            return "new Set(" + serialize(Array.from(sets[valueIndex].values()), options) + ")";
        }

        if (type === 'A') {
            return "Array.prototype.slice.call(" + serialize(Object.assign({ length: arrays[valueIndex].length }, arrays[valueIndex]), options) + ")";
        }

        if (type === 'U') {
            return 'undefined'
        }

        if (type === 'I') {
            return infinities[valueIndex];
        }

        if (type === 'B') {
            return "BigInt(\"" + bigInts[valueIndex] + "\")";
        }

        if (type === 'L') {
            return "new URL(\"" + urls[valueIndex].toString() + "\")"; 
        }

        var fn = functions[valueIndex];

        return serializeFunc(fn);
    });
}


const JSON_stringify = JSON.stringify
const JSON_parse = JSON.parse

JSON.parse = (json, reviver) => {
    if(!json) return null
    const obj = JSON_parse(json)
    return JSON_parse(json, (k,v) => {
        if(!v){ return v }
        if(typeof v !== 'string'){ return v }
        if(v.startsWith('@FUNCTION:')){
          const function_string = v.substring(10)
          if(function_string.startsWith('(')){
            try { return eval(function_string) } catch (error) { console.log(error) }
          }else if(function_string.startsWith(k)){
            let arg = function_string.substring(k.length, function_string.indexOf(")"))
            arg = arg.substring(arg.indexOf('(')  + 1).split(',')
            try { 
              const func = new Function(arg, function_string.substring(function_string.indexOf("{")))
              func.bind(obj)
              return func
            } catch (error) { console.log(error) }
          }
        }
        return reviver ? reviver(k, v) : v
    })
}

JSON.stringify = (obj, replacer, space) =>{
    if(!obj) return null
    return JSON_stringify(obj, (key, val) => {
        if (typeof val === 'function') { return '@FUNCTION:' + val.toString() }
        return replacer ? replacer(key, val) : val
    }, space)
}

JSON.encode = (obj) => {
    if(!obj) return null
    const json = JSON_stringify(obj, (key, val) => {
        if (typeof val === 'function') {
          return '@FUNCTION:' + val.toString()
        }
        return val
    })
    return JSON_parse(json)
}
JSON.decode = (obj) => {
    if(!obj) return null
    const str = JSON_stringify(obj)
    return JSON_parse(str, (k,v) => {
      if(!v){ return v }
      if(typeof v !== 'string'){ return v }
      if(v.startsWith('@FUNCTION:')){
        const function_string = v.substring(10)
        if(function_string.startsWith('(')){
          try { return eval(function_string) } catch (error) { console.log(error) }
        }else if(function_string.startsWith(k)){
          let arg = function_string.substring(k.length, function_string.indexOf(")"))
          arg = arg.substring(arg.indexOf('(')  + 1).split(',')
          try { 
            const func = new Function(arg, function_string.substring(function_string.indexOf("{")))
            func.bind(obj)
            return func
          } catch (error) { console.log(error) }
        }
      }
      return v
    })
}
JSON.serialize = serialize
JSON.executeCode = (code) => {
    if(!code){ return }
    if(code.trim().startsWith('module.exports')){
        code = code.replace(/^.*\n/, "");
    }
    return new Function('return (' + code + ')')()
}
JSON.toCode = (obj) => serialize(obj, { space: 2 })

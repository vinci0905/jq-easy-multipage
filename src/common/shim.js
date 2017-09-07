/*
vinci
require:html5-tag,es5-safe,json2
*/

;(function(){
	if((typeof document.createElement('canvas').getContext) === 'undefined') {
		var e = "abbr, article, aside, audio, canvas, datalist, details, dialog, eventsource, figure, footer, header, hgroup, m, mark, menu, meter, nav, output, progress, section, time, video".split(', ');
		var i= e.length;
		while (i--){
			document.createElement(e[i]);
		}
	}
}());

(function() {

  // es5-safe
  // ----------------
  // Provides compatibility shims so that legacy JavaScript engines behave as
  // closely as possible to ES5.
  //
  // Thanks to:
  //  - http://es5.github.com/
  //  - http://kangax.github.com/es5-compat-table/
  //  - https://github.com/kriskowal/es5-shim
  //  - http://perfectionkills.com/extending-built-in-native-objects-evil-or-not/
  //  - https://gist.github.com/1120592
  //  - https://code.google.com/p/v8/


  var OP = Object.prototype;
  var AP = Array.prototype;
  var FP = Function.prototype;
  var SP = String.prototype;
  var hasOwnProperty = OP.hasOwnProperty;
  var slice = AP.slice;


  /*---------------------------------------*
   * Function
   *---------------------------------------*/

  // ES-5 15.3.4.5
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
  FP.bind || (FP.bind = function(that) {
	var target = this;

	// If IsCallable(func) is false, throw a TypeError exception.
	if (typeof target !== 'function') {
	  throw new TypeError('Bind must be called on a function');
	}

	var boundArgs = slice.call(arguments, 1);

	function bound() {
	  // Called as a constructor.
	  if (this instanceof bound) {
		var self = createObject(target.prototype);
		var result = target.apply(
			self,
			boundArgs.concat(slice.call(arguments))
		);
		return Object(result) === result ? result : self;
	  }
	  // Called as a function.
	  else {
		return target.apply(
			that,
			boundArgs.concat(slice.call(arguments))
		);
	  }
	}

	// NOTICE: The function.length is not writable.
	//bound.length = Math.max(target.length - boundArgs.length, 0);

	return bound;
  });


  // Helpers
  function createObject(proto) {
	var o;

	if (Object.create) {
	  o = Object.create(proto);
	}
	else {
	  /** @constructor */
	  function F() {
	  }

	  F.prototype = proto;
	  o = new F();
	}

	return o;
  }


  /*---------------------------------------*
   * Object
   *---------------------------------------*/
  // http://ejohn.org/blog/ecmascript-5-objects-and-properties/

  // ES5 15.2.3.14
  // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
  // https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
  // http://msdn.microsoft.com/en-us/library/adebfyya(v=vs.94).aspx
  Object.keys || (Object.keys = (function() {
	var hasDontEnumBug = !{toString: ''}.propertyIsEnumerable('toString');
	var DontEnums = [
	  'toString',
	  'toLocaleString',
	  'valueOf',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'constructor'
	];
	var DontEnumsLength = DontEnums.length;

	return function(o) {
	  if (o !== Object(o)) {
		throw new TypeError(o + ' is not an object');
	  }

	  var result = [];

	  for (var name in o) {
		if (hasOwnProperty.call(o, name)) {
		  result.push(name);
		}
	  }

	  if (hasDontEnumBug) {
		for (var i = 0; i < DontEnumsLength; i++) {
		  if (hasOwnProperty.call(o, DontEnums[i])) {
			result.push(DontEnums[i]);
		  }
		}
	  }

	  return result;
	};

  })());


  /*---------------------------------------*
   * Array
   *---------------------------------------*/
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array
  // https://github.com/kangax/fabric.js/blob/gh-pages/src/util/lang_array.js

  // ES5 15.4.3.2
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
  Array.isArray || (Array.isArray = function(obj) {
	return OP.toString.call(obj) === '[object Array]';
  });


  // ES5 15.4.4.18
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
  AP.forEach || (AP.forEach = function(fn, context) {
	for (var i = 0, len = this.length >>> 0; i < len; i++) {
	  if (i in this) {
		fn.call(context, this[i], i, this);
	  }
	}
  });


  // ES5 15.4.4.19
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
  AP.map || (AP.map = function(fn, context) {
	var len = this.length >>> 0;
	var result = new Array(len);

	for (var i = 0; i < len; i++) {
	  if (i in this) {
		result[i] = fn.call(context, this[i], i, this);
	  }
	}

	return result;
  });


  // ES5 15.4.4.20
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
  AP.filter || (AP.filter = function(fn, context) {
	var result = [], val;

	for (var i = 0, len = this.length >>> 0; i < len; i++) {
	  if (i in this) {
		val = this[i]; // in case fn mutates this
		if (fn.call(context, val, i, this)) {
		  result.push(val);
		}
	  }
	}

	return result;
  });


  // ES5 15.4.4.16
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/every
  AP.every || (AP.every = function(fn, context) {
	for (var i = 0, len = this.length >>> 0; i < len; i++) {
	  if (i in this && !fn.call(context, this[i], i, this)) {
		return false;
	  }
	}
	return true;
  });


  // ES5 15.4.4.17
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/some
  AP.some || (AP.some = function(fn, context) {
	for (var i = 0, len = this.length >>> 0; i < len; i++) {
	  if (i in this && fn.call(context, this[i], i, this)) {
		return true;
	  }
	}
	return false;
  });


  // ES5 15.4.4.21
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
  AP.reduce || (AP.reduce = function(fn /*, initial*/) {
	if (typeof fn !== 'function') {
	  throw new TypeError(fn + ' is not an function');
	}

	var len = this.length >>> 0, i = 0, result;

	if (arguments.length > 1) {
	  result = arguments[1];
	}
	else {
	  do {
		if (i in this) {
		  result = this[i++];
		  break;
		}
		// if array contains no values, no initial value to return
		if (++i >= len) {
		  throw new TypeError('reduce of empty array with on initial value');
		}
	  }
	  while (true);
	}

	for (; i < len; i++) {
	  if (i in this) {
		result = fn.call(null, result, this[i], i, this);
	  }
	}

	return result;
  });


  // ES5 15.4.4.22
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
  AP.reduceRight || (AP.reduceRight = function(fn /*, initial*/) {
	if (typeof fn !== 'function') {
	  throw new TypeError(fn + ' is not an function');
	}

	var len = this.length >>> 0, i = len - 1, result;

	if (arguments.length > 1) {
	  result = arguments[1];
	}
	else {
	  do {
		if (i in this) {
		  result = this[i--];
		  break;
		}
		// if array contains no values, no initial value to return
		if (--i < 0)
		  throw new TypeError('reduce of empty array with on initial value');
	  }
	  while (true);
	}

	for (; i >= 0; i--) {
	  if (i in this) {
		result = fn.call(null, result, this[i], i, this);
	  }
	}

	return result;
  });


  // ES5 15.4.4.14
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/indexOf
  AP.indexOf || (AP.indexOf = function(value, from) {
	var len = this.length >>> 0;

	from = Number(from) || 0;
	from = Math[from < 0 ? 'ceil' : 'floor'](from);
	if (from < 0) {
	  from = Math.max(from + len, 0);
	}

	for (; from < len; from++) {
	  if (from in this && this[from] === value) {
		return from;
	  }
	}

	return -1;
  });


  // ES5 15.4.4.15
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/indexOf
  AP.lastIndexOf || (AP.lastIndexOf = function(value, from) {
	var len = this.length >>> 0;

	from = Number(from) || len - 1;
	from = Math[from < 0 ? 'ceil' : 'floor'](from);
	if (from < 0) {
	  from += len;
	}
	from = Math.min(from, len - 1);

	for (; from >= 0; from--) {
	  if (from in this && this[from] === value) {
		return from;
	  }
	}

	return -1;
  });


  /*---------------------------------------*
   * String
   *---------------------------------------*/

  // ES5 15.5.4.20
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/trim
  // http://blog.stevenlevithan.com/archives/faster-trim-javascript
  // http://jsperf.com/mega-trim-test
  SP.trim || (SP.trim = (function() {

	// http://perfectionkills.com/whitespace-deviations/
	var whiteSpaces = [

	  '\\s',
	  //'0009', // 'HORIZONTAL TAB'
	  //'000A', // 'LINE FEED OR NEW LINE'
	  //'000B', // 'VERTICAL TAB'
	  //'000C', // 'FORM FEED'
	  //'000D', // 'CARRIAGE RETURN'
	  //'0020', // 'SPACE'

	  '00A0', // 'NO-BREAK SPACE'
	  '1680', // 'OGHAM SPACE MARK'
	  '180E', // 'MONGOLIAN VOWEL SEPARATOR'

	  '2000-\\u200A',
	  //'2000', // 'EN QUAD'
	  //'2001', // 'EM QUAD'
	  //'2002', // 'EN SPACE'
	  //'2003', // 'EM SPACE'
	  //'2004', // 'THREE-PER-EM SPACE'
	  //'2005', // 'FOUR-PER-EM SPACE'
	  //'2006', // 'SIX-PER-EM SPACE'
	  //'2007', // 'FIGURE SPACE'
	  //'2008', // 'PUNCTUATION SPACE'
	  //'2009', // 'THIN SPACE'
	  //'200A', // 'HAIR SPACE'

	  '200B', // 'ZERO WIDTH SPACE (category Cf)
	  '2028', // 'LINE SEPARATOR'
	  '2029', // 'PARAGRAPH SEPARATOR'
	  '202F', // 'NARROW NO-BREAK SPACE'
	  '205F', // 'MEDIUM MATHEMATICAL SPACE'
	  '3000' //  'IDEOGRAPHIC SPACE'

	].join('\\u');

	var trimLeftReg = new RegExp('^[' + whiteSpaces + ']+');
	var trimRightReg = new RegExp('[' + whiteSpaces + ']+$');

	return function() {
	  return String(this).replace(trimLeftReg, '').replace(trimRightReg, '');
	}

  })());


  /*---------------------------------------*
   * Date
   *---------------------------------------*/

  // ES5 15.9.4.4
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now
  Date.now || (Date.now = function() {
	return +new Date;
  });

})();

/*
	json2.js
	2011-10-19

	Public Domain.

	NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

	See http://www.JSON.org/js.html


	This code should be minified before deployment.
	See http://javascript.crockford.com/jsmin.html

	USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	NOT CONTROL.


	This file creates a global JSON object containing two methods: stringify
	and parse.

		JSON.stringify(value, replacer, space)
			value       any JavaScript value, usually an object or array.

			replacer    an optional parameter that determines how object
						values are stringified for objects. It can be a
						function or an array of strings.

			space       an optional parameter that specifies the indentation
						of nested structures. If it is omitted, the text will
						be packed without extra whitespace. If it is a number,
						it will specify the number of spaces to indent at each
						level. If it is a string (such as '\t' or '&nbsp;'),
						it contains the characters used to indent at each level.

			This method produces a JSON text from a JavaScript value.

			When an object value is found, if the object contains a toJSON
			method, its toJSON method will be called and the result will be
			stringified. A toJSON method does not serialize: it returns the
			value represented by the name/value pair that should be serialized,
			or undefined if nothing should be serialized. The toJSON method
			will be passed the key associated with the value, and this will be
			bound to the value

			For example, this would serialize Dates as ISO strings.

				Date.prototype.toJSON = function (key) {
					function f(n) {
						// Format integers to have at least two digits.
						return n < 10 ? '0' + n : n;
					}

					return this.getUTCFullYear()   + '-' +
						 f(this.getUTCMonth() + 1) + '-' +
						 f(this.getUTCDate())      + 'T' +
						 f(this.getUTCHours())     + ':' +
						 f(this.getUTCMinutes())   + ':' +
						 f(this.getUTCSeconds())   + 'Z';
				};

			You can provide an optional replacer method. It will be passed the
			key and value of each member, with this bound to the containing
			object. The value that is returned from your method will be
			serialized. If your method returns undefined, then the member will
			be excluded from the serialization.

			If the replacer parameter is an array of strings, then it will be
			used to select the members to be serialized. It filters the results
			such that only members with keys listed in the replacer array are
			stringified.

			Values that do not have JSON representations, such as undefined or
			functions, will not be serialized. Such values in objects will be
			dropped; in arrays they will be replaced with null. You can use
			a replacer function to replace those with JSON values.
			JSON.stringify(undefined) returns undefined.

			The optional space parameter produces a stringification of the
			value that is filled with line breaks and indentation to make it
			easier to read.

			If the space parameter is a non-empty string, then that string will
			be used for indentation. If the space parameter is a number, then
			the indentation will be that many spaces.

			Example:

			text = JSON.stringify(['e', {pluribus: 'unum'}]);
			// text is '["e",{"pluribus":"unum"}]'


			text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
			// text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

			text = JSON.stringify([new Date()], function (key, value) {
				return this[key] instanceof Date ?
					'Date(' + this[key] + ')' : value;
			});
			// text is '["Date(---current time---)"]'


		JSON.parse(text, reviver)
			This method parses a JSON text to produce an object or array.
			It can throw a SyntaxError exception.

			The optional reviver parameter is a function that can filter and
			transform the results. It receives each of the keys and values,
			and its return value is used instead of the original value.
			If it returns what it received, then the structure is not modified.
			If it returns undefined then the member is deleted.

			Example:

			// Parse the text. Values that look like ISO date strings will
			// be converted to Date objects.

			myData = JSON.parse(text, function (key, value) {
				var a;
				if (typeof value === 'string') {
					a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
					if (a) {
						return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
							+a[5], +a[6]));
					}
				}
				return value;
			});

			myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
				var d;
				if (typeof value === 'string' &&
						value.slice(0, 5) === 'Date(' &&
						value.slice(-1) === ')') {
					d = new Date(value.slice(5, -1));
					if (d) {
						return d;
					}
				}
				return value;
			});


	This is a reference implementation. You are free to copy, modify, or
	redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
	call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
	getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
	lastIndex, length, parse, prototype, push, replace, slice, stringify,
	test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
	JSON = {};
}

(function () {
	'use strict';

	function f(n) {
		// Format integers to have at least two digits.
		return n < 10 ? '0' + n : n;
	}

	if (typeof Date.prototype.toJSON !== 'function') {

		Date.prototype.toJSON = function (key) {

			return isFinite(this.valueOf())
				? this.getUTCFullYear()     + '-' +
					f(this.getUTCMonth() + 1) + '-' +
					f(this.getUTCDate())      + 'T' +
					f(this.getUTCHours())     + ':' +
					f(this.getUTCMinutes())   + ':' +
					f(this.getUTCSeconds())   + 'Z'
				: null;
		};

		String.prototype.toJSON      =
			Number.prototype.toJSON  =
			Boolean.prototype.toJSON = function (key) {
				return this.valueOf();
			};
	}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap,
		indent,
		meta = {    // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		rep;


	function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string'
				? c
				: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}


	function str(key, holder) {

// Produce a string from holder[key].

		var i,          // The loop counter.
			k,          // The member key.
			v,          // The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

		if (value && typeof value === 'object' &&
				typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

// What happens next depends on the value's type.

		switch (typeof value) {
		case 'string':
			return quote(value);

		case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

			return isFinite(value) ? String(value) : 'null';

		case 'boolean':
		case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

			return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

		case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

			if (!value) {
				return 'null';
			}

// Make an array to hold the partial results of stringifying this object value.

			gap += indent;
			partial = [];

// Is the value an array?

			if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || 'null';
				}

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

				v = partial.length === 0
					? '[]'
					: gap
					? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
					: '[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}

// If the replacer is an array, use it to select the members to be stringified.

			if (rep && typeof rep === 'object') {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					if (typeof rep[i] === 'string') {
						k = rep[i];
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			} else {

// Otherwise, iterate through all of the keys in the object.

				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			}

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

			v = partial.length === 0
				? '{}'
				: gap
				? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
				: '{' + partial.join(',') + '}';
			gap = mind;
			return v;
		}
	}

// If the JSON object does not yet have a stringify method, give it one.

	if (typeof JSON.stringify !== 'function') {
		JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

			var i;
			gap = '';
			indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

// If the space parameter is a string, it will be used as the indent string.

			} else if (typeof space === 'string') {
				indent = space;
			}

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
					(typeof replacer !== 'object' ||
					typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

			return str('', {'': value});
		};
	}


// If the JSON object does not yet have a parse method, give it one.

	if (typeof JSON.parse !== 'function') {
		JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			if (/^[\],:{}\s]*$/
					.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
						.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
						.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

				j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

				return typeof reviver === 'function'
					? walk({'': j}, '')
					: j;
			}

// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
		};
	}
}());
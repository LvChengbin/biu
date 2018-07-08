(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.biu = factory());
}(this, (function () { 'use strict';

/**
 * async function
 *
 * @syntax: 
 *  async function() {}
 *  async () => {}
 *  async x() => {}
 *
 * @compatibility
 * IE: no
 * Edge: >= 15
 * Android: >= 5.0
 *
 */

function asyncFunction (fn) { return ( {} ).toString.call( fn ) === '[object AsyncFunction]'; }

function isFunction (fn) { return ({}).toString.call( fn ) === '[object Function]' || asyncFunction( fn ); }

function isPromise (p) { return p && isFunction( p.then ); }

var Promise$1 = (function () {
    function Promise( fn ) {
        if( !( this instanceof Promise ) ) {
            throw new TypeError( this + ' is not a promise ' );
        }

        if( !isFunction( fn ) ) {
            throw new TypeError( 'Promise resolver ' + fn + ' is not a function' );
        }

        this[ '[[PromiseStatus]]' ] = 'pending';
        this[ '[[PromiseValue]]' ]= null;
        this[ '[[PromiseThenables]]' ] = [];
        try {
            fn( promiseResolve.bind( null, this ), promiseReject.bind( null, this ) );
        } catch( e ) {
            if( this[ '[[PromiseStatus]]' ] === 'pending' ) {
                promiseReject.bind( null, this )( e );
            }
        }
    }

    Promise.prototype.then = function then ( resolved, rejected ) {
        var promise = new Promise( function () {} );
        this[ '[[PromiseThenables]]' ].push( {
            resolve : isFunction( resolved ) ? resolved : null,
            reject : isFunction( rejected ) ? rejected : null,
            called : false,
            promise: promise
        } );
        if( this[ '[[PromiseStatus]]' ] !== 'pending' ) { promiseExecute( this ); }
        return promise;
    };

    Promise.prototype.catch = function catch$1 ( reject ) {
        return this.then( null, reject );
    };

    return Promise;
}());

Promise$1.resolve = function( value ) {
    if( !isFunction( this ) ) {
        throw new TypeError( 'Promise.resolve is not a constructor' );
    }
    /**
     * @todo
     * check if the value need to return the resolve( value )
     */
    return new Promise$1( function (resolve) {
        resolve( value );
    } );
};

Promise$1.reject = function( reason ) {
    if( !isFunction( this ) ) {
        throw new TypeError( 'Promise.reject is not a constructor' );
    }
    return new Promise$1( function ( resolve, reject ) {
        reject( reason );
    } );
};

Promise$1.all = function( promises ) {
    var rejected = false;
    var res = [];
    return new Promise$1( function ( resolve, reject ) {
        var remaining = 0;
        var then = function ( p, i ) {
            if( !isPromise( p ) ) {
                p = Promise$1.resolve( p );
            }
            p.then( function (value) {
                res[ i ] = value;
                setTimeout( function () {
                    if( --remaining === 0 ) { resolve( res ); }
                }, 0 );
            }, function (reason) {
                if( !rejected ) {
                    reject( reason );
                    rejected = true;
                }
            } );
        };

        var i = 0;
        for( var i$1 = 0, list = promises; i$1 < list.length; i$1 += 1 ) {
            var promise = list[i$1];

            remaining++;
            then( promise, i++ );
        }
        if( !i ) {
            resolve( res );
        }
    } );
};

Promise$1.race = function( promises ) {
    var resolved = false;
    var rejected = false;

    return new Promise$1( function ( resolve, reject ) {
        function onresolved( value ) {
            if( !resolved && !rejected ) {
                resolve( value );
                resolved = true;
            }
        }

        function onrejected( reason ) {
            if( !resolved && !rejected ) {
                reject( reason );
                rejected = true;
            }
        }

        for( var i = 0, list = promises; i < list.length; i += 1 ) {
            var promise = list[i];

            if( !isPromise( promise ) ) {
                promise = Promise$1.resolve( promise );
            }
            promise.then( onresolved, onrejected );
        }
    } );
};

function promiseExecute( promise ) {
    var thenable,
        p;

    if( promise[ '[[PromiseStatus]]' ] === 'pending' ) { return; }
    if( !promise[ '[[PromiseThenables]]' ].length ) { return; }

    var then = function ( p, t ) {
        p.then( function (value) {
            promiseResolve( t.promise, value );
        }, function (reason) {
            promiseReject( t.promise, reason );
        } );
    };

    while( promise[ '[[PromiseThenables]]' ].length ) {
        thenable = promise[ '[[PromiseThenables]]' ].shift();

        if( thenable.called ) { continue; }

        thenable.called = true;

        if( promise[ '[[PromiseStatus]]' ] === 'resolved' ) {
            if( !thenable.resolve ) {
                promiseResolve( thenable.promise, promise[ '[[PromiseValue]]' ] );
                continue;
            }
            try {
                p = thenable.resolve.call( null, promise[ '[[PromiseValue]]' ] );
            } catch( e ) {
                then( Promise$1.reject( e ), thenable );
                continue;
            }
            if( p && ( typeof p === 'function' || typeof p === 'object' ) && p.then ) {
                then( p, thenable );
                continue;
            }
        } else {
            if( !thenable.reject ) {
                promiseReject( thenable.promise, promise[ '[[PromiseValue]]' ] ); 
                continue;
            }
            try {
                p = thenable.reject.call( null, promise[ '[[PromiseValue]]' ] );
            } catch( e ) {
                then( Promise$1.reject( e ), thenable );
                continue;
            }
            if( ( typeof p === 'function' || typeof p === 'object' ) && p.then ) {
                then( p, thenable );
                continue;
            }
        }
        promiseResolve( thenable.promise, p );
    }
    return promise;
}

function promiseResolve( promise, value ) {
    if( !( promise instanceof Promise$1 ) ) {
        return new Promise$1( function (resolve) {
            resolve( value );
        } );
    }
    if( promise[ '[[PromiseStatus]]' ] !== 'pending' ) { return; }
    if( value === promise ) {
        /**
         * thie error should be thrown, defined ES6 standard
         * it would be thrown in Chrome but not in Firefox or Safari
         */
        throw new TypeError( 'Chaining cycle detected for promise #<Promise>' );
    }

    if( value !== null && ( typeof value === 'function' || typeof value === 'object' ) ) {
        var then;

        try {
            then = value.then;
        } catch( e ) {
            return promiseReject( promise, e );
        }

        if( typeof then === 'function' ) {
            then.call( value, 
                promiseResolve.bind( null, promise ),
                promiseReject.bind( null, promise )
            );
            return;
        }
    }
    promise[ '[[PromiseStatus]]' ] = 'resolved';
    promise[ '[[PromiseValue]]' ] = value;
    promiseExecute( promise );
}

function promiseReject( promise, value ) {
    if( !( promise instanceof Promise$1 ) ) {
        return new Promise$1( function ( resolve, reject ) {
            reject( value );
        } );
    }
    promise[ '[[PromiseStatus]]' ] = 'rejected';
    promise[ '[[PromiseValue]]' ] = value;
    promiseExecute( promise );
}

function isString (str) { return typeof str === 'string' || str instanceof String; }

function number ( n, strict ) {
    if ( strict === void 0 ) strict = false;

    if( ({}).toString.call( n ).toLowerCase() === '[object number]' ) {
        return true;
    }
    if( strict ) { return false; }
    return !isNaN( parseFloat( n ) ) && isFinite( n )  && !/\.$/.test( n );
}

function integer ( n, strict ) {
    if ( strict === void 0 ) strict = false;


    if( number( n, true ) ) { return n % 1 === 0; }

    if( strict ) { return false; }

    if( isString( n ) ) {
        if( n === '-0' ) { return true; }
        return n.indexOf( '.' ) < 0 && String( parseInt( n ) ) === n;
    }

    return false;
}

function isIPv4 (ip) {
    if( !isString( ip ) ) { return false; }
    var pieces = ip.split( '.' );
    if( pieces.length !== 4 ) { return false; }

    for( var i$1 = 0, list = pieces; i$1 < list.length; i$1 += 1 ) {
        var i = list[i$1];

        if( !integer( i ) ) { return false; }
        if( i < 0 || i > 255 ) { return false; }
    }
    return true;
}

/**
 * <user>:<password> can only be supported with FTP scheme on IE9/10/11
 */

function url (url) {
    if( !isString( url ) ) { return false; }

    if( !/^(https?|ftp):\/\//i.test( url ) ) { return false; }
    var a = document.createElement( 'a' );
    a.href = url;

    /**
     * In IE, sometimes a.protocol would be an unknown type
     * Getting a.protocol will throw Error: Invalid argument in IE
     */
    try {
        if( !isString( a.protocol ) ) { return false; }
    } catch( e ) {
        return false;
    }

    if( !/^(https?|ftp):/i.test( a.protocol ) ) { return false; }

    /**
     * In IE, invalid IP address could be a valid hostname
     */
    if( /^(\d+\.){3}\d+$/.test( a.hostname ) && !isIPv4( a.hostname ) ) { return false; }

    return true;
}

var decode = function (str) { return decodeURIComponent( String( str ).replace( /\+/g, ' ' ) ); };

var URLSearchParams = function URLSearchParams( init ) {
    var this$1 = this;

    this.dict = [];

    if( !init ) { return; }

    if( URLSearchParams.prototype.isPrototypeOf( init ) ) {
        return new URLSearchParams( init.toString() );
    }

    if( Array.isArray( init ) ) {
        throw new TypeError( 'Failed to construct "URLSearchParams": The provided value cannot be converted to a sequence.' );
    }

    if( typeof init === 'string' ) {
        if( init.charAt(0) === '?' ) {
            init = init.slice( 1 );
        }
        var pairs = init.split( /&+/ );
        for( var i = 0, list = pairs; i < list.length; i += 1 ) {
            var item = list[i];

            var index = item.indexOf( '=' );
            this$1.append(
                index > -1 ? item.slice( 0, index ) : item,
                index > -1 ? item.slice( index + 1 ) : ''
            );
        }
        return;
    }

    for( var attr in init ) {
        this$1.append( attr, init[ attr ] );
    }
};
URLSearchParams.prototype.append = function append ( name, value ) {
    this.dict.push( [ decode( name ), decode( value ) ] );
};
URLSearchParams.prototype.delete = function delete$1 ( name ) {
    var dict = this.dict;
    for( var i = 0, l = dict.length; i < l; i += 1 ) {
        if( dict[ i ][ 0 ] == name ) {
            dict.splice( i, 1 );
            i--; l--;
        }
    }
};
URLSearchParams.prototype.get = function get ( name ) {
        var this$1 = this;

    for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
        var item = list[i];

            if( item[ 0 ] == name ) {
            return item[ 1 ];
        }
    }
    return null;
};
URLSearchParams.prototype.getAll = function getAll ( name ) {
        var this$1 = this;

    var res = [];
    for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
        var item = list[i];

            if( item[ 0 ] == name ) {
            res.push( item[ 1 ] );
        }
    }
    return res;
};
URLSearchParams.prototype.has = function has ( name ) {
        var this$1 = this;

    for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
        var item = list[i];

            if( item[ 0 ] == name ) {
            return true;
        }
    }
    return false;
};
URLSearchParams.prototype.set = function set ( name, value ) {
        var this$1 = this;

    var set = false;
    for( var i = 0, l = this.dict.length; i < l; i += 1 ) {
        var item  = this$1.dict[ i ];
        if( item[ 0 ] == name ) {
            if( set ) {
                this$1.dict.splice( i, 1 );
                i--; l--;
            } else {
                item[ 1 ] = String( value );
                set = true;
            }
        }
    }
};
URLSearchParams.prototype.sort = function sort () {
    this.dict.sort( function ( a, b ) {
        var nameA = a[ 0 ].toLowerCase();
        var nameB = b[ 0 ].toLowerCase();
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1; }
        return 0;
    } );
};

URLSearchParams.prototype.entries = function entries () {
        var this$1 = this;


    var dict = [];

    for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
        var item = list[i];

            dict.push( [ item[ 0 ], item[ 1 ] ] );
    }
        
    return dict;
};

URLSearchParams.prototype.keys = function keys () {
        var this$1 = this;

    var keys = [];
    for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
       var item = list[i];

            keys.push( item[ 0 ] );
    }

    return keys;
};

URLSearchParams.prototype.values = function values () {
        var this$1 = this;

    var values = [];
    for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
       var item = list[i];

            values.push( item[ 1 ] );
    }

    return values;
};

URLSearchParams.prototype.toString = function toString () {
        var this$1 = this;

    var pairs = [];
    for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
        var item = list[i];

            pairs.push( encodeURIComponent( item[ 0 ] ) + '=' + encodeURIComponent( item[ 1 ] ) );
    }
    return pairs.join( '&' );
};

var g = typeof global === 'undefined' ? window : global;

var attrs = [
    'href', 'origin',
    'host', 'hash', 'hostname',  'pathname', 'port', 'protocol', 'search',
    'username', 'password', 'searchParams'
];

var URL$1 = function URL( path, base ) {
    var this$1 = this;

    if( g.URL && new g.URL( 'http://a.com' ).protocol ) {
        var url$$1 = new g.URL( path, base );
        if( !( 'searchParams' in url$$1 ) ) {
            url$$1.searchParams = new URLSearchParams( url$$1.search ); 
        }
        return url$$1;
    } else {

        if( URL.prototype.isPrototypeOf( path ) ) {
            return new URL( path.href );
        }

        if( URL.prototype.isPrototypeOf( base ) ) {
            return new URL( path, base.href );
        }

        path = String( path );

        if( base !== undefined ) {
            if( !url( base ) ) {
                throw new TypeError( 'Failed to construct "URL": Invalid base URL' );
            }
            if( /^[a-zA-Z][0-9a-zA-Z.-]*:/.test( path ) ) {
                base = null;
            }
        } else {
            if( !/^[a-zA-Z][0-9a-zA-Z.-]*:/.test( path ) ) {
                throw new TypeError( 'Failed to construct "URL": Invalid URL' );
            }
        }

        if( base ) {
            base = new URL( base );
            if( path.charAt( 0 ) === '/' && path.charAt( 1 ) === '/' ) {
                path = base.protocol + path;
            } else if( path.charAt( 0 ) === '/' ) {
                path = base.origin + path;
            } else {
                var pathname = base.pathname;
                    
                if( pathname.charAt( pathname.length - 1 ) === '/' ) {
                    path = base.origin + pathname + path;
                } else {
                    path = base.origin + pathname.replace( /\/[^/]+\/?$/, '' ) + '/' + path;
                }
            }
        }

        var dotdot = /([^/])\/[^/]+\/\.\.\//;
        var dot = /\/\.\//g;

        path = path.replace( dot, '/' );

        while( path.match( dotdot ) ) {
            path = path.replace( dotdot, '$1/' );
        }

        var node = document.createElement( 'a' );
        node.href = path;

        for( var i = 0, list = attrs; i < list.length; i += 1 ) {
            var attr = list[i];

            this$1[ attr ] = attr in node ? node[ attr ] : '';
        }

        /**
         * set origin for IE
         */
        if( !this.origin ) {
            this.origin = this.protocol + '//' + this.host;
        }

        /**
         * add a slash before the path for IE
         */
        if( this.pathname && this.pathname.charAt( 0 ) !== '/' ) {
            this.pathname = '/' + this.pathname;
        }
        this.searchParams = new URLSearchParams( this.search ); 
    }
};
URL$1.prototype.toString = function toString () {
    return this.href;
};
URL$1.prototype.toJSON = function toJSON () {
    return this.href;
};

var id = 0;

var prefix = 'biu_jsonp_callback_' + (+new Date) + '_' + Math.random().toString().substr( 2 );

function createScriptTag( src, id ) {
    var target = document.getElementsByTagName( 'script' )[ 0 ] || document.head.firstChild;
    var  script = document.createElement( 'script' );
    script.src = src;
    script.id = id;
    return target.parentNode.insertBefore( script, target );
}

function jsonp( url, options ) {
    if ( options === void 0 ) options = {};


    var params = options.data || {};
    var callback = prefix + '_' + id++;

    var r1, r2;

    var promise = new Promise$1( function ( resolve, reject ) { 
        r1 = resolve;
        r2 = reject;
    } );

    params.callback || ( params.callback = callback );

    var querystring = new URLSearchParams( params ).toString();

    url += ( url.indexOf( '?' ) >= 0 ? '&' : '?' ) + querystring;

    window[ params.callback ] = function( response ) {
        r1( response );

        window[ params.callback ] = null;
        delete window[ params.callback ];
        var script = document.getElementById( params.callback );
        script && script.parentNode.removeChild( script );
    };

    var script = createScriptTag( url, params.callback );

    script.addEventListener( 'error', function (e) { r2( e ); } );

    return promise;
}

function isUndefined() {
    return arguments.length > 0 && typeof arguments[ 0 ] === 'undefined';
}

function isURLSearchParams( obj ) {
    if( window.URLSearchParams.prototype.isPrototypeOf( obj ) ) { return true; }
    return URLSearchParams.prototype.isPrototypeOf( obj );
}

function mergeParams( dest, src ) {
    if( !isURLSearchParams( dest ) ) {
        dest = new URLSearchParams( dest );
    }

    if( !src ) { return dest; }

    if( isURLSearchParams( src ) ) {
        for( var i = 0, list = src.entries(); i < list.length; i += 1 ) {
            var item = list[i];

            dest.append( item[ 0 ], item[ 1 ] );
        }
    } else {
        var keys = Object.keys( src );

        for( var i$1 = 0, list$1 = keys; i$1 < list$1.length; i$1 += 1 ) {
            var item$1 = list$1[i$1];

            dest.append( item$1, src[ item$1 ] );
        }
    }
    return dest;
}

function isArguments (obj) { return ({}).toString.call( obj ) === '[object Arguments]'; }

function array (obj) { return Array.isArray( obj ); }

/**
 * arrow function
 *
 * Syntax: () => {}
 *
 * IE : no
 * Android : >= 5.0
 */

function arrowFunction (fn) {
    if( !isFunction( fn ) ) { return false; }
    return /^(?:function)?\s*\(?[\w\s,]*\)?\s*=>/.test( fn.toString() );
}

function isBoolean (s) { return typeof s === 'boolean'; }

function date (date) { return ({}).toString.call( date ) === '[object Date]'; }

function email (str) { return /^(([^#$%&*!+-/=?^`{|}~<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test( str ); }

function object (obj) { return obj && typeof obj === 'object' && !Array.isArray( obj ); }

function empty (obj) {
    if( array( obj ) || isString( obj ) ) {
        return !obj.length;
    }
    if( object( obj ) ) {
        return !Object.keys( obj ).length;
    }
    return !obj;
}

function error (e) { return ({}).toString.call( e ) === '[object Error]'; }

function isFalse ( obj, generalized ) {
    if ( generalized === void 0 ) generalized = true;

    if( isBoolean( obj ) || !generalized ) { return !obj; }
    if( isString( obj ) ) {
        return [ 'false', 'no', '0', '', 'nay', 'n', 'disagree' ].indexOf( obj.toLowerCase() ) > -1;
    }
    return !obj;
}

/**
 * iterable
 *
 * @compatibility
 *
 * IE: no
 * Edge: >= 13
 * Android: >= 5.0
 *  
 */

function iterable (obj) {
    try {
        return isFunction( obj[ Symbol.iterator ] );
    } catch( e ) {
        return false;
    }
}

// https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/test/data/jquery-1.9.1.js#L480

function plainObject (obj) {
    if( !object( obj ) ) {
        return false;
    }

    try {
        if( obj.constructor && !({}).hasOwnProperty.call( obj, 'constructor' ) && !({}).hasOwnProperty.call( obj.constructor.prototype, 'isPrototypeOf' ) ) {
            return false;
        }
    } catch( e ) {
        return false;
    }

    var key;
    for( key in obj ) {} // eslint-disable-line

    return key === undefined || ({}).hasOwnProperty.call( obj, key );
}

function isRegExp (reg) { return ({}).toString.call( reg ) === '[object RegExp]'; }

function isTrue ( obj, generalized ) {
    if ( generalized === void 0 ) generalized = true;

    if( isBoolean( obj ) || !generalized ) { return !!obj; }
    if( isString( obj ) ) {
        return [ 'true', 'yes', 'ok', '1', 'yea', 'yep', 'y', 'agree' ].indexOf( obj.toLowerCase() ) > -1;
    }
    return !!obj;
}

function node (s) { return ( typeof Node === 'object' ? s instanceof Node : s && typeof s === 'object' && typeof s.nodeType === 'number' && typeof s.nodeName === 'string' ); }

function textNode (node$$1) { return node( node$$1 ) && node$$1.nodeType === 3; }

function elementNode (node$$1) { return node( node$$1 ) && node$$1.nodeType === 1; }

function isWindow (obj) { return obj && obj === obj.window; }

function isClass (obj) { return isFunction( obj ) && /^\s*class\s+/.test( obj.toString() ); }

function isIPv6 (ip) {
    /**
     * An IPv6 address should have at least one colon(:)
     */
    if( ip.indexOf( ':' ) < 0 ) { return false; }

    /**
     * An IPv6 address can start or end with '::', but cannot start or end with a single colon.
     */
    if( /(^:[^:])|([^:]:$)/.test( ip ) ) { return false; }

    /**
     * An IPv6 address should consist of colon(:), dot(.) and hexadecimel
     */
    if( !/^[0-9A-Fa-f:.]{2,}$/.test( ip ) ) { return false; }

    /**
     * An IPv6 address should not have any sequence like:
     * 1. a hexadecimal that it's length greater than 4
     * 2. three or more continous colons
     * 3. two or more continous dots
     */
    if( /[0-9A-Fa-f]{5,}|:{3,}|\.{2,}/.test( ip ) ) { return false; }

    /**
     * In an IPv6 address, the "::" can only appear once.
     */
    if( ip.split( '::' ).length > 2 ) { return false; }

    /**
     * if the IPv6 address is in mixed form.
     */
    if( ip.indexOf( '.' ) > -1 ) {
        var lastColon = ip.lastIndexOf( ':' );
        var hexadecimal = ip.substr( 0, lastColon );
        var decimal = ip.substr( lastColon + 1 );
        /**
         * the decimal part should be an valid IPv4 address.
         */
        if( !isIPv4( decimal ) ) { return false; }

        /**
         * the length of the hexadecimal part should less than 6.
         */
        if( hexadecimal.split( ':' ).length > 6 ) { return false; }
    } else {
        /**
         * An IPv6 address that is not in mixed form can at most have 8 hexadecimal sequences.
         */
        if( ip.split( ':' ).length > 8 ) { return false; }
    }
    return true;
}

function isIP (ip) { return isIPv4( ip ) || isIPv6( ip ); }

/**
 * Private IPv4 address
 *
 * 10.0.0.0 ~ 10.255.255.255
 * 172.16.0.0 ~ 172.31.255.255
 * 192.168.0.0 ~ 192.168.255.255
 */

function isPrivateIPv4 (ip) {
    if( !isIPv4( ip ) ) { return false; }
    if( /^10\..*/.test( ip ) ) { return true; }
    if( /^192\.168\..*/.test( ip ) ) { return true; }
    if( /^172\.(1[6-9]|2[0-9]|3[0-1])\..*/.test( ip ) ) { return true; }
    return false;
}

function generator (fn) {
    try {
        return new Function( 'fn', 'return fn.constructor === (function*(){}).constructor' )( fn );
    } catch( e ) {
        return false;
    }
}

var is = {
    arguments : isArguments,
    array: array,
    arrowFunction: arrowFunction,
    asyncFunction: asyncFunction,
    boolean : isBoolean,
    date: date,
    email: email,
    empty: empty,
    error: error,
    false : isFalse,
    function : isFunction,
    integer: integer,
    iterable: iterable,
    number: number,
    object: object,
    plainObject: plainObject,
    promise: isPromise,
    regexp: isRegExp,
    string: isString,
    true : isTrue,
    undefined : isUndefined,
    url: url,
    node: node,
    textNode: textNode,
    elementNode: elementNode,
    window : isWindow,
    class : isClass,
    ip : isIP,
    ipv4 : isIPv4,
    ipv6 : isIPv6,
    privateIPv4 : isPrivateIPv4,
    generator: generator
};

var assign = function ( dest ) {
    var sources = [], len = arguments.length - 1;
    while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

    if( isFunction( Object.assign ) ) {
        return Object.assign.apply( Object, [ dest ].concat( sources ) );
    }
    var obj = sources[ 0 ];
    for( var property in obj ) {
        if( obj.hasOwnProperty( property ) ) {
            dest[ property ] = obj[ property ];
        }
    }
    if( sources.length > 1 ) {
        return assign.apply( void 0, [ dest ].concat( sources.splice( 1, sources.length - 1 ) ) );
    }
    return dest;
};

var Response = (function () {
    function Response( ref ) {
    var status = ref.status; if ( status === void 0 ) status = 200;
    var statusText = ref.statusText; if ( statusText === void 0 ) statusText = 'OK';
    var url = ref.url; if ( url === void 0 ) url = '';
    var body = ref.body; if ( body === void 0 ) body = null;
    var headers = ref.headers; if ( headers === void 0 ) headers = {};

        if( !is.string( body ) ) {
            return new TypeError( 'Response body must be a string "' + body + '"' );
        }
        assign( this, { 
            body: body,
            status: status,
            statusText: statusText,
            url: url,
            headers: headers,
            ok : status >= 200 && status < 300 || status === 304
        } );
    }

    Response.prototype.text = function text () {
        return Promise.resolve( this.body );
    };

    Response.prototype.json = function json () {
        try {
            var json = JSON.parse( this.body );
            return Promise.resolve( json );
        } catch( e ) {
            return  Promise.reject( e );
        }
    };

    Response.prototype.uncompress = function uncompress () {
    };

    Response.prototype.compress = function compress () {
    };

    return Response;
}());

function ajax ( url, options ) {
    if ( options === void 0 ) options = {};


    var data = options.data;
    var params = options.params;
    var timeout = options.timeout;
    var asynchronous = options.asynchronous; if ( asynchronous === void 0 ) asynchronous = true;
    var method = options.method; if ( method === void 0 ) method = 'GET';
    var headers = options.headers; if ( headers === void 0 ) headers = {};
    var onprogress = options.onprogress;
    var credentials = options.credentials; if ( credentials === void 0 ) credentials = 'omit';
    var responseType = options.responseType; if ( responseType === void 0 ) responseType = 'text';
    var xhr = options.xhr; if ( xhr === void 0 ) xhr = new XMLHttpRequest();

    method = method.toUpperCase();

    xhr.timeout = timeout;

    return new Promise$1( function ( resolve, reject ) {

        xhr.withCredentials = credentials === 'include';

        var onreadystatechange = function () {
            if( xhr.readyState != 4 ) { return; }
            if( xhr.status === 0 ) { return; }

            var response = new Response( {
                body : responseType !== 'text' ? xhr.response : xhr.responseText,
                status : xhr.status,
                statusText : xhr.statusText,
                headers : xhr.getAllResponseHeaders()
            } );


            resolve( response );

            xhr = null;
        };

        url = new URL$1( url, location.href );

        mergeParams( url.searchParams, params );

        xhr.open( method, url.href, asynchronous );

        xhr.onerror = function (e) {
            reject( e );
            xhr = null;
        };
        
        xhr.ontimeout = function () {
            reject( 'Timeout' );
            xhr = null;
        };

        if( isFunction( onprogress ) ) {
            xhr.onprogress = onprogress;
        }

        var isFormData = FormData.prototype.isPrototypeOf( data );

        for( var key in headers ) {
            if( ( isUndefined( data ) || isFormData ) && key.toLowerCase() === 'content-type' ) {
                // if the data is undefined or it is an instance of FormData
                // let the client to set "Content-Type" in header
                continue;
            }
            xhr.setRequestHeader( key, headers[ key ] );
        }

        asynchronous && ( xhr.onreadystatechange = onreadystatechange );

        xhr.send( isUndefined( data ) ? null : data );

        asynchronous || onreadystatechange();
    } );
}

function find( haystack, key ) {
    for( var i = 0, list = haystack; i < list.length; i += 1 ) {
        var item = list[i];

        if( item[ 0 ] === key ) { return item; }
    }
    return false;
}

var Map = function Map( iterable ) {
    if ( iterable === void 0 ) iterable = [];

    if( !( this instanceof Map ) ) {
        throw new TypeError( 'Constructor Map requires \'new\'' );
    }
    this.map = iterable || [];
};

var prototypeAccessors = { size: { configurable: true } };
prototypeAccessors.size.get = function () {
    return this.map.length;
};

Map.prototype.get = function get ( key ) {
    var data = find( this.map, key );
    return data ? data[ 1 ] : undefined;
};

Map.prototype.set = function set ( key, value ) {
    var data = find( this.map, key );
    if( data ) {
        data[ 1 ] = value;
    } else {
        this.map.push( [ key, value ] );
    }
    return this;
};

Map.prototype.delete = function delete$1 ( key ) {
        var this$1 = this;

    for( var i = 0, l = this.map.length; i < l; i += 1 ) {
        var item = this$1.map[ i ];
        if( item[ 0 ] === key ) {
            this$1.map.splice( i, 1 );
            return true;
        }
            
    }
    return false;
};

Map.prototype.clear = function clear () {
    this.map= [];
};

Map.prototype.forEach = function forEach ( callback, thisArg ) {
        var this$1 = this;

    isUndefined( thisArg ) && ( this.Arg = this );
    for( var i = 0, list = this$1.map; i < list.length; i += 1 ) {
        var item = list[i];

            callback.call( thisArg, item[ 1 ], item[ 0 ], this$1 );
    }
};

Map.prototype.has = function has ( key ) {
    return !!find( this.map, key );
};

Map.prototype.keys = function keys () {
        var this$1 = this;

    var keys = [];
    for( var i = 0, list = this$1.map; i < list.length; i += 1 ) {
        var item = list[i];

            keys.push( item[ 0 ] );
    }
    return keys;
};

Map.prototype.entries = function entries () {
    return this.map;
};

Map.prototype.values = function values () {
        var this$1 = this;

    var values = [];
    for( var i = 0, list = this$1.map; i < list.length; i += 1 ) {
        var item = list[i];

            values.push( item[ 1 ] );
    }
    return values;
};

Object.defineProperties( Map.prototype, prototypeAccessors );

var Set = function Set( iterable ) {
    var this$1 = this;
    if ( iterable === void 0 ) iterable = [];

    if( !( this instanceof Set ) ) {
        throw new TypeError( 'Constructor Set requires \'new\'' );
    }
    this.set = [];

    if( iterable && iterable.length ) {
        for( var i = 0, list = iterable; i < list.length; i += 1 ) {
            var item = list[i];

            this$1.add( item );
        }
    }
};

var prototypeAccessors$1 = { size: { configurable: true } };

prototypeAccessors$1.size.get = function () {
    return this.set.length;
};

Set.prototype.add = function add ( value ) {
    var i = this.set.indexOf( value );
    if( i > -1 ) {
        this.set[ i ] = value;
    } else {
        this.set.push( value );
    }
    return this;
};

Set.prototype.delete = function delete$1 ( value ) {
    var i = this.set.indexOf( value );
    if( i > -1 ) {
        this.set.splice( i, 1 );
        return true;
    }
    return false;
};

Set.prototype.clear = function clear () {
    this.set = [];
};

Set.prototype.forEach = function forEach ( callback, thisArg ) {
        var this$1 = this;

    isUndefined( thisArg ) && ( this.Arg = this );
    for( var i = 0, list = this$1.set; i < list.length; i += 1 ) {
        var item = list[i];

            callback.call( thisArg, item, item, this$1 );
    }
};

Set.prototype.has = function has ( value ) {
    return this.set.indexOf( value ) > -1;
};

Set.prototype.keys = function keys () {
    return this.values();
};

Set.prototype.entries = function entries () {
        var this$1 = this;

    var res = [];
    for( var i = 0, list = this$1.set; i < list.length; i += 1 ) {
        var item = list[i];

            res.push( [ item, item ] ); 
    }
    return res;
};

Set.prototype.values = function values () {
    return this.set;
};

Object.defineProperties( Set.prototype, prototypeAccessors$1 );

var defaultExport = function defaultExport() {
    this.__listeners = new Map();
};

defaultExport.prototype.on = function on ( evt, handler ) {
    var listeners = this.__listeners;
    var handlers = listeners.get( evt );

    if( !handlers ) {
        handlers = new Set();
        listeners.set( evt, handlers );
    }
    handlers.add( handler );
    return this;
};

defaultExport.prototype.once = function once ( evt, handler ) {
        var this$1 = this;

    var _handler = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

        handler.apply( this$1, args );
        this$1.removeListener( evt, _handler );
    };
    return this.on( evt, _handler );
};

defaultExport.prototype.removeListener = function removeListener ( evt, handler ) {
    var listeners = this.__listeners;
    var handlers = listeners.get( evt );
    handlers && handlers.delete( handler );
    return this;
};

defaultExport.prototype.emit = function emit ( evt ) {
        var this$1 = this;
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var handlers = this.__listeners.get( evt );
    if( !handlers ) { return false; }
    handlers.forEach( function (handler) { return handler.call.apply( handler, [ this$1 ].concat( args ) ); } );
};

defaultExport.prototype.removeAllListeners = function removeAllListeners ( rule ) {
    var checker;
    if( isString( rule ) ) {
        checker = function (name) { return rule === name; };
    } else if( isFunction( rule ) ) {
        checker = rule;
    } else if( isRegExp( rule ) ) {
        checker = function (name) {
            rule.lastIndex = 0;
            return rule.test( name );
        };
    }

    var listeners = this.__listeners;

    listeners.forEach( function ( value, key ) {
        checker( key ) && listeners.delete( key );
    } );
    return this;
};

function assign$2( dest ) {
    var sources = [], len = arguments.length - 1;
    while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

    if( isFunction( Object.assign ) ) {
        return Object.assign.apply( Object, [ dest ].concat( sources ) );
    }
    var obj = sources[ 0 ];
    for( var property in obj ) {
        if( obj.hasOwnProperty( property ) ) {
            dest[ property ] = obj[ property ];
        }
    }
    if( sources.length > 1 ) {
        return assign$2.apply( void 0, [ dest ].concat( sources.splice( 1, sources.length - 1 ) ) );
    }
    return dest;
}

function config() {
    return {
        promises : [],
        results : [],
        index : 0,
        steps : [],
        busy : false,
        promise : Promise$1.resolve()
    };
}
/**
 * new Sequence( false, [] )
 * new Sequence( [] )
 */

var Sequence = (function (EventEmitter$$1) {
    function Sequence( steps, options ) {
        var this$1 = this;
        if ( options === void 0 ) options = {};

        EventEmitter$$1.call(this);

        this.__resolve = null;
        this.running = false;
        this.suspended = false;
        this.suspendTimeout = null;
        this.muteEndIfEmpty = !!options.emitEndIfEmpty;
        this.interval = options.interval || 0;

        assign$2( this, config() );

        if( steps && steps.length ) {
            this.append( steps );
        } else if( !this.muteEndIfEmpty ) {
            if( typeof process === 'object' && isFunction( process.nextTick ) ) {
                process.nextTick( function () {
                    this$1.emit( 'end', this$1.results, this$1 );
                } );
            } else if( typeof setImmediate === 'function' ) {
                setImmediate( function () {
                    this$1.emit( 'end', this$1.results, this$1 );
                } );
            } else {
                setTimeout( function () {
                    this$1.emit( 'end', this$1.results, this$1 );
                }, 0 );
            }
        }

        options.autorun !== false && setTimeout( function () {
            this$1.run();
        }, 0 );
    }

    if ( EventEmitter$$1 ) Sequence.__proto__ = EventEmitter$$1;
    Sequence.prototype = Object.create( EventEmitter$$1 && EventEmitter$$1.prototype );
    Sequence.prototype.constructor = Sequence;

    /**
     * to append new steps to the sequence
     */
    Sequence.prototype.append = function append ( steps ) {
        var this$1 = this;

        var dead = this.index >= this.steps.length;

        if( isFunction( steps ) ) {
            this.steps.push( steps );
        } else {
            for( var i = 0, list = steps; i < list.length; i += 1 ) {
                var step = list[i];

                this$1.steps.push( step );
            }
        }
        this.running && dead && this.next( true );
    };

    Sequence.prototype.go = function go ( n ) {
        if( isUndefined( n ) ) { return; }
        this.index = n;
        if( this.index > this.steps.length ) {
            this.index = this.steps.length;
        }
    };

    Sequence.prototype.clear = function clear () {
        assign$2( this, config() );
    };

    Sequence.prototype.next = function next ( inner ) {
        var this$1 = this;
        if ( inner === void 0 ) inner = false;

        if( !inner && this.running ) {
            console.warn( 'Please do not call next() while the sequence is running.' );
            return Promise$1.reject( new Sequence.Error( {
                errno : 2,
                errmsg : 'Cannot call next during the sequence is running.'
            } ) );
        }

        /**
         * If there is a step that is running,
         * return the promise instance of the running step.
         */
        if( this.busy || this.suspended ) { return this.promise; }

        /**
         * If already reached the end of the sequence,
         * return a rejected promise instance with a false as its reason.
         */
        if( !this.steps[ this.index ] ) {
            return Promise$1.reject( new Sequence.Error( {
                errno : 1,
                errmsg : 'no more step can be executed.'
            } ) );
        }

        this.busy = true;
        
        return this.promise = this.promise.then( function () {
            var step = this$1.steps[ this$1.index ];
            var promise;

            try {
                promise = step(
                    this$1.results[ this$1.results.length - 1 ],
                    this$1.index,
                    this$1.results
                );
                /**
                 * if the step function doesn't return a promise instance,
                 * create a resolved promise instance with the returned value as its value
                 */
                if( !isPromise( promise ) ) {
                    promise = Promise$1.resolve( promise );
                }
            } catch( e ) {
                promise = Promise$1.reject( e );
            }

            return promise.then( function (value) {
                var result = {
                    status : Sequence.SUCCEEDED,
                    index : this$1.index,
                    value: value,
                    time : +new Date
                };
                this$1.results.push( result );
                this$1.emit( 'success', result, this$1.index, this$1 );
                return result;
            } ).catch( function (reason) {
                var result = {
                    status : Sequence.FAILED,
                    index : this$1.index,
                    reason: reason,
                    time : +new Date
                };
                this$1.results.push( result );
                this$1.emit( 'failed', result, this$1.index, this$1 );
                return result;
            } ).then( function (result) {
                this$1.index++;
                this$1.busy = false;
                if( !this$1.steps[ this$1.index ] ) {
                    this$1.emit( 'end', this$1.results, this$1 );
                } else {
                    setTimeout( function () {
                        this$1.running && this$1.next( true ); 
                    }, this$1.interval );
                }
                return result;
            } );
        } );
    };

    Sequence.prototype.run = function run () {
        if( this.running ) { return; }
        this.running = true;
        this.next( true );
    };

    Sequence.prototype.stop = function stop () {
        this.running = false;
    };

    Sequence.prototype.suspend = function suspend ( duration ) {
        var this$1 = this;
        if ( duration === void 0 ) duration = 1000;

        this.suspended = true;
        this.suspendTimeout && clearTimeout( this.suspendTimeout );
        this.suspendTimeout = setTimeout( function () {
            this$1.suspended = false;
            this$1.running && this$1.next( true );
        }, duration );
    };

    Sequence.all = function all () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = parseArguments.apply( void 0, args );
        var steps = ref.steps;
        var interval = ref.interval;
        var cb = ref.cb;
        var sequence = new Sequence( steps, { interval: interval } );

        isFunction( cb ) && cb.call( sequence, sequence );

        return new Promise$1( function ( resolve, reject ) {
            sequence.on( 'end', function (results) {
                resolve( results );
            } );
            sequence.on( 'failed', function () {
                sequence.stop();
                reject( sequence.results );
            } );
        } );
    };

    Sequence.chain = function chain () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = parseArguments.apply( void 0, args );
        var steps = ref.steps;
        var interval = ref.interval;
        var cb = ref.cb;
        var sequence = new Sequence( steps, { interval: interval } );
        isFunction( cb ) && cb.call( sequence, sequence );
        return new Promise$1( function (resolve) {
            sequence.on( 'end', function (results) {
                resolve( results );
            } );
        } );
    };

    Sequence.any = function any () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = parseArguments.apply( void 0, args );
        var steps = ref.steps;
        var interval = ref.interval;
        var cb = ref.cb;
        var sequence = new Sequence( steps, { interval: interval } );
        isFunction( cb ) && cb.call( sequence, sequence );
        return new Promise$1( function ( resolve, reject ) {
            sequence.on( 'success', function () {
                resolve( sequence.results );
                sequence.stop();
            } );

            sequence.on( 'end', function () {
                reject( sequence.results );
            } );
        } );
    };

    return Sequence;
}(defaultExport));

Sequence.SUCCEEDED = 1;
Sequence.FAILED = 0;

Sequence.Error = (function () {
    function Error( options ) {
        assign$2( this, options );
    }

    return Error;
}());

function parseArguments( steps, interval, cb ) {
    if( isFunction( interval ) ) {
        cb = interval;
        interval = 0;
    }
    return { steps: steps, interval: interval, cb: cb }
}

function isObject (obj) { return obj && typeof obj === 'object' && !Array.isArray( obj ); }

function isUndefined$1() {
    return arguments.length > 0 && typeof arguments[ 0 ] === 'undefined';
}

function isNumber ( n, strict ) {
    if ( strict === void 0 ) strict = false;

    if( ({}).toString.call( n ).toLowerCase() === '[object number]' ) {
        return true;
    }
    if( strict ) { return false; }
    return !isNaN( parseFloat( n ) ) && isFinite( n )  && !/\.$/.test( n );
}

function isAsyncFunction (fn) { return ( {} ).toString.call( fn ) === '[object AsyncFunction]'; }

function isFunction$1 (fn) { return ({}).toString.call( fn ) === '[object Function]' || isAsyncFunction( fn ); }

function isDate (date) { return ({}).toString.call( date ) === '[object Date]'; }

function isString$1 (str) { return typeof str === 'string' || str instanceof String; }

var md5 = ( function () {
    var safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    var bit_rol = function ( num, cnt ) { return ( num << cnt ) | ( num >>> ( 32 - cnt ) ); };
    var md5_cmn = function ( q, a, b, x, s, t ) { return safe_add( bit_rol( safe_add( safe_add( a, q ), safe_add( x, t ) ), s ), b ); };
    var md5_ff = function ( a, b, c, d, x, s, t ) { return md5_cmn( (b & c) | ( ( ~b ) & d ), a, b, x, s, t ); };
    var md5_gg = function ( a, b, c, d, x, s, t ) { return md5_cmn( (b & d) | ( c & ( ~d ) ), a, b, x, s, t ); };
    var md5_hh = function ( a, b, c, d, x, s, t ) { return md5_cmn( b ^ c ^ d, a, b, x, s, t ); };
    var md5_ii = function ( a, b, c, d, x, s, t ) { return md5_cmn( c ^ ( b | ( ~d ) ), a, b, x, s, t ); };

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    var binl_md5 = function ( x, len ) {
        /* append padding */
        x[ len >> 5 ] |= 0x80 << (len % 32);
        x[ ( ( ( len + 64 ) >>> 9 ) << 4) + 14 ] = len;

        var a = 1732584193,
            b = -271733879,
            c = -1732584194,
            d = 271733878;

        for( var i = 0, l = x.length; i < l; i += 16 ) {
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
        return [ a, b, c, d ];
    };

    /*
     * Convert an array of little-endian words to a string
     */
    var binl2rstr = function (input) {
        var output = '';
        for( var i = 0, l = input.length * 32; i < l; i += 8 ) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    };

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    var rstr2binl = function (input) {
        var output = Array.from( { length : input.length >> 2 } ).map( function () { return 0; } );
        for( var i = 0, l = input.length; i < l * 8; i += 8 ) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    };

    var rstr_md5 = function (s) { return binl2rstr( binl_md5( rstr2binl(s), s.length * 8 ) ); };
    var str2rstr_utf8 = function (input) { return window.unescape( encodeURIComponent( input ) ); };
    return function (string) {
        var output = '';
        var hex_tab = '0123456789abcdef';
        var input = rstr_md5( str2rstr_utf8( string ) );

        for( var i = 0, l = input.length; i < l; i += 1 ) {
            var x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
        }
        return output;
    };
} )();

var Storage = function Storage( name ) {
    var this$1 = this;

    if( !name ) {
        throw new TypeError( ("Expect a name for the storage, but a(n) " + name + " is given.") );
    }

    this.name = "#LC-STORAGE-V-1.0#" + name + "#";

    var abstracts = [ 'set', 'get', 'delete', 'clear', 'keys' ];

    for( var i = 0, list = abstracts; i < list.length; i += 1 ) {

        var method = list[i];

        if( !isFunction$1( this$1[ method ] ) ) {
            throw new TypeError( ("The method \"" + method + "\" must be declared in every class extends from Cache") );
        }
    }
};

Storage.prototype.format = function format ( data, options ) {
        if ( options === void 0 ) options = {};

    var string = true;
    if( !isString$1( data ) ) {
        string = false;
        data = JSON.stringify( data );
    }

    var input = {
        data: data,
        type : options.type || 'localcache',
        mime : options.mime || 'text/plain',
        string: string,
        priority : options.priority === undefined ? 50 : options.priority,
        ctime : options.ctime || +new Date,
        lifetime : options.lifetime || 0
    };

    if( options.extra ) {
        input.extra = JSON.stringify( options.extra );
    }

    if( options.md5 ) {
        input.md5 = md5( data );
    }

    if( options.cookie ) {
        input.cookie = md5( document.cookie );
    }

    return input;
};

Storage.prototype.validate = function validate ( data, options ) {
        if ( options === void 0 ) options = {};

    var result = true;

    if( data.lifetime ) {
        if( new Date - data.ctime >= data.lifetime ) {
            result = false;
        }
    } 
        
    if( data.cookie ) {
        if( data.cookie !== md5( document.cookie ) ) {
            result = false;
        }
    } 
        
    if( data.md5 && options.md5 ) {
        if( data.md5 !== options.md5 ) {
            result = false;
        }
        if( md5( data.data ) !== options.md5 ) {
            result = false;
        }
    }

    if( options.validate ) {
        return options.validate( data, result );
    }

    return result;
};

Storage.prototype.clean = function clean ( check ) {
        var this$1 = this;

    return this.keys().then( function (keys) {
        var steps = [];

        var loop = function () {
            var key = list[i];

                steps.push( function () {
                return this$1.get( key ).then( function (data) {
                    if( check( data, key ) === true ) {
                        return this$1.delete( key );
                    }
                } )
            } );
        };

            for( var i = 0, list = keys; i < list.length; i += 1 ) loop();

        return Sequence.chain( steps ).then( function (results) {
            var removed = [];

            for( var i = 0, list = results; i < list.length; i += 1 ) {

                var result = list[i];

                    if( result.status === Sequence.FAILED ) {
                    removed.push( keys[ result.index ] );
                }
            }

            return removed;
        } );
    } );
};

Storage.prototype.output = function output ( data, storage ) {

    if( !storage ) {
        console.error( 'Storage type is required.' );
    }

    if( !data.string ) {
        data.data = JSON.parse( data.data );
    }

    if( data.extra ) {
        data.extra = JSON.parse( data.extra );
    }

    data.storage = storage;

    return data;
};

var Memory = (function (Storage$$1) {
    function Memory( name ) {
        Storage$$1.call( this, name );
        this.data = {};
    }

    if ( Storage$$1 ) Memory.__proto__ = Storage$$1;
    Memory.prototype = Object.create( Storage$$1 && Storage$$1.prototype );
    Memory.prototype.constructor = Memory;

    Memory.prototype.set = function set ( key, data, options ) {
        if ( options === void 0 ) options = {};

        data = this.format( data, options );
        this.data[ key ] = data;
        return Promise$1.resolve( data );
    };

    Memory.prototype.get = function get ( key, options ) {
        if ( options === void 0 ) options = {};

        var data = this.data[ key ];

        if( !data ) { return Promise$1.reject(); }

        if( this.validate( data, options ) === false ) {
            options.autodelete !== false && this.delete( key );
            return Promise$1.reject();
        }

        return Promise$1.resolve( this.output( data, 'page' ) );
    };

    Memory.prototype.delete = function delete$1 ( key ) {
        this.data[ key ] = null;
        delete this.data[ key ];
        return Promise$1.resolve();
    };

    Memory.prototype.keys = function keys () {
        return Promise$1.resolve( Object.keys( this.data ) );
    };

    Memory.prototype.clear = function clear () {
        this.data = {};
        return Promise$1.resolve();
    };

    return Memory;
}(Storage));

var SessionStorage = (function (Storage$$1) {
    function SessionStorage( name ) {
        Storage$$1.call( this, name );
    }

    if ( Storage$$1 ) SessionStorage.__proto__ = Storage$$1;
    SessionStorage.prototype = Object.create( Storage$$1 && Storage$$1.prototype );
    SessionStorage.prototype.constructor = SessionStorage;

    SessionStorage.prototype.set = function set ( key, data, options ) {
        if ( options === void 0 ) options = {};

        data = this.format( data, options );
        try {
            sessionStorage.setItem( this.name + key, JSON.stringify( data ) );
            return Promise$1.resolve( data );
        } catch( e ) {
            return Promise$1.reject( e );
        }
    };

    SessionStorage.prototype.get = function get ( key, options ) {
        if ( options === void 0 ) options = {};

        var data;
        
        try {
            data = JSON.parse( sessionStorage.getItem( this.name + key ) );

            if( !data ) { return Promise$1.reject(); }

            if( this.validate( data, options ) === false ) {
                options.autodelete !== false && this.delete( key );
                return Promise$1.reject();
            }
        } catch( e ) {
            this.delete( key );
            return Promise$1.reject();
        }
        return Promise$1.resolve( this.output( data, 'session' ) );
    };

    SessionStorage.prototype.delete = function delete$1 ( key ) {
        sessionStorage.removeItem( this.name + key );  
        return Promise$1.resolve();
    };

    SessionStorage.prototype.clear = function clear () {
        sessionStorage.clear();
        return Promise$1.resolve();
    };

    SessionStorage.prototype.keys = function keys () {
        var keys = [];
        var name = this.name;
        var l = this.name.length;

        for( var key in sessionStorage ) {
            if( key.indexOf( name ) ) { continue; }
            keys.push( key.substr( l ) );
        }

        return Promise$1.resolve( keys );
    };

    return SessionStorage;
}(Storage));

var IDB = (function (Storage$$1) {
    function IDB( name ) {
        var this$1 = this;

        Storage$$1.call( this, name );

        this.idb = null;

        this.ready = this.open().then( function () {
            this$1.idb.onerror = function (e) {
                console.warn( 'IDB Error', e );
            };
            return this$1.idb;
        } );

    }

    if ( Storage$$1 ) IDB.__proto__ = Storage$$1;
    IDB.prototype = Object.create( Storage$$1 && Storage$$1.prototype );
    IDB.prototype.constructor = IDB;

    IDB.prototype.open = function open () {
        var this$1 = this;


        var request = window.indexedDB.open( this.name );

        return new Promise( function ( resolve, reject ) {

            request.onsuccess = function (e) {
                this$1.idb = e.target.result;
                resolve( e );
            };

            request.onerror = function (e) {
                reject( e );
            };

            request.onupgradeneeded = function (e) {
                this$1.onupgradeneeded( e );
            };
        } );
    };

    IDB.prototype.onupgradeneeded = function onupgradeneeded ( e ) {
        var os = e.target.result.createObjectStore( 'storage', {
            keyPath : 'key'
        } );

        os.createIndex( 'key', 'key', { unique : true } );
        os.createIndex( 'data', 'data', { unique : false } );
        os.createIndex( 'type', 'type', { unique : false } );
        os.createIndex( 'string', 'string', { unique : false } );
        os.createIndex( 'ctime', 'ctime', { unique : false } );
        os.createIndex( 'md5', 'md5', { unique : false } );
        os.createIndex( 'lifetime', 'lifetime', { unique : false } );
        os.createIndex( 'cookie', 'cookie', { unique : false } );
        os.createIndex( 'priority', 'priority', { unique : false } );
        os.createIndex( 'extra', 'extra', { unique : false } );
        os.createIndex( 'mime', 'mime', { unique : false } );
    };

    IDB.prototype.store = function store ( write ) {
        if ( write === void 0 ) write = false;

        return this.idb.transaction( [ 'storage' ], write ? 'readwrite' : 'readonly' ).objectStore( 'storage' );
    };

    IDB.prototype.set = function set ( key, data, options ) {
        var this$1 = this;
        if ( options === void 0 ) options = {};


        data = this.format( data, options );

        return this.ready.then( function () {
            return new Promise( function ( resolve, reject ) {
                var store = this$1.store( true );
                // don't manipulate the origin data
                var request = store.put( Object.assign( { key: key }, data ) );

                request.onsuccess = function () {
                    resolve( data );
                };

                request.onerror = function (e) {
                    reject( e );
                };
            } );
        } );
    };

    IDB.prototype.delete = function delete$1 ( key ) {
        var this$1 = this;

        return this.ready.then( function () {
            return new Promise( function ( resolve, reject ) {
                var store = this$1.store( true );
                var request = store.delete( key );

                request.onsuccess = function () {
                    resolve();
                };

                request.onerror = function (e) {
                    reject( e );
                };
            } );
        } );
    };

    IDB.prototype.get = function get ( key, options ) {
        var this$1 = this;
        if ( options === void 0 ) options = {};

        return this.ready.then( function () {
            return new Promise( function ( resolve, reject ) {
                var store = this$1.store();
                var request = store.get( key );

                request.onsuccess = function () {
                    var data = request.result;
                    if( !data ) {
                        return reject();
                    }

                    if( this$1.validate( data, options ) === false ) {
                        options.autodelete !== false && this$1.delete( key ); 
                        return reject();
                    }
                    delete data.key;
                    resolve( this$1.output( data, 'persistent' ) );
                };

                request.onerror = function (e) {
                    reject( e );
                };
                
            } );
        } );
    };

    IDB.prototype.clear = function clear () {
        var this$1 = this;

        return this.ready.then( function () {
            return new Promise( function ( resolve, reject ) {
                var store = this$1.store( true );
                var request = store.clear();

                request.onsuccess = function () {
                    resolve();
                };

                request.onerror = function (e) {
                    reject( e );
                };
            } );
        } );
    };

    IDB.prototype.keys = function keys () {
        var this$1 = this;

        return this.ready.then( function () {
            return new Promise( function ( resolve, reject ) {
                var store = this$1.store();

                if( store.getAllKeys ) {
                    var request = store.getAllKeys();

                    request.onsuccess = function () {
                        resolve( request.result );
                    };

                    request.onerror = function () {
                        reject();
                    };
                } else {
                    try {
                        var request$1 = store.openCursor();
                        var keys = [];

                        request$1.onsuccess = function () {
                            var cursor = request$1.result;

                            if( !cursor ) {
                                resolve( keys );
                                return;
                            }

                            keys.push( cursor.key );
                            cursor.continue();
                        };
                    } catch( e ) {
                        reject( e );
                    }
                }
            } );
        } );
    };

    return IDB;
}(Storage));

var Persistent = Storage;

if( window.indexedDB ) {
    Persistent = IDB;
}

var Persistent$1 = Persistent;

/**
 * please don't change the order of items in this array.
 */
var LocalCache = function LocalCache( name ) {
    if( !name ) {
        throw new TypeError( 'Expect a name for your storage' );
    }

    this.page = new Memory( name );
    this.session = new SessionStorage( name );
    this.persistent = new Persistent$1( name );

    this.clean();
};
LocalCache.prototype.set = function set ( key, data, options ) {
        var this$1 = this;


    var steps = [];

    var loop = function () {
        var mode = list[i];

            if( !options[ mode ] ) { return; }

        var opts = options[ mode ];

        if( opts === false ) { return; }

        if( !isObject( opts ) ) {
            opts = {};
        }

        if( !isUndefined$1( options.type ) ) {
            opts.type = options.type;
        }

        if( !isUndefined$1( options.extra ) ) {
            opts.extra = options.extra;
        }

        if( !isUndefined$1( options.mime ) ) {
            opts.mime = options.mime;
        }
            
        steps.push( function () { return this$1[ mode ].set( key, data, opts ); } );
    };

        for( var i = 0, list = LocalCache.STORAGES; i < list.length; i += 1 ) loop();

    if( !steps.length ) {
        throw new TypeError( ("You must specify at least one storage mode in [" + (LocalCache.STORAGES.join(', ')) + "]") );
    }

    return Sequence.all( steps ).then( function () { return data; } );
};

LocalCache.prototype.get = function get ( key, modes, options ) {
        var this$1 = this;
        if ( options === void 0 ) options = {};


    if( isObject( modes ) ) {
        modes = LocalCache.STORAGES;
        options = modes;
    }

    modes || ( modes = LocalCache.STORAGES );

    var steps = [];

    var loop = function () {
        var mode = list[i];

            if( !this$1[ mode ] ) {
            throw new TypeError( ("Unexcepted storage mode \"" + mode + "\", excepted one of: " + (LocalCache.STORAGES.join( ', ' ))) );
        }
        steps.push( function () { return this$1[ mode ].get( key, options ); } );
    };

        for( var i = 0, list = modes; i < list.length; i += 1 ) loop();

    return Sequence.any( steps ).then( function (results) {
            var obj;

        var result = results[ results.length - 1 ];
        var value = result.value;

        var store = false;

        for( var i = 0, list = LocalCache.STORAGES; i < list.length; i += 1 ) {
            var item = list[i];

                if( options[ item ] && item !== value.storage ) {
                store = true;
            }
        }

        if( !store ) { return value; }

        var opts = Object.assign( value, options, ( obj = {}, obj[ value.storage ] = false, obj) );

        return this$1.set( key, value.data, opts ).then( function () { return value; } );
    } );
};

LocalCache.prototype.delete = function delete$1 ( key, modes ) {
        var this$1 = this;

    modes || ( modes = LocalCache.STORAGES );

    var steps = [];

    var loop = function () {
        var mode = list[i];

            if( !this$1[ mode ] ) {
            throw new TypeError( ("Unexcepted mode \"" + mode + "\", excepted one of: " + (LocalCache.STORAGES.join( ', ' ))) );
        }
        steps.push( function () { return this$1[ mode ].delete( key ); } );
    };

        for( var i = 0, list = modes; i < list.length; i += 1 ) loop();
    return Sequence.all( steps );
};

LocalCache.prototype.clear = function clear ( modes ) {
        var this$1 = this;

    modes || ( modes = LocalCache.STORAGES );

    var steps = [];

    var loop = function () {
        var mode = list[i];

            if( !this$1[ mode ] ) {
            throw new TypeError( ("Unexcepted mode \"" + mode + "\", excepted one of: " + (LocalCache.STORAGES.join( ', ' ))) );
        }
        steps.push( function () { return this$1[ mode ].clear(); } );
    };

        for( var i = 0, list = modes; i < list.length; i += 1 ) loop();

    return Sequence.all( steps );
};

LocalCache.prototype.clean = function clean ( options ) {
        var this$1 = this;
        if ( options === void 0 ) options = {};

    var check = function ( data, key ) {
        var remove = false;

        var priority = options.priority;
            var length = options.length;
            var ctime = options.ctime;
            var type = options.type;

        if( !isUndefined$1( priority ) ) {
            if( data.priority < priority ) {
                remove = true;
            }
        }

        if( !remove && !isUndefined$1( length ) ) {
            var content = data.data;
            if( isNumber( length ) ) {
                if( content.length >= length ) {
                    remove = true;
                }
            } else if( Array.isArray( length ) ) {
                if( content.length >= length[ 0 ] && content.length <= length[ 1 ] ) {
                    remove = true;
                }
            }
        }

        if( !remove && !isUndefined$1( ctime ) ) {
            if( isDate( ctime ) || isNumber( ctime ) ) {
                if( data.ctime < +ctime ) {
                    remove = true;
                }
            } else if( Array.isArray( ctime ) ) {
                if( data.ctime > ctime[ 0 ] && data.ctime < ctime[ 1 ] ) {
                    remove = true;
                }
            }
        }

        if( !remove ) {
            if( Array.isArray( type ) ) {
                if( type.indexOf( data.type ) > -1 ) {
                    remove = true;
                }
            } else if( type == data.type ) {
                remove = true;
            }
        }

        if( !remove && isFunction$1( options.remove ) ) {
            if( options.remove( data, key ) === true ) {
                remove = true;
            }
        }

        return remove;
    };

    var steps = [];

    for( var i = 0, list = LocalCache.STORAGES; i < list.length; i += 1 ) {
        var mode = list[i];

            steps.push( this$1[ mode ].clean( check ) );
    }
    return Promise.all( steps );
};

LocalCache.STORAGES = [ 'page', 'session', 'persistent' ];

var localcache = new LocalCache( 'BIU-REQUEST-VERSION-1.0.0' );

function set( key, data, options ) {
    var url = new URL( key );
    url.searchParams.sort();

    return localcache.set( url.toString(), data, options );
}

function get( key, options ) {
    if ( options === void 0 ) options = {};


    var url = new URL( key ); 
    url.searchParams.sort();
    url = url.toString();

    return localcache.get( url, LocalCache.STORAGES, options ).then( function (result) {
        var response = new Response( {
            url: url,
            body : result.data,
            status : 200,
            statusText : 'From LocalCache',
            headers : {
                'Content-Type' : result.mime
            }
        } );

        return response;
    } );
}

var lc = { localcache: localcache, set: set, get: get };

function resJSON( xhr ) {
    return /^application\/json;/i.test( xhr.getResponseHeader( 'content-type' ) );
}

function request( url, options ) {
    if ( options === void 0 ) options = {};


    if( options.auth ) {
        if( !options.headers ) {
            options.headers = {};
        }
        var username = options.auth.username || '';
        var password = options.auth.password || '';
        options.headers.Authorization = 'Basic ' + btoa( username + ':' + password );
    }

    options.xhr || ( options.xhr =  new XMLHttpRequest() );

    return ajax( url, options ).then( function (response) {
        var status = response.status;

        if( status < 200 || status >= 300 ) {
            throw response;
        }

        if( options.fullResponse ) {
            return response;
        }

        if( options.rawBody ) {
            return response.body;
        }

        if( resJSON( options.xhr ) || options.type === 'json' ) {
            return response.json();
        }

        return response.body;
    } );
}

function get$1( url, options ) {
    if ( options === void 0 ) options = {};


    var cache = options.cache; if ( cache === void 0 ) cache = false;
    var fullResponse = options.fullResponse; if ( fullResponse === void 0 ) fullResponse = false;
    var rawBody = options.rawBody; if ( rawBody === void 0 ) rawBody = false;
    var localcache = options.localcache; if ( localcache === void 0 ) localcache = false;

    options = assign( {}, options, {
        method : 'GET'
    } );

    url = new URL$1( url, location.href );
    mergeParams( url.searchParams, options.params ); 

    options.params = {};

    if( cache === false ) {
        options.params[ '_' + +new Date ] = '_';
    }

    if( !localcache ) {
        return request( url, options );
    }

    return lc.get( url, localcache ).catch( function () {

        options.fullResponse = true;

        options.xhr || ( options.xhr = new XMLHttpRequest() );

        return request( url, options ).then( function (response) {

            var isJSON = ( resJSON( options.xhr ) || options.type === 'json' );

            if( !localcache.mime ) {
                if( isJSON ) {
                    localcache.mime = 'application/json';
                } else {
                    localcache.mime = response.headers[ 'Content-Type' ] || 'text/plain';
                }
            }

            return lc.set( url.toString(), response.body, localcache ).then( function () {

                if( fullResponse ) {
                    return response;
                }

                if( rawBody ) {
                    return response.body;
                }

                if( isJSON ) {
                    return response.json();
                }

                return response.body;
            } );
        } );
    } );
}

function post( url, options ) {
    if ( options === void 0 ) options = {};

    options.method = 'POST';

    var contentType = options.contentType; if ( contentType === void 0 ) contentType = true;

    if( !options.headers ) {
        options.headers = {};
    }

    if( contentType && !options.headers[ 'Content-Type' ] ) {
        options.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    return request( url, options );
}

var index = { request: request, get: get$1, post: post, ajax: ajax, jsonp: jsonp };

return index;

})));

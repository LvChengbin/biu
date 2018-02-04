import { URL } from '@lvchengbin/url';
import ajax from './ajax';
import lc from './localcache';
import { mergeParams } from './utils';

function resJSON( response ) {
    return response.headers[ 'Content-Type' ] === 'application/json';
}

function request( url, options = {} ) {

    if( options.auth ) {
        if( !options.headers ) {
            options.headers = {};
        }
        const username = options.auth.username || '';
        const password = options.auth.password || '';
        options.headers.Authorization = 'Basic ' + btoa( username + ':' + password );
    }

    return ajax( url, options ).then( response => {
        const status = response.status;

        if( status < 200 && status >= 300 ) {
            throw response;
        }

        if( options.fullResponse ) {
            return response;
        }

        if( options.rawBody ) {
            return response.body;
        }

        if( resJSON( response ) || options.type === 'json' ) {
            return response.json();
        }

        return response.body;
    } );
}

function get( url, options = {} ) {

    const {
        cache = false,
        fullResponse = false,
        rawBody = false,
        localcache = false
    } = options;

    options = Object.assign( {}, options, {
        method : 'GET'
    } );

    url = new URL( url, location.href );
    mergeParams( url.searchParams, options.params ); 

    options.params = {};

    if( cache === false ) {
        options.params[ '_' + +new Date ] = '_';
    }

    if( !localcache ) {
        return request( url, options );
    }

    return lc.get( url, localcache ).catch( () => {

        options.fullResponse = true;

        return request( url, options ).then( response => {

            const isJSON = ( resJSON( response ) || options.type === 'json' );

            if( isJSON && !localcache.mime ) {
                localcache.mime = 'application/json';
            } else {
                localcache.mime = response.headers[ 'Content-Type' ];
            }

            lc.set( url.toString(), response.body, localcache );

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
}

function post( url, options = {} ) {
    options.method = 'POST';

    const { contentType = true } = options;

    if( !options.headers ) {
        options.headers = {};
    }

    if( contentType && !options.headers[ 'Content-Type' ] ) {
        options.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    return request( url, options );
}

export { request, get, post };

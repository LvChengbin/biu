import LocalCache from '@lvchengbin/localcache';
import isString from '@lvchengbin/is/src/string';
import Response from './response';

const localcache = new LocalCache( 'BIU-REQUEST-VERSION-1.0.0' );

function set( url, data, options ) {
    localcache.set( url, data, options );
}

function get( key, options = {} ) {
    const storages = options.storages || LocalCache.STORAGES;

    if( !isString( key ) ) {
        key = key.toString();
    }

    return localcache.get( key, storages, options.options ).then( result => {
        const response = new Response( {
            url : key,
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

export default { localcache, set, get };

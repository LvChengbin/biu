import LocalCache from '@lvchengbin/localcache';
import Response from './response';

const localcache = new LocalCache( 'BIU-REQUEST-VERSION-1.0.0' );

function set( key, data, options ) {
    const url = new URL( key );
    url.searchParams.sort();

    localcache.set( url.toString(), data, options );
}

function get( key, options = {} ) {

    let url = new URL( key ); 

    url.searchParams.sort();

    const storages = options.storages || LocalCache.STORAGES;

    url = url.toString();

    return localcache.get( url, storages, options.get ).then( result => {
        const response = new Response( {
            url,
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

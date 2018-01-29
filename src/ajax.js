import Promise from '@lvchengbin/promise';
import { URLSearchParams } from '@lvchengbin/url';
import isUndefined from '@lvchengbin/is/src/undefined';
import isFunction from '@lvchengbin/is/src/function';

export default ( url, options = {} ) => {

    let {
        data,
        params,
        timeout,
        asynchronous = true,
        method = 'GET',
        headers = {},
        onprogress,
        credentials = 'omit',
        responseType = 'text',
        xhr = new XMLHttpRequest()
    } = options;

    method = method.toUpperCase();

    xhr.timeout = timeout;

    return new Promise( ( resolve, reject ) => {

        xhr.withCredentials = credentials === 'include';

        const onreadystatechange = () => {
            if( xhr.readyState != 4 ) return;
            if( xhr.status === 0 ) return;

            const response = {
                body : responseType !== 'text' ? xhr.response : xhr.responseText,
                status : xhr.status,
                statusText : xhr.statusText,
                headers : xhr.getAllResponseHeaders()
            };


            resolve( response );

            xhr = null;
        };

        if( !URLSearchParams.prototype.isPrototypeOf( params ) ) {
            params = new URLSearchParams( params );
        }

        params = params.toString();
        
        if( params ) {
            url += ( url.indexOf( '?' ) > -1 ? '&' : '?' ) + params;
        }

        xhr.open( method, url, asynchronous );

        xhr.onerror = e => {
            reject( e );
            xhr = null;
        };
        
        xhr.ontimeout = () => {
            reject( 'Timeout' );
            xhr = null;
        };

        if( isFunction( onprogress ) ) {
            xhr.onprogress = onprogress;
        }

        const isFormData = FormData.prototype.isPrototypeOf( data );

        for( let key in headers ) {
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
};



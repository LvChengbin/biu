import isString from '@lvchengbin/is/src/string';
import isUndefined from '@lvchengbin/is/src/undefined';

const Response = class {
    constructor( body, init ) {

        if( window.Response ) {
            return new window.Response( body, init );
        }

        if( !isString( body ) ) {
            return new TypeError( 'Response body must be a string "' + body + '"' );
        }

        this.__init = init;

        let status;

        if( init.status === '' ) {
            status = 200;
        } else {
            status = +init.status;
        }

        if( !isNaN( status ) || status < 200 || status > 599 ) {
            throw new RangeError( 'Failed to construct "Response": The status provided (0) is outside the range [200, 599].' );
        }

        Object.defineProperties( this, {
            body : {
                value : body,
                writeable : false
            },
            headers : {
                value : init.headers || {},
                writeable : false
            },
            status : {
                value : status,
                writeable : false
            },
            ok : {
                value : this.status >= 200 && this.status < 300,
                writeable : false
            },
            redirected : {
                value : false,
                writeable : false
            },
            statusText : {
                value : init.statusText,
                writeable : false
            },
            type : {
                value : init.type || 'default',
                writeable : false
            },
            url : {
                value : init.url || '',
                writeable : false
            },
            bodyUsed : {
                value : false,
                writeable : false
            }

        } );

        this.useFinalURL = '';
    }

    clone() {
        return new Response( this.body, this.__init )
    }

    error() {
    }

    redirect( url, status ) {
        const init = Object.assign( {}, this.__init, { url } );

        if( !isUndefined( status ) ) {
            init.status = status;
        }

        return new Response( this.body, init );
    }

    arrayBuffer() {
    }

    blob() {
    }

    formData() {
    }

    text() {
        return this.body;
    }

    json() {
        return JSON.parse( this.body );
    }
};

export default Response;

import Promise from '@lvchengbin/promise';
import isString from '@lvchengbin/is/src/string';
import isBlob from '@lvchengbin/is/src/blob';
import isFormData from '@lvchengbin/is/src/formdata';
import isDataView from '@lvchengbin/is/src/dataview';
import isArrayBuffer from '@lvchengbin/is/src/array-buffer';
import isArrayBufferView from '@lvchengbin/is/src/array-buffer-view';

import {
    support, isSearchParams, cloneBuffer,
    readBlobAsX, readArrayBufferAsText
} from './utils';

class Body {
    constructor( body ) {
        if( !body ) {
            this._bodyText = '';
        } else if( isString( body ) ) {
            this._bodyText = body;
        } else if( isBlob( body ) ) {
            this._bodyBlob = body;
        } else if( isFormData( body ) ) {
            this._bodyFormData = body;
        } else if( isSearchParams( body ) ) {
            this._bodyText = body.toString();
        } else if( support.blob && isDataView( body ) ) {
            this._bodyArrayBuffer = cloneBuffer( body.buffer );
            this._bodyInit = new Blob( [ this._bodyArrayBuffer ] );
        } else if( isArrayBuffer( body ) || isArrayBufferView( body ) ) {
            this._bodyArrayBuffer = cloneBuffer( body );
        } else {
            throw new TypeError( 'Unexpected body type.' );
        }
        this.bodyUsed = false;
    }

    arrayBuffer() {
        if( this._bodyArrayBuffer ) {
            return Promise.resolve( this._bodyArrayBuffer );
        } else {
            return this.blob().then( blob => {
                return readBlobAsX( blob, 'readAsArrayBuffer' )
            } );
        }
    }

    blob() {
        if( this._bodyBlob ) {
            return Promise.resolve( this._bodyBlob );
        }
        
        if( this._bodyArrayBuffer ) {
            return Promise.resolve( new Blob( [ this._bodyArrayBuffer ] ) )
        }
        
        if( this._bodyFormData ) {
            try {
                return Promise.resolve( new Blob( [ this._bodyFormData ] ) );
            } catch( e ) {
                throw new TypeError( 'Cannot read FormData as blob' );
            }
        }
    }

    text() {
        if( this._bodyBlob ) {
            return readBlobAsX( this._bodyBlob, 'readAsText' );
        }

        if( this._bodyArrayBuffer ) {
            return Promise.resolve( readArrayBufferAsText( this._bodyArrayBuffer ) );
        }

        if( this._bodyText ) {
            return Promise.resolve( this._bodyText );
        }

        throw new TypeError( 'Cannot read body as text' );
    }

    json() {
        return this.text().then( JSON.parse );
    }
}

export default Body;


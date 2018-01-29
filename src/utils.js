import { URLSearchParams } from '@lvchengbin/url';

function generators() {
    try {
        new Function( 'function* test() {}' )();
    } catch( e ) {
        return false;
    }
    return true;
}

function blob() {
    if( !( 'FileReader' in window ) ) return false;
    if( !( 'Blob' in window ) ) return false;
    try {
        new Blob();
        return true;
    } catch( e ) {
        return false;
    }
}

const support = {
    iterator : 'Symbol' in window && 'iterator' in Symbol,
    generators : generators(),
    searchParams : 'URLSearchParams' in window,
    blob : blob()
};

function isSearchParams( obj ) {
    if( URLSearchParams.prototype.isPrototypeOf( obj ) ) return true;
    return support.searchParams && window.URLSearchParams.prototype.isPrototypeOf( obj )
}

function cloneBuffer( buffer ) {
    if( buffer.slice ) {
        return buffer.slice( 0 );
    }

    // for IE 10 which does not support ArrayBuffer.prototype.slice
    const view = new Uint8Array( buffer.byteLength );
    view.set( new Uint8Array( buffer ) );
    return view.buffer;
}

function readBlobAsX( blob, x ) {
    return new Promise( ( resolve, reject ) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve( reader.result );
        };

        reader.onerror = () => {
            reject( reader.error );
        };

        reader[ x ]( blob );
    } );
}

function readArrayBufferAsText( arrayBuffer ) {
    const view = new Uint8Array( arrayBuffer );
    const seq = [];

    for( let i = 0, l = view.length; i < l; i += 1 ) {
        seq.push( String.fromCharCode( view[ i ] ) );
    }

    return seq.join( '' );
}

export default {
    support, isSearchParams, cloneBuffer,
    readBlobAsX, readArrayBufferAsText
};

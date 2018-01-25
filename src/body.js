import isString from '@lvchengbin/is/src/string';

class Body {
    constructor( body ) {
        if( !body ) {
            this._bodyText = '';
        } else if( isString( body ) ) {
        }
        this.bodyUsed = false;
    }

    arrayBuffer() {

    }

    blob() {
    }

    formData() {
    }

    text() {
    }

    json() {
    }

    _useBody() {
        if( this.bodyUsed ) {
            throw new TypeError( 'body stream already read' );
        }
        this.bodyUsed = true;
    }

}

export default Body;


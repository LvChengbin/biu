import jsonp from '../src/jsonp';    

describe( 'request', () => {
    describe( 'jsonp', () => {
        it( 'jsonp without specifying a callback function name', done => {
            jsonp( 'http://localhost:9877/jsonp/params', {
                data : {
                    x : 1,
                    y : 2
                }
            } ).then( response => {
                expect( +response.x ).toBe( 1 );
                done();
            } );
        } );
    } );
} );

import { URLSearchParams } from '@lvchengbin/url';
import ajax from '../src/ajax';
import config from './config';

describe( 'ajax', () => {
    it( 'get', done => {
        const api = config.api + '/ajax?x=1&y=2';
        ajax( api, {
            headers : {
                'x-custom-header' : 'ajax'
            }
        } ).then( response => {
            expect( response.status ).toEqual( 200 );
            expect( JSON.parse( response.body ) ).toEqual( {
                query : {
                    x : '1',
                    y : '2'
                },
                method : 'get',
                header : 'ajax'
            } );
            done();
        } ).catch( e => {
            console.log( e );
        } );
    } );

    it( 'get 404', done => {
        const api = config.api + '/deserted';
        ajax( api, {
            headers : {
                'x-custom-header' : 'ajax'
            }
        } ).then( response => {
            expect( response.status ).toEqual( 404 );
            done();
        } ).catch( e => {
            console.log( e );
        } );
    } );

    it( 'post urlencoded', done => {
        const api = config.api + '/ajax?x=1&y=2';
        ajax( api, {
            method : 'post',
            data : new URLSearchParams( {
                m : 1,
                n : 2
            } ).toString(),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'x-custom-header' : 'ajax'
            }
        } ).then( response => {
            expect( response.status ).toEqual( 200 );
            expect( JSON.parse( response.body ) ).toEqual( {
                query : {
                    x : '1',
                    y : '2'
                },
                method : 'post',
                header : 'ajax',
                body : {
                    m : '1',
                    n : '2'
                }
            } );
            done();
        } ).catch( e => {
            console.log( e );
        } );
    } );

    it( 'post text/plain', done => {
        const api = config.api + '/ajax?x=1&y=2';
        ajax( api, {
            method : 'post',
            data : 'ajax',
            headers : {
                'Content-Type' : 'text/plain'
            }
        } ).then( response => {
            expect( response.status ).toEqual( 200 );
            expect( JSON.parse( response.body ) ).toEqual( {
                query : {
                    x : '1',
                    y : '2'
                },
                method : 'post',
                body : 'ajax'
            } );
            done();
        } ).catch( e => {
            console.log( e );
        } );
    } );

    it( 'post multipart/form-data', done => {
        const formdata = new FormData();
        formdata.append( 'x', 1 );
        formdata.append( 'y', 2 );

        const api = config.api + '/formdata?x=1&y=2';
        ajax( api, {
            method : 'post',
            data : formdata,
            headers : {
                'content-type' : 'multipart/form-data'
            }
        } ).then( response => {
            expect( response.status ).toEqual( 200 );
            expect( JSON.parse( response.body ) ).toEqual( {
                query : {
                    x : '1',
                    y : '2'
                },
                method : 'post',
                body : {
                    x : '1',
                    y : '2'
                }
            } );
            done();
        } ).catch( e => {
            console.log( e );
        } );
    } );

    // I want to add a case for testing uploading a file with FormData
    // but I don't know how to do this in Chrome Headless, so I will add it
    // later after I know how to do that.
    /**
    it( 'post multipart/form-data with attachements', done => {

        const formdata = new FormData();
        formdata.append( 'x', 1 );
        formdata.append( 'y', 2 );

        const api = config.api + '/formdata?x=1&y=2';
        ajax( api, {
            method : 'post',
            data : formdata,
            headers : {
                'content-type' : 'multipart/form-data'
            }
        } ).then( response => {
            expect( response.status ).toEqual( 200 );
            expect( JSON.parse( response.body ) ).toEqual( {
                query : {
                    x : '1',
                    y : '2'
                },
                method : 'post',
                body : {
                    x : '1',
                    y : '2'
                }
            } );
            done();
        } ).catch( e => {
            console.log( e );
        } );
    } );
    */

} );

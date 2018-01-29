const Koa = require( 'koa' );
const body = require( 'koa-body' );
const logger = require( 'koa-logger' );
const Router = require( '@lvchengbin/koa-router' );

const app = new Koa();
const router = new Router( app );

app.use( logger() );
app.use( body( { multipart : true } ) );

router.options( '/deserted', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.set( 'Access-Control-Allow-Headers', 'x-custom-header' );
    ctx.body = {};
} );

router.get( '/deserted', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.res.statusCode = 404;
} );

router.options( '/ajax', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.set( 'Access-Control-Allow-Headers', 'x-custom-header' );
    ctx.body = {};
} );

router.get( '/ajax', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.body = {
        method : 'get',
        query : ctx.query,
        header : ctx.request.headers[ 'x-custom-header' ]
    };
} );

router.post( '/ajax', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.body = {
        method : 'post',
        body : ctx.request.body,
        query : ctx.query,
        header : ctx.request.headers[ 'x-custom-header' ]
    };
} );

router.options( '/formdata', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.set( 'Access-Control-Allow-Headers', 'x-custom-header' );
    ctx.body = {};
} );

router.post( '/formdata', async ctx => {
    console.log( ctx.request.body.fields );
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.body = {
        method : 'post',
        body : ctx.request.body.fields,
        query : ctx.query,
        header : ctx.request.headers[ 'x-custom-header' ]
    };
} );

app.listen( 50001 );

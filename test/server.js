const Koa = require( 'koa' );
const body = require( 'koa-body' );
const logger = require( 'koa-logger' );
const Router = require( '@lvchengbin/koa-router' );
const auth = require( '@lvchengbin/koa-basic-auth' );

const app = new Koa();
const router = new Router( app );

app.use( logger() );
app.use( body( { multipart : true } ) );

app.use( async ( ctx, next ) => {
    if( ctx.method === 'OPTIONS' ) {
        const origin = ctx.request.get( 'origin' );
        ctx.set( 'Access-Control-Allow-Origin', origin );
        ctx.set( 'Access-Control-Allow-Headers', 'x-custom-header, Authorization' );
        ctx.body = {};
    } else {
        next();
    }
} );

router.get( '/auth', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    if( !auth( 'n', 'p', ctx ) ) {
        ctx.res.statusCode = 401;
    } else {
        ctx.body = 'authorized';
    }
    
} );

router.get( '/deserted', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.res.statusCode = 404;
} );

router.get( '/md5', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.body = 'biu';
} );


router.get( '/ajax', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    const body = {
        method : 'get',
        query : ctx.query,
        header : ctx.request.headers[ 'x-custom-header' ]
    };

    for( let item in ctx.query ) {
        if( /^_\d+/.test( item ) ) {
            body.nocache = item;
        }
    }

    ctx.body = body;
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

router.get( '/simpleresponse', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.body = 'body';
} );

router.post( '/formdata', async ctx => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    ctx.body = {
        method : 'post',
        body : ctx.request.body.fields,
        query : ctx.query,
        header : ctx.request.headers[ 'x-custom-header' ]
    };
} );

router.get( '/jsonp', async ctx => {
    const callback = ctx.query.callback;
    ctx.body = `${callback}(${JSON.stringify(ctx.query)})`;
} );

app.listen( 50001 );

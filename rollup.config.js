import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default [ {
    input : 'src/index.js',
    plugins : [
        resolve( {
            module : true,
            jsnext : true
        } )
    ],
    output : [
        { file : 'dist/biu.cjs.js', format : 'cjs' },
        { file : 'dist/biu.js', format : 'umd', name : 'biu' }
    ]
}, {
    input : 'src/biu.js',
    plugins : [
        resolve( {
            module : true,
            jsnext : true
        } ),
        babel()
    ],
    output : [
        { file : 'dist/biu.bc.js', format : 'umd', name : 'biu' }
    ]
} ];

import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import bubel from 'rollup-plugin-buble';

export default {
    input: 'core/index.js',
    output: {
        file: 'build/bundle.js',
        format: 'umd',
        name:"log4redis"
    },
    external:[
        "redis","log4js"
    ],
    plugins: [
        json(),
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        }),
        bubel()
    ]
}

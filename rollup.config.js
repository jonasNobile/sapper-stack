import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup'
import pkg from './package.json'

import alias from '@rollup/plugin-alias'
import sveltePreprocess from 'svelte-preprocess'

const autoprefixer = require('autoprefixer')
const preprocess = sveltePreprocess({
    scss: {
        prependData: `
                    @import 'reset-css/sass/reset';
                    @import 'breakpoint-sass/stylesheets/breakpoint';
                    @import 'breakpoint-slicer/stylesheets/breakpoint-slicer';
                    @import 'src/style/imports/imports_loader';
                    @import 'src/style/config/config';
                    `,
    },
    postcss: {
        plugins: [autoprefixer],
    },
})

const aliases = alias({
    resolve: ['.svelte', '.js', '.scss'],
    entries: [
        { find: 'scripts', replacement: 'src/scripts' },
        { find: 'style', replacement: 'src/style' },
        { find: 'components', replacement: 'src/components' },
    ],
})

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const postcssOptions = {
    module: true,
}

const onwarn = (warning, onwarn) =>
    (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
    (warning.code === 'CIRCULAR_DEPENDENCY' &&
        /[/\\]@sapper[/\\]/.test(warning.message)) ||
    warning.code !== 'css-unused-selector' ||
    onwarn(warning)

export default {
    client: {
        input: config.client.input(),
        output: config.client.output(),
        plugins: [
            replace({
                'process.browser': true,
                'process.env.NODE_ENV': JSON.stringify(mode),
            }),
            svelte({
                preprocess,
                dev,
                hydratable: true,
                emitCss: true,
            }),
            aliases,
            resolve({
                browser: true,
                dedupe: ['svelte'],
            }),
            commonjs(),

            legacy &&
                babel({
                    extensions: ['.js', '.mjs', '.html', '.svelte'],
                    babelHelpers: 'runtime',
                    exclude: ['node_modules/@babel/**'],
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: '> 0.25%, not dead',
                            },
                        ],
                    ],
                    plugins: [
                        '@babel/plugin-syntax-dynamic-import',
                        [
                            '@babel/plugin-transform-runtime',
                            {
                                useESModules: true,
                            },
                        ],
                    ],
                }),

            !dev &&
                terser({
                    module: true,
                }),
        ],

        preserveEntrySignatures: false,
        onwarn,
    },

    server: {
        input: config.server.input(),
        output: config.server.output(),
        plugins: [
            replace({
                'process.browser': false,
                'process.env.NODE_ENV': JSON.stringify(mode),
            }),
            svelte({
                preprocess,
                generate: 'ssr',
                hydratable: true,
                dev,
            }),
            aliases,
            resolve({
                dedupe: ['svelte'],
            }),
            commonjs(),
        ],
        external: Object.keys(pkg.dependencies).concat(
            require('module').builtinModules
        ),

        preserveEntrySignatures: 'strict',
        onwarn,
    },

    serviceworker: {
        input: config.serviceworker.input(),
        output: config.serviceworker.output(),
        plugins: [
            resolve(),
            replace({
                'process.browser': true,
                'process.env.NODE_ENV': JSON.stringify(mode),
            }),
            commonjs(),
            !dev && terser(),
        ],

        preserveEntrySignatures: false,
        onwarn,
    },
}

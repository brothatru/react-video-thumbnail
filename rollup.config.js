import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
// Convert CJS modules to ES6, so they can be included in a bundle
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import postcssModules from 'postcss-modules';
const cssExportMap = {};


export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs'
    },
    // All the used libs needs to be here
    external: [
        'react',
        'react-dom'
    ],
    plugins: [
        resolve(),
        postcss({
            plugins: [
                postcssModules({
                    getJSON(id, exportTokens) {
                        cssExportMap[id] = exportTokens;
                    }
                })
            ],
            getExportNamed: false,
            getExport(id) {
                return cssExportMap[id];
            },
            extract: 'dist/styles.css',
            // extract: 'src/components/video-thumbnail.css'
        }),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                // left-hand side can be an absolute path, a path
                // relative to the current directory, or the name
                // of a module in node_modules
                // 'node_modules/prop-types/index.js': ['PropTypes']
            }
        }),
        babel({
            exclude: 'node_modules/**',
            babelrc: false,
            presets: [
                [
                    "env",
                    { "modules": false }
                ],
                "react"
            ],
            plugins: [
                "transform-class-properties",
                'external-helpers'
            ],
        })
    ]
}
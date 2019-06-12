const commonJs = require('rollup-plugin-commonjs')
const filesize = require('rollup-plugin-filesize')
const nodeResolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')

module.exports = [
  {
    input: 'index.js',
    output: {
      file: 'feather-route-matcher.js',
      exports: 'default',
      format: 'umd',
      name: 'createMatcher',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonJs(),
      filesize()
    ]
  },
  {
    input: 'index.js',
    output: {
      file: 'feather-route-matcher.min.js',
      exports: 'default',
      format: 'umd',
      name: 'createMatcher',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonJs(),
      uglify.uglify({ mangle: true, compress: true }),
      filesize()
    ]
  }
]

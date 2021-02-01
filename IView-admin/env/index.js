
'use strict'

console.log('VUE_CLI_SERVICE.mode ', process.VUE_CLI_SERVICE.mode)

let mode = (process.VUE_CLI_SERVICE && process.VUE_CLI_SERVICE.mode) || 'dev'
if (mode === 'development') mode = 'dev';
if (mode === 'production') mode = 'prod';

module.exports = require(`./env.${mode}`)
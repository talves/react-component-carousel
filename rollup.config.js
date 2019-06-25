// rollup.config.js
import config from 'ada-scripts/dist/config/rollup.config'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import css from 'rollup-plugin-css-only'

config.plugins.unshift(peerDepsExternal())
config.plugins.push(css({ output: './dist/component-carousel.css' }))

export default config;

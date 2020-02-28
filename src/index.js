const {version, date, hash, dev} = process.env
const build = dev ? 'dev' : 'prod'
// [strings]
console.log(`nature elsewhere v${version} ${date} #${hash} ${build}
   ┌>°┐
by │  │ddoid
   └──┘`)

import('../pkg/index.js').catch(console.error)

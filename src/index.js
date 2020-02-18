const {version, date, hash} = process.env
// [strings]
console.log(`nature elsewhere v${version} ${date} #${hash}
   ┌>°┐
by │  │ddoid
   └──┘`)

import('../pkg/index.js').catch(console.error)

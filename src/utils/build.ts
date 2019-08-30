export namespace Build {
  export const dev = process.env.NODE_ENV === 'development'
  export const {date, version, hash} = process.env
}

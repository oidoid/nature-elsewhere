export interface ShaderConfig {
  readonly uniforms: Readonly<Record<string, string>>
  readonly perVertex: readonly ShaderConfig.Attribute[]
  readonly perInstance: readonly ShaderConfig.Attribute[]
}

export namespace ShaderConfig {
  export interface Attribute {
    readonly type: GLDataType | string
    readonly name: string
    readonly len: number
  }
}

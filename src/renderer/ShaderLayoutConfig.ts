export interface ShaderLayoutConfig {
  readonly uniforms: Readonly<Record<string, string>>
  readonly perVertex: readonly ShaderLayoutConfig.Attribute[]
  readonly perInstance: readonly ShaderLayoutConfig.Attribute[]
}

export namespace ShaderLayoutConfig {
  export interface Attribute {
    readonly type: GLDataType | string
    readonly name: string
    readonly len: number
  }
}

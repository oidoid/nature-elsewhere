export interface ShaderLayout {
  readonly uniforms: Readonly<Record<string, string>>
  readonly perVertex: ShaderLayout.AttributeBuffer
  readonly perInstance: ShaderLayout.AttributeBuffer
}

export namespace ShaderLayout {
  export interface AttributeBuffer {
    readonly len: number
    readonly stride: number
    readonly divisor: number
    readonly attributes: readonly Attribute[]
  }

  export interface Attribute {
    readonly type: GLDataType
    readonly name: string
    readonly len: number
    readonly offset: number
  }

  export interface Config {
    readonly uniforms: Readonly<Record<string, string>>
    readonly perVertex: readonly AttributeConfig[]
    readonly perInstance: readonly AttributeConfig[]
  }

  export interface AttributeConfig {
    readonly type: GLDataType | string
    readonly name: string
    readonly len: number
  }
}

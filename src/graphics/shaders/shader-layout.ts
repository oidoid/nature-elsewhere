export interface ShaderLayout {
  readonly uniforms: Readonly<Record<string, string>>
  readonly perVertex: ShaderAttributeBufferLayout
  readonly perInstance: ShaderAttributeBufferLayout
}

export interface ShaderAttributeBufferLayout {
  readonly len: number
  readonly stride: number
  readonly divisor: number
  readonly attributes: readonly ShaderAttribute[]
}

export interface ShaderAttribute {
  readonly type: GLDataType
  readonly name: string
  readonly len: number
  readonly offset: number
}

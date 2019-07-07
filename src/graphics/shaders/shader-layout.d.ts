interface ShaderLayout {
  readonly uniforms: Readonly<Record<string, string>>
  readonly perVertex: ShaderAttributeBufferLayout
  readonly perInstance: ShaderAttributeBufferLayout
}

interface ShaderAttributeBufferLayout {
  readonly length: number
  readonly stride: number
  readonly divisor: number
  readonly attributes: readonly ShaderAttribute[]
}

interface ShaderAttribute {
  readonly type: GLDataType
  readonly name: string
  readonly length: number
  readonly offset: number
}

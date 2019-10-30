import {AnimatorConfig} from './AnimatorConfig'
import {AnimatorSerializer} from './AnimatorSerializer'

type Test = [string, number, number, AnimatorConfig]

test.each(<Test[]>[
  ['all defaults', 0, 0, undefined],
  ['period', 1, 0, {period: 1}],
  ['exposure', 0, 1, {exposure: 1}],
  ['all nondefaults', 2, 3, {period: 2, exposure: 3}]
])(
  '%# serialize %p {period: %p, exposure: %p} => %p',
  (_case, period, exposure, expected) => {
    const received = AnimatorSerializer.serialize({period, exposure})
    if (expected === undefined) expect(received).toBeUndefined()
    else expect(received).toStrictEqual(expected)
  }
)

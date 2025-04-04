import { createSignal, Signal, SignalOptions } from 'solid-js'
import { NotWrappable } from 'solid-js/store'
import { produce } from 'immer'

export function createImmerSignal<T>(
  value: Exclude<T, NotWrappable>,
  options?: SignalOptions<T>,
) {
  const [getter, setter] = createSignal<T>(value, options)

  type Value = Exclude<T, Function>
  type Producer = (draft: T) => void | T
  const immerSetter = (arg: Value | Producer) => {
    if (typeof arg === 'function') {
      setter((prev) => produce(prev, arg as Producer))
    } else {
      setter(arg as Value)
    }
  }

  return [getter, immerSetter] as const
}

export default createImmerSignal

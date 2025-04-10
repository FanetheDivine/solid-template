import 'solid-js'

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements extends globalThis.JSX.IntrinsicElements {}
  }
}

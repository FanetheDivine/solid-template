import { customElement } from 'solid-element'

type LeaferRectProps = {
  text: string
}

customElement('leafer-rect', { text: '' }, (props) => {
  return <>leafer-rect-{props.text}</>
})

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      'leafer-rect': LeaferRectProps
    }
  }
}

import { customElement } from 'solid-element'

export type LeaferRectProps = {
  text: string
}

customElement('leafer-rect', { text: '' }, (props) => {
  return <>leafer-rect-{props.text}</>
})

export namespace JSX {
  export interface IntrinsicElements {
    'leafer-rect': LeaferRectProps
  }
}

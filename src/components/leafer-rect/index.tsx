import { customElement } from 'solid-element'

export type LeaferBoxProps = {
  text: string
}

customElement('leafer-box', { text: '' }, (props) => {
  return <>leafer-box-{props.text}</>
})

export namespace JSX {
  export interface IntrinsicElements {
    'leafer-box': LeaferBoxProps
  }
}

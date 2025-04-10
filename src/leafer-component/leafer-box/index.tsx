import { customElement } from 'solid-element'

type LeaferBoxProps = {
  text: string
}

customElement('leafer-box', { text: '' }, (props) => {
  return <>leafer-box-{props.text}</>
})

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      'leafer-box': LeaferBoxProps
    }
  }
}

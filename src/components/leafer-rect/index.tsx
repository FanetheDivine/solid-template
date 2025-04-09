import { customElement } from 'solid-element'

type LeaferRectProps = {
  text: string
}

customElement<LeaferRectProps>('leafer-rect', { text: '' }, (props) => {
  return <>{props.text}</>
})

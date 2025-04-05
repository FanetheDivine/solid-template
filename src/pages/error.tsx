import { Component } from 'solid-js'

const Error: Component<{ err: any; reset: () => void }> = (props) => {
  console.log(props)
  return 'error 可以改一下/src/pages/page.tsx去除异常'
}
export default Error

import { ErrorBoundary, ParentComponent } from 'solid-js'
import Error from './error'

const Layout: ParentComponent = (props) => {
  return <>layout {props.children}</>
}

export default Layout

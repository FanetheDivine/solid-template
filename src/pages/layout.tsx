import { Route } from '@solidjs/router'

export default function Layout() {
  console.log(1)
  return (
    <div class='flex flex-col min-h-screen'>
      <Route></Route>
    </div>
  )
}

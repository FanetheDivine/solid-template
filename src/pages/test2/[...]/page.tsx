import { Component } from 'solid-js'
import { useParams } from '@solidjs/router'

const Page: Component = () => {
  const params = useParams()
  return 'rest:' + params.rest
}

export default Page

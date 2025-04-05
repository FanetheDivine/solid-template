import { Component } from 'solid-js'
import { useParams } from '@solidjs/router'

const Page: Component = () => {
  const params = useParams()
  return 'id:' + params.id
}

export default Page

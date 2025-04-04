import { useParams } from '@solidjs/router'

const Page = () => {
  const params = useParams()
  console.log(params)
  return <div>test1</div>
}

export default Page

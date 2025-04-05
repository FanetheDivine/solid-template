import { Component, createResource } from 'solid-js'
import { Button } from 'cui-solid'
import { absoluteCenter } from '@/styles'
import { cn } from '@/utils/classnames'
import { sleep } from '@/utils/sleep'

const Page: Component = () => {
  throw new Error('a')
  let num = 1
  const [data, { refetch }] = createResource(async () => {
    await sleep(2000)
    return ++num
  })
  return (
    <Button
      type='primary'
      onClick={refetch}
      class={cn(absoluteCenter, 'bg-black')}
    >
      点击loading{data()}
    </Button>
  )
}
export default Page

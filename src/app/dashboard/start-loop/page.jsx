import StartLoop from '@/components/start-loop'
import React from 'react'

async function Home({searchParams}) {
  const search = await searchParams
  console.log(search)
  return (
    <StartLoop />
  )
}

export default Home
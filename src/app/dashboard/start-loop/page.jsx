import StartLoop from '@/components/start-loop'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { getDocumentsByUser } from '@/app/actions/DocumentActions'

async function Home({searchParams}) {
  const search = await searchParams
  console.log(search)

  const { userId } = await auth()

  const documentsData = await getDocumentsByUser(userId)
  return (
    <StartLoop documentGallaryData={documentsData?.data} />
  )
}

export default Home
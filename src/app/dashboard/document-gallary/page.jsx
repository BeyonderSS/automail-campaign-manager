import { getDocumentsByUser } from '@/app/actions/DocumentActions'
import DocumentGallaryHome from '@/components/document-gallary'
import React from 'react'
import { auth } from '@clerk/nextjs/server'

async function page() {
  const { userId } = await auth()

  const documentsData = await getDocumentsByUser(userId)
  console.log(documentsData?.data)
  return (
    <DocumentGallaryHome documentsData={documentsData?.data}/>
  )
}

export default page
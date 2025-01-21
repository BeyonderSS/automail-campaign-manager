import { auth } from '@clerk/nextjs/server'
import { getUserMetadata } from '@/app/actions/CredentialActions'
import { CredentialManager } from '@/components/manage-credentials/CredentialManager'

export default async function CredentialsPage() {
  const { userId } = await auth()
  const userMetadata = await getUserMetadata(userId)

  const initialCredentials = [
    { id: 'smtpMail', name: 'SMTP Mail', value: userMetadata.data?.smtpMail || '', icon: "Mail" },
    { id: 'smtpPassword', name: 'SMTP Password', value: userMetadata.data?.smtpPassword || '', icon: "Lock" },
    { id: 'huggingfaceToken', name: 'Hugging Face Token', value: userMetadata.data?.huggingfaceToken || '', icon: "Brain" },
    { id: 'uploadThingToken', name: 'Upload Thing Token', value: userMetadata.data?.uploadThingToken || '', icon: "Cloud" },
  ]

  return <CredentialManager initialCredentials={initialCredentials} />
}


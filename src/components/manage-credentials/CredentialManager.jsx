'use client'

import { useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCredentials } from '@/hooks/useCredentials'
import { CredentialCard } from './CredentialCard'
import { useToast } from '@/hooks/use-toast'

export function CredentialManager({ initialCredentials }) {
  const { credentials, isLoading, error, updateCredential, saveCredentials } = useCredentials(initialCredentials)
  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    }
  }, [error, toast])

  const handleSaveAll = async () => {
    const result = await saveCredentials()
    if (result.success) {
      toast({
        title: 'Success',
        description: 'All credentials saved successfully',
      })
    }
  }

  const handleSaveIndividual = async (credential) => {
    const result = await saveCredentials([credential])
    if (result.success) {
      toast({
        title: 'Success',
        description: `${credential.name} saved successfully`,
      })
    }
  }

  return (
    <div className="space-y-6 my-2 mx-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Credential Manager</h1>
        <Button onClick={handleSaveAll} disabled={isLoading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Credentials'}
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {credentials.map((cred) => (
          <CredentialCard
            key={cred.id}
            {...cred}
            onChange={updateCredential}
            onSave={handleSaveIndividual}
          />
        ))}
      </div>
    </div>
  )
}


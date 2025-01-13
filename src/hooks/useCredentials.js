
import { useState, useCallback } from 'react'
import { updateCredentials } from '@/app/actions/CredentialActions'
import { useAuth } from '@clerk/nextjs'

export function useCredentials(initialCredentials) {
  const [credentials, setCredentials] = useState(initialCredentials)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { userId } = useAuth()

  const updateCredential = useCallback((id, value) => {
    setCredentials(prev => prev.map(cred => cred.id === id ? { ...cred, value } : cred))
  }, [])

  const saveCredentials = useCallback(async (credentialsToSave) => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    const credentialsToUpdate = credentialsToSave || credentials
    const credentialsObject = credentialsToUpdate.reduce((acc, cred) => {
      if (cred.value) acc[cred.id] = cred.value
      return acc
    }, {})

    try {
      const result = await updateCredentials(userId, credentialsObject)
      if (!result.success) {
        setError(result.error || 'Failed to update credentials')
      }
      return result
    } catch (err) {
      setError('An error occurred while saving credentials')
      return { success: false, error: 'An error occurred while saving credentials' }
    } finally {
      setIsLoading(false)
    }
  }, [userId, credentials])

  return {
    credentials,
    isLoading,
    error,
    updateCredential,
    saveCredentials
  }
}


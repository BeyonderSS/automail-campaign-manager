import { useState, useCallback } from 'react';
import { updateCredentials } from '@/app/actions/CredentialActions';
import { useAuth } from '@clerk/nextjs';

export function useCredentials(initialCredentials) {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userId } = useAuth();

  // Update a specific credential by ID
  const updateCredential = useCallback((id, value) => {
    setCredentials((prev) =>
      prev.map((cred) => (cred.id === id ? { ...cred, value } : cred))
    );
  }, []);

  // Save credentials (all or specific ones)
  const saveCredentials = useCallback(
    async (credentialsToSave = credentials) => {
      if (!userId) {
        setError('User is not authenticated.');
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsLoading(true);
      setError(null);

      const credentialsObject = credentialsToSave.reduce((acc, cred) => {
        if (cred.value) acc[cred.id] = cred.value;
        return acc;
      }, {});

      if (Object.keys(credentialsObject).length === 0) {
        setIsLoading(false);
        setError('No credentials to save.');
        return { success: false, error: 'No credentials to save.' };
      }

      try {
        const result = await updateCredentials(userId, credentialsObject);
        if (!result.success) {
          setError(result.error || 'Failed to update credentials.');
          return result;
        }
        return result;
      } catch (err) {
        setError('An error occurred while saving credentials.');
        return { success: false, error: 'An error occurred while saving credentials.' };
      } finally {
        setIsLoading(false);
      }
    },
    [userId, credentials]
  );

  return {
    credentials,
    isLoading,
    error,
    updateCredential,
    saveCredentials,
  };
}

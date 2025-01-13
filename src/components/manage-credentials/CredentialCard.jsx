import { useState } from 'react'
import { Eye, EyeOff, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import * as Icons from 'lucide-react'

export function CredentialCard({ id, name, value, icon, onChange, onSave }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const Icon = Icons[icon]

  const handleSave = async () => {
    setIsSaving(true)
    await onSave({ id, name, value, icon })
    setIsSaving(false)
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {name}
        </CardTitle>
        <CardDescription>Manage your {name.toLowerCase()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={id}>{name}</Label>
          <div className="flex">
            <Input
              id={id}
              type={isVisible ? 'text' : 'password'}
              value={value}
              onChange={(e) => onChange(id, e.target.value)}
              className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              variant="outline"
              size="icon"
              className="rounded-l-none border-l-0"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save'}
        </Button> */}
      </CardFooter>
    </Card>
  )
}


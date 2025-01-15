'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { initializeLoop } from '@/app/actions/Loops'

import { useAuth } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Zod schema for form validation
const loopSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
})

export default function InitialiseLoop({ onSuccess }) {
  const { isLoaded, userId } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loopSchema), // Integrate Zod validation with React Hook Form
  })

  const handleFormSubmit = async (data) => {
    console.log("Form submitted with data:", data)

    const { title, description } = data

    try {
      const result = await initializeLoop(userId, title, description)
      console.log("Loop initialization result:", result)

      if (result.success) {
        console.log("Loop initialized successfully:", result.data)
        onSuccess(result.data)
      } else {
        console.error("Error initializing loop:", result.error)
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Enter Loop Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('title')}
              placeholder="Loop Title"
              className={`border ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.title && <div className="text-red-500">{errors.title.message}</div>}
          </div>

          <div>
            <Textarea
              {...register('description')}
              placeholder="Loop Description"
              className={`border ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && <div className="text-red-500">{errors.description.message}</div>}
          </div>

          <Button type="submit" className="w-full">Save and Continue</Button>
        </form>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Upload, File, X } from 'lucide-react'
import { parseFile } from '../utils/fileUtils.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function FileUploader({ onUpload }) {
  const [fileData, setFileData] = useState([])
  const [fields, setFields] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState('')

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setFileName(file.name)
      setIsLoading(true)
      setUploadProgress(0)
      try {
        const { data, extractedFields } = await parseFile(file, (progress) => {
          setUploadProgress(progress)
        })
        setFileData(data)
        setFields(extractedFields)
        onUpload(data, extractedFields)
      } catch (error) {
        console.error('Error parsing file:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.oasis.opendocument.spreadsheet': ['.ods']
    },
    multiple: false
  })

  const resetUpload = () => {
    setFileData([])
    setFields([])
    setFileName('')
    setUploadProgress(0)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Upload Your File With Emails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-lg">Drop the file here...</p>
          ) : (
            <p className="text-lg">Drag & drop a file here, or click to select a file</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: .csv, .xlsx, .xls, .ods
          </p>
        </div>

        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploading {fileName}</span>
              <span className="text-sm font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {fileData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <File className="w-5 h-5 text-primary" />
                <span className="font-medium">{fileName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetUpload}>
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {fields.map((field, index) => (
                      <TableHead key={index} className="px-4 py-2 bg-gray-100">
                        {field}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileData.slice(0, 5).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {fields.map((field, cellIndex) => (
                        <TableCell key={cellIndex} className="px-4 py-2">
                          {row[field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {fileData.length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                Showing 5 of {fileData.length} rows
              </p>
            )}
            <Button onClick={() => onUpload(fileData, fields)} className="w-full">
              Continue to Email Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


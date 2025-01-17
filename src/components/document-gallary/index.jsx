"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon, UploadCloud } from "lucide-react";
import { ReusableAlert } from "../ui/ReusableAlert";
import { useAuth } from "@clerk/nextjs";
import { createDocument, deleteDocument } from "@/app/actions/DocumentActions";
import { UploadDropzone } from "@/utils/uploadthing";

// Component for rendering document card
const DocumentCard = ({ doc, selectedDocument, setSelectedDocument, handleDelete }) => (
  <Card
    key={doc._id}
    className={`cursor-pointer transition-all hover:shadow-md ${
      selectedDocument?._id === doc._id ? "ring-2 ring-primary" : ""
    }`}
    onClick={() => setSelectedDocument(doc)}
  >
    <CardContent className="flex flex-col items-center p-4">
      <FileTextIcon className="h-12 w-12 text-blue-500" />
      <p className="mt-2 w-full truncate text-center text-sm">{doc.title}</p>
      <ReusableAlert
        triggerText="Delete Document"
        triggerProps={{
          className: "mt-2",
          variant: "destructive",
        }}
        dialogTitle="Confirm Document Deletion"
        dialogDescription={`Are you sure you want to delete "${doc.title}"? This action cannot be undone.`}
        cancelText="Cancel"
        actionText="Delete"
        onAction={() => {
          handleDelete(doc._id);
        }}
      />
    </CardContent>
  </Card>
);

// Component for handling document upload
const UploadDocument = ({ isUploading, setIsUploading, handleUpload }) => (
  <ReusableAlert
    triggerText={<UploadCloud />}
    triggerProps={{ variant: "" }}
    dialogTitle="Confirm Document Upload"
    dialogDescription="Are you sure you want to upload your document(s)?"
    cancelText="No, Cancel"
    onCancel={() => console.log("Upload canceled.")}
    isLoading={isUploading}
  >
    <UploadDropzone
      endpoint="documentUploader"
      onClientUploadComplete={(response) => {
        setIsUploading(false);
        response.forEach((file) => {
          handleUpload(file.name, file.url, file.key);
        });
      }}
      onUploadError={(error) => {
        setIsUploading(false);
        console.error("Upload failed:", error);
      }}
    />
  </ReusableAlert>
);

// Component for rendering document preview
const DocumentPreview = ({ selectedDocument }) => (
  <div className="relative h-[calc(100vh-350px)]">
    {selectedDocument ? (
      <iframe
        src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
          selectedDocument.url
        )}`}
        className="h-full w-full border-0"
        title={`Preview of ${selectedDocument.title}`}
      />
    ) : (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a document to preview
      </div>
    )}
  </div>
);

// Component for rendering document details
const DocumentDetails = ({ selectedDocument }) => (
  <div>
    <h3 className="mb-2 font-semibold">Document Details</h3>
    <p>
      <strong>Title:</strong> {selectedDocument.title}
    </p>
    <p>
      <strong>URL:</strong> {selectedDocument.url}
    </p>
  </div>
);

export default function DocumentGalleryHome({ documentsData }) {
  const { userId } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (title, url, fileKey) => {
    try {
      const response = await createDocument({ title, url, fileKey, userId });
      // Optionally handle response or refresh document data here
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteDocument(id);
    setSelectedDocument(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Document Gallery</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Documents</h2>
              <UploadDocument
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                handleUpload={handleUpload}
              />
            </div>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {documentsData.map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    doc={doc}
                    selectedDocument={selectedDocument}
                    setSelectedDocument={setSelectedDocument}
                    handleDelete={handleDelete}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                <DocumentPreview selectedDocument={selectedDocument} />
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <DocumentDetails selectedDocument={selectedDocument} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import InitialiseLoop from "./InitialiseLoop";
import { FileUploader } from "./FileUploader";
import { EmailEditor } from "./EmailEditor";
import { createEmailQueueForLoop } from "@/app/actions/Loops";
import { EmailPreview } from "./EmailPreview";

export default function StartLoop() {
  const [step, setStep] = useState(1);
  const [isCsvUploaded, setIsCsvUploaded] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState(null);
  const [loopData, setLoopData] = useState(null);
  const [emailQueueData, setEmailQueueData] = useState([
    {
      email: "",
      dynamicFields: {},
      subject: "",
      body: "",
      documentGallary: null,
    },
  ]);
  const [error, setError] = useState(null); // State for error tracking
  const [currentIndex, setCurrentIndex] = useState(0); // Index for preview navigation

  const handleLoopDetailsSuccess = (data) => {
    setLoopData(data);
    setStep(2);
  };

  // Function to replace dynamic fields in template text
  const populateDynamicFields = (templateText, dynamicFields) => {
    let populatedText = templateText;

    // Loop through dynamic fields and replace placeholders in the template
    Object.keys(dynamicFields).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g"); // Create regex for dynamic field
      populatedText = populatedText.replace(regex, dynamicFields[key] || "");
    });

    return populatedText;
  };

  // Handle file upload and generate email queue data
  const handleFileUpload = (data, fields, emails) => {
    setIsCsvUploaded(true);

    // Create the emailQueueData from the CSV data and email template
    const queueData = data.map((row) => {
      const dynamicFields = {};

      // Loop through fields and populate dynamic fields
      fields.forEach((field) => {
        dynamicFields[field] = row[field] || ""; // Populate dynamic fields
      });

      // Assume the first email field is the email column
      const email = row.email || "";

      return {
        email,
        dynamicFields,
        subject: emailTemplate?.subject || "",
        body: emailTemplate?.body || "",
        documentGallary: loopData?.documentGallary || null,
      };
    });

    setEmailQueueData(queueData);
  };

  // Handle email template saving and error handling
  const handleEmailTemplateSave = async (template) => {
    try {
      setEmailTemplate(template);

      // Update the emailQueueData with the new template's subject and body
      const updatedQueueData = emailQueueData.map((item) => ({
        ...item,
        subject: populateDynamicFields(template.subject, item.dynamicFields),
        body: populateDynamicFields(template.body, item.dynamicFields),
      }));

      setEmailQueueData(updatedQueueData);

      // Optionally save to the backend
      const response = await createEmailQueueForLoop(
        loopData._id,
        updatedQueueData,
      );

      if (!response.success) {
        throw new Error(
          response.error || "An error occurred while creating email queues.",
        );
      }

      // Handle success
      console.log("Email queue created successfully:", response.message);
      setStep(3);
    } catch (error) {
      // Set error message in state
      setError(
        error.message ||
          "An unexpected error occurred while processing the email template.",
      );
    }
  };

  // Display error if it exists
  const renderError = () => {
    if (error) {
      return (
        <div className="mt-4 text-red-500">
          <strong>Error:</strong> {error}
        </div>
      );
    }
  };
  const handleNavigatePreview = (index) => {
    setCurrentIndex(index);
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center justify-center py-4">
        <ProgressBar currentStep={step} totalSteps={3} />
      </div>
      <div className="mt-8">
        {step === 1 && <InitialiseLoop onSuccess={handleLoopDetailsSuccess} />}

        {step === 2 &&
          (!isCsvUploaded ? (
            <FileUploader onUpload={handleFileUpload} />
          ) : (
            <EmailEditor
              fields={
                emailQueueData.length > 0
                  ? Object.keys(emailQueueData[0].dynamicFields)
                  : []
              }
              onSave={handleEmailTemplateSave}
            />
          ))}
        {step === 3 && (
          <EmailPreview
            emailTemplate={emailQueueData[currentIndex]}
            previewData={emailQueueData[currentIndex].dynamicFields}
            totalRecords={emailQueueData.length}
            currentIndex={currentIndex}
            onNavigate={handleNavigatePreview}
          />
        )}
      </div>
      {renderError()} {/* Render the error message */}
    </main>
  );
}
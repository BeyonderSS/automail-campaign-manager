"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

// Zod Schema for Validation
const EmailSchema = z.object({
  subject: z.string(),
  body: z.string(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .optional(),
  documentGallary: z
    .object({
      title: z.string(),
      url: z.string(),
    })
    .optional(),
});

export function EmailPreview({ emailTemplate = [], totalRecords = 0 }) {
  // Validate emailTemplate using Zod
  const parsedEmails = z.array(EmailSchema).safeParse(emailTemplate);

  if (!parsedEmails.success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }} // Simplified animation
        className="text-center text-red-500"
      >
        Invalid email data provided.
      </motion.div>
    );
  }

  const validEmails = parsedEmails.data;

  const [currentIndex, setCurrentIndex] = useState(0); // Index for preview navigation
  const currentEmail = validEmails[currentIndex];

  const handleNavigatePreview = (index) => {
    setCurrentIndex(index);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="email-preview-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }} // Modern and minimalistic
        className="mx-auto w-full max-w-4xl"
      >
        <Card className="shadow-lg dark:bg-gray-light dark:border-gray-lighter">
          <CardHeader>
            <motion.div
              key="email-preview-header"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }} // Simplified animation
            >
              <CardTitle className="text-center text-xl font-bold dark:text-gray-light">
                Email Preview
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            {validEmails.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }} // Minimalistic transition
                  className="space-y-6"
                >
                  {/* Subject */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Subject:
                    </h3>
                    <p className="text-gray-900 dark:text-gray-100">{currentEmail.subject}</p>
                  </div>

                  {/* Body */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Body:
                    </h3>
                    <div
                      className="prose max-w-none rounded-md border bg-gray-50 p-4 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      style={{
                        wordBreak: "break-word", // Ensures long words break properly
                        overflowWrap: "break-word", // Handles unbreakable content
                        overflow: "auto", // Adds scrollbars if content overflows
                      }}
                      dangerouslySetInnerHTML={{
                        __html: currentEmail.body,
                      }}
                    />
                  </div>

                  {/* Attachments */}
                  {currentEmail.attachments &&
                    currentEmail.attachments.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          Attachments:
                        </h3>
                        <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200">
                          {currentEmail.attachments.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {/* Document Gallery */}
                  {currentEmail.documentGallary && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Attachment:
                      </h3>
                      <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200">
                        <Link href={"/dashboard/document-gallary"}>
                          <li>{currentEmail.documentGallary.title}</li>
                        </Link>
                      </ul>
                    </div>
                  )}

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Previewing{" "}
                      <span className="mx-1 rounded-md bg-purple-600 px-2 py-1 text-xs text-white">
                        {currentIndex + 1}
                      </span>{" "}
                      of{" "}
                      <span className="mx-1 rounded-md bg-purple-600 px-2 py-1 text-xs text-white">
                        {totalRecords}
                      </span>
                    </span>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300"
                        onClick={() =>
                          handleNavigatePreview(Math.max(0, currentIndex - 1))
                        }
                        disabled={currentIndex === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="primary"
                        className="dark:bg-purple-700 dark:hover:bg-purple-600"
                        onClick={() =>
                          handleNavigatePreview(
                            Math.min(validEmails.length - 1, currentIndex + 1),
                          )
                        }
                        disabled={currentIndex === validEmails.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }} // Faster and smoother
                className="text-center text-gray-500 dark:text-gray-400"
              >
                No emails available to preview.
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

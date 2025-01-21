"use client";

import { useState, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marked } from "marked";
import { streamAIEmailTemplate } from "@/app/actions/emailAction";
import {
  Loader2,
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  LinkIcon,
  Paperclip,
  Lock,
} from "lucide-react";

const emailTemplates = [
  {
    id: "template1",
    name: "Job Application Follow-up",
    subject: "Following Up on {{position}} Application",
    body: `<p>Dear <strong>{{name}}</strong>,</p>
<p>I hope this email finds you well. I recently applied for the <strong>{{position}}</strong> position at <strong>{{company}}</strong> and wanted to follow up on the status of my application.</p>
<p>I am very excited about the opportunity to contribute to your team and would appreciate any information you can provide regarding the next steps in the hiring process.</p>
<p>Thank you for your time and consideration.</p>
<p>Best regards,<br>[Your Name]</p>`,
  },
  {
    id: "template2",
    name: "Networking Introduction",
    subject: "Connecting with {{name}} from {{company}}",
    body: `<p>Hello <strong>{{name}}</strong>,</p>
<p>I hope this email finds you well. My name is [Your Name], and I came across your profile while researching <strong>{{company}}</strong>. I'm impressed by your role as <strong>{{position}}</strong> and would love to connect.</p>
<p>I'm currently exploring opportunities in the industry and would greatly appreciate the chance to learn more about your experiences at <strong>{{company}}</strong>. Would you be open to a brief chat or coffee meeting in the coming weeks?</p>
<p>Thank you for your time, and I look forward to potentially connecting.</p>
<p>Best regards,<br>[Your Name]</p>`,
  },
];

export function EmailEditor({
  onSave,
  fields,
  documentGallaryData,
  isAiEnabled,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [useAI, setUseAI] = useState(false);
  const [emailPurpose, setEmailPurpose] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Placeholder.configure({
        placeholder: "Write your email body here...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setSelectedTemplate(editor.getHTML());
    },
  });

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
    const template = emailTemplates.find((t) => t.id === value);
    if (template && editor) {
      editor.commands.setContent(template.body);
      setSubject(template.subject);
    }
  };

  const insertDynamicField = (field) => {
    if (editor) {
      editor.commands.insertContent(`{{${field}}}`);
    }
  };

  const generateAIContent = async () => {
    if (!emailPurpose) return;

    setIsGenerating(true);
    editor.commands.setContent("");
    setSubject("");

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await streamAIEmailTemplate(emailPurpose, fields); // Pass dynamic fields
      const reader = response.getReader();
      let textBuffer = ""; // Buffer to accumulate partial JSON data

      while (true) {
        const { done, value } = await reader.read();
        if (done || signal.aborted) break;

        const chunk = new TextDecoder().decode(value);
        textBuffer += chunk; // Accumulate chunks

        // Attempt to parse JSON when we have complete data
        try {
          const emailData = JSON.parse(textBuffer);

          if (emailData.subject) {
            setSubject(emailData.subject); // Set the subject
          }

          if (emailData.body) {
            const htmlContent = marked(emailData.body); // Convert Markdown to HTML
            editor.commands.setContent(htmlContent); // Set the body content
          }

          textBuffer = ""; // Clear the buffer after successful parsing
        } catch (err) {
          // JSON is incomplete; keep accumulating chunks
        }
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <Card className="mx-auto w-full max-w-4xl dark:bg-gray">
      <CardContent className="space-y-6 p-6">
        <h2 className="mb-6 text-center text-2xl font-semibold text-purple-dark dark:text-purple">
          Create Email Template
        </h2>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger disabled={!isAiEnabled} value="ai">
              {isAiEnabled ? (
                "AI Assistant"
              ) : (
                <>
                  <Lock className="mx-2 h-4" /> AI Assistant{" "}
                  <span className="sr-only">
                    Go to manage credentials and add Hugging Face token to
                    enable this feature.
                  </span>
                </>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <div className="space-y-4">
              <Label htmlFor="template-select">Select Template</Label>
              <Select onValueChange={handleTemplateChange}>
                <SelectTrigger id="template-select">
                  <SelectValue placeholder="Select email template" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          <TabsContent value="ai">
            <div className="space-y-4">
              <Label htmlFor="email-purpose">Email Purpose</Label>
              <Textarea
                id="email-purpose"
                placeholder="Describe the purpose of your email..."
                value={emailPurpose}
                onChange={(e) => setEmailPurpose(e.target.value)}
                className="min-h-[100px]"
              />
              {isGenerating ? (
                <Button onClick={cancelGeneration} variant="destructive">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancel Generation
                </Button>
              ) : (
                <Button
                  onClick={generateAIContent}
                  disabled={!emailPurpose}
                  className="w-full"
                >
                  Generate AI Content
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            className="dark:bg-gray-light"
          />
        </div>

        <div className="space-y-2">
          <Label>Email Body</Label>
          <div className="overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-2 border-b border-gray-300 bg-gray-200 p-2 dark:border-gray-600 dark:bg-gray-light">
              <Button
                className=""
                onClick={() => editor?.chain().focus().toggleBold().run()}
                variant={editor?.isActive("bold") ? "secondary" : "ghost"}
                size="sm"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                variant={editor?.isActive("italic") ? "secondary" : "ghost"}
                size="sm"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                variant={editor?.isActive("underline") ? "secondary" : "ghost"}
                size="sm"
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
                size="sm"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                variant={
                  editor?.isActive("orderedList") ? "secondary" : "ghost"
                }
                size="sm"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  const url = prompt("Enter the URL:");
                  if (url) {
                    editor?.chain().focus().setLink({ href: url }).run();
                  }
                }}
                variant="ghost"
                size="sm"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
            <EditorContent
              editor={editor}
              className="min-h-[200px] bg-white p-4 dark:bg-gray-lighter"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachments" className="flex items-center space-x-2">
            <Paperclip className="h-4 w-4" />
            <span>Mail Attachments</span>
          </Label>
          {documentGallaryData.length > 0 ? (
            <Select onValueChange={(value) => setAttachments(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Document for attachment" />
              </SelectTrigger>
              <SelectContent>
                {documentGallaryData.map((document) => (
                  <SelectItem key={document._id} value={document}>
                    {document.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Link href="dashboard/document-gallary">Upload Your Documents</Link>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Available dynamic fields:</p>
          <div className="flex flex-wrap gap-2">
            {fields.map((field) => (
              <Button
                key={field}
                variant="outline"
                size="sm"
                onClick={() => insertDynamicField(field)}
                className="bg-purple/10 hover:bg-purple/20"
              >
                {`${field}`}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={() =>
            onSave({ subject, body: editor?.getHTML(), attachments })
          }
          className="w-full bg-purple text-white hover:bg-purple-dark"
        >
          Continue to Preview
        </Button>
      </CardContent>
    </Card>
  );
}

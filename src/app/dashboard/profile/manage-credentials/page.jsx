import { auth } from "@clerk/nextjs/server";
import { getUserMetadata } from "@/app/actions/CredentialActions";
import { CredentialManager } from "@/components/manage-credentials/CredentialManager";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CredentialsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Credential Manager</h1>

            <Skeleton className={"h-8 w-52"} />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      }
    >
      <CredentialWrapper />
    </Suspense>
  );
}

async function CredentialWrapper(params) {
  const { userId } = await auth();
  const userMetadata = await getUserMetadata(userId);

  const initialCredentials = [
    {
      id: "smtpMail",
      name: "SMTP Mail",
      value: userMetadata.data?.smtpMail || "",
      icon: "Mail",
    },
    {
      id: "smtpPassword",
      name: "SMTP Password",
      value: userMetadata.data?.smtpPassword || "",
      icon: "Lock",
    },
    {
      id: "huggingfaceToken",
      name: "Hugging Face Token",
      value: userMetadata.data?.huggingfaceToken || "",
      icon: "Brain",
    },
    {
      id: "uploadThingToken",
      name: "Upload Thing Token",
      value: userMetadata.data?.uploadThingToken || "",
      icon: "Cloud",
    },
  ];

  return <CredentialManager initialCredentials={initialCredentials} />;
}

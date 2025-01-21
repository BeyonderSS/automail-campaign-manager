import StartLoop from "@/components/start-loop";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { getDocumentsByUser } from "@/app/actions/DocumentActions";
import { getUserMetadata } from "@/app/actions/CredentialActions";

async function Home({ searchParams }) {
  const search = await searchParams;
  console.log(search);

  const { userId } = await auth();
  const tokenData = await getUserMetadata(userId);

  const isAiEnabled = tokenData.data.huggingfaceToken ? true : false;

  console.log(isAiEnabled, tokenData.data.huggingfaceToken);
  const documentsData = await getDocumentsByUser(userId);
  return (
    <StartLoop
      searchParams={search}
      documentGallaryData={documentsData?.data}
      isAiEnabled={isAiEnabled}
    />
  );
}

export default Home;

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { auth } from "@clerk/nextjs/server";
import { getUserMetadata } from "@/app/actions/CredentialActions";

let cachedToken = null; // Token cache
let cacheTimestamp = null; // Timestamp for cache validation
const TOKEN_CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

async function getUTtoken() {
  try {
    // Check if the cached token is still valid
    if (cachedToken && cacheTimestamp && Date.now() - cacheTimestamp < TOKEN_CACHE_TTL) {
      return cachedToken;
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const userMetadata = await getUserMetadata(userId);
    const token = userMetadata.data.uploadThingToken;

    if (!token) {
      throw new Error("UploadThing token not found in user metadata");
    }

    // Cache the token and update the timestamp
    cachedToken = token;
    cacheTimestamp = Date.now();

    return token;
  } catch (error) {
    console.error("Error fetching UT token:", error);
    return null;
  }
}

export async function GET() {
  try {
    const token = await getUTtoken();
    console.log("GET Token", token);

    if (!token) {
      throw new Error("Failed to retrieve UploadThing token");
    }

    return createRouteHandler({
      router: ourFileRouter,
      config: { token },
    }).GET();
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const token = await getUTtoken();
    console.log("POST Token", token);

    if (!token) {
      throw new Error("Failed to retrieve UploadThing token");
    }

    return createRouteHandler({
      router: ourFileRouter,
      config: { token },
    }).POST(req);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

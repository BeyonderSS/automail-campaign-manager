import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function UserProfileButton() {
  const user = await currentUser();

  return (
    <div className="flex items-center space-x-2">
      <Image
        src={user?.imageUrl}
        className="rounded-md"
        alt="Profile"
        width={32}
        height={32}
      />
      <div className="flex flex-col">
        <span className="text-sm text-gray-800 dark:text-gray-200">
          {user?.fullName}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {user?.primaryEmailAddress.emailAddress}
        </span>
      </div>
    </div>
  );
}

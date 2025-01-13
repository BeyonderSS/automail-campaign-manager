import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="min-h-screen flex justify-center items-center my-2">
    <UserProfile path="/dashboard/profile" />
  </div>
);

export default UserProfilePage;

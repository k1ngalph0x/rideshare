import { User } from "../types/user";

interface ProfileCardProps {
  user?: User | null;
}

// const formatDate = (dateString: string): string => {
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       return "Date not available";
//     }
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   } catch {
//     return "Date not available";
//   }
// };

export const ProfileCard = ({ user }: ProfileCardProps) => {
  if (!user) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Profile Information
      </h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Username</p>
          <p className="text-lg text-gray-900">{user.username}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-lg text-gray-900">{user.email}</p>
        </div>
        {/* <div>
          <p className="text-sm font-medium text-gray-500">Member Since</p>
          <p className="text-lg text-gray-900">{formatDate(user.createdAt)}</p>
        </div> */}
      </div>
    </div>
  );
};

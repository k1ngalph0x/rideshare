import { useQuery, gql } from "@apollo/client";
import { ProfileCard } from "../components/ProfileCard";
import { UserStats } from "../components/UserStats";
import { NotificationsList } from "../components/NotificationList";
import { Chat } from "../components/Chat";

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      email
      username
      createdAt
      updatedAt
    }
  }
`;

export const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_USER_PROFILE);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center p-4">Error: {error.message}</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileCard user={data?.me} />
            <UserStats />
          </div>
          <div className="mt-6">
            <Chat />
          </div>
        </div>
        <div className="lg:col-span-1">
          <NotificationsList />
        </div>
      </div>
    </div>
  );
};

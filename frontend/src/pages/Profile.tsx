// pages/Profile.tsx
import { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
//import { useAuth } from "../hooks/useAuth";

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      username
      email
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      email
      updatedAt
    }
  }
`;

export const Profile = () => {
  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  const [updateUser] = useMutation(UPDATE_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", content: "" });

  //   useState(() => {
  //     if (data?.me) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         username: data.me.username,
  //         email: data.me.email,
  //       }));
  //     }
  //   }, [data]);

  useEffect(() => {
    if (data?.me) {
      setFormData((prev) => ({
        ...prev,
        username: data.me.username,
        email: data.me.email,
      }));
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });

    try {
      // Validate passwords if trying to change password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: "error", content: "New passwords do not match" });
          return;
        }
        if (!formData.currentPassword) {
          setMessage({
            type: "error",
            content: "Current password is required",
          });
          return;
        }
      }

      const input = {
        username: formData.username,
        email: formData.email,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      };

      await updateUser({ variables: { input } });
      setMessage({ type: "success", content: "Profile updated successfully" });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: "error", content: err.message });
    }
  };

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {message.content && (
          <div
            className={`p-4 rounded-md mb-4 ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {isEditing && (
            <>
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

// export interface User {
//   id: string;
//   email: string;
//   username: string;
//   createdAt: string;
//   updatedAt: string;
// }
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string; // This should be an ISO date string from the server
  updatedAt: string;
}

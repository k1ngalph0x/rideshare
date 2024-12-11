import { IUser } from "../models/User";

export interface PubSubEvents {
  [key: string]: unknown;
  USER_UPDATED: [{ userUpdated: IUser }];
}

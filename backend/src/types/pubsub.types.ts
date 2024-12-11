import { IUser } from "../models/User";

export interface PubSubPayload {
  userUpdated: IUser;
}

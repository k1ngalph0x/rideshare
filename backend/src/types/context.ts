import { IUser } from "../models/User";

export interface Context {
  user: IUser | null;
}

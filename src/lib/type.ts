import { Types } from "mongoose";

interface user_id {
  name: string;
  email: string;
}

interface leave_type_id {
  name: string;
  description: string;
}

export interface LeavetypeInterface {
  _id: Types.ObjectId;
  user_id: user_id;
  leave_type_id: leave_type_id;
  org_id: Types.ObjectId;
  start_date: Date;
  end_date: Date;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}


// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   __v: number;
// }

// interface Organization {
//   _id: string;
// }

// export interface MemberTypeInterface{
//   _id: string;
//   user_id: User | null;
//   org_id: string | Organization;
//   role: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

export interface MemberTypeInterface{
  username: string;
  email: string;
  role: string;
  orgName: string;
}
import { Types } from "mongoose";

interface user_id {
  name: string;
  email: string;
  _id:string;
}

interface leave_type_id {
  name: string;
  description: string;
  _id:string;
}

interface org_id {
  name: string;
  _id: Types.ObjectId;
}



export interface LeavetypeInterface {
  _id: Types.ObjectId;
  user: user_id;
  leave_type: leave_type_id;
  org: org_id;
  start_date: Date;
  end_date: Date;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ViewLeavetypeInterface {
  _id: Types.ObjectId;
  name:string;
  description:string;
  org: org_id;
  does_carry_forward:boolean;
  count_per_month:number;
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
  id:string
}
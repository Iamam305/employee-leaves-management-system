import { Types } from "mongoose";

interface user_id {
  name:string,
  email:string,
}

interface  leave_type_id{
  name:string,
  description:string,
}

export interface LeavetypeInterface {
  _id:Types.ObjectId,  
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

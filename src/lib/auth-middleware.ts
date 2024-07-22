import { Membership } from "@/models/membership.model";
import { User } from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
// user_name: user.email, user_id: user._id

/**
 * Authenticates a user based on a JWT token and an optional organization ID.
 *
 * @param {Object} params - An object containing the token and org_id.
 * @param {string} params.token - The JSON Web Token to authenticate the user.
 * @param {string} [params.org_id] - The ID of the organization to authenticate the user against.
 * @returns {Promise<[{user: User | null, membership: Membership | null} | null, Error | null]>} - A promise that resolves to an array containing the authenticated user and membership, and an error if any occurred.
 */
export const auth_middleware = async (
  request: NextRequest,
  org_id?: string
) => {
  try {
    let token: string;
    if (request.headers.get("token")) {
      token = request.headers.get("token") as string;
    } else {
      token = request.cookies.get("token")?.value as string;
    }
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    if (!decoded || !("user_id" in decoded)) {
      return [null, new Error("Invalid token")];
    }
    const user_id = decoded.user_id;
    const user: any | null = await User.findOne({
      _id: new mongoose.Types.ObjectId(user_id as string),
    }).select("-password");
    if (!user) {
      return [null, new Error("User not found")];
    }
    let membership: typeof Membership | null = null;
    if (org_id) {
      try {
        membership = await Membership.findOne({
          user_id: new mongoose.Types.ObjectId(user_id as string),
          org_id: new mongoose.Types.ObjectId(org_id),
        });
      } catch (error) {
        return [null, error as Error];
      }
    } else {
      membership = await Membership.findOne({
        user_id: new mongoose.Types.ObjectId(user_id as string),
      });
    }
    return [{ user, membership }, null];
  } catch (error) {
    return [null, error as Error];
  }
};

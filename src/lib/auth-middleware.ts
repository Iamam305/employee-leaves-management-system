import { Membership } from "@/models/membership.model";
import { User } from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
// user_name: user.email, user_id: user._id

/**
 * Authenticates a user based on a JWT token and an optional organization ID.
 *
 * @param {Object} params - An object containing the token and org_id.
 * @param {string} params.token - The JSON Web Token to authenticate the user.
 * @param {string} [params.org_id] - The ID of the organization to authenticate the user against.
 * @returns {Promise<[{user: User | null, membership: Membership | null} | null, Error | null]>} - A promise that resolves to an array containing the authenticated user and membership, and an error if any occurred.
 */
export const auth_middleware = async ({
  token,
  org_id,
}: {
  token: string;
  org_id?: string;
}): Promise<
  [
    { user: typeof User; membership: typeof Membership | null } | null,
    Error | null
  ]
> => {
  try {
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    if (!decoded || !("user_id" in decoded)) {
      return [null, new Error("Invalid token")];
    }
    const user_id = decoded.user_id;
    const user: typeof User | null = await User.findOne({
      _id: new mongoose.Types.ObjectId(user_id as string),
    });
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
    }
    return [{ user, membership }, null];
  } catch (error) {
    return [null, error as Error];
  }
};

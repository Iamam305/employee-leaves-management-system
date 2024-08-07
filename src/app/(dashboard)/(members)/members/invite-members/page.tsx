"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {
  useState,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useEffect,
} from "react";
import { toast } from "sonner";

const Page = () => {
  const [emails, setEmails] = useState<string[]>([""]);
  const [orgId, setOrgId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, emails.length);
    console.log(inputRefs.current);
  }, [emails]);

  const handleChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const newEmails = [...emails];
      newEmails[index] = e.target.value;
      setEmails(newEmails);
    };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const removeEmailField = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
    setTimeout(() => {
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }, 0);
  };

  const handleKey = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentEmail = emails[index];
      if (!validateEmail(currentEmail)) {
        toast.error("Please enter a valid email address.");
        return;
      }
      e.preventDefault();
      if (index === emails.length - 1) {
        addEmailField();
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      } else {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/org/invite-member", {
        emails,
        org_id: orgId,
        role: userRole,
      });

      toast.success(response.data.msg);
      router.push("/members");
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      toast.error(
        error.response.data.msg ||
          "An error occurred during sending invitations"
      );
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className=" flex justify-between w-full">
        <h1 className="text-3xl font-bold mb-4  mx-auto">Invite Members</h1>
        <div className="flex gap-2">
          {/* <Button type="button" onClick={addEmailField} variant="secondary">
            Add Another Email
          </Button> */}
        </div>
      </div>

      <div className="bg-gray-100 p-8 pb-10 rounded-lg w-full mx-auto">
        <div className="mb-3">
          <label htmlFor="userEmail">User Email</label>
        </div>
        <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className=" flex w-full p-3 gap-1 border-2 flex-wrap">
            {emails.map((email, index) => (
              <div
                key={index}
                className="flex  max-w-max items-center gap-0 relative justify-center
                 rounded-md
                "
              >
                <Input
                  type="text"
                  id={`email-${index}`}
                  value={email}
                  onChange={handleChange(index)}
                  onKeyDown={handleKey(index)}
                  required
                  placeholder="Enter email"
                  className={`
            flex-grow-0 bg-transparent
            border-0 border-none !outline-none !ring-0 !ring-offset-0
            focus:border-0 focus:border-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0

            text-sm px-2 py-4 h-6 max-w-[330px] overflow-x-auto
            ${emails.length > 1 ? "bg-gray-400 text-white rounded" : ""}
            ${!validateEmail(email) && email !== "" ? "text-red-500" : ""}
          `}
                  style={{ boxShadow: "none" }}
                  ref={(el: any) => (inputRefs.current[index] = el)}
                />
                {index > 0 && (
                  <span
                    onClick={() => removeEmailField(index)}
                    className="absolute right-0.5 top-1/2 transform -translate-y-1/2 text-black cursor-pointer text-sm font-medium  rounded-full bg-white h-4 w-4 flex items-center justify-center"
                  >
                    X
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="">
            <span className=" text-xs">
              &quot;Please enter email addresses, pressing Enter after each
              email. Remember not to use commas; simply type the email address
              and then press Enter to continue.&quot;
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="group">Group Name</label>
            <select
              name="group_name"
              id=""
              className="  p-3 hover:cursor-pointer rounded-md"
              onChange={(e) => setOrgId(e.target.value)}
              required
            >
              <option value="">Select The Group</option>
              <option value="val1">Mushroom World</option>
              <option value="val2">Mushroom Health</option>
              <option value="669f97ab186ea1a384360673">
                Mushroom FutureTech
              </option>
              <option value="val4">Mushroom Film</option>
              <option value="val5">Mushroom Fitness</option>
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="group">User Role</label>
            <select
              name="user_role"
              id=""
              className="  p-3 hover:cursor-pointer rounded-md"
              onChange={(e) => setUserRole(e.target.value)}
              required
            >
              <option value="">Select The Role</option>
              <option value="hr">Hr</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting ...." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;

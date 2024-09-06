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
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Modal } from "../ui/modal";
import { PlusIcon } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useTheme } from "@/context/ThemeContext";

const InviteMembers = () => {
  const [emails, setEmails] = useState<string[]>([""]);
  const [orgId, setOrgId] = useState<string>("");
  const [orgs, setOrgs] = useState<any>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const theme = useTheme();

  const user_role = useSelector(
    (state: any) => state.membership.memberShipData
  );

  const router = useRouter();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, emails.length);
    // console.log(inputRefs.current);
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

  const handleOrgChange = (selectedOrgId: any) => {
    setOrgId(selectedOrgId);
  };

  const handleUserRole = (selectedUserRole: any) => {
    setUserRole(selectedUserRole);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const currentOrgId =
        user_role?.role === "admin" ? orgId : user_role.org_id;
      const response = await axios.post("/api/org/invite-member", {
        emails,
        org_id: currentOrgId,
        role: userRole,
      });
      toast.success(response.data.msg);
      router.push("/dashboard");
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

  const fetch_all_orgs = async () => {
    try {
      const { data } = await axios.get("/api/org");
      setOrgs(data.all_orgs);
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  useEffect(() => {
    fetch_all_orgs();
  }, []);

  return (
    <div>
      <Button
        className=" flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon className=" h-4 w-4" />
        Invite Members
      </Button>
      <Modal title="" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent className="">
          <div className="p-0 ">
            {/* <div className="p-2 w-full max-w-4xl mx-auto"> */}
            <div className="flex justify-between w-full">
              <h1 className="text-3xl font-bold mb-4 mx-auto">
                Invite Members
              </h1>
            </div>

            <div
              className={` p-8 pb-10 w-full max-h-[80vh] overflow-auto rounded-lg mx-auto invite_modal`}
            >
              <div className="mb-3">
                <label htmlFor="userEmail">User Email</label>
              </div>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className={`flex w-full p-3 gap-1 border-2 flex-wrap `}>
                  {emails.map((email, index) => (
                    <div
                      key={index}
                      className="flex max-w-max items-center gap-0 relative justify-center rounded-md"
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
                          text-sm px-2 py-4 h-6 w-auto overflow-x-auto
                          ${
                            emails.length > 1
                              ? `${
                                  theme === "dark"
                                    ? "bg-white text-black rounded-lg"
                                    : "bg-black text-white rounded-lg"
                                }`
                              : ""
                          }
                          ${
                            !validateEmail(email) && email !== ""
                              ? "text-red-500"
                              : ""
                          }
                        `}
                        style={{ boxShadow: "none" }}
                        ref={(el: any) => (inputRefs.current[index] = el)}
                      />
                      {index > 0 && (
                        <span
                          onClick={() => removeEmailField(index)}
                          className="absolute right-0.5 top-1/2 transform -translate-y-1/2 text-black cursor-pointer text-sm font-medium rounded-full bg-white h-4 w-4 flex items-center justify-center"
                        >
                          <Cross1Icon className=" h-4 w-4" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-xs">
                    &quot;Please enter email addresses, pressing Enter after
                    each email. Remember not to use commas; simply type the
                    email address and then press Enter to continue.&quot;
                  </span>
                </div>

                {user_role?.role === "admin" ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <label htmlFor="group">Group Name</label>

                    <Select
                      onValueChange={handleOrgChange}
                      value={orgId as any}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {/* <SelectLabel>Select Group</SelectLabel> */}
                          {orgs.map((org: any, index: any) => (
                            <SelectItem key={index} value={org._id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-col gap-2">
                  <label htmlFor="group">User Role</label>

                  <Select
                    value={userRole as any}
                    onValueChange={handleUserRole}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="hr">Hr</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting ...." : "Submit"}
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Modal>
    </div>
  );
};

export default InviteMembers;

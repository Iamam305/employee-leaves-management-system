import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { DialogContent } from "../ui/dialog";
import { Form, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";

interface FormDataProps {
  oldPassword: string;
  newPassword: string;
}

const ChangePasswordModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataProps>({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = async (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/change-password", formData);
      toast.success(data.msg);
      setIsOpen(false);
      setLoading(false);
      console.log("Form Data==> ", formData);
    } catch (error: any) {
      toast.error(error.response.data.msg);
      setLoading(false);
    }
  };

  return (
    <div>
      <span onClick={() => setIsOpen(true)}>Change Password</span>
      <Modal title="" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent className="">
          <h1 className=" text-center text-2xl">Change Your Password</h1>
          <form
            action=""
            onSubmit={handleSubmit}
            className=" flex flex-col gap-5"
          >
            <Input
              type="text"
              placeholder="Enter Your Old Password"
              value={formData.oldPassword}
              name="oldPassword"
              required
              onChange={handleChange}
            />
            <Input
              type="text"
              placeholder="Enter Your New Password"
              value={formData.newPassword}
              name="newPassword"
              required
              onChange={handleChange}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting...." : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Modal>
    </div>
  );
};

export default ChangePasswordModal;

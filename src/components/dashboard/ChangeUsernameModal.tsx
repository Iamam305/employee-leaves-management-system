import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

const ChangeUsernameModal = () => {
  const current_user = useSelector((state: any) => state.auth.userData);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(current_user.name);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/change-username", { name });
      toast.success(data.msg);
      setLoading(false);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response.data.msg);
      setLoading(false);
    }
  };

  return (
    <div>
      <span onClick={() => setIsOpen(true)}>Change Username</span>
      <Modal title="" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent className="">
          <h1 className=" text-center text-2xl">Change Your Username</h1>
          <form
            action=""
            onSubmit={handleSubmit}
            className=" flex flex-col gap-5"
          >
            <Input
              type="text"
              value={name}
              name="name"
              required
              onChange={(e) => setName(e.target.value)}
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

export default ChangeUsernameModal;

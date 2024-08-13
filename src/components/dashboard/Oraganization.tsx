"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Modal } from "../ui/modal";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";

const Oraganization = () => {
  const [orgs, setOrgs] = useState<any>([]);


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
    <div >
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Organizations" />
        </SelectTrigger>
        <SelectContent className="max-w-full overflow-scroll  text-left">
          {orgs.map((item: any, index: number) => (
            <SelectItem
              key={index}
              value={item.name}
              className="overflow-scroll text-left"
              disabled
            >
              {item.name.length > 15 ? item.name.substring(0,15) + "..." : item.name}
            </SelectItem>
          ))}
          <Separator />
          <div className="w-full mt-2 flex items-center justify-center">
            <CreateOrgDialog />
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Oraganization;

export function CreateOrgDialog() {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/org", { name });
      setLoading(false);
      toast.success(data.msg);
      setOpen(false);
      setName("");
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast.error(
        error.response?.data?.msg ||
          "An error occurred during organization creation"
      );
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label htmlFor="name" className="sr-only">
                Organization Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter the organization name"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

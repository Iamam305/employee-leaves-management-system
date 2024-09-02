"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MultiSelect } from "@/components/Multi-select/multi-select";
import { toast } from "sonner";
import axios from "axios";
import { Modal } from "../ui/modal";
import { PlusIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Heading } from "../ui/heading";

// Sample array of employees
const sampleEmployees = [
  {
    value: "66cd86c07e350e405edeb687",
    label: "phritik06",
  },
  {
    value: "66cd86c07e350e405edeb681",
    label: "phritik07",
  },
  {
    value: "66cd86c07e350e405edeb682",
    label: "phritik08",
  },
  {
    value: "66cd86c07e350e405edeb683",
    label: "phritik09",
  },
  {
    value: "66cd86c07e350e405edeb684",
    label: "phritik10",
  },
  {
    value: "66cd86c07e350e405edeb685",
    label: "phritik11",
  },
];

const sampleManagers = [
  {
    value: "66cd8ab37e350e405edeb9bb",
    label: "hrtkpthk01",
  },
  {
    value: "66cd8ab37e350e405edeb9bb1",
    label: "hrtkpthk02",
  },
  {
    value: "66cd8ab37e350e405edeb9bb2",
    label: "hrtkpthk03",
  },
  {
    value: "66cd8ab37e350e405edeb9bb3",
    label: "hrtkpthk04",
  },
  {
    value: "66cd8ab37e350e405edeb9bb4",
    label: "hrtkpthk05",
  },
  {
    value: "66cd8ab37e350e405edeb9bb5",
    label: "hrtkpthk06",
  },
];

const FormSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1),
  managerId: z.string().min(1),
});

const AssignManager = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selected_orgId = useSelector(
    (state: any) => state.organization.selectedOrg
  );

  const current_user = useSelector(
    (state: any) => state.membership.memberShipData
  );

  let org_id;

  const [employees, setEmployees] = useState<any>([]);
  const [managers, setManagers] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployee = async () => {
    try {
      if (current_user.role === "admin" && !selected_orgId) {
        return toast.error("Please Select Any Organization");
      }
      org_id =
        current_user.role === "admin" ? selected_orgId : current_user.org_id;
      const { data } = await axios.get(`/api/get-employees?org_id=${org_id}`);
      console.log("Data Recieved==> ", data);
      setEmployees(
        data.employees.map((employee: any) => ({
          value: employee._id,
          label: employee.name,
        }))
      );
      setManagers(
        data.managers.map((manager: any) => ({
          value: manager._id,
          label: manager.name,
        }))
      );
    } catch (error: any) {
      // toast.error(error.response.data.msg);
      console.log(error.message);
    }
  };

  console.log("Employees==> ", employees);

  useEffect(() => {
    fetchEmployee();
  }, [org_id, selected_orgId]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userIds: [],
      managerId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (data.userIds.length === 0) {
      toast.error("Please select at least one employee.");
      return;
    }
    if (!data.managerId) {
      toast.error("Please select a manager.");
      return;
    }
    console.log("submitted data", data);

    try {
      const response = await axios.post("/api/manager", data);
      toast.success(response.data.msg);
    } catch (error: any) {
      // console.log(error);
      toast.error(error.response.data.msg);
    }
  };

  return (
    <>
      <div>
        <Button
          onClick={() => setIsOpen(true)}
          className=" flex items-center gap-2"
        >
          <PlusIcon className=" md:h-4 md:w-4" />
          Assign Manager
        </Button>
      </div>
      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen} title="">
        <div className=" w-full flex items-center justify-center">
          <Heading title="Assign Manager" description="" />
        </div>
        <main className="flex min-h-screen:calc(100vh - 3rem) flex-col items-center justify-start space-y-3 p-3">
          <Card className="w-full max-w-xl p-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="userIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employees</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={employees}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select employees"
                          variant="inverted"
                          animation={2}
                          maxCount={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Choose the employees to assign a manager.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="managerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a manager" />
                          </SelectTrigger>
                          <SelectContent>
                            {managers.map((manager: any) => (
                              <SelectItem
                                key={manager.value}
                                value={manager.value}
                              >
                                {manager.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Choose a manager to assign to the selected employees.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Button
                  variant="default"
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </Card>
        </main>
      </Modal>
    </>
  );
};

export default AssignManager;

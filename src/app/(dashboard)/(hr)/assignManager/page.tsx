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
import { useSearchParams } from "next/navigation";

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
  employees: z.array(z.string().min(1)).min(1),
  manager: z.string().min(1),
});

const Page = () => {
  const searchParams = useSearchParams();

  const org_id = searchParams.get("org_id");

  console.log("Org Id==> ",org_id)

  // const [employees, setEmployees] = useState(sampleEmployees);
  const [employees, setEmployees] = useState<any>([]);
  const [managers, setManagers] = useState(sampleManagers);
  const [loading, setLoading] = useState(false);

  const fetchEmployee = async () => {
    try {
      const { data } = await axios.get(`/api/org/get-employees?org_id=${org_id}`);
      console.log(
        "Data Recieved => ",
        data.all_members.map((member: any) => member.user_id)
      );
      setEmployees({
        value:"",
        label:""
      })
      // setEmployees(
      //   data.all_members.map((member: any) => ({
      //     value: member.user_id._id,
      //     label: member.user_id.name,
      //   }))
      // );
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Employees==> ", employees);

  useEffect(() => {
    fetchEmployee();
    // Uncomment and replace with actual API calls if needed
    // const fetchEmployeesAndManagers = async () => {
    //   try {
    //     const [employeeResponse, managerResponse] = await Promise.all([
    //       fetch("/api/get-employees"), // Replace with actual API endpoint
    //       fetch("/api/get-managers"), // Replace with actual API endpoint
    //     ]);

    //     const employeeData = await employeeResponse.json();
    //     const managerData = await managerResponse.json();

    //     const employeeOptions = employeeData.map((employee: any) => ({
    //       value: employee.id,
    //       label: employee.name,
    //     }));

    //     const managerOptions = managerData.map((manager: any) => ({
    //       value: manager.id,
    //       label: manager.name,
    //     }));

    //     setEmployees(employeeOptions);
    //     setManagers(managerOptions);
    //   } catch (error) {
    //     console.error("Error fetching employees or managers:", error);
    //     toast.error("Failed to load data");
    //   }
    // };

    // fetchEmployeesAndManagers();
  }, [org_id]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      employees: [],
      manager: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // Validate before submitting
    if (data.employees.length === 0) {
      toast.error("Please select at least one employee.");
      return;
    }
    if (!data.manager) {
      toast.error("Please select a manager.");
      return;
    }

    console.log("submitted data", data);

    // setLoading(true);

    // try {
    //   const response = await fetch("/api/assign-manager", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       managerId: data.manager,
    //       userIds: data.employees,
    //     }),
    //   });

    //   const result = await response.json();

    //   if (response.ok) {
    //     toast.success(result.msg || "Manager assigned to employees successfully");
    //   } else {
    //     toast.error(result.msg || "Failed to assign manager");
    //   }
    // } catch (error) {
    //   toast.error("Something went wrong. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <main className="flex min-h-screen:calc(100vh - 3rem) flex-col items-center justify-start space-y-3 p-3">
      <Card className="w-full max-w-xl p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="employees"
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
              name="manager"
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
                        {managers.map((manager) => (
                          <SelectItem key={manager.value} value={manager.value}>
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
  );
};

export default Page;

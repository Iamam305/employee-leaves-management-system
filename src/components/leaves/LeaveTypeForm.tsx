"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the form schema using Zod
const formSchema = z.object({
  Leave_Type_Name: z.string().min(5, { message: "Leave Type Name is required." }),
  Leave_Type_Description: z.string().min(5, { message: "Leave Type Description is required." }),
  carryforward: z.boolean().refine((val) => typeof val === "boolean", { message: "Carryforward is required." }),
  count: z.string().min(1, { message: "Count is required." }),
  org_id: z.string().optional(), // Optional because it's only required for admin
});

interface LeaveTypeFormProps {
  fetchData: () => void; 
  onclose : () => void; // Define the fetchData prop
  organizations?: { id: string; name: string }[]; // Added orgs to be passed in
}

export function LeaveTypeForm({ fetchData, onclose, organizations }: LeaveTypeFormProps) {
  const [isloading, setIsloading] = useState(false);

  // Get membership data from Redux store
  const membership = useSelector((state: any) => state.membership.memberShipData);

  // Initialize the form with react-hook-form and Zod schema validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Leave_Type_Name: '',
      Leave_Type_Description: '',
      carryforward: false,
      count: '',
      org_id: membership.role === "admin" ? "" : membership.org_id, // Pre-fill org_id for hr
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = {
      ...values,
      // role: membership.role,
      org_id: membership.role === "hr" ? membership.org_id : values.org_id, // Use hr's org_id or selected value
    };

    console.log("formData", formData);

    try {
      setIsloading(true);
      // Example API call
      const response = await axios.post('/api/leave-type', formData);
      if (response) {
        toast.success("Leave Type Added Successfully");
      }

      onclose();
      fetchData();
    } catch (error) {
      console.error("Error Requesting leave:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Leave Type Name Field */}
        <FormField
          control={form.control}
          name="Leave_Type_Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Type Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Leave Type Description Field */}
        <FormField
          control={form.control}
          name="Leave_Type_Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Type Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Does CarryForward Field */}
        <FormField
          control={form.control}
          name="carryforward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Does CarryForward</FormLabel>
              <FormControl>
                <RadioGroup
                  defaultValue={field.value ? "true" : "false"}
                  onValueChange={(value) => field.onChange(value === "true")}
                >
                  <FormItem className="flex items-center space-x-3">
                    <RadioGroupItem value="true" />
                    <FormLabel>Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <RadioGroupItem value="false" />
                    <FormLabel>No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Count Field */}
        <FormField
          control={form.control}
          name="count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Count</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter count per month" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Org Select Field (Visible for Admins) */}
        {membership.role === "admin" && (
          <FormField
            control={form.control}
            name="org_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Organization</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations?.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Submit Button */}
        {isloading ? (
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Loading ....
          </Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}

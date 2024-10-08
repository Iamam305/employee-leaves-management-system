"use client"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"

// Define the form schema using Zod
const formSchema = z.object({
  Leave_Type_Name: z.string().min(5, { message: "Leave Type Name is required." }),
  Leave_Type_Description: z.string().min(5, { message: "Leave Type Description is required." }),
  carryforward: z.boolean().refine((val) => typeof val === "boolean", { message: "Carryforward is required." }),
  count: z.string().min(1, { message: "Count is required." }),
});

interface LeaveTypeFormProps {
  fetchData: () => void
  data:{
  _id: string;
  name:string;
  description:string;
  org_id: string;
  does_carry_forward:boolean;
  count_per_month:string;
  },
  isOpen: boolean;  // Assuming this is a boolean
  setIsOpen: (open: boolean) => void; 
   // Define the onclose prop
}

export function LeaveTypeEditForm({ fetchData , data  , isOpen , setIsOpen}: LeaveTypeFormProps) {
  const [isloading, setIsloading] = useState(false)

  // Get membership data from Redux store
  const membership = useSelector((state: any) => state.membership.memberShipData);

  // Initialize the form with react-hook-form and Zod schema validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Leave_Type_Name: data.name,
      Leave_Type_Description: data.description,
      carryforward: data.does_carry_forward,
      count:`${data.count_per_month}`,
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = {
      ...values,
      role: membership.role,
      org_id: membership.org_id,
    };

    console.log("formData", formData);
    // onclose();

    try {
      setIsloading(true);
      // Example API call
      const response = await axios.post(`/api/leave-type/${data._id}`, formData);
      if(response)
      {
        toast.success("Leave Type Added Successfully");
      }
      setIsOpen(false)
      fetchData();
    } catch (error) {
      console.error("Error Requesting leave:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setIsloading(false);
    }
  }

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
                <Input type="text" placeholder="Enter Type Name" {...field} onChange={field.onChange}/>
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
                <Textarea placeholder="Enter Type Description" {...field} onChange={field.onChange}/>
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
                <Input type="text" placeholder="Enter count per month" {...field} onChange={field.onChange}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

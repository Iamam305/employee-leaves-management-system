"use client"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"

// Define the form schema using Zod
const formSchema = z.object({
  leave_type_id: z.string().min(1, { message: "Leave Type ID is required." }),
  start_date: z.string().min(1, { message: "Start Date is required." }),
  end_date: z.string().min(1, { message: "End Date is required." }),
  description: z.string().optional(), // Description is optional
});


interface LeaveRequestFormProps {
    onclose: () => void;  // Define the onclose prop
  }

  export function LeaveRequestForm({ onclose }: LeaveRequestFormProps) {
  // State to hold leave types
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isloading, setIsloading] = useState(false)

  // Get user_id and org_id from Redux store
  const user = useSelector((state: any) => state.auth.userData);
  const membership = useSelector((state: any) => state.membership.memberShipData);

  // Initialize the form with react-hook-form and Zod schema validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leave_type_id: '',
      start_date: '',
      end_date: '',
      description: ''
    },
  });

  // Fetch leave types from the API
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const { data } = await axios.get('/api/leave-type');
        setLeaveTypes(data.data);
      } catch (error) {
        console.error("Failed to fetch leave types:", error);
      }
    };

    fetchLeaveTypes();
  }, []);

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
      console.log("leave" , leaveTypes)
    // Set user_id and org_id before submitting
    const formData = {
      ...values,
      user_id: user._id,
      org_id: membership.org_id,
    };

    console.log("formData", formData);
    // Handle form submission, e.g., send data to an API
    // Example:
    try {
        setIsloading(true);
        const response = await axios.post('/api/leave', 
          formData
        );
  
        // Assuming the response contains a message
        toast.success(response.data.message || "Leave request Raised Successfully!");
  
        // Close the modal
        // setIsOpen(false);
        onclose();
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
        
        {/* Leave Type ID Field */}
        <FormField
          control={form.control}
          name="leave_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Leave Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type:any , index:number) => (
                      <SelectItem key={index} value={type._id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date Field */}
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date Field */}
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Description" {...field} />
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
        ) : (<Button type="submit">Submit</Button>)
        }
        
      </form>
    </Form>
  );
}

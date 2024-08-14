"use client"
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Define the form schema using Zod
const formSchema = z.object({
  leave_type_id: z.string().min(1, { message: "Leave Type ID is required." }),
  start_date:  z.date({
    required_error: "Start Date is required.",
  }),
  end_date:   z.date({
    required_error: "End Date is required.",
  }),
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
    // defaultValues: {
    //   leave_type_id: '',
    //   start_date: ,
    //   end_date: '',
    //   description: ''
    // },
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
        
          // toast.success("Leave request Raised Successfully!");
        // Assuming the response contains a message
        if(response){
          toast.success(response.data.message || "Leave request Raised Successfully!");
        }
  
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
            // <FormItem>
            //   <FormLabel>Start Date</FormLabel>
            //   <FormControl>
            //     <Input type="date" {...field} />
            //   </FormControl>
            //   <FormMessage />
            // </FormItem>
            <FormItem className="flex flex-col">
            <FormLabel>Select Start Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()
                  //   {
                  //   Reset the time of the current date to midnight
                  //   const today = new Date();
                  //   today.setHours(0, 0, 0, 0);
                  //   Disable dates less than today's date
                  //   return date < today;
                  // }
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
            Select the start date from which the leave will be effective.
            </FormDescription>
            <FormMessage />
          </FormItem>
          )}
        />

        {/* End Date Field */}
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            // <FormItem>
            //   <FormLabel>End Date</FormLabel>
            //   <FormControl>
            //     <Input type="date" {...field} />
            //   </FormControl>
            //   <FormMessage />
            // </FormItem>
            <FormItem className="flex flex-col">
            <FormLabel>Select End Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date() || date < new Date(form.getValues("start_date"))
                  //   {
                  //   Reset the time of the current date to midnight
                  //   const today = new Date();
                  //   today.setHours(0, 0, 0, 0);
                  //   Disable dates less than today's date
                  //   return date < today;
                  // }
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
            Select the end date up to which the leave will be effective.
            </FormDescription>
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

"use client";
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FileUploader } from "react-drag-drop-files";
import { FileUp } from "lucide-react";

const formSchema = z.object({
  leave_type_id: z.string().min(1, { message: "Leave Type ID is required." }),
  start_date: z.date({
    required_error: "Start Date is required.",
  }),
  end_date: z.date({
    required_error: "End Date is required.",
  }),
  description: z.string().optional(),
});

interface LeaveRequestFormProps {
  onclose: () => void;
  fetchData?: () => void; 
}

export function LeaveRequestForm({ onclose , fetchData}: LeaveRequestFormProps) {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileKey, setFileKey] = useState<string>("");

  const user = useSelector((state: any) => state.auth.userData);
  const membership = useSelector(
    (state: any) => state.membership.memberShipData
  );

  console.log("Leave Form Membership ==> ", membership);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const { data } = await axios.get("/api/leave-type");
        setLeaveTypes(data.data);
      } catch (error) {
        console.error("Failed to fetch leave types:", error);
      }
    };

    fetchLeaveTypes();
  }, []);

  const handleAttachmentUpload = async (file: File) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    console.log("File==> ", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("File Upload Successfully !");
      setFileKey(data.file_key);
    } catch (error) {
      console.error("File upload error==> ", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("leave", leaveTypes);
    const formData = {
      ...values,
      docs: fileKey,
      user_id: user._id,
      org_id: membership.org_id,
      manager_id: membership.manager_id,
    };

    console.log("formData", formData);
    try {
      setIsLoading(true);
      const response = await axios.post("/api/leave", formData);
      if (response) {
        toast.success(
          response.data.message || "Leave request Raised Successfully!"
        );
      }
      onclose();
      if(fetchData){
        fetchData();
      }
    } catch (error: any) {
      console.error("Error Requesting leave:", error);
      if (error.response.status === 403) {
        toast.warning(error.response.data.msg);
      } else {
        toast.error("An error occurred while processing your request.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log("File KEY===> ", fileKey);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 overflow-auto"
      >
        <FormField
          control={form.control}
          name="leave_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Leave Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type: any, index: number) => (
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
                    disabled={(date) => date < new Date()}
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
                    disabled={(date) =>
                      date < new Date() ||
                      date < new Date(form.getValues("start_date"))
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

        {/* File Upload Field */}

        <div className=" mt-1">
          <FormLabel className=" mb-2">Attachement</FormLabel>
          <FileUploader
            type="file"
            accept="pdf/*"
            handleChange={handleAttachmentUpload}
            className="w-full"
          >
            <div className="w-full h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-400 text-zinc-500">
              <FileUp className="w-15 h-15" />
              {fileKey ? (
                <span className="mt-2 text-sm text-gray-700">{fileKey}</span>
              ) : (
                <span className="mt-2 text-sm">
                  Drag and drop a file or click to select
                </span>
              )}
            </div>
          </FileUploader>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </Form>
  );
}

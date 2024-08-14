import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "../ui/select"; // Replace with your actual import
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Organization = () => {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const org_id = searchParams.get("org_id");

  useEffect(() => {
    fetch_all_orgs();
    if (org_id) {
      setSelectedOrgId(org_id);
    } else {
      setSelectedOrgId("none");
    }
  }, [org_id]);

  const fetch_all_orgs = async () => {
    try {
      const { data } = await axios.get("/api/org");
      setOrgs(data.all_orgs);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = async (selectedOrgId: string) => {
    if (selectedOrgId !== "none") {
      router.push(`?org_id=${selectedOrgId}`);
    } else {
      router.push(`${pathname}`);
    }
  };

  return (
    <div className="flex flex-col">
      <Select value={selectedOrgId as any} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Organizations" />
        </SelectTrigger>
        <SelectContent className="max-w-full overflow-scroll text-left">
          <SelectItem value={"none"} className="overflow-scroll text-left">
            None
          </SelectItem>
          {orgs.map((item: any, index: number) => (
            <SelectItem
              key={index}
              value={item._id}
              className="overflow-scroll text-left"
            >
              {item.name.length > 15
                ? item.name.substring(0, 15) + "..."
                : item.name}
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

export default Organization;

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
                onChange={(e: any) => setName(e.target.value)}
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

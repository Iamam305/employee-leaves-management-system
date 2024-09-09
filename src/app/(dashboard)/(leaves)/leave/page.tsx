"use client";
import { LeaveTableClient } from "@/components/table/LeaveTable/client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [orgs, setOrgs] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [managers, setManagers] = useState<any>([]);
  const [managerId, setManagerId] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();

  const org_id = useSelector((state: any) => state.organization.selectedOrg);
  const current_user = useSelector(
    (state: any) => state.membership?.memberShipData || null
  );

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      let queryString = `page=${page}`;
      if (name.trim() !== "") {
        queryString += `&name=${encodeURIComponent(name)}`;
      }
      if (org_id !== (null as any)) {
        queryString += `&org_id=${org_id}`;
      }
      if (managerId.trim() !== "") {
        queryString += `&manager_id=${managerId}`;
      }
      const response = await axios.get(`/api/leave?${queryString}`);
      const data = response.data;
      console.log("fetch leave data", data);
      setLeaves(data.leaves);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      if (!current_user) return; 
      let selectOrg =
        current_user?.role === "admin" ? org_id : current_user.org_id;
      const { data } = await axios.get(
        `/api/get-employees?org_id=${selectOrg}`
      );
      setManagers(data.managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (name) {
      queryParams.set("name", name);
    }
    if (managerId) {
      queryParams.set("manager_id", managerId);
    }
    if (page > 1) {
      queryParams.set("page", page.toString());
    }
    const queryString = queryParams.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  }, [name, org_id, page, pathname, router, managerId]);

  useEffect(() => {
    setPage(1);
  }, [name, org_id]);

  useEffect(() => {
    const debounced = setTimeout(() => {
      fetchLeaves();
    }, 500);
    return () => clearTimeout(debounced);
  }, [name, org_id, page, managerId]);

  const fetchAllOrgs = async () => {
    try {
      const { data } = await axios.get("/api/org");
      setOrgs(data.all_orgs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (current_user) {
      fetchManagers(); 
    }
  }, [org_id, current_user]);

  useEffect(() => {
    fetchAllOrgs();
  }, []);

  console.log("Total Page==> ", totalPages);

  return (
    <div className="p-4">
       {
        current_user && (
          <LeaveTableClient
          data={leaves}
          isLoading={isLoading}
          name={name}
          setName={setName}
          orgs={orgs}
          setOrgs={setOrgs}
          type="Leave"
          page={page}
          setPage={setPage}
          totalPage={totalPages}
          fetchdata={fetchLeaves}
          managers={managers}
          managerId={managerId}
          setManagerId={setManagerId}
        />
        )
       }
    </div>
  );
};

export default Page;

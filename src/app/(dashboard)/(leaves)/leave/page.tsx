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
  // const [orgId, setOrgId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const pathname = usePathname();

  const org_id = useSelector((state:any) => state. organization.selectedOrg)

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
      const response = await axios.get(`/api/leave?${queryString}`);
      const data = response.data;
      console.log('fetch leeave data' , data)
      setLeaves(data.leaves);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (name) {
      queryParams.set("name", name);
    }
    // if (org_id) {
    //   queryParams.set("org_id", org_id);
    // }
    if (page > 1) {
      queryParams.set("page", page.toString());
    }
    const queryString = queryParams.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  }, [name, org_id, page, pathname, router]);


  useEffect(() => {
    setPage(1);
  }, [name, org_id]);

  useEffect(() => {
    const debounced = setTimeout(() => {
      fetchLeaves();
    }, 500);
    return () => clearTimeout(debounced);
  }, [name, org_id, page]);

  const fetchAllOrgs = async () => {
    try {
      const { data } = await axios.get("/api/org");
      setOrgs(data.all_orgs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllOrgs();
  }, []);

  return (
    <div className="p-4">
      {/* data for leave */}
      <LeaveTableClient
        data={leaves}
        isLoading={isLoading}
        name={name}
        setName={setName}
        orgs={orgs}
        setOrgs={setOrgs}
        // setOrgId={setOrgId}
        page={page}
        setPage={setPage}
        totalPage={totalPages}
        fetchdata={fetchLeaves}
      />
    </div>
  );
};

export default Page;

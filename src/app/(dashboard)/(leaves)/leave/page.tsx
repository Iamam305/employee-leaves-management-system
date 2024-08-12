"use client";
import { LeaveTableClient } from "@/components/table/LeaveTable/client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [orgs, setOrgs] = useState<any>([]);
  const [orgId, setOrgId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const pathname = usePathname();

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      let queryString = `page=${page}`;
      if (name.trim() !== "") {
        queryString += `&name=${encodeURIComponent(name)}`;
      }
      if (orgId.trim() !== "") {
        queryString += `&org_id=${orgId}`;
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
    if (orgId) {
      queryParams.set("org_id", orgId);
    }
    if (page > 1) {
      queryParams.set("page", page.toString());
    }
    const queryString = queryParams.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  }, [name, orgId, page, pathname, router]);

  useEffect(() => {
    setPage(1);
  }, [name, orgId]);

  useEffect(() => {
    const debounced = setTimeout(() => {
      fetchLeaves();
    }, 500);
    return () => clearTimeout(debounced);
  }, [name, orgId, page]);

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
        setOrgId={setOrgId}
        page={page}
        setPage={setPage}
        totalPage={totalPages}
        fetchdata={fetchLeaves}
      />
    </div>
  );
};

export default Page;

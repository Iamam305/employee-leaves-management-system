"use client";
import { MemberTableClient } from "@/components/table/memberTable/client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [orgs, setOrgs] = useState<any>([]);
  const [orgId, setOrgId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const pathname = usePathname();

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      let queryString = `page=${page}`;
      if (name.trim() !== "") {
        queryString += `&name=${encodeURIComponent(name)}`;
      }
      if (orgId.trim() !== "") {
        queryString += `&org_id=${orgId}`;
      }
      const response = await axios.get(`/api/org/get-members?${queryString}`);
      const data = response.data;
      const flattenedMembers = data.all_members.map((member: any) => ({
        username: member.user_id?.name ?? "N/A",
        email: member.user_id?.email ?? "N/A",
        role: member.role,
        orgName: member.org_id?.name ?? "N/A",
      }));
      setMembers(flattenedMembers);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching members:", error);
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
      fetchMembers();
    }, 500);
    return () => clearTimeout(debounced);
  }, [name, orgId, page]);

  const fetch_all_orgs = async () => {
    try {
      const { data } = await axios.get("/api/org");
      setOrgs(data.all_orgs);
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  useEffect(() => {
    fetch_all_orgs();
  }, []);

  return (
    <div className="p-4">
      <MemberTableClient
        data={members}
        isLoading={isLoading}
        name={name}
        setName={setName}
        orgs={orgs}
        setOrgs={setOrgs}
        setOrgId={setOrgId}
        page={page}
        setPage={setPage}
        totalPage={totalPages}
      />
    </div>
  );
};

export default Page;

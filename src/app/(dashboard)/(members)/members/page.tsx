"use client";
import { MemberTableClient } from "@/components/table/memberTable/client";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [orgs, setOrgs] = useState<any>([]);
  const [managers, setManagers] = useState<any>([]);
  const [managerId, setManagerId] = useState<string>("");

  // const [orgId, setOrgId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();


  const current_user = useSelector(
    (state: any) => state.membership.memberShipData
  );

  const selected_orgId = useSelector(
    (state: any) => state.organization.selectedOrg
  );

  const fetchManagers = async () => {
    try {
      let org_id =
        current_user.role === "admin" ? selected_orgId : current_user.org_id;
      const { data } = await axios.get(`/api/get-employees?org_id=${org_id}`);
      setManagers(data.managers);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      let queryString = `page=${page}`;
      if (name.trim() !== "") {
        queryString += `&name=${encodeURIComponent(name)}`;
      }
      if (managerId.trim() !== "") {
        queryString += `&manager_id=${managerId}`;
      }
      if (selected_orgId !== (null as any)) {
        queryString += `&org_id=${selected_orgId}`;
      }
      const response = await axios.get(`/api/org/get-members?${queryString}`);
      const data = response.data;
      const flattenedMembers = data.all_members.map((member: any) => ({
        id: member.user_id?._id ?? "N/A",
        username: member.user_id?.name ?? "N/A",
        email: member.user_id?.email ?? "N/A",
        role: member.role,
        orgName: member.org_id?.name ?? "N/A",
      }));
      setRole(current_user.role);
      setMembers(flattenedMembers);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("selected_orgId changed: ", selected_orgId);
    fetch_all_orgs();
  }, [selected_orgId]);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (name) {
      queryParams.set("name", name);
    }

    if (managerId) {
      queryParams.set("manager_id", managerId);
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
  }, [name, selected_orgId, page, managerId, pathname, router]);

  useEffect(() => {
    setPage(1);
  }, [name, selected_orgId]);

  useEffect(() => {
    const debounced = setTimeout(() => {
      fetchMembers();
    }, 500);
    return () => clearTimeout(debounced);
  }, [name, selected_orgId, managerId, page]);

  useEffect(() => {
    fetchManagers();
  }, [selected_orgId]);

  const fetch_all_orgs = async () => {
    try {
      const { data } = await axios.get("/api/org");
      setOrgs(data.all_orgs);
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  // console.log("mmebers ===> ",members)

  return (
    <div className="p-4">
      <MemberTableClient
        data={members}
        isLoading={isLoading}
        name={name}
        setName={setName}
        orgs={orgs}
        setOrgs={setOrgs}
        managers={managers}
        type="Members"
        managerId={managerId}
        setManagerId={setManagerId}
        // setOrgId={setOrgId}
        page={page}
        setPage={setPage}
        totalPage={totalPages}
        current_user_role={role}
      />
    </div>
  );
};

export default Page;

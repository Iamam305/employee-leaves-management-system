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
  // const [orgId, setOrgId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const user_role = useSelector(
    (state: any) => state.membership.memberShipData?.role
  );

  const org_id = useSelector((state:any) => state. organization.selectedOrg)

  console.log("Selected org id==> ",org_id)


  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      let queryString = `page=${page}`;
      if (name.trim() !== "") {
        queryString += `&name=${encodeURIComponent(name)}`;
      }
      if (org_id !== (null as any)) {
        queryString += `&org_id=${org_id}`;
      }
      const response = await axios.get(`/api/org/get-members?${queryString}`);
      const data = response.data;
      const flattenedMembers = data.all_members.map((member: any) => ({
        id:member.user_id?._id ?? "N/A",
        username: member.user_id?.name ?? "N/A",
        email: member.user_id?.email ?? "N/A",
        role: member.role,
        orgName: member.org_id?.name ?? "N/A",
      }));
      setRole(user_role)
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
      fetchMembers();
    }, 500);
    return () => clearTimeout(debounced);
  }, [name, org_id, page]);

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

  console.log("mmebers ===> ",members)

  return (
    <div className="p-4">
      <MemberTableClient
        data={members}
        isLoading={isLoading}
        name={name}
        setName={setName}
        orgs={orgs}
        setOrgs={setOrgs}
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

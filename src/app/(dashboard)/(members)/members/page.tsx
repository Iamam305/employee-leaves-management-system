"use client";
import React, { useCallback, useEffect, useState } from "react";
import { MemberTableClient } from "@/components/table/memberTable/client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { debounce } from "@/lib/utils";

const Page = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [orgs, setOrgs] = useState<any>([]);
  const [orgId, setOrgId] = useState<any>("");

  const router = useRouter();
  const pathname = usePathname();

  const fetchMembers = useCallback(
    debounce(async () => {
      try {
        const { data } = await axios.get(
          `/api/org/get-members?name=${name}&org_id=${orgId}`
        );
        const flattenedMembers = data.all_members.flat().map((member: any) => ({
          username: member.user_id?.name ?? "N/A",
          email: member.user_id?.email ?? "N/A",
          role: member.role,
          orgName: member.org_id?.name ?? "N/A",
        }));
        setMembers(flattenedMembers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching members:", error);
        setIsLoading(false);
      }
    }, 1000),
    [name, orgId]
  );

  useEffect(() => {
    fetchMembers();
  }, [name, fetchMembers]);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (name) {
      queryParams.set("name", name);
    }
    if (orgId) {
      queryParams.set("org_id", orgId);
    }
    const queryString = queryParams.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newPath);
  }, [name, orgId, pathname, router]);

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

  console.log("Org---> ", orgs);

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
      />
    </div>
  );
};

export default Page;

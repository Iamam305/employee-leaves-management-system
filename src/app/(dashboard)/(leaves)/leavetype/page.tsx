'use client'

import { LeaveTypeTableClient } from "@/components/table/LeaveTypeTable/client";
import axios from "axios";
import { usePathname , useRouter} from "next/navigation";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { toast } from "sonner";



const Page = () => {

    const [leavesTypes, setLeavesTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState<string>("");
    const [orgs, setOrgs] = useState<any>([]);
    const [role, setrole] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const router = useRouter();
    const pathname = usePathname();
  
    const org_id = useSelector((state:any) => state.organization.selectedOrg)
    const currentrole = useSelector((state:any) => state.membership.memberShipData?.role)

    const fetchLeavesTypes = async () => {
        try {
            setIsLoading(true);
            let queryString = `page=${page}`;
            if (name.trim() !== "") {
                queryString += `&name=${encodeURIComponent(name)}`;
            }
            if (org_id !== (null as any)) {
                queryString += `&org_id=${org_id}`;
            }
            if(currentrole){
              setrole(currentrole)
            }
            const response = await axios.get(`/api/leave-type?${queryString}`)
            console.log('leavetype', response.data)
            if (response) {
                setLeavesTypes(response.data.data)
                setTotalPages(response.data.pagination.totalPages)
            }
        }
        catch (error: any) {
            toast.error(error.msg || 'error in fetching leavetypes')
            console.log('erro in fetch leave type', error)
        }
        finally {
            setIsLoading(false);
        }
    }

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
          fetchLeavesTypes();
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

    // console.log('fetch leaves type', fetchLeavesTypes)

    return (
        <div className="p-4">            
            <LeaveTypeTableClient 
                data={leavesTypes}
                isLoading={isLoading}
                name={name}
                setName={setName}
                orgs={orgs}
                setOrgs={setOrgs}
                role={role}
                page={page}
                setPage={setPage}
                totalPage={totalPages} 
                fetchData={fetchLeavesTypes}
                />
        </div>

    )

}

export default Page
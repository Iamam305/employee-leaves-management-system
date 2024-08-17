'use client'

import { LeaveTypeTableClient } from "@/components/table/LeaveTypeTable/client";
import axios from "axios";
import { useEffect, useState } from "react"
import { toast } from "sonner";



const Page = () => {

    const [leavesTypes, setLeavesTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

const fetchLeavesTypes = async () => {
    try{
        setIsLoading(true);
        const response = await axios.get('/api/leave-type')
        console.log('leavetype' , response.data)
        if(response){
            setLeavesTypes(response.data.data)
        }
    }
    catch(error:any) {
        toast.error(error.msg || 'error in fetching leavetypes')
        console.log('erro in fetch leave type' , error)
    }
    finally{
        setIsLoading(false);
    }
}
  useEffect(() => {
    fetchLeavesTypes();
  }, [])

  console.log('fetch leaves type' , fetchLeavesTypes)
  
return (
    <LeaveTypeTableClient data={leavesTypes}
        isLoading={isLoading}
        fetchData={fetchLeavesTypes}/>
        
    )
  
}

export default Page
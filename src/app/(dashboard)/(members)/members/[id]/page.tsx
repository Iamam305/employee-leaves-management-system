"use client"
import UserDashboard from '@/components/Employee/UserDashboard'
import LeaveRequestModal from '@/components/leaves/LeaveRequestModal'
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

const page = () => {

  const params = useParams(); // Get dynamic route parameters
  const employee_id = params.id; // Extract the id parameter from the URL

  console.log("Employee Id==>", employee_id);

  return (
    <div>
        <div className="w-full flex items-center justify-end p-2 gap-2">
            <LeaveRequestModal title="Apply For Leave" />
          </div>
          <UserDashboard id={employee_id} />
    </div>
  )
}

export default page

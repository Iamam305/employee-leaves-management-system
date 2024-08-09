"use client"
import { LeaveTableClient } from "@/components/table/LeaveTable/client";
import axios from "axios";
import { useEffect, useState } from "react";


const Page = () => {
  
  const [leavedata, setLeavedata] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const Leaves = [
    {
      user_id: {
        name: 'Lokesh',
        email: 'Lokesh@gmail.com',
      },
      leave_type_id: {
        name: 'insuline',
        description: 'take when not well',
      },
      org_id: '12345678',
      start_date: '14/04/2024',
      end_date: '14/05/2024',
      description: 'taking leave',
      status: 'pending',
    },
    {
      user_id: {
        name: 'Priya',
        email: 'Priya@gmail.com',
      },
      leave_type_id: {
        name: 'vacation',
        description: 'annual leave',
      },
      org_id: '87654321',
      start_date: '01/06/2024',
      end_date: '10/06/2024',
      description: 'family vacation',
      status: 'approved',
    },
    {
      user_id: {
        name: 'Rohan',
        email: 'Rohan@gmail.com',
      },
      leave_type_id: {
        name: 'sick',
        description: 'medical leave',
      },
      org_id: '23456789',
      start_date: '20/05/2024',
      end_date: '25/05/2024',
      description: 'fever and flu',
      status: 'approved',
    },
    {
      user_id: {
        name: 'Sneha',
        email: 'Sneha@gmail.com',
      },
      leave_type_id: {
        name: 'maternity',
        description: 'maternity leave',
      },
      org_id: '34567890',
      start_date: '01/07/2024',
      end_date: '01/09/2024',
      description: 'maternity leave',
      status: 'pending',
    },
    {
      user_id: {
        name: 'Amit',
        email: 'Amit@gmail.com',
      },
      leave_type_id: {
        name: 'paternity',
        description: 'paternity leave',
      },
      org_id: '45678901',
      start_date: '15/07/2024',
      end_date: '25/07/2024',
      description: 'newborn care',
      status: 'approved',
    },
    {
      user_id: {
        name: 'Kavya',
        email: 'Kavya@gmail.com',
      },
      leave_type_id: {
        name: 'bereavement',
        description: 'leave for mourning',
      },
      org_id: '56789012',
      start_date: '18/08/2024',
      end_date: '22/08/2024',
      description: 'loss in the family',
      status: 'pending',
    },
    {
      user_id: {
        name: 'Vikram',
        email: 'Vikram@gmail.com',
      },
      leave_type_id: {
        name: 'study',
        description: 'exam preparation',
      },
      org_id: '67890123',
      start_date: '10/09/2024',
      end_date: '20/09/2024',
      description: 'study for exams',
      status: 'approved',
    },
    {
      user_id: {
        name: 'Nisha',
        email: 'Nisha@gmail.com',
      },
      leave_type_id: {
        name: 'compensatory',
        description: 'leave in lieu of extra work',
      },
      org_id: '78901234',
      start_date: '05/10/2024',
      end_date: '07/10/2024',
      description: 'comp off',
      status: 'rejected',
    },
  ];
  
  useEffect(() => {

    (async() => {
      const {data} = await axios.get('/api/leave')
      console.log('leave data' ,data.data)
    })();
  }, [])
  

  return (
    <div> 
      <LeaveTableClient data={Leaves} isLoading={false}/>
    </div>
  )
}

export default Page
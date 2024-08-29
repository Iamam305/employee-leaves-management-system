import { Balances } from "@/models/balanceCredits.model";
import { LeaveType } from "@/models/leave-type.model";

// call when new employee is created
// update the function first change
export const initializeEmployeeBalance = async (userId: string, year: any, orgId: string) => {
  const leaveTypes = await LeaveType.find({ org_id: orgId });
  
  const leaveBalances = leaveTypes.reduce((acc, leaveType) => {
    const monthlyBalances = new Map();
    
    for (let month = 0; month < 12; month++) {
      // Convert the numeric month to a string key
      monthlyBalances.set(month.toString(), {
        credit: leaveType.count_per_month,
        used: 0,
        available: leaveType.count_per_month,
      });
    }
    
    acc[leaveType.name] = {
      total: {
        credit: leaveType.count_per_month * 12,
        used: 0,
        available: leaveType.count_per_month * 12,
      },
      monthly: monthlyBalances,
    };
    
    return acc;
  }, {});

  const balance = new Balances({
    userId,
    year,
    org_id: orgId,
    leaveBalances,
  });

  await balance.save();
  return balance;
};


  
  
  // export const updateEmployeeBalance = async(userId:string, year:any, leaveTypeName:string, credit:number) => {
  //   const balance:any = await Balances.findOne({ userId, year });
  
  //   if (!balance) {
  //     throw new Error("Balance not found for the specified user and year");
  //   }
  
  //   if (!balance.leaveBalances.has(leaveTypeName)) {
  //     throw new Error(`Leave type ${leaveTypeName} not found for the user`);
  //   }
  
  //   balance.leaveBalances.set(leaveTypeName, {
  //     credit,
  //     used: balance.leaveBalances.get(leaveTypeName).used,
  //     available: credit - balance.leaveBalances.get(leaveTypeName).used
  //   });
  
  //   await balance.save();
  //   return balance;
  // }
  
  
  
  interface LeaveCredits {
    [leaveTypeName: string]: number;
  }
  
  // call when admin or hr add credits to employee change this also
  export const updateEmployeeBalance = async (
    userId: string,
    year: any,
    leaveCredits: LeaveCredits
  ) => {
    const balance: any = await Balances.findOne({ userId, year });
  
    if (!balance) {
      throw new Error("Balance not found for the specified user and year");
    }
  
    for (const leaveTypeName in leaveCredits) {
      if (balance.leaveBalances.has(leaveTypeName)) {
        const credit = leaveCredits[leaveTypeName];
        const leaveTypeBalance = balance.leaveBalances.get(leaveTypeName);
  
        // Update total balance
        const totalUsed = leaveTypeBalance.total.used;
        leaveTypeBalance.total.credit = credit;
        leaveTypeBalance.total.available = credit - totalUsed;
  
        // Adjust each month's available balance based on the current used value
        leaveTypeBalance.monthly.forEach((monthBalance: any, month: string) => {
          const used = monthBalance.used;
          const monthlyCredit = monthBalance.credit;
  
          // Update available balance for each month
          leaveTypeBalance.monthly.set(month, {
            credit: monthlyCredit,
            used,
            available: monthlyCredit - used,
          });
        });
  
        balance.leaveBalances.set(leaveTypeName, leaveTypeBalance);
      } else {
        throw new Error(`Leave type ${leaveTypeName} not found for the user`);
      }
    }
  
    // Save the updated balance document
    await balance.save();
  
    return balance;
  };
  
  
  
  
  //call when new leavtype is created
  export const addNewLeaveTypeToAllEmployees = async (leaveType: any) => {
    // Fetch all employees' balances for the given organization
    const allBalances = await Balances.find({ org_id: leaveType.org_id });
  
    // Update leaveBalances for each employee
    for (const balance of allBalances) {
      // Initialize monthly balances map
      const monthlyBalances = new Map<string, any>();
      
      for (let month = 0; month < 12; month++) {
        // Set default values for each month
        monthlyBalances.set(month.toString(), {
          credit: leaveType.count_per_month,
          used: 0,
          available: leaveType.count_per_month,
        });
      }
      
      // Define the new leave type balance
      const newLeaveTypeBalance = {
        total: {
          credit: leaveType.count_per_month * 12, // Total credit
          used: 0,   // Total used
          available: leaveType.count_per_month * 12, // Total available
        },
        monthly: monthlyBalances,
      };
  
      // Add the new leave type to the employee's leaveBalances
      balance.leaveBalances.set(leaveType.name, newLeaveTypeBalance);
  
      // Save the updated balance document
      await balance.save();
    }
  };
  
  
  //call when employee applying for leave
  // export const calculateAndUpdateBalances = async(
  //   userId:string,
  //   year:any,
  //   leaveTypeName:string,
  //   days:number
  // ) => {
  //   // Find the balance record for the specific user and year
  //   const balance = await Balances.findOne({ userId, year });
  
  //   if (!balance) {
  //     throw new Error("Balance not found for the specified user and year");
  //   }
  
  //   // Check if the leave type exists in the user's balance record
  //   if (!balance.leaveBalances.has(leaveTypeName)) {
  //     throw new Error(`Leave type ${leaveTypeName} not found for the user`);
  //   }
  
  //   // Get the current balance for the specified leave type
  //   const currentBalance:any = balance.leaveBalances.get(leaveTypeName);
  
  //   // Calculate the updated balance
  //   const updatedUsed = currentBalance.used + days;
  //   const updatedAvailable = currentBalance.credit - updatedUsed;
  
  //   // Update the balance in the map
  //   balance.leaveBalances.set(leaveTypeName, {
  //     credit: currentBalance.credit,
  //     used: updatedUsed,
  //     available: updatedAvailable,
  //   });
  
  //   // Save the updated balance record
  //   await balance.save();
  
  //   return balance;
  // }


  export const calculateLeaveBalance = async (
    userId: string,
    year: any,
    leaveTypeName: string
  ) => {
    // Find the balance record for the specific user and year
    const balance = await Balances.findOne({ userId, year });
  
    if (!balance) {
      throw new Error("Balance not found for the specified user and year");
    }
  
    // Check if the leave type exists in the user's balance record
    if (!balance.leaveBalances.has(leaveTypeName)) {
      throw new Error(`Leave type ${leaveTypeName} not found for the user`);
    }
  
    // Get the current balance for the specified leave type
    const leaveTypeBalance:any = balance.leaveBalances.get(leaveTypeName);
  
    // Convert the monthly Map to a plain object for easier manipulation
    const monthlyBalances = Object.fromEntries(
      Array.from(leaveTypeBalance.monthly.entries()).map(([month , balance]:any) => [
        month,
        {
          credit: balance.credit,
          used: balance.used,
          available: balance.available,
        }
      ])
    );
  
    // Return the current balance including the total and monthly balances
    return {
      total: {
        credit: leaveTypeBalance.total.credit,
        used: leaveTypeBalance.total.used,
        available: leaveTypeBalance.total.available,
      },
      monthly: monthlyBalances,
    };
  };
  
  


  // update balnce change this function also
  export const updateLeaveBalance = async (
    userId: string,
    year: any,
    leaveTypeName: string,
    month: number // Add month parameter to specify the month of leave
  ) => {
    // Find the balance record for the specific user and year
    console.log("Entered values:", {
      userId,
      year,
      leaveTypeName,
      month,
    });
  
    const balance = await Balances.findOne({ userId, year });
  
    if (!balance) {
      throw new Error("Balance not found for the specified user and year");
    }
  
    // Check if the leave type exists in the user's balance record
    if (!balance.leaveBalances.has(leaveTypeName)) {
      throw new Error(`Leave type ${leaveTypeName} not found for the user`);
    }
  
    // Get the current balance for the specified leave type
    const leaveTypeBalance: any = balance.leaveBalances.get(leaveTypeName);
  
    // Convert month to a string for correct map handling
    const monthKey = month.toString();
  
    // Check if the month balance exists in the leave type balance
    if (!leaveTypeBalance.monthly.has(monthKey)) {
      throw new Error(`Month ${month} not found for leave type ${leaveTypeName}`);
    }
  
    // Get the current month's balance
    const currentMonthBalance = leaveTypeBalance.monthly.get(monthKey);
  
    // Calculate the new used and available balances for the month
    const newMonthUsed = currentMonthBalance.used + 1; // Increment by 1 for each use
    const newMonthAvailable = currentMonthBalance.credit - newMonthUsed;
  
    // Ensure the available monthly balance does not go negative
    if (newMonthAvailable < 0) {
      throw new Error(
        `Insufficient balance: cannot take more leaves for the month. Only ${currentMonthBalance.available} leaves available for this month.`
      );
    }
  
    // Update the monthly balance in the map
    leaveTypeBalance.monthly.set(monthKey, {
      credit: currentMonthBalance.credit,
      used: newMonthUsed,
      available: newMonthAvailable,
    });
  
    // Update the total balance for the leave type
    const totalUsed = leaveTypeBalance.total.used + 1;
    const totalAvailable = leaveTypeBalance.total.credit - totalUsed;
  
    leaveTypeBalance.total.used = totalUsed;
    leaveTypeBalance.total.available = totalAvailable;
  
    // Save the updated leave type balance back into the balance document
    balance.leaveBalances.set(leaveTypeName, leaveTypeBalance);
  
    // Save the updated balance record
    await balance.save();
  
    return balance;
  };
  


// calculateTotalCredit
// export const calculateTotalCredit = async (userId: string, year: any) => {
//   // Find the balance record for the specific user and year
//   const balance = await Balances.findOne({ userId, year });

//   if (!balance) {
//     // If no balance is found, return 0
//     return 0;
//   }

//   // Initialize total available balance
//   let totalAvailable = 0;

//   // Iterate through all leave types and sum up the total available balances
//   balance.leaveBalances.forEach((leaveTypeBalance: any) => {
//     totalAvailable += leaveTypeBalance.total.available;
//   });

//   // Return the total available balance
//   return totalAvailable;
// };


export const calculateTotalCredit = async (userId: string, year: any) => {
  // Find the balance record for the specific user and year
  const balance = await Balances.findOne({ userId, year });

  if (!balance) {
    // If no balance is found, return [0, []] (0 for totalCredit and an empty array for totalMonthCredits)
    return [0, []];
  }

  // Initialize total yearly available balance
  let totalCredit = 0;

  // Initialize an array to store total available monthly credits
  const totalMonthCredits = Array(12).fill(0); // Array of 12 months initialized to 0

  // Iterate through all leave types and calculate the total available balances
  balance.leaveBalances.forEach((leaveTypeBalance: any) => {
    // Add to the total yearly credit
    totalCredit += leaveTypeBalance.total.available;

    // Calculate total available balance for each month
    leaveTypeBalance.monthly.forEach((monthlyBalance: any, month: number) => {
      totalMonthCredits[month] += monthlyBalance.available;
    });
  });

  // Return an array with totalCredit and totalMonthCredits
  return [totalCredit, totalMonthCredits];
};
  
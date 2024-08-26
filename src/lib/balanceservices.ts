import { Balances } from "@/models/balanceCredits.model";
import { LeaveType } from "@/models/leave-type.model";

// call when new employee is created
export const initializeEmployeeBalance = async(userId:string, year:any) => {
    const leaveTypes = await LeaveType.find();
  
    const leaveBalances = leaveTypes.reduce((acc, leaveType) => {
      acc[leaveType.name] = {
        credit: leaveType.count_per_month * 12,
        used: 0,
        available: leaveType.count_per_month * 12,
      };
      return acc;
    }, {});
  
    const balance = new Balances({
      userId,
      year,
      leaveBalances,
    });
  
    await balance.save();
    return balance;
  }
  
  
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
  
  // call when admin or hr add credits to employee
  export const updateEmployeeBalance = async (userId: string, year: any, leaveCredits: LeaveCredits) => {
    const balance: any = await Balances.findOne({ userId, year });
  
    if (!balance) {
      throw new Error("Balance not found for the specified user and year");
    }
  
    for (const leaveTypeName in leaveCredits) {
      if (balance.leaveBalances.has(leaveTypeName)) {
        const credit = leaveCredits[leaveTypeName];
        const used = balance.leaveBalances.get(leaveTypeName).used;
  
        balance.leaveBalances.set(leaveTypeName, {
          credit,
          used,
          available: credit - used,
        });
      } else {
        throw new Error(`Leave type ${leaveTypeName} not found for the user`);
      }
    }
  
    // Save the updated balance document
    await balance.save();
  
    return balance ;
  };
  
  
  //call when new leavtype is created
  export const addNewLeaveTypeToAllEmployees = async(leaveType:any) => {
      // Fetch all employees' balances
      const allBalances = await Balances.find({});
  
      // Update leaveBalances for each employee
      for (const balance of allBalances) {
        balance.leaveBalances.set(leaveType.name, {
          credit: leaveType.count_per_month * 12 , // default credit
          used: 0,   // default used
          available: leaveType.count_per_month * 12, // default available
        });
    
        await balance.save();
      }
  }
  
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
    const currentBalance: any = balance.leaveBalances.get(leaveTypeName);

    // Return the current balance without modification
    return {
        credit: currentBalance.credit,
        used: currentBalance.used,
        available: currentBalance.available,
    };
};


  // update balnce 
  export const updateLeaveBalance = async (
    userId: string,
    year: any,
    leaveTypeName: string
) => {
    // Find the balance record for the specific user and year
    console.log("Entered values:", {
        userId,
        year,
        leaveTypeName,
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
    const currentBalance: any = balance.leaveBalances.get(leaveTypeName);

    // Calculate the potential new used and available balances
    const newUsed = currentBalance.used + 1; // Increment by 1 for each use
    const newAvailable = currentBalance.credit - newUsed;

    // Ensure the available balance does not go negative
    if (newAvailable < 0) {
        throw new Error(`Insufficient balance: cannot take more leaves. Only ${currentBalance.available} leaves available.`);
    }

    // Update the balance in the map
    balance.leaveBalances.set(leaveTypeName, {
        credit: currentBalance.credit,
        used: newUsed,
        available: newAvailable,
    });

    // Save the updated balance record
    await balance.save();

    return balance;
};


  export const calculateTotalCredit = async (userId: string, year: any) => {
    // Find the balance record for the specific user and year
    const balance = await Balances.findOne({ userId, year });
  
    if (!balance) {
      // throw new Error("Balance not found for the specified user and year");
      return 0;
    }
  
    // Initialize total credit
    let totalAvailable = 0;
  
    // Iterate through all leave types and sum up the credits
    for (const leaveType of balance.leaveBalances.keys()) {
      const leaveBalance: any = balance.leaveBalances.get(leaveType);
      totalAvailable += leaveBalance.available;
    }
  
    // Return the total credit
    return totalAvailable;
  };
  
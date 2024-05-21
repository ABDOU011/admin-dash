"use client"

import React, { useEffect, useState } from "react";
import NewUser from "@/components/NewUser";
import NewAdmin from "@/components/NewAdmin";
import UsersTable from "@/components/UsersTable";
import Overview from "@/components/Overview";

export default function Header (){

    const [selected, setSelected] = useState(() => {
        if (typeof window !== "undefined") {
          return localStorage.getItem("selected") || "overview";
        }
        return "overview";
      });
    
      useEffect(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("selected", selected);
        }
      }, [selected]);
    
      const handleSelect = (value: string) => {
        setSelected(value);
      };
    return (
        <div className="bg-[#F4F7FE] w-full flex flex-col items-start">
            <div className="flex flex-row items-center justify-between p-[24px] gap-[56px] w-full">
                <nav className="flex flex-row justify-center items-center gap-[56px] w-[554px] h-[24px]"> 
                    {selected==="overview" ? (
                        <button onClick={() => handleSelect("overview")} className="font-['SF_Compact_Display'] font-medium text-[20px] text-[#24BAEC] ">Overview</button>
                    )
                    :
                    (
                        <button onClick={() => handleSelect("overview")} className="font-['SF_Compact_Display'] font-medium text-[20px] text-[#1B1E28] opacity-50">Overview</button>
                    )
                }
                    {selected==="table" ? (
                        <button onClick={() => handleSelect("table")} className="font-['SF_Compact_Display'] font-medium text-[20px] text-[#24BAEC] ">Table</button>
                    )
                    :
                    (
                        <button onClick={() => handleSelect("table")} className="font-['SF_Compact_Display'] font-medium text-[20px] text-[#1B1E28] opacity-50">Table</button>
                    )
                }
                    {selected==="newuser" ? (
                        <button onClick={() => handleSelect("newuser")} className="font-['SF_Compact_Display'] font-medium text-[20px] text-[#24BAEC] ">New User</button>
                    )
                    :
                    (
                        <button onClick={() => handleSelect("newuser")} className="font-['SF_Compact_Display'] font-medium text-[20px] text-[#1B1E28] opacity-50">New User</button>
                    )
                }
                {selected==="newadmin" ? (
                        <button onClick={() => handleSelect("newadmin")} className="font-['SF_Compact_Display'] font-medium text-[20px] text-[#24BAEC] ">New Admin</button>
                    )
                    :
                    (
                        <button onClick={() => handleSelect("newadmin")} className="font-['SF_Compact_Display'] font-medium text-[20px] text-[#1B1E28] opacity-50">New Admin</button>
                    )
                }
                    
                    
                    
                    
                </nav>
                <div className="flex-row items-center p-[12px] gap-[18px] w-[342px] h-[65px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] [box-shadow:14px_17px_40px_4px_rgba(112,_144,_176,_0.08)] rounded-[30px]">
                
                </div>
            </div>
            {selected==="overview" ? (
                <Overview></Overview>
            )
            : selected==="table" ?
            (
                
                <UsersTable></UsersTable>
                
            )
            : selected ==="newuser"?
            (
                <NewUser></NewUser>
            ) :
            (
                <NewAdmin></NewAdmin>
            )
        }
        </div>
    )
}
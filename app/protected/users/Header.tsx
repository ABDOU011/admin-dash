"use client";

import React, { useEffect, useState } from "react";
import NewUser from "@/components/NewUser";
import NewAdmin from "@/components/NewAdmin";
import UsersTable from "@/components/UsersTable";
import Overview from "@/components/Overview";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { signout } from "../users/actions/actions";
export default function Header() {
  const [selected, setSelected] = useState("overview");

  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem("selected", value);
  };

  useEffect(() => {
    const savedSelected2 = localStorage.getItem("selected");
    if (savedSelected2) {
      setSelected(savedSelected2);
    }
  }, []);

  return (
    <div className="bg-[#F4F7FE] w-full flex flex-col items-start">
      <div className="flex flex-row items-center justify-between p-[24px] gap-[56px] w-full">
        <nav className="flex flex-row justify-center items-center gap-[56px] w-[580px] h-[24px]">
          {selected === "overview" ? (
            <button
              onClick={() => handleSelect("overview")}
              className="font-['SF_Compact_Display'] font-medium text-[20px] text-[#24BAEC] "
            >
              Overview
            </button>
          ) : (
            <button
              onClick={() => handleSelect("overview")}
              className=" font-medium text-[20px] text-[#1B1E28] opacity-50"
            >
              Overview
            </button>
          )}
          {selected === "table" ? (
            <button
              onClick={() => handleSelect("table")}
              className=" font-medium text-[20px] text-[#24BAEC] "
            >
              View Users
            </button>
          ) : (
            <button
              onClick={() => handleSelect("table")}
              className=" font-medium text-[20px] text-[#1B1E28] opacity-50"
            >
              View Users
            </button>
          )}
          {selected === "newuser" ? (
            <button
              onClick={() => handleSelect("newuser")}
              className=" font-medium text-[20px] text-[#24BAEC] "
            >
              New User
            </button>
          ) : (
            <button
              onClick={() => handleSelect("newuser")}
              className=" font-medium text-[20px] text-[#1B1E28] opacity-50"
            >
              New User
            </button>
          )}
          {selected === "newadmin" ? (
            <button
              onClick={() => handleSelect("newadmin")}
              className=" font-medium text-[20px] text-[#24BAEC] "
            >
              New Admin
            </button>
          ) : (
            <button
              onClick={() => handleSelect("newadmin")}
              className=" font-medium text-[20px] text-[#1B1E28] opacity-50"
            >
              New Admin
            </button>
          )}
        </nav>
        <div className="flex-row items-center p-[12px] gap-[18px] w-[110px] h-[54px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4]  rounded-[30px]">
          <button
            onClick={() => {
              signout();
            }}
          >
            <LogoutOutlinedIcon className="text-[black]"></LogoutOutlinedIcon>
          </button>
        </div>
      </div>
      {selected === "overview" ? (
        <Overview></Overview>
      ) : selected === "table" ? (
        <UsersTable></UsersTable>
      ) : selected === "newuser" ? (
        <NewUser></NewUser>
      ) : (
        <NewAdmin></NewAdmin>
      )}
    </div>
  );
}

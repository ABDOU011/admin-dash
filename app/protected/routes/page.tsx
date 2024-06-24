"use client"
import ROverview from "@/components/ROverview";
import { useEffect, useState } from "react";
import { signout } from "../users/actions/actions";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import RouteTable from "@/components/RouteTable";
import NewRoute from "@/components/NewRoute";

export default function routes() {
    const [selected, setSelected] = useState("overview");

  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem("selected3", value);
  };

  useEffect(() => {
    const savedSelected2 = localStorage.getItem("selected3");
    if (savedSelected2) {
      setSelected(savedSelected2);
    }
  }, []);

  return (
    <div className="bg-[#F4F7FE] w-full flex flex-col items-start">
      <div className="flex flex-row items-center justify-between p-[24px] w-full">
        <nav className="flex flex-row justify-start pl-7 items-center gap-[56px] w-full h-[24px]">
          {selected === "overview" ? (
            <button
              onClick={() => handleSelect("overview")}
              className=" font-medium text-[18px] text-[#24BAEC] "
            >
              Overview
            </button>
          ) : (
            <button
              onClick={() => handleSelect("overview")}
              className=" font-medium text-[18px] text-[#1B1E28] opacity-50"
            >
              Overview
            </button>
          )}
          {selected === "table" ? (
            <button
              onClick={() => handleSelect("table")}
              className=" font-medium text-[18px] text-[#24BAEC] "
            >
              View Routes
            </button>
          ) : (
            <button
              onClick={() => handleSelect("table")}
              className=" font-medium text-[18px] text-[#1B1E28] opacity-50"
            >
              View Routes
            </button>
          )}
          {selected === "createnew" ? (
            <button
              onClick={() => handleSelect("createnew")}
              className=" font-medium text-[18px] text-[#24BAEC] "
            >
              Create New
            </button>
          ) : (
            <button
              onClick={() => handleSelect("createnew")}
              className=" font-medium text-[18px] text-[#1B1E28] opacity-50"
            >
              Create New
            </button>
          )}
        </nav>

        <div className="flex-row items-center p-[12px] gap-[18px]  h-[54px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4]  rounded-[30px]">
          <button
            onClick={() => {
              signout();
            }}
          >
            <LogoutOutlinedIcon className="text-[black]"></LogoutOutlinedIcon>
          </button>
        </div>
      </div>
      {selected==="overview" ? (
                <ROverview></ROverview>
            )
            
            : selected==="table"?(
                <RouteTable></RouteTable>
            )
            :(
                <NewRoute></NewRoute>
            )
            }
    </div>
  );
}

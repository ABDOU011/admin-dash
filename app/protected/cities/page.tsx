"use client";

import React ,{ useEffect, useState } from "react";
import { signout } from "../users/actions/actions";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import COverview from "@/components/COverview";
import CityTable from "@/components/CityTable";
import NewCity from "@/components/NewCity";


export default function Cities() {
  const [selected, setSelected] = useState("overview");
  const [city, setcity] = useState<string | null>(null);
  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem("selected4", value);
  };
  
  useEffect(() => {
    const savedSelected2 = localStorage.getItem("selected4");
    if (savedSelected2) {
      setSelected(savedSelected2);
    }
    
  }, []);

  
    
    
 
    
  
  return (
    <div className="bg-[#F4F7FE] w-full flex flex-col items-start h-full">
      <div className="flex flex-row items-center justify-between p-[24px] w-full">
        <nav className="flex flex-row pl-7 items-center gap-[56px] w-[554px] h-[24px]">
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
              View Cities
            </button>
          ) : (
            <button
              onClick={() => handleSelect("table")}
              className=" font-medium text-[18px] text-[#1B1E28] opacity-50"
            >
              View Cities
            </button>
          )}
          {selected === "addcity" ? (
            <button
              onClick={() => handleSelect("addcity")}
              className=" font-medium text-[18px] text-[#24BAEC] "
            >
              Add City
            </button>
          ) : (
            <button
              onClick={() => handleSelect("addcity")}
              className=" font-medium text-[18px] text-[#1B1E28] opacity-50"
            >
              Add City
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
      
      {selected === "overview" ? (
        <COverview/>
      ) : selected === "table" ? (
        <CityTable/>
      ) : selected === "addcity" ? (
        <NewCity></NewCity>
      )
      :(
        <></>
    )}
    </div>
  );
}

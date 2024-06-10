"use client";


import { redirect } from "next/navigation";
import DashIcon from "../../components/icons/DashIcon"
import UsersIcon from "../../components/icons/UsersIcon"
import RoutesIcon from "../../components/icons/RoutesIcon"
import Overview from "@/components/Overview";
import { signout } from "./users/actions/actions";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default async function ProtectedPage() {
  

 

  return (
    <div className="bg-[#F4F7FE] w-full">
           <div className="bg-[#F4F7FE] w-full flex flex-col items-start">
      <div className="flex flex-row items-center justify-between p-[24px] gap-[56px] w-full">
        <nav className="flex flex-row justify-start items-center gap-[56px] w-[554px] h-[24px]">
          
            <button
              
              className=" font-medium text-[20px] text-[#24BAEC] "
            >
              Overview
            </button>
          
          
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
     
        <Overview></Overview>
      
      </div>
    </div>
  );
}

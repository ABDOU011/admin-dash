"use client"


import DashIcon from "./icons/DashIcon";
import UsersIcon from "./icons/UsersIcon";
import RoutesIcon from "./icons/RoutesIcon";
import Link from "next/link";
import { useEffect, useState } from "react";

export default  function ProtectedPage() {
  const [selected2, setSelected] = useState(localStorage.getItem("selected2") || "dashboard");

  

  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem("selected2", value);
  };

  return (
    <section className="flex flex-col self-stretch pt-14 pb-5 gap-10 bg-white h-screen min-w-[280px]">
      <header className="flex flex-col w-full">
        <h1 className="justify-center self-center px-5 py-1 text-2xl font-bold leading-7 text-sky-400">
          HORIZON <span>FREE</span>
        </h1>
      </header>
      <hr className="h-[1px] w-full bg-[#E4E4E4]"></hr>

      <nav className="flex flex-col pl-5  w-full text-base font-medium tracking-tight leading-8 text-gray-900 whitespace-nowrap">
        <Link href={"/protected"} onClick={()=> {handleSelect("dashboard")}}>
          {selected2 === "dashboard" ? (
            <div className="flex flex-row gap-5 py-1 mt-5 items-center">
              <hr className="h-[36px] w-[4px] bg-[#24BAEC] left-0 absolute"></hr>
              <DashIcon color="#24BAEC" />
              <span>Dashboard</span>
            </div>
          ) : (
            <div className="flex flex-row gap-5 py-1 mt-5 items-center">
              <DashIcon color="#1B1E28" />
              <span>Dashboard</span>
            </div>
          )}
        </Link>

        <Link href={"/protected/users"} onClick={()=> {handleSelect("users")}}>
          {selected2 === "users" ? (
            <div className="flex flex-row gap-5 py-1 mt-5 items-center">
              <hr className="h-[36px] w-[4px] bg-[#24BAEC] left-0 absolute"></hr>
              <UsersIcon color="#24BAEC" />
              <span>Users</span>
            </div>
          ) : (
            <div className="flex flex-row gap-5 py-1 mt-5 items-center">
              <UsersIcon color="#1B1E28" />
              <span>Users</span>
            </div>
          )}
        </Link>
        <Link href={"/protected/routes"} onClick={()=> {handleSelect("routes")}}>
          {selected2 === "routes" ? (
            <div className="flex flex-row gap-5 py-1 mt-5 items-center">
              <hr className="h-[36px] w-[4px] bg-[#24BAEC] left-0 absolute"></hr>
              <RoutesIcon color="#24BAEC" />
              <span>Routes</span>
            </div>
          ) : (
            <div className="flex flex-row gap-5 py-1 mt-5 items-center">
              <RoutesIcon color="#1B1E28" />
              <span>Routes</span>
            </div>
          )}
        </Link>
      </nav>
    </section>
  );
}

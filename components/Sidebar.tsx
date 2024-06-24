"use client";

import DashIcon from "./icons/DashIcon";
import UsersIcon from "./icons/UsersIcon";
import RoutesIcon from "./icons/RoutesIcon";
import CitiesIcon from "./icons/CitiesIcon";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function Sidebar() {

  const [selected2, setSelected] = useState("dashboard");
    
 
    
  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem("selected2", value);
    
  };

 

  

  const router = useRouter();

  useEffect(() => {
    // Initialize the selected state from localStorage
    const savedSelected2 = localStorage.getItem("selected2");
    
    if (savedSelected2) {
      setSelected(savedSelected2);
      if (savedSelected2 === "users") {
        router.push("/protected/users");
      } else if (savedSelected2 === "routes" ) {
        
        router.push(`/protected/routes`);
      }
      else if (savedSelected2 === "cities" ) {
        
        router.push(`/protected/cities`);
      }
      
    }
  }, []);

  return (
    <section className="flex flex-col self-stretch pt-14 pb-5 gap-10 bg-white h-screen min-w-[280px] fixed">
      <header className="flex flex-col w-full">
        <h1 className="justify-center self-center px-5 py-1 text-2xl font-bold leading-7 text-sky-400">
          GuiDZ 
        </h1>
      </header>
      <hr className="h-[1px] w-full bg-[#E4E4E4]"></hr>

      <nav className="flex flex-col pl-5 gap-5 w-full text-[#76787e] ">
        <Link
          href={"/protected"}
          onClick={() => {
            handleSelect("dashboard");
          }}
        >
          {selected2 === "dashboard" ? (
            <div className="flex flex-row gap-5 py-1 items-center">
              <hr className="h-[36px] w-[4px] bg-[#24BAEC] left-0 absolute"></hr>
              <DashIcon color="#24BAEC" />
              <span className="text-black">Dashboard</span>
            </div>
          ) : (
            <div className="flex flex-row gap-5 py-1 items-center">
              <DashIcon color="#76787e" />
              <span>Dashboard</span>
            </div>
          )}
        </Link>

        <Link
          href={"/protected/users"}
          onClick={() => {
            handleSelect("users");
          }}
        >
          {selected2 === "users" ? (
            <div className="flex flex-row gap-5 py-1 items-center">
              <hr className="h-[36px] w-[4px] bg-[#24BAEC] left-0 absolute"></hr>
              <UsersIcon color="#24BAEC" />
              <span className="text-black">Users</span>
            </div>
          ) : (
            <div className="flex flex-row gap-5 py-1 items-center">
              <UsersIcon color="#76787e" />
              <span>Users</span>
            </div>
          )}
        </Link>

        <Link
          href={"/protected/cities"}
          onClick={() => {
            handleSelect("cities");
          }}
        >
          {selected2 === "cities" ? (
            <div className="flex flex-row gap-5 py-1 items-center">
              <hr className="h-[36px] w-[4px] bg-[#24BAEC] left-0 absolute"></hr>
              <CitiesIcon color="#24BAEC" />
              <span className="text-black">Cities</span>
            </div>
          ) : (
            <div className="flex flex-row gap-5 py-1 items-center">
              <CitiesIcon color="#76787e" />
              <span>Cities</span>
            </div>
          )}
        </Link>

        <Link
          href={"/protected/routes"}
          onClick={() => {
            handleSelect("routes");
          }}
        >
          {selected2 === "routes" ? (
            <div className="flex flex-row gap-5 py-1 items-center">
              <hr className="h-[36px] w-[4px] bg-[#24BAEC] left-0 absolute"></hr>
              <RoutesIcon color="#24BAEC" />
              <span className="text-black">Routes</span>
            </div>
          ) : (
            <div className="flex flex-row gap-5 py-1 items-center">
              <RoutesIcon color="#76787e" />
              <span>Routes</span>
            </div>
          )}
        </Link>
        
      </nav>
    </section>
  );
}

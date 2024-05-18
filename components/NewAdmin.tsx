"use client";
import { useRef } from "react";
import { addAdmin } from "@/app/protected/users/actions/actions";

export default function NewUser({}: {}) {
  
  const ref = useRef<HTMLFormElement>(null);
  

  return (
    <div className="flex flex-col items-end pt-0 px-[24px] pb-[80px] gap-[16px] w-full">
      <form ref={ref} action={async (formData) => {
        await addAdmin(formData);
        ref.current?.reset();
      }} className="flex flex-col items-start p-[24px] gap-[48px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px] w-full">
        <h1 className="font-medium text-[20px] text-[#1B1E28]">
          Create New User
        </h1>
        <div className="flex flex-col items-start gap-[24px] w-full">
          <div className="flex flex-row items-start gap-[24px] ">
            <div className=" flex flex-col justify-center items-start gap-[12px] w-[440px] ">
              <label htmlFor="name" className="text-black"> Name</label>
              <input required maxLength={32} minLength={6} name="name" placeholder="your name"  className="text-black pl-4 w-[440px] h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"/>
            </div>
            <div className=" flex flex-col justify-center items-start gap-[12px] w-[440px] ">
              
            </div>
          </div>
          <div className="flex flex-row items-start gap-[24px] ">
            <div className=" flex flex-col justify-center items-start gap-[12px] w-[440px] ">
              <label htmlFor="email" className="text-black"> Email</label>
              <input type="email" required name="email" placeholder="Email"  className="text-black pl-4 w-[440px] h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"/>
            </div>
            <div className=" flex flex-col justify-center items-start gap-[12px] w-[440px] ">
              <label htmlFor="password" className="text-black"> Password</label>
              <input minLength={6} maxLength={32} required type="password" name="password" placeholder="*********" className="text-black pl-4 w-[440px] h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"/>
            </div>
          </div>
          
        </div>
        <button type="submit"   className="flex flex-row justify-center items-center p-0 gap-[10px] w-[240px] h-[56px] bg-[#24BAEC] rounded-[16px]">
        Save
      </button>
      </form>
      
    </div>
  );
}

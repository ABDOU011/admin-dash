"use client";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createClient } from "@/utils/supabase/client";


export default function City(): JSX.Element {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const data = [14, 25, 33, 19, 15, 27, 24, 35, 31, 36, 38, 44];
  const [newusers, setNewUsers] = useState<number>(0);
  const [totalusers, setTotalUsers] = useState<number>(0);
  const [linedata, setLineData] = useState<number[] | undefined>(undefined);
  const [histo, setHistory] = useState<number[] | undefined>(undefined);
  const maxCount = Math.max(...(linedata ? linedata : []));
  const router = useRouter();
  const searchParams = useSearchParams();
  const i = searchParams?.get("id");
  
  console.log(i);


  const fetchData = async () => {
    const supabase = createClient();
    const { data: sessiondata, error: sessionerror } =
      await supabase.auth.getSession();

    if(i){
      const { data, error } = await supabase.functions.invoke("admin", {
        body: {
          route: "user-reservations",
          data: i,
        },
        
        
      
      });
      if (data) {
        console.log(data);
      }
      if (error) {
        console.log(error);
      }
    }

    
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseModal = () => {
    setModalIsOpen(false);
    fetchData();
  };

  return (
    <div className="bg-[#F4F7FE] w-full flex flex-col items-start pt-12">
      <button className="ml-5 mb-5" onClick={() => router.back()}>
        <ArrowBackIcon className="text-black" />
      </button>
      <div className="flex flex-col items-start p-[24px] gap-[48px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px] w-full">
        <p className="font-medium text-[20px] text-[#1B1E28]">
          Upcoming reservations
        </p>
        <div className="flex flex-col items-start p-0 gap-[20px]">
          <div className="flex flex-row items-center px-[16px] py-0 gap-[24px] w-[904px] h-[56px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[8px]">
            <ConfirmationNumberIcon className="opacity-30 text-black"></ConfirmationNumberIcon>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

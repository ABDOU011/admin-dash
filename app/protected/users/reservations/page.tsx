"use client";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createClient } from "@/utils/supabase/client";
import EastIcon from '@mui/icons-material/East';
import CloseIcon from '@mui/icons-material/Close';
import Modal from 'react-modal';

export default function City(): JSX.Element {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [newusers, setNewUsers] = useState<any>();
  const [totalusers, setTotalUsers] = useState<any>();
  const [linedata, setLineData] = useState<number[] | undefined>(undefined);
 
  const maxCount = Math.max(...(linedata ? linedata : []));
  const router = useRouter();
  const searchParams = useSearchParams();
  const i = searchParams?.get("id");
  var dg = ['Zero','One','Two','Three','Four', 'Five','Six','Seven','Eight','Nine','Ten'];

  const handleClickOpen = (userId:string) => {
    setTotalUsers(userId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const fetchData = async () => {
    const supabase = createClient();

    if (i) {
      const {
        data: { data },
        error,
      } = await supabase.functions.invoke("admin", {
        body: {
          route: "user-reservations",
          data: i,
        },
      });
      if (data) {
        console.log(data);
        setNewUsers(data);
      }
      if (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseModal = async (reservationId:any) => {
    const supabase = createClient();
   try {
    const {
      error,
      } = await supabase.functions.invoke("admin", {
      body: {
      route: "cancel-reservation",
      data: {
      "user": i,
      "reservation": reservationId
      },},
      }); 
      if(error){
        console.log(error);
      }
      else{
        fetchData();
      }
   } catch (error) {
    toast.error("error occured check console");
   }
    toast.success("Reservation cancelled");
      
  };

  return (
    <div className="bg-[#F4F7FE] w-full flex flex-col items-start pt-12 px-6 h-full">
      <button className="ml-5 mb-5" onClick={() => router.back()}>
        <ArrowBackIcon className="text-black" />
      </button>
      <div className="flex flex-col items-start p-[24px] gap-[48px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px] w-full">
        <div className="flex flex-row justify-between w-full">
        <p className="font-medium text-[20px] text-[#1B1E28]">
          Upcoming reservations
        </p>
        <button className="font-medium text-[12px] text-black" onClick={()=>{fetchData()}}> Refresh</button>
        </div>
        
        
        <div className="flex flex-col items-start p-0 gap-[20px] w-full">
          {newusers?.map((item:any, index:number) => {
            return (
              <div key={index} className="flex flex-row items-center px-[16px] py-0 gap-[24px] w-full h-[56px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[8px]">
                <ConfirmationNumberIcon className="opacity-30 text-black"></ConfirmationNumberIcon>
                <div className="flex flex-row items-center p-0 gap-[32px] ">
                  <div className="flex flex-col items-start p-0 gap-[2px] ">
                    <p className="text-black text-[12px] opacity-60">{item.from.place}</p>
                    <p className="text-black text-[12px] ">{Math.trunc(item.from.time/60) < 10 ? "0"+Math.trunc(item.from.time/60) : Math.trunc(item.from.time/60)}:{(item.from.time%60) < 10 ? "0"+(item.from.time%60) : (item.from.time%60)}</p>
                  </div>
                  <EastIcon className="text-black h-[20px]"></EastIcon>
                  <div className="flex flex-col items-start p-0 gap-[2px] ">
                    <p className="text-black text-[12px] opacity-60">{item.to.place}</p>
                    <p className="text-black text-[12px] ">{Math.trunc(item.to.time/60) < 10 ? "0"+Math.trunc(item.to.time/60) : Math.trunc(item.to.time/60)}:{(item.to.time%60) < 10 ? "0"+(item.to.time%60) : (item.to.time%60)}</p>
                  </div>
                </div>
                <div className="w-0 h-[40px] border-[1px] border-[solid] border-[#E4E4E4]" />
                <div className="flex flex-row items-center p-0 gap-[30px]">
                  <div className="flex flex-col items-center p-0 gap-[6px]">
                    <p className="text-black text-[12px] opacity-60">{`Passenger(s)`}</p>
                    <p className="text-black text-[14px] ">{dg[item.seatsCount]}</p>
                  </div>
                  <div className="flex flex-col items-center p-0 gap-[6px]">
                    <p className="text-black text-[12px] opacity-60">Total Price</p>
                    <p className="text-black text-[14px] ">{item.totalPrice} DA</p>
                  </div>
                  <div className="flex flex-col items-center p-0 gap-[6px]">
                    <p className="text-black text-[12px] opacity-60">Price Payed</p>
                    <p className="text-black text-[14px] ">{item.pricePayed} DA</p>
                  </div>
                  <div className="flex flex-col items-center p-0 gap-[6px]">
                    <p className="text-black text-[12px] opacity-60">Payement Method</p>
                    <p className="text-black text-[14px] ">{item.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex flex-row justify-self-end ml-auto">
                  <button onClick={() => handleClickOpen(item.id)}>
                    <CloseIcon className="text-black opacity-50"></CloseIcon>
                  </button> 
                </div>
              </div>
            );
          })}
        </div>
        <ToastContainer />
      </div>
      <Modal
        isOpen={open}
        onRequestClose={handleClose}
        contentLabel="Edit User Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            width: "400px",
            height: "250px",
            marginRight: "-125px",
            marginBottom: "-75px",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div className="flex flex-col justify-center items-center gap-[24px] w-[350px] h-[200px]  rounded-[16px] p-[24px]">
          <h1 className="text-black text-[14px] font-bold">Are you sure you want to permanently delete it?</h1>
          <div className="flex flex-row items-end justify-end w-full gap-2">
            <button onClick={handleClose} className="flex flex-row justify-center items-center p-0 gap-[10px] w-[120px] h-[56px] text-black border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]">Cancel</button>
            <button onClick={() => {try {
                    handleCloseModal(totalusers);
                    fetchData();
                    handleClose();
                    toast.success("Reservation deleted");
                  } catch (error) {
                    toast.error("error occured check consol");
                  } }} className="flex flex-row justify-center items-center p-0 gap-[10px] w-[120px] h-[56px] bg-[#DE1C1C] rounded-[16px]">
              Confirm
            </button>
          </div>
        </div>
        <ToastContainer />
      </Modal>
    </div>
  );
}

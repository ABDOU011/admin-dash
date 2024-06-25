"use client";

import React,{ useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteCity, fetch } from "@/app/protected/cities/actions";
import Modal from "react-modal";
import {
  monthchart,
  newUsers,
  usersCount,
  history,
  signout,
} from "@/app/protected/users/actions/actions";
import { BarChart } from "@mui/x-charts";
import NewCity from "../../../../components/NewCity";
import { useSearchParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function City(): JSX.Element {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const data = [14, 25, 33, 19, 15, 27, 24, 35, 31, 36, 38, 44];
  const [newusers, setNewUsers] = useState<number>(0);
  const [totalusers, setTotalUsers] = useState<number>(0);
  const [linedata, setLineData] = useState<number[] | undefined>(undefined);
  const [histo, setHistory] = useState<any>();
  const maxCount = Math.max(...(linedata ? linedata : []));
  const router = useRouter();
  const searchParams = useSearchParams();
  const i = searchParams?.get("id");

  const fetchData = async () => {
    const data = await fetch(i);
    setHistory(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const xLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    fetchData();
  };

  return (
    <div className="bg-[#F4F7FE] w-full flex flex-col items-start pt-12 min-h-screen">
      <button className="ml-5 mb-5" onClick={() => router.back()}>
        <ArrowBackIcon className="text-black" />
      </button>
      <div className="flex flex-col items-center pt-0 px-[24px] pb-[80px] gap-[24px] w-full">
        <div className="flex flex-row  justify-between items-center px-[36px] py-[20px] gap-[36px] w-full bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]">
          <div className="flex flex-col justify-center items-center p-0 gap-[8px]">
            <p className=" font-medium text-[16px] text-[#1B1E28] opacity-[0.56]">
              City Name
            </p>
            <p className=" font-semibold text-[20px] text-[#1B1E28]">{histo?.name}</p>
          </div>
          <div className="flex flex-col justify-center items-center p-0 gap-[8px]">
            <p className=" font-medium text-[16px] text-[#1B1E28] opacity-[0.56]">
              Hotspots
            </p>
            <p className=" font-semibold text-[20px] text-[#1B1E28]">{histo?.count}</p>
          </div>
          <div className="flex flex-col justify-center items-center p-0 gap-[8px]">
            <p className=" font-medium text-[16px] text-[#1B1E28] opacity-[0.56]">
              Avg Reservation per Day
            </p>
            <p className=" font-semibold text-[20px] text-[#1B1E28]">1</p>
          </div>
          <div className="flex flex-col justify-center items-center p-0 gap-[8px]">
            <p className=" font-medium text-[16px] text-[#1B1E28] opacity-[0.56]">
              trasportation Health
            </p>
            <p className=" font-semibold text-[20px] text-[#1B1E28]">Healthy</p>
          </div>
        </div>
        
        <div className="flex flex-row justify-end items-center px-[24px] py-0 gap-[16px] w-full">
          
          <button
            className="w-[240px] h-[56px] bg-[#24BAEC] rounded-[16px]"
            onClick={() => handleOpenModal()}
          >
            Edit City
          </button>
          <button
            onClick={() => {
              try {
                deleteCity((i!));
                fetchData();
                toast.error("city deleted");
              } catch (error) {
                toast.error("error occured check console");
              }
            }}
            className="w-[240px] h-[56px] bg-[#BB0000] rounded-[16px]"
          >
            Remove City
          </button>
        </div>
        <ToastContainer />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Edit User Modal"
        >
          <h1 className="font-medium text-[20px] text-[#1B1E28]">Edit city</h1>
          <NewCity cityId={i!}></NewCity>
          <div className="flex flex-row justify-between w-full">
            <button
              onClick={handleCloseModal}
              className="flex flex-row justify-center items-center p-0 gap-[10px] w-[240px] h-[56px] bg-[#24BAEC] rounded-[16px]"
            >
              Cancel
            </button>
          </div>

          <ToastContainer />
        </Modal>
      </div>
    </div>
  );
}


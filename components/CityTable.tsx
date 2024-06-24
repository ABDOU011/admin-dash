"use client";
import React, { useEffect, useRef, useState } from "react";
import { getUser, updateUser } from "@/app/protected/users/actions/actions";
import MUIDataTable from "mui-datatables";
import Modal from "react-modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { deleteCity, getCities } from "@/app/protected/cities/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewCity from "./NewCity";
import {  useRouter } from "next/navigation";
import { Bars } from "react-loader-spinner";

type CityInfo = {
  number: string;
  name: string;
};



type FlattenedDataRow = {
  cityInfo: string;
  provs: string;
  streets: string;
  stops: string;
  hotspots: string;
  id: string;
};

export default function CityTable({}: {}) {
  const [daat, setData] = useState<(object | string[] | number[])[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const [SelectedCity, setSelectedCity] = useState<any>(null);
  const [open, setOpen] = React.useState(false);
  const [UserId, setUserId] = React.useState('');
  const [loading, setLoading] = useState(false);
  const handleClickOpen = (userId:string) => {
    setUserId(userId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal = async (userId: string) => {
    setSelectedCity(userId);

    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    const fetchedData = await getCities();
    const formattedData: FlattenedDataRow[] = fetchedData.map((row: any) => {
      const [city, provs, streets,stops, hotspots, id] = row;
      return {
        cityInfo: `${city.number} - ${city.name}`,
        provs,
        streets,
        stops,
        hotspots,
        id,
      };
    });
    setData(formattedData);

    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter()

  const columns = [
    {
      name: "cityInfo",
      label:"City",
      options: {
        searchable:true,
        sortCompare: (order: string) => {
          return (obj1: { data: string; }, obj2: { data: string; }) => {
            console.log(order); 
            let val1 = parseInt(obj1.data, 10);
            let val2 = parseInt(obj2.data, 10);
            return (val1 - val2) * (order === 'asc' ? 1 : -1);
          };
        },
        filter:false,
        customBodyRender: (value: any) => {
          const [number, name] = value.split(' - ');
          return (
            <div className="flex flex-row items-center p-0 gap-[16px]">
              <div className="text-[#24BAEC] h-7 border-solid border-[#24BAEC] border-t-[2px] border-b-[2px]">
                {number}
              </div>
              {name}
            </div>
          );
        },
      },
    },
    {name:"provs",label:'Provs Count',options:{filter:false,sortCompare: (order: string) => {
      return (obj1: { data: string; }, obj2: { data: string; }) => {
        console.log(order); 
        let val1 = parseInt(obj1.data, 10);
        let val2 = parseInt(obj2.data, 10);
        return (val1 - val2) * (order === 'asc' ? 1 : -1);
      };
    },}},
    {name:"streets",label:'Streets Count',options:{filter:false,sortCompare: (order: string) => {
      return (obj1: { data: string; }, obj2: { data: string; }) => {
        console.log(order); 
        let val1 = parseInt(obj1.data, 10);
        let val2 = parseInt(obj2.data, 10);
        return (val1 - val2) * (order === 'asc' ? 1 : -1);
      };
    },}},
    {name:"stops",label:'Stops Count', options:{filter:false,sortCompare: (order: string) => {
      return (obj1: { data: string; }, obj2: { data: string; }) => {
        console.log(order); 
        let val1 = parseInt(obj1.data, 10);
        let val2 = parseInt(obj2.data, 10);
        return (val1 - val2) * (order === 'asc' ? 1 : -1);
      };
    },}},
    {name:"hotspots",label:'HotSpots Count',options:{filter:false,sortCompare: (order: string) => {
      return (obj1: { data: string; }, obj2: { data: string; }) => {
        console.log(order); 
        let val1 = parseInt(obj1.data, 10);
        let val2 = parseInt(obj2.data, 10);
        return (val1 - val2) * (order === 'asc' ? 1 : -1);
      };
    },}},
    
    {
      name: "id",
      label: "Actions",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value: any) => {
          return (
            <div className="flex flex-row">
              <button
                onClick={() => {
                  handleClickOpen(value)
                }}
              >
                <DeleteIcon style={{ height: 24, width: 24 }}></DeleteIcon>
              </button>
              <button onClick={() => handleOpenModal(value)}>
                <EditIcon style={{ height: 24, width: 24 }}></EditIcon>
              </button>
              <button onClick={() => router.push(`/protected/cities/city?id=${value}`)}>
                <VisibilityIcon style={{ height: 24, width: 24 }}></VisibilityIcon>
              </button>
            </div>
          );
        },
      },
    },
  ];

  
  const options = {
    search: true,
    filter: true,
    download: false,
    print: false,
    viewColumns: false,

    searchAlwaysOpen: true,
    Selection: false,
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTable: {
          styleOverrides: {
            root: {
              width: "100%",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
            },
          },
        },
      },
    });

  return (
    <div className="flex pt-0 px-[24px] pb-[80px] w-full h-full">
      {loading ? (
        <div className="ml-[500px] text-black text-[18px]">Loading <Bars
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        /></div>
      )
    :(
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={""}
          data={daat}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    )}
      

      <ToastContainer />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Edit User Modal"
      >
          <h1 className="font-medium text-[20px] text-[#1B1E28]">Edit city</h1>
          <NewCity cityId={SelectedCity}></NewCity>
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
            <button onClick={() => {
                  try {
                    deleteCity(UserId);
                    fetchData();
                    handleClose();
                    toast.success("city deleted");
                  } catch (error) {
                    toast.error("error occured check consol");
                  }
                }} className="flex flex-row justify-center items-center p-0 gap-[10px] w-[120px] h-[56px] bg-[#DE1C1C] rounded-[16px]">
              Confirm
            </button>
          </div>
        </div>
        <ToastContainer />
      </Modal>
    </div>
  );
}

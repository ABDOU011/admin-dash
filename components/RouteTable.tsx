"use client";
import React, { useEffect, useRef, useState, } from "react";
import {
  getUsers,
  deleteUser,
  getUser,
  updateUser,
  userLogs,
} from "@/app/protected/users/actions/actions";
import MUIDataTable, { SelectableRows } from "mui-datatables";
import Modal from "react-modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { deleteRoute, getRoutes } from "@/app/protected/routes/actions";
import NewRoute from "./NewRoute";
import { Bars } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
type RouteInfo = {
  acr: string;
  name: string;
};



type FlattenedDataRow = {
  routeInfo: string;
  stops: string;
  cost: string;
  count: number;
  id: string;
};

export default function RouteTable({}: {}) {
  const [daat, setData] = useState<FlattenedDataRow []>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [loading, setLoading] = useState(false);

   

  const handleOpenModal = async (Id: string) => {
    
    
    setSelectedRoute(Id)
    
    setModalIsOpen(true);
    
  };
  
  const handleCloseModal = () => {
    setModalIsOpen(false);
    fetchData();
  };
  
  const fetchData = async () => {
    setLoading(true);
    const fetchedData = await getRoutes();
    const formattedData: FlattenedDataRow[] = fetchedData.map((row: any) => {
      const [route, stops, cost, count, id] = row;
      return {
        routeInfo: `${route.acr.split(" | ")[0]} / ${route.name.split(" | ")[0]}`,
        stops,
        cost,
        count,
        id,
      };
    });
   
    
    setData(formattedData);

    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "routeInfo",
      label:"Name",
      options: {
        searchable:true,
        sort:true,
        filter:false,
        
        customBodyRender: (value: any) => {
          const [acr, name] = value.split(' / ');
          
          return (
            <div className="flex flex-row items-center p-0 gap-[16px]">
              <div className="text-[#24BAEC] h-7 border-solid border-[#24BAEC] border-t-[2px] border-b-[2px]">
                {acr}
              </div>
              {name}
            </div>
          );
        },
      },
    },
    {name:"stops",label:'Stops Count'},
    {name:"cost",label:'Cost'},
    {name:"count",label:'Trips Count'},   
  //   {
  //     name:"status",
  //     label:"Status",
  //     options:{
  //       sort:true,
  //       filter:true,
  //       searchable:true,
  //       customBodyRender:(value:any)=>{
  //         return (
  //           <div>
  //             {
  //               value ==="overwelming"? (
  //                 <div className="flex flex-row items-center px-[8px]  gap-[5px] w-fit h-[25px] bg-[rgba(255,0,0,0.2)] border-[1px]  border-[#FF0000] rounded-[4px]">
  //             <div className="w-[3px] h-[3px] rounded-full bg-[#FF0000]"></div>
  //             <span className="text-[12px] text-[#FF0000]">{value}</span>
  //           </div>
  //               )
  //               : value==="very crowded"?(
  //                 <div className="flex flex-row items-center px-[8px]  gap-[5px] w-fit h-[25px] bg-[rgba(193,61,5,0.2)] border-[1px]  border-[#cc9036] rounded-[4px]">
  //             <div className="w-[3px] h-[3px] rounded-full bg-[#cc9036]"></div>
  //             <span className="text-[12px] text-[#cc9036]">{value}</span>
  //           </div>
  //               ): value==="normal"?(
  //                 <div className="flex flex-row items-center px-[8px]  gap-[5px] w-fit h-[25px] bg-[rgba(80,97,194,0.2)] border-[1px]  border-[#3f59ec] rounded-[4px]">
  //             <div className="w-[3px] h-[3px] rounded-full bg-[#3f59ec]"></div>
  //             <span className="text-[12px] text-[#3f59ec]">{value}</span>
  //           </div>
  //               ):
  //               (
  //                 <div className="flex flex-row items-center px-[8px]  gap-[5px] w-fit h-[25px] bg-[rgba(83,170,72,0.2)] border-[1px]  border-[#37c767] rounded-[4px]">
  //             <div className="w-[3px] h-[3px] rounded-full bg-[#37c767]"></div>
  //             <span className="text-[12px] text-[#37c767]">{value}</span>
  //           </div>
  //               )
  //             }
  //           </div>
  //         );
  //     },
  //   },
  // },
    {
      name: "id",
      label: "Actions",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value: any) => {
          return (
            <div className="flex flex-row">
              <button onClick={() => handleOpenModal(value)}>
                <EditIcon style={{ height: 24, width: 24 }}></EditIcon>
              </button>
              <button
                onClick={() => {
                  try {
                    deleteRoute(value);
                    fetchData();
                    toast.success("Route deleted");
                  } catch (error) {
                    toast.error("error occured check console");
                  }
                }}
              >
                <DeleteIcon style={{ height: 24, width: 24 }}></DeleteIcon>
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
    enableNestedDataAccess: ".",
    searchAlwaysOpen: true,
    
    selectableRows:"none" as SelectableRows
    
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
    <div className="flex pt-0 px-[24px] pb-[80px]  w-full">
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
      ):(<ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={""}
        data={daat}
        columns={columns}
        options={options}
      />
    </ThemeProvider>)}
      

      <ToastContainer />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Edit User Modal"
      
      >
       
       <h1 className="font-medium text-[20px] text-[#1B1E28]">Edit city</h1>
          <NewRoute routeId={selectedRoute}></NewRoute>
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
  );
}

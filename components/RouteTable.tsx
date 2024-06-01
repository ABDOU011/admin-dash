"use client";
import React, { useEffect, useRef, useState, } from "react";
import {
  getUsers,
  deleteUser,
  getUser,
  updateUser,
  userLogs,
} from "@/app/protected/users/actions/actions";
import MUIDataTable from "mui-datatables";
import Modal from "react-modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";


export default function RouteTable({}: {}) {
  const [daat, setData] = useState<(object | string[] | number[])[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
   

  const handleOpenModal = async (userId: string) => {
    const edituser = await getUser(userId);
    
    setSelectedUser(edituser)
    
    setModalIsOpen(true);
    
  };
  
  const handleCloseModal = () => {
    setModalIsOpen(false);
    fetchData();
  };
  
  const fetchData = async () => {
    const fetchedData = await getUsers();
    
    setData(fetchedData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "Name",
      options: {
        customBodyRender: (value: any) => {
          return (
            <div className="flex flex-row items-center p-0 gap-[16px]">
              <div className="text-[#24BAEC] h-7 border-solid border-[#24BAEC] border-t-[2px] border-b-[2px]">
                {value.acr}
              </div>
              {value.name}
            </div>
          );
        },
      },
    },
    "Stops Count",
    "Buses Count",

    {
      name:"State",
      options:{
        customBodyRender:(value:any)=>{
          return (
            <div className="flex flex-row items-center px-[8px]  gap-[5px] w-fit h-[25px] bg-[rgba(193,_61,_5,_0.2)] border-[1px]  border-[rgba(255,0,0,0.5)] rounded-[4px]">
              <div className="w-[3px] h-[3px] rounded-full bg-[#FF0000]"></div>
              <span className="text-[12px] text-[#FF0000]">overwelming</span>
            </div>
          );
      },
    },
  },
    {
      name: "delete",
      label: "Actions",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value: any) => {
          return (
            <div className="flex flex-row">
              <button
                onClick={() => {
                  try {
                    deleteUser(value);
                    fetchData();
                    toast.success("user deleted");
                  } catch (error) {
                    toast.error("error occured check consol");
                  }
                }}
              >
                <DeleteIcon style={{ height: 24, width: 24 }}></DeleteIcon>
              </button>
              <button onClick={() => handleOpenModal(value)}>
                <EditIcon style={{ height: 24, width: 24 }}></EditIcon>
              </button>
            </div>
          );
        },
      },
    },
  ];
  
  const data = [
    [{acr:"A14" ,name:"A14 Line"}, "14 Stops", "16 Buses Active", "Overwelming","65465484561465"],
    [{acr:"A14" ,name:"A14 Line"}, "14 Stops", "16 Buses Active", "Overwelming","65465484561465"],
    [{acr:"A14" ,name:"A14 Line"}, "14 Stops", "16 Buses Active", "Overwelming","65465484561465"],
    [{acr:"A14" ,name:"A14 Line"}, "14 Stops", "16 Buses Active", "Overwelming","65465484561465"],
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
    <div className="flex pt-0 px-[24px] pb-[80px]  w-full">
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={""}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>

      <ToastContainer />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Edit User Modal"
      
      >
        <form ref={ref} action={async (formData) => {
        try {
        await updateUser(formData);
        toast.success('User updated');
        handleCloseModal();
        } catch (error) {
          toast.error("error occured check consol");
          handleCloseModal()
        }
        
      }} className="flex flex-col items-start p-[24px] gap-[48px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px] w-full">
        <h1 className="font-medium text-[20px] text-[#1B1E28]">
          Edit User
        </h1>
        <div className="flex flex-col items-start gap-[24px] w-full">
          <div className="flex flex-row items-start gap-[24px] ">
            <div className=" flex flex-col justify-center items-start gap-[12px] w-[440px] ">
            <label htmlFor="name" className="text-black"> Name</label>
              <input required maxLength={32} minLength={6} name="name" defaultValue={selectedUser?.name}  className="text-black pl-4 w-[440px] h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"/>
            </div>
            <div className=" flex flex-col justify-center items-start gap-[12px] w-[440px] ">
              <input type="hidden" name="id" defaultValue={selectedUser?.id}></input>
            </div>
          </div>
          <div className="flex flex-row items-start gap-[24px] ">
            <div className=" flex flex-col justify-center items-start gap-[12px] w-[440px] ">
              <label htmlFor="phone" className="text-black"> Phone (optional)</label>
              <input maxLength={10} minLength={10} type="number" name="phone" defaultValue={selectedUser?.phone}  className="text-black pl-4 w-[440px] h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"/>
            </div>
            <div className=" flex flex-col justify-center items-start gap-[12px] w-[440px] ">
              <label htmlFor="Address" className="text-black"> Address (optional)</label>
              <input name="Address" defaultValue={selectedUser?.address} className="text-black pl-4 w-[440px] h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"/>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full">
        <button type="submit"   className="flex flex-row justify-center items-center p-0 gap-[10px] w-[240px] h-[56px] bg-[#24BAEC] rounded-[16px]">
        Save
      </button>
      <button onClick={handleCloseModal} className="flex flex-row justify-center items-center p-0 gap-[10px] w-[240px] h-[56px] bg-[#24BAEC] rounded-[16px]">Cancel</button>
      </div>
      </form>
      <ToastContainer />
      
      </Modal>
    </div>
  );
}

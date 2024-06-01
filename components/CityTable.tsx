"use client";
import React, { useEffect, useRef, useState } from "react";
import { getUser, updateUser } from "@/app/protected/users/actions/actions";
import MUIDataTable from "mui-datatables";
import Modal from "react-modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { deleteCity, getCities } from "@/app/protected/cities/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewCity from "./NewCity";

export default function CityTable({}: {}) {
  const [daat, setData] = useState<(object | string[] | number[])[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const [SelectedCity, setSelectedCity] = useState<any>(null);

  const handleOpenModal = async (userId: string) => {
    setSelectedCity(userId);

    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    fetchData();
  };

  const fetchData = async () => {
    const fetchedData = await getCities();

    setData(fetchedData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "City name",
      options: {
        customBodyRender: (value: any) => {
          return (
            <div className="flex flex-row items-center p-0 gap-[16px]">
              <div className="text-[#24BAEC] h-7 border-solid border-[#24BAEC] border-t-[2px] border-b-[2px]">
                {value.number}
              </div>
              {value.name}
            </div>
          );
        },
      },
    },
    "Provs Count",
    "Streets Count",
    "Stops Count",
    "HotSpots Count",
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
                    deleteCity(value);
                    fetchData();
                    toast.success("city deleted");
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
          data={daat}
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
    </div>
  );
}

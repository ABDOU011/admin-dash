import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useRef } from "react";
import Icon from "./icons/Icon";
import Select from "react-select";
import { deleteHotspot, fetchStops } from "@/app/protected/cities/actions";

interface HotspotFormProps {
  setHotspot: React.Dispatch<
    React.SetStateAction<
      {
        id?: number;
        name: string;
        namear: string;
        image: string | null;
        place: number | string;
      }[]
    >
  >;
  hotspot: {
    id?: number;
    name: string;
    namear: string;
    image: string | null;
    place: number | string;
  }[];
  streets: {
    [key: number]: { id?: number; name: string;namear: string; numberOfStops: number }[];
  };
  cityID?: number;
  provenances: { id?: number; name: string;namear: string; numstreet: number }[];
}

const HotspotForm: React.FC<HotspotFormProps> = ({
  setHotspot,
  hotspot,
  streets,
  cityID,
  provenances,
}) => {
  const [showImage, setShowImage] = useState("");
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [searchResults, setSearchResults] = useState<
    { id?: number; label: string }[]
  >([]);
  const [base64, setBase64] = useState<string | null>(null);
  const handleChange = (index: number, name: string, value: any) => {
    const updatedProvenances = [...hotspot];
    updatedProvenances[index] = { ...updatedProvenances[index], [name]: value };

    setHotspot(updatedProvenances);
  };
  const handleContainerClick = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  const handleSearch = async () => {
    const data = await fetchStops(cityID);
    setSearchResults(data);
  };
  useEffect(() => {
    if (cityID) {
      handleSearch();
    } else {
      const result: any = [];
      provenances.map((provenance, provIndex) =>
        streets[provIndex]?.map((street, streetIndex) =>
          result.push({
            label: street.name+" | "+street.namear,
          })
        )
      );
      setSearchResults(result);
    }
  }, [hotspot, streets]);
  
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const updatedHotspots = [...hotspot];
          updatedHotspots[index] = {
            ...updatedHotspots[index],
            image: base64String,
          };
          setHotspot(updatedHotspots);
        };
        reader.readAsDataURL(file);
      } catch (error) {}
    }
  };
  const handleAddProvenance = () => {
    setHotspot([...hotspot, { place: 0, image: null, name: "" ,namear:""}]);
  };
  const handleRemoveProvenance = (index: number, id?: any) => {
    if (id) {
      deleteHotspot(id);
    }
    const updatedHotspots = [...hotspot];
    updatedHotspots.splice(index, 1);
    setHotspot(updatedHotspots);
  };

  const [value, setValue] = useState<boolean[]>([...hotspot].map(() => false));

  
  return (
    <div className="w-full">
      {hotspot.map((hot, index) => (
        <div className="">
          {(hot.id || value[index]) && value[index] ? (
            <div className="flex flex-col mb-4 justify-center items-center p-[8px] gap-[10px]  rounded-[16px] w-full">
              <div className="flex flex-row items-start p-0 gap-[8px] h-[64px] w-full">
                <img
                  src={hot.image!}
                  className="w-[180px] h-[64px] rounded-[8px]"
                />
                <div className="flex flex-row items-center p-0 gap-[10px] w-[378px]">
                  <div className="flex flex-col justify-center items-start px-[8px] py-0 gap-[8px] w-[302px]">
                    <p className="font-medium text-[16px] text-[#1B1E28]">
                      {hot.name}
                    </p>
                    <p className="font-medium text-[14px] text-[#1B1E28] opacity-50">
                      {hot?.place?.toString()}
                    </p>
                  </div>
                  <div className="flex flex-row items-center px-[20px] py-0 gap-[12px] mx-[auto] my-[0] w-[76px] h-[12px] opacity-50">
                    <button
                      onClick={() =>
                        setValue((prevValue) => {
                          const newValue = [...prevValue];
                          newValue[index] = false;
                          return newValue;
                        })
                      }
                    >
                      <EditIcon style={{ height: 24, width: 24 }}></EditIcon>
                    </button>
                    <button
                      onClick={() => {
                        handleRemoveProvenance(index, hot.id!);
                      }}
                    >
                      <DeleteIcon
                        style={{ height: 24, width: 24 }}
                      ></DeleteIcon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !value[index] ? (
            <div className="flex flex-col mb-4 justify-center items-center p-[8px] gap-[10px] bg-[#E4E4E4] rounded-[16px] w-full">
              <div className=" flex flex-col gap-[12px] w-full text-black">
                <div className="flex flex-row gap-1">
                  <div className="flex flex-col justify-center items-start gap-[4px] w-full">
                    <label className="text-black">Hotspot Name</label>
                    <input
                      value={hot?.name}
                      onChange={(e) =>
                        handleChange(index, e.target.name, e.target.value)
                      }
                      type="text"
                      required
                      name="name"
                      placeholder="Name"
                      className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-[4px] w-full">
                    <label className="text-black">Hotspot Arabic Name</label>
                    <input
                      value={hot?.namear}
                      onChange={(e) =>
                        handleChange(index, e.target.name, e.target.value)
                      }
                      type="text"
                      required
                      name="namear"
                      placeholder="Arab Name"
                      className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
                    />
                  </div>
                </div>
                <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
                  <Select
                    className="text-black w-full"
                    required
                    placeholder={hot?.place?.toString()}
                    options={searchResults}
                    onChange={(newValue) => {
                      handleChange(index, "place", newValue?.label);
                    }}
                  />
                </div>
              </div>

              <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
                {hot.image ? (
                  <div
                    className="w-full max-w-[600px] h-[220px] p-5 border-[2px] border-[solid] border-[#ccc] rounded-[10px] text-center flex flex-col justify-center items-center cursor-pointer"
                    onClick={() => handleContainerClick(index)}
                  >
                    <img
                      src={hot.image!}
                      alt="image"
                      className="max-w-[600px] h-[220px] rounded-[10px]"
                    />
                    <input
                      type="file"
                      required
                      accept="image/png"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      onChange={(e) => handleImageChange(e, index)}
                      style={{ display: "none" }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-full max-w-[600px] h-[220px] p-5 border-[2px] border-[solid] border-[#ccc] rounded-[10px] text-center flex flex-col justify-center items-center cursor-pointer"
                    onClick={() => handleContainerClick(index)}
                  >
                    <Icon color={"#76787E"}></Icon>
                    <p className="text-black opacity-50">
                      Drop Picture to Upload
                    </p>
                    <input
                      type="file"
                      required
                      accept="image/png"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      onChange={(e) => handleImageChange(e, index)}
                      style={{ display: "none" }}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-row items-end justify-end gap-2 w-full">
                {hot.id ? (
                  <button
                    className="flex flex-row justify-center items-center p-0 w-[160px] gap-[10px]  my-[0] h-[56px] bg-[#F4F7FE] text-black border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
                    onClick={() =>
                      setValue((prevValue) => {
                        const newValue = [...prevValue];
                        newValue[index] = true;
                        return newValue;
                      })
                    }
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    className="flex flex-row justify-center items-center p-0 w-[160px] gap-[10px]  my-[0] h-[56px] bg-[#F4F7FE] text-black border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
                    onClick={() => handleRemoveProvenance(index)}
                  >
                    Remove
                  </button>
                )}
                <button
                  className="flex flex-row justify-center items-center p-0 w-[160px] gap-[10px]  my-[0] h-[56px] bg-[#24BAEC] rounded-[16px]"
                  onClick={() =>
                    setValue((prevValue) => {
                      const newValue = [...prevValue];
                      newValue[index] = true;
                      return newValue;
                    })
                  }
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
      <button
        onClick={handleAddProvenance}
        className="flex flex-row justify-center items-center gap-[10px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px] w-[566px] h-[56px] text-[#24BAEC]"
      >
        Add Another Hotspot
      </button>
    </div>
  );
};

export default HotspotForm;

import { useEffect, useState } from "react";

import React, { useRef } from "react";
import Icon from "./icons/Icon";
import Select from "react-select";
import { fetchStops } from "@/app/protected/cities/actions";

interface HotspotFormProps {
  setHotspot: React.Dispatch<
    React.SetStateAction<
      { id?: number; name: string; image: string | null; place: number }[]
    >
  >;
  hotspot: { id?: number; name: string; image: string | null; place: number }[];
  streets: {
    [key: number]: { id?: number; name: string; numberOfStops: number }[];
  };
  cityID?: number;
  provenances: { id?: number; name: string; numstreet: number }[];
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
            label: street.name,
          })
        )
      );
      setSearchResults(result);
    }
  }, [hotspot, streets]);
  console.log(hotspot);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>,index: number ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const updatedHotspots = [...hotspot];
          updatedHotspots[index] = { ...updatedHotspots[index], image: base64String };
          setHotspot(updatedHotspots);
        };
        reader.readAsDataURL(file);
      } catch (error) {}
    }
  };
  const handleAddProvenance = () => {
    setHotspot([...hotspot, { place: 0, image: null, name: "" }]);
  };
  const  handleRemoveProvenance =  (index: number,id?:any) => {
    
    const updatedHotspots = [...hotspot];
    updatedHotspots.splice(index, 1);
    setHotspot(updatedHotspots);

  };

  const [value, setValue] = useState<string | null>();

  return (
    <div className="w-full">
      {hotspot.map((hot, index) => (
        <div className="flex flex-col mb-4 justify-center items-center p-[8px] gap-[10px] bg-[#E4E4E4] rounded-[16px] w-full">
          <div className=" flex flex-row gap-[12px] w-full text-black">
            <input
              value={hot?.name}
              onChange={(e) =>
                handleChange(index, e.target.name, e.target.value)
              }
              type="text"
              name="name"
              placeholder="Name"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
            <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
              <Select
                className="text-black w-full"
                options={searchResults}
                onChange={(newValue) => {
                  handleChange(index, "place", newValue?.label);
                  setValue(newValue?.id?.toString());
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
                  accept="image/*"
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
                <p className="text-black opacity-50">Drop Picture to Upload</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  onChange={(e) => handleImageChange(e, index)}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
          <div className="flex flex-row items-end justify-end gap-2 w-full">
            <button
              className="flex flex-row justify-center items-center p-0 w-[160px] gap-[10px]  my-[0] h-[56px] bg-[#F4F7FE] text-black border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
              onClick={()=>{handleRemoveProvenance(index,hot?.id)}}
            >
              Cancel
            </button>
            <button
              className="flex flex-row justify-center items-center p-0 w-[160px] gap-[10px]  my-[0] h-[56px] bg-[#24BAEC] rounded-[16px]"
              onClick={() => {
                handleAddProvenance();
              }}
            >
              Save
            </button>
          </div>
        </div>
      ))}
      <button onClick={handleAddProvenance} className="text-black">
        Add Another Stop
      </button>
    </div>
  );
};

export default HotspotForm;

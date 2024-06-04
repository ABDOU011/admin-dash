"use client";
import { useEffect, useRef, useState } from "react";

import Street from "../../../../components/icons/Street";

import Hotspot from "../../../../components/icons/Hotspot";

import {
  
  fetchCityData,
  save,
  update,
} from "@/app/protected/cities/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HotSpots from "@/components/Hotspots";
import HotspotStreets from "@/components/HotspotStreets";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createClient } from "@/utils/supabase/client";

export default function NewHotspot() {
  const [currentSegment, setCurrentSegment] = useState<string>("Hotspot");
  const [city, setCity] = useState<{ name: string; image: File } | null>(null);
  const [provenance, setProvenance] = useState<{ id?: number; name: string }[]>(
    [{ name: "" }]
  );
  const searchParams = useSearchParams();
  const cityId = searchParams?.get("id");

  const handleNextSegment = () => {
    if (currentSegment === "Hotspot") setCurrentSegment("HStreets");
  };

  const handlePreviousSegment = () => {
    if (currentSegment === "HStreets") setCurrentSegment("Hotspot");
  };

  const renderSegment = () => {
    switch (currentSegment) {
      
      case "HStreets":
        return !city ? (
          <HotspotStreets
            provenances={provenance}
            setProvenance={setProvenance}
            cityId={cityId!}
          />
        ) : (
          <p className="text-black">Fill Previous Form</p>
        );

      default:
        return 
    }
  };

  const handleSubmit = async () => {
    const supabase = createClient();

   
      const { data: hotspotdata, error: stopsError } = await supabase
        .from("hotspots")
        .insert({ name: city?.name, city: cityId })
        .select("id");

      const hId = hotspotdata?.[0].id;
      if (stopsError) {
        console.log(stopsError.message);
      } else {
        for (const stop of provenance) {
          const { data, error } = await supabase
            .from("places")
            .update({ hotspot: hId })
            .eq("id", stop.id);
          if (error) {
            console.log(error.message);
            return;
          } 
                
        }
        const { data:bucket, error:bucketer } = await supabase.storage
                .from('hotspots')
                .upload(`${city?.name}/cover.png`, city!.image, 
                {
                  
                  contentType:'image/png',
                
                })
              if(bucketer){
                console.log(bucketer?.message)
              }
            }
        
      

      
    
    toast.success("hotspot added");
    window.location.reload();
  };

  const router = useRouter();
 
  return (
    <div className="bg-[#F4F7FE] w-full flex flex-col items-start pt-12">
      <button className="ml-5 mb-5" onClick={() => router.back()}>
        <ArrowBackIcon className="text-black" />
      </button>
      <div className="flex flex-row items-start pt-0 px-[24px] pb-[80px] gap-[40px] w-full">
        <div className="flex flex-col justify-between items-start px-0 py-[24px] w-[306px] h-[534px]">
          <div className="flex flex-col items-start px-[24px] py-0 gap-[8px] mx-[auto] my-[0]">
            <div
              className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${
                currentSegment === "Hotspot" ? "bg-[#24BAEC]" : "bg-[#F4F7FE]"
              }`}
              onClick={() => setCurrentSegment("Hotspot")}
            >
              <Hotspot
                color={currentSegment === "Hotspot" ? "white" : "black"}
              />
              <p
                className={`text-[14px] ${
                  currentSegment === "Hotspot" ? "text-white" : "text-black"
                }`}
              >
                Hotspot Information
              </p>
            </div>
            <div
              className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${
                currentSegment === "HStreets" ? "bg-[#24BAEC]" : "bg-[#F4F7FE]"
              }`}
              onClick={() => setCurrentSegment("HStreets")}
            >
              <Street
                color={currentSegment === "HStreets" ? "white" : "black"}
              />
              <p
                className={`text-[14px] ${
                  currentSegment === "HStreets" ? "text-white" : "text-black"
                }`}
              >
                Streets
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4 w-full">
            <button
              className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#F4F7FE] text-black border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
              onClick={handlePreviousSegment}
            >
              Previous
            </button>
            {currentSegment === "HStreets" ? (
              <button
                className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#24BAEC] rounded-[16px]"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Save
              </button>
            ) : (
              <button
                className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#24BAEC] rounded-[16px]"
                onClick={handleNextSegment}
              >
                Next
              </button>
            )}
          </div>
        </div>

        <div className="w-0 h-[534px] border-[1px] border-[solid] border-[#E4E4E4]" />

        <div className="w-[600px] py-[24px]">{renderSegment()}</div>
        <ToastContainer />
      </div>
    </div>
  );
}

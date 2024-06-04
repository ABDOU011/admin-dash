"use client";
import { useEffect, useRef, useState } from "react";


import City from "./icons/City";
import Provenance from "./icons/Provenance";
import Street from "./icons/Street";
import StopsIcon from "./icons/Stops";
import Hotspot from "./icons/Hotspot";

import CityForm from "./Cities";
import Provenances from './Provenances';
import Streets from "./Streets";
import Stops from "./Stops";
import HotSpots from "./Hotspots";
import { fetchCityData, save, update } from "@/app/protected/cities/actions";
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type NewCityProps = {
  cityId?: string; // cityId will be undefined for new city, defined for updating city
};

export default function NewCity({ cityId }: NewCityProps) {
    const [currentSegment, setCurrentSegment] = useState<string>('City');
    const [city, setCity] = useState<{id?:number,name:string, number:number} | null>(null);
    const [provenance, setProvenance] = useState<{id?:number,name:string, numstreet:number}[]>([{ name: '', numstreet:0 }])
    const [streets, setStreets] = useState<{[key: number]: {id?:number, name: string, numberOfStops: number }[] }>({});
    const [stops, setStops] = useState<{ [key: string]: {id?:number, longitude: number, latitude: number }[] }>({});
    const [hotspot, setHotspot] = useState<{id?:number,name:string, image:string|null,place:number|string}[] >([{ name: '', image: null, place: 0 }]);
    const router = useRouter()
    
    useEffect(() => {
      if (cityId) {
        // Fetch existing city data for update
        fetchData(cityId);
      }
    }, [cityId]);


    const handleNextSegment = () => {
      if (currentSegment === 'City') setCurrentSegment('Provenances');
      if (currentSegment === 'Provenances') setCurrentSegment('Streets');
      if (currentSegment === 'Streets') setCurrentSegment('Stops');
      if (currentSegment === 'Stops') setCurrentSegment('Hotspots');
    };
    
    const handlePreviousSegment = () => {
      if (currentSegment === 'Hotspots') setCurrentSegment('Stops');
      if (currentSegment === 'Stops') setCurrentSegment('Streets');
      if (currentSegment === 'Streets') setCurrentSegment('Provenances');
      if (currentSegment === 'Provenances') setCurrentSegment('City');
    };
    const fetchData = async (cityId: string ) => {
      await fetchCityData(cityId!).then((data) => {
        setCity(data.city);
        setProvenance(data.provenances);
        setStreets(data.streets);
        setStops(data.stops)
        setHotspot(data.hotspots)
      }).catch((error) => {
        console.error("Error fetching city data:", error);
        toast.error("Error fetching city data");
      });
    }

    

    const renderSegment = () => {
      switch (currentSegment) {
        case 'City':
          return <CityForm setCity={setCity} city={city} />;
        case 'Provenances':
          return city ?  <Provenances provenances={provenance} setProvenance={setProvenance} streets={streets}
          setStreets={setStreets}
          stops={stops}
          setStops={setStops}/> : <p className="text-black">Fill Previous Form</p>;
        case 'Streets':
          return provenance !== null &&  <Streets provenances={provenance} streets={streets} setStreets={setStreets} />;
        case 'Stops':
          return <Stops provenances={provenance} streets={streets} stops={stops} setStops={setStops}/>;
        case 'Hotspots':
          return <HotSpots hotspot={hotspot} setHotspot={setHotspot} streets= {streets} provenances={provenance}></HotSpots>
        default:
          return <CityForm setCity={setCity} city={city} />;
      }
    };
    
    const handleSubmit = async () => {
      try {
        if (cityId) {
          
          await update( city, provenance, streets, stops,hotspot);
          toast.success("City updated");
          
        }
        else{ 
        await save(city,provenance,streets,stops,hotspot);
        toast.success("city added");
      } 
        
      } catch (error) {
        console.log(error)
        toast.error("error occured check console");
      }
      
      window.location.reload()
    };
  return (
    <div className="flex flex-row items-start pt-0 px-[24px] pb-[80px] gap-[40px] w-full">
      <div className="flex flex-col justify-between items-start px-0 py-[24px] w-[306px] h-[534px]">
        <div className="flex flex-col items-start px-[24px] py-0 gap-[8px] mx-[auto] my-[0]">
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'City' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('City')}
          >
            <City color={currentSegment === 'City' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'City' ? 'text-white' : 'text-black'}`}>City Information</p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Provenances' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Provenances')}
          >
            <Provenance color={currentSegment === 'Provenances' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Provenances' ? 'text-white' : 'text-black'}`}>Provenances</p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Streets' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Streets')}
          >
            <Street color={currentSegment === 'Streets' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Streets' ? 'text-white' : 'text-black'}`}>Streets</p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Stops' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Stops')}
          >
            <StopsIcon color={currentSegment === 'Stops' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Stops' ? 'text-white' : 'text-black'}`}>Stops</p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Hotspots' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Hotspots')}
          >
            <Hotspot color={currentSegment === 'Hotspots' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Hotspots' ? 'text-white' : 'text-black'}`}>Hotspots</p>
          </div>
          
        </div>
        <div className="flex flex-row gap-4 w-full">
          <button
            className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#F4F7FE] text-black border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            onClick={handlePreviousSegment}
          >
            Previous
          </button>
          {currentSegment==="Hotspots"
            ? (
              <button
            className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#24BAEC] rounded-[16px]"
            onClick={()=>{
              handleSubmit();
            }}
          >
            Save
          </button>
            ):
            (
              <button
            className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#24BAEC] rounded-[16px]"
            onClick={handleNextSegment}
          >
            Next
          </button>
            )
          }
          
        </div>
      </div>

      <div className="w-0 h-[534px] border-[1px] border-[solid] border-[#E4E4E4]" />

      <div className="w-[600px] text-black">{renderSegment()}</div>
      <ToastContainer  />
    </div>
  );
}

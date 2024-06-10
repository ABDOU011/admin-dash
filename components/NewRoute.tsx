"use client";
import { useEffect, useRef, useState } from "react";


import City from "./icons/City";
import Pencil from "./icons/Pencil";
import CCIcon from "./icons/CCIcon";
import StopsIcon from "./icons/Stops";
import TimeIcon from "./icons/TimeIcon";

import CityForm from "./Cities";
import Provenances from './Provenances';
import Streets from "./Streets";
import Stops from "./Stops";
import HotSpots from "./Hotspots";
import { fetchCityData, save, update } from "@/app/protected/cities/actions";
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import RouteForm from "./RouteForm";
import RStops from "./RStops";
import Fares from "./Fares";
import Time from "./Time";
import Schedule from "./Schedule";
import Rotation from "./Rotation";
import Other from "./Other";
import { fetchRouteData, saveRoute, updateRoute } from "@/app/protected/routes/actions";

type NewCityProps = {
  routeId?: string; 
};

export default function NewRoute({ routeId }: NewCityProps) {
    const [currentSegment, setCurrentSegment] = useState<string>('Line');
    const [line, setLine] = useState<{id?:number,name:string,acr:string,city:string, type:string,stype:string} | null>(null);
    
    const [stops, setStops] = useState<{id?:number,value:number, label: string}[] >([]);

    const [fares, setFares] = useState<{id?:number, from: number, to: number , cost:number}[] >([{ from: 0, to: 0, cost: 0 }]);

    const [times, setTimes] = useState<{id?:number,departure:string[], arival:string[]}>({departure: [], arival: []});

    const [schedule, setSchedule] = useState<{id?:number,start_times:number[]}>({start_times: []});

    const [rotation, setRotation] = useState<{id?:number,start_time:number | null,end_time:number | null,interval:number | null}>({
      start_time: null, end_time: null, interval: null})

    const [other, setOther] = useState<{seats:number|null}>({seats: null});

    const router = useRouter()
 
    useEffect(() => {
      if (routeId) {
        // Fetch existing city data for update
        fetchData(routeId);
      }
    }, [routeId]);


    const handleNextSegment = () => {
      if (currentSegment === 'Line') setCurrentSegment('Stops');
      if (currentSegment === 'Stops') setCurrentSegment('Fares');
      if (currentSegment === 'Fares') setCurrentSegment('Time');
      if (currentSegment === 'Time' && line?.stype==="Scheduled") setCurrentSegment('Scheduled');
      else if(currentSegment === 'Time' && line?.stype==="Rotation") setCurrentSegment('Rotation');
      if (currentSegment === 'Rotation' || currentSegment === 'Scheduled') setCurrentSegment('Other');
    };
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const handlePreviousSegment = () => {
      if (currentSegment === 'Other' && line?.stype==="Scheduled") setCurrentSegment('Scheduled');
      else if(currentSegment === 'Other' && line?.stype==="Rotation") setCurrentSegment('Rotation');
      if (currentSegment === 'Rotation' || currentSegment === 'Scheduled') setCurrentSegment('Time');
      if (currentSegment === 'Time') setCurrentSegment('Fares');
      if (currentSegment === 'Fares') setCurrentSegment('Stops');
      if (currentSegment === 'Stops') setCurrentSegment('Line');
      
    };
    const fetchData = async (routeId: string ) => {
      setLoading(true);
      await fetchRouteData(routeId!).then((data) => {
        setLine(data.line);
        setStops(data.finalstops);
        setFares(data.fares!);
        setTimes(data.time!);
        if(data.line?.stype==="Scheduled"){setSchedule(data.s!);}
        if(data.line?.stype==="Rotation"){setRotation(data.r!);}
        setOther(data.other!);
        
      }).catch((error) => {
        console.error("Error fetching city data:", error);
        toast.error("Error fetching city data");
      });
      setLoading(false);
    }

    

    const renderSegment = () => {
      switch (currentSegment) {
        case 'Line':
          return <RouteForm setLine={setLine} line={line} />;
        case 'Stops':
          return <RStops setStops={setStops} stops={stops} cityId={line?.city}/>;
        case 'Fares':
          return <Fares setFares={setFares} fares={fares} stops={stops}/>;
        case 'Time':
          return <Time setTimes={setTimes} times={times} stops={stops}/>;
        case 'Scheduled':
          return <Schedule setSchedule={setSchedule} schedule={schedule} />;
        case 'Rotation':
          return <Rotation setRotation={setRotation} rotation={rotation} />;
        case 'Other':
          return <Other setOther={setOther} other={other} />;
        default:
          return <RouteForm setLine={setLine} line={line} />;
      }
    };
    console.log(schedule)
    const handleSubmit = async () => {
      try {
        setLoading2(true);
        if(routeId){
          await updateRoute(line, stops, fares, times, schedule, rotation, other, routeId);
          toast.success("Route Updated");
        }
        else{
          await saveRoute(line, stops, fares, times, schedule, rotation, other);
          toast.success("Route added");
        }
        setLoading2(false);
      } catch (error) {
        console.log("error")
        toast.error("error occured check console");
      }
      window.location.reload()
      
    };


   


  return (
    <div>
      {
        !loading ? (
          <div className="flex flex-row items-start pt-0 px-[24px] pb-[80px] gap-[40px] w-full">
      
      <div className="flex flex-col justify-between items-start px-0 py-[24px] w-[300px] h-[534px]">
        <div className="flex flex-col items-start px-[24px] py-0 gap-[8px] mx-[auto] my-[0]">
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Line' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Line')}
          >
            <City color={currentSegment === 'Line' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Line' ? 'text-white' : 'text-black'}`}>Line Information</p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Stops' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Stops')}
          >
            <StopsIcon color={currentSegment === 'Stops' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Stops' ? 'text-white' : 'text-black'}`}>Stops</p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Fares' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Fares')}
          >
            <CCIcon color={currentSegment === 'Fares' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Fares' ? 'text-white' : 'text-black'}`}>Fares</p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Time' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Time')}
          >
            <TimeIcon color={currentSegment === 'Time' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Time' ? 'text-white' : 'text-black'}`}>Time</p>
          </div>
          {line?.stype==="Rotation" ? (
            <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Rotation' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Rotation')}
          >
            <TimeIcon color={currentSegment === 'Rotation' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Rotation' ? 'text-white' : 'text-black'}`}>Rotation</p>
          </div>
          ):
          (
            <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Scheduled' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Scheduled')}
          >
            <TimeIcon color={currentSegment === 'Scheduled' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Scheduled' ? 'text-white' : 'text-black'}`}>Scheduled</p>
          </div>
          )}
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${currentSegment === 'Other' ? 'bg-[#24BAEC]' : 'bg-[#F4F7FE]'}`}
            onClick={() => setCurrentSegment('Other')}
          >
            <Pencil color={currentSegment === 'Other' ? 'white' : 'black'} />
            <p className={`text-[14px] ${currentSegment === 'Other' ? 'text-white' : 'text-black'}`}>Other Parameters</p>
          </div>
          
        </div>
        <div className="flex flex-row gap-4 w-full">
          <button
            className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#F4F7FE] text-black border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            onClick={handlePreviousSegment}
          >
            Previous
          </button>
          {currentSegment==="Other"
            ? (
              <button
            className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#24BAEC] rounded-[16px]"
            onClick={()=>{
              handleSubmit();
            }}
          >
            {loading2? <p>Loading...</p>:<p>Save</p>}
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

      <div className="w-[590px] text-black">{renderSegment()}</div>
      <ToastContainer  />
    </div>
        )
        :
        (
          <p className="text-black text-[22px]">Loading....</p>
        )
      }
      <ToastContainer  />
    </div>
    
  );
}

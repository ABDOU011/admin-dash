import { deleteProv, fetchS, fetchStops } from "@/app/protected/cities/actions";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ProvenancesProps {
  schedule: {id?:number,start_times:number[]};
  setSchedule: React.Dispatch<
    React.SetStateAction<{id?:number,start_times:number[]}>
  >;
  
}
const Schedule: React.FC<ProvenancesProps> = ({ schedule, setSchedule }) => {
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedTimes = { ...schedule };
    
      updatedTimes.start_times[index] = Number(value);
     
      setSchedule(updatedTimes);
  };
  const handleAddProvenance = () => {
    const updatedTimes = { ...schedule };
    updatedTimes.start_times.push(0);
    setSchedule(updatedTimes);
  };
  console.log(schedule)

  return (
    <div className="flex flex-col items-start p-0 gap-[16px] w-full">
      {schedule!.start_times!.map((element, index) => (
        
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="">Trip {index + 1} start time</label>
            <input
              value={Number(schedule.start_times[index])}
              onChange={(e) => handleChange(index, e)}
              type="number"
              required
              name="start"
              placeholder="Time input"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
          
          
        
      ))}
        <button onClick={handleAddProvenance} className="flex flex-row justify-center items-center gap-[10px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px] w-[566px] h-[56px] text-[#24BAEC]">
        Add New Trip
      </button>
    </div>
  );
};

export default Schedule;

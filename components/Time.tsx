import { deleteProv, fetchS, fetchStops } from "@/app/protected/cities/actions";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ProvenancesProps {
  times: { id?: number; departure: string[]; arival: string[] };
  setTimes: React.Dispatch<
    React.SetStateAction<{ id?: number; departure: string[]; arival: string[] }>
  >;
  stops: { id?: number; value: number; label: string }[];
}
const Time: React.FC<ProvenancesProps> = ({ times, setTimes, stops }) => {
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedTimes = { ...times };
    if (name === "dep") {
      updatedTimes.departure[index] = value.toString();
    } else if (name === "arr") {
      updatedTimes.arival[index] = value.toString();
    }
    setTimes(updatedTimes);
  };

  console.log(times);

  return (
    <div className="flex flex-col items-start p-0 gap-[16px] w-full">
      {stops.slice(0, -1).map((element, index) => (
        <div className="flex flex-row  gap-[16px] w-full">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="">Departure from stop{index + 1}</label>
            <input
              value={Number(times.departure[index])}
              onChange={(e) => handleChange(index, e)}
              type="number"
              required
              name="dep"
              placeholder="Time in minutes"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="">arrival at stop{index + 2}</label>
            <input
              value={Number(times.arival[index])}
              onChange={(e) => handleChange(index, e)}
              type="number"
              required
              name="arr"
              placeholder="Time in minutes"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Time;

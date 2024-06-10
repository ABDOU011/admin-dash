import { deleteProv, fetchS, fetchStops } from "@/app/protected/cities/actions";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ProvenancesProps {
    other: {seats:number|null};
    setOther: React.Dispatch<
    React.SetStateAction<{seats:number|null}>
  >;
  
}
const Other: React.FC<ProvenancesProps> = ({ other, setOther }) => {
  const handleChange = (
    
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedTimes = { ...other };
    
    setOther({ ...other!, [name]: value  });
  };
  
  console.log(other)

  return (
    <div className="flex flex-col items-start p-0 gap-[8px] w-full">
      
        
          <label htmlFor="seats">Number of Seats per Bus</label>
          <input
              value={other.seats!}
              onChange={(e) => handleChange( e)}
              type="number"
              required
              name="seats"
              placeholder="Seats"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
        
      
        
    </div>
  );
};

export default Other;

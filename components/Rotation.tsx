import { deleteProv, fetchS, fetchStops } from "@/app/protected/cities/actions";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ProvenancesProps {
  rotation: {id?:number,start_time:number| null,end_time:number| null,interval:number| null};
  setRotation: React.Dispatch<
    React.SetStateAction<{id?:number,start_time:number| null,end_time:number| null,interval:number| null}>
  >;
  
}
const Rotation: React.FC<ProvenancesProps> = ({ rotation, setRotation }) => {
  const handleChange = (
    
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedTimes = { ...rotation };
    
    setRotation({ ...rotation!, [name]: value  });
  };
  
  console.log(rotation)

  return (
    <div className="flex flex-col items-start p-0 gap-[16px] w-full">
      
        
          <div className="flex flex-row gap-2 w-full">
            
            <input
              value={rotation.start_time!}
              onChange={(e) => handleChange( e)}
              type="number"
              required
              name="start_time"
              placeholder="Rotation Starting Hour"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
            <input
              value={rotation.end_time!}
              onChange={(e) => handleChange( e)}
              type="number"
              required
              name="end_time"
              placeholder="Rotation Ending Hour"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
          
          <input
              value={rotation.interval!}
              onChange={(e) => handleChange( e)}
              type="number"
              required
              name="interval"
              placeholder="Rotation Interval"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
        
      
        
    </div>
  );
};

export default Rotation;

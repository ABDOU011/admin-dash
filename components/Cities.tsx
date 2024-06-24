import { useState } from "react";

interface City {
  id?: number;
  name: string;
  namear:string
  number: number;
}
interface CityFormProps {
  setCity: React.Dispatch<React.SetStateAction<{name:string, number:number,namear:string} | null>>;
  city: ({name:string, number:number, namear:string} | null)
}

const CityForm: React.FC<CityFormProps> = ({ setCity, city }) => {
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCity({ ...city!, [name]: name === "number" ? Number(value) : value });
  };

  

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-row justify-center items-start gap-[12px] w-full">
        <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
          <label className="text-black">
            {" "}
            City Name
          </label>
          <input
            value={city?.name}
            onChange={handleChange}
            required
            type="text"
            name="name"
            placeholder="City Name"
            className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
          />
        </div>
        <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
          <label  className="text-black">
            {" "}
            City Arabic Name
          </label>
          <input
            value={city?.namear}
            onChange={handleChange}
            required
            type="text"
            name="namear"
            placeholder="City Arabic Name"
            className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
          />
        </div>
        </div>
        
        <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
          <label htmlFor="number" className="text-black">
            {" "}
            City Number
          </label>
          <input
            value={city?.number}
            onChange={handleChange}
            required
            type="number"
            name="number"
            placeholder="Number"
            className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
          />
        </div>
        
        
      </div>
      
    </div>
  );
};

export default CityForm;

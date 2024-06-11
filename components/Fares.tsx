import { deleteProv, fetchS, fetchStops } from "@/app/protected/cities/actions";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ProvenancesProps {
  fares: { id?: number; from: number; to: number; cost: number }[];
  setFares: React.Dispatch<
    React.SetStateAction<
      { id?: number; from: number; to: number; cost: number }[]
    >
  >;
  stops: { id?: number; value: number; label: string }[];
}
const Fares: React.FC<ProvenancesProps> = ({ setFares, fares, stops }) => {
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedProvenances = [...fares];
    updatedProvenances[index] = { ...updatedProvenances[index], [name]: value };
    setFares(updatedProvenances);
  };
  const [searchResults, setSearchResults] = useState<
    { id?: number; value: number; label: string }[]
  >([]);
  const handleSearch = async () => {
    setSearchResults(stops);
  };

  useEffect(() => {
    handleSearch();
  }, []);

 
  
  const handleAddProvenance = () => {
    setFares([...fares, { from: 0, to: 0, cost: 0 }]);
  };
  const handleStopChange = (index: any, e: any, v: any) => {
    const updatedProvenances = [...fares];
    updatedProvenances[index] = { ...updatedProvenances[index], [e]: v };
    setFares(updatedProvenances);
  };
  const [value, setValue] = useState<boolean[]>([...fares].map(() => false));

  return (
    <div className="flex flex-col items-start p-0 gap-[16px] w-full">
      {fares.map((fare, index) => (
        <div className="flex flex-col items-start px-[16px] py-[24px] gap-[16px] w-[566px]  bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]">
          <div className="flex flex-row justify-between items-center p-0 gap-[10px] w-full">
            <h1 className="font-medium text-[20px] text-[#1B1E28]">
              Basic Rule
            </h1>
            {!value[index] ? (
              <button
                onClick={() =>
                  setValue((prevValue) => {
                    const newValue = [...prevValue];
                    newValue[index] = true;
                    return newValue;
                  })
                }
              >
                <ExpandLessIcon />
              </button>
            ) : (
              <button
                onClick={() =>
                  setValue((prevValue) => {
                    const newValue = [...prevValue];
                    newValue[index] = false;
                    return newValue;
                  })
                }
              >
                <ExpandMoreIcon />
              </button>
            )}
          </div>

          {!value[index] ? (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row items-start p-0 gap-[16px]">
                <Select
                  className="text-black w-full"
                  required
                  placeholder={searchResults.find((result) => result.value === Number(fare?.from))?.label}
                  options={searchResults}
                  onChange={(NewValue) =>
                    handleStopChange(index, "from", NewValue?.value)
                  }
                />
                <Select
                  className="text-black w-full"
                  required
                  placeholder={searchResults.find((result) => result.value === Number(fare?.to))?.label}
                  options={searchResults}
                  onChange={(NewValue) =>
                    handleStopChange(index, "to", NewValue?.value)
                  }
                />
              </div>
                  <label>
                    Cost
                  </label>
              <input
                value={fare?.cost}
                onChange={(e) => handleChange(index, e)}
                type="number"
                required
                name="cost"
                placeholder="Cost"
                className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
              />
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
        Add New Rule
      </button>
    </div>
  );
};

export default Fares;

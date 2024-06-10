import { deleteProv, fetchS, fetchStops } from "@/app/protected/cities/actions";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";

interface ProvenancesProps {
  stops: { id?: number,value:number, label: string }[];
  setStops: React.Dispatch<
    React.SetStateAction<{ id?: number,value:number, label: string }[]>
  >;
  cityId?: string;
}
const RStops: React.FC<ProvenancesProps> = ({ setStops, stops, cityId }) => {
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedProvenances = [...stops];
    updatedProvenances[index] = { ...updatedProvenances[index], [name]: value };
    setStops(updatedProvenances);
  };
  const [searchResults, setSearchResults] = useState<
    { value?: number; label: string }[]
  >([]);
  const handleSearch = async () => {
    const data = await fetchS(cityId);

    setSearchResults(data);
  };

  useEffect(() => {
    handleSearch();
  }, [cityId]);
  const [start, setStart] = useState({value:0, label: "" });
  const [finish, setFinish] = useState({value:0, label: "" });

  
  
  

  const addStop = () => {
    if (stops.length < 2) return;

    const newStop = { value:0,label: "" };
    const newStops = [...stops];
    newStops.splice(newStops.length - 1, 0, newStop);
    setStops(newStops);
  };

  const handleSetStart = () => {
    if (!start) return;
    setStops([start, ...stops.slice(1)]);
  };

  // Function to set the finish value
  const handleSetFinish = () => {
    if (!finish) return;
    setStops([...stops.slice(0, stops.length - 1), finish]);
  };
  const updateSearchResults = (selected: any) => {
    
    setSearchResults(prevResults => prevResults.filter(result => result.label !== selected.label));
  };
  console.log(stops)
  const restoreSearchResult = (removed: any) => {
    if (removed.label) {
        setSearchResults(prevResults => [...prevResults, removed].sort((a, b) => a.label.localeCompare(b.label)));
    }
  };
  // Update start value in the array when the input is updated
  const handleStartChange = (e: any) => {
    setStart(e);
    if (stops.length === 0) {
      setStops([e]);
    } else {
      handleSetStart();
    }
    updateSearchResults(e);
  };

  // Update finish value in the array when the input is updated
  const handleFinishChange = (e: any) => {
    setFinish(e);
    if (stops.length < 2) {
      setStops([...(stops[0] ? stops : []), e]);
    } else {
      handleSetFinish();
    }
    updateSearchResults(e);
  };
  const handleStopChange = (index: any, e: any) => {
    const newStops = [...stops];
    newStops[index + 1] = e; // Adjust for the sliced array index
    setStops(newStops);
    updateSearchResults(e);
  };
  const handleRemoveStop = (index: any) => {
    const removedStop = stops[index + 1];
    restoreSearchResult(removedStop);
    const newStops = stops.filter((_, i) => i !== index + 1); // Adjust for the sliced array index
    setStops(newStops);
  };
  
  const renderStops = stops.slice(1, stops.length - 1);
  
  return (
    <div>
      <div className="flex flex-col gap-3 pb-5">
        <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
          <Select
            className="text-black w-full"
            required
            placeholder={stops[0] ? stops[0].label : "Start"}
            options={searchResults}
            onChange={(NewValue) => handleStartChange(NewValue)}
          />
        </div>
        {renderStops.map((stop, index) => (
          <div className=" flex flex-row justify-center items-start gap-[12px] w-full ">
            <Select
            className="text-black w-full"
            required
            placeholder={stop.label}
            options={searchResults}
            onChange={(NewValue) => handleStopChange(index,NewValue)}
          />
            
            <button
              className="text-black"
              onClick={() => handleRemoveStop(index)}
            >
              Remove Stop
            </button>
          </div>
        ))}
        <button
          onClick={addStop}
          className="flex flex-row justify-center items-center self-center gap-[10px] bg-[#E4E4E4] text-[11px] rounded-[16px] w-[420px] h-4 text-black"
        >
          Add Stop Here
        </button>
        <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
        <Select
            className="text-black w-full"
            required
            placeholder={stops[stops.length - 1] ? stops[stops.length - 1].label : "Finish"}
            options={searchResults}
            onChange={(NewValue) => handleFinishChange(NewValue)}
          />
          
        </div>
      </div>
    </div>
  );
};

export default RStops;

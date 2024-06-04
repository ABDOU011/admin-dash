
import { useEffect, useState } from "react";
import Select from 'react-select'
import { fetchStops } from "@/app/protected/cities/actions";

interface ProvenancesProps {
  provenances: {id?:number, name: string;}[];
  setProvenance: React.Dispatch<
    React.SetStateAction<{ id?: number; name: string;}[]>
  >;
  cityId?: string
}

const HotspotStreets: React.FC<ProvenancesProps> = ({
  setProvenance,
  provenances,
  cityId
}) => {
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{id?:number,label:string}[]>([]);

  const handleChange = (
    index: number,
    id: number,
    e: string
  ) => {
    const value = e;
    const updatedProvenances = [...provenances];
    updatedProvenances[index] = { ...updatedProvenances[index], id: id, name: value };
    setProvenance(updatedProvenances);
  };

  const handleAddProvenance = () => {
    setProvenance([...provenances, { id: 0, name: ""}]);
  };
  const  handleRemoveProvenance = async (index: number) => {
    const updatedProvenances = [...provenances];
    updatedProvenances.splice(index, 1);
    setProvenance(updatedProvenances);
  };
  const handleSearch = async () => {
    
    
    const data = await fetchStops(cityId);
    
    setSearchResults(data);
    
    
  };

  useEffect(() => {
    handleSearch();
  }, []);
  
  
  
  const [value, setValue] = useState<string | null>();
  return (
    <div>
      
      
      {provenances.map((provenance, index) => (
        <div key={index} className="flex flex-row gap-3 pb-5">
          <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
          <Select className="text-black w-full" options={searchResults} onChange={(newValue) => {
          setValue(newValue?.id?.toString());
          handleChange(index, newValue!.id!, newValue!.label)
        }}/>
          </div>
          <button onClick={() => handleRemoveProvenance(index)} className="text-black">
            Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddProvenance} className="text-black">
        Add Another Stop
      </button>
    </div>
  );
};

export default HotspotStreets;


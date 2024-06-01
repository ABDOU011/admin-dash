import { deleteProv } from "@/app/protected/cities/actions";
import { useState } from "react";

interface ProvenancesProps {
  provenances: {id?:number, name: string; numstreet: number }[];
  setProvenance: React.Dispatch<
    React.SetStateAction<{ name: string; numstreet: number }[]>
  >;
  streets: { [key: number]: {id?:number, name: string, numberOfStops: number }[] };
  setStreets: React.Dispatch<React.SetStateAction<{ [key: number]: { name: string, numberOfStops: number }[] }>>;
  stops: { [key: string]: { id?:number,longitude: number, latitude: number }[] };
  setStops: React.Dispatch<React.SetStateAction<{ [key: string]: { longitude: number, latitude: number }[] }>>;
}
const Provenances: React.FC<ProvenancesProps> = ({
  setProvenance,
  provenances,
  streets,
  setStreets,
  stops,
  setStops
}) => {
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedProvenances = [...provenances];
    updatedProvenances[index] = { ...updatedProvenances[index], [name]: value };
    setProvenance(updatedProvenances);
  };

  const handleAddProvenance = () => {
    setProvenance([...provenances, { name: "", numstreet: 0 }]);
  };
  const  handleRemoveProvenance = async (index: number,id:any) => {
    await deleteProv(id);
    const updatedProvenances = [...provenances];
    updatedProvenances.splice(index, 1);
    setProvenance(updatedProvenances);

    const updatedStreets = { ...streets };
    delete updatedStreets[index];
    setStreets(updatedStreets);

    const updatedStops = { ...stops };
    Object.keys(stops).forEach(key => {
      if (key.startsWith(`${index}-`)) {
        delete updatedStops[key];
      }
    });
    setStops(updatedStops);
  };
  const handleSubmit = async () => {};

  return (
    <div>
      {provenances.map((provenance, index) => (
        <div key={index} className="flex flex-row gap-3 pb-5">
          <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
            <label htmlFor="name" className="text-black">
              {" "}
              Provenance Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Provenance Name"
              value={provenance.name}
              onChange={(e) => handleChange(index, e)}
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
          <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
            <label htmlFor="numstreet" className="text-black">
              Number of streets
            </label>
            <input
              type="number"
              name="numstreet"
              placeholder="Number of streets"
              value={provenance.numstreet}
              onChange={(e) => handleChange(index, e)}
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
          {
            provenance.id ? (
              <button onClick={()=>{handleRemoveProvenance(index,provenance?.id)}} className="text-black">
        Delete
      </button>
            ):
             (
              <></>
             )
          }
        </div>
      ))}

      <button onClick={handleAddProvenance} className="text-black">
        Add New Provenance
      </button>
    </div>
  );
};

export default Provenances;

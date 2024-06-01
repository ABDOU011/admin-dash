import { deleteStreet } from '@/app/protected/cities/actions';
import { useState, useEffect } from 'react';

interface StreetsProps {
  provenances: {id?:number, name: string; numstreet: number }[];
  streets: { [key: number]: { provid?:number,id?:number,name: string, numberOfStops: number }[] };
  setStreets: React.Dispatch<React.SetStateAction<{ [key: number]: { name: string, numberOfStops: number }[] }>>;
}

const Streets: React.FC<StreetsProps> = ({ provenances, streets, setStreets }) => {
  useEffect(() => {
    provenances.forEach((prov, index) => {
      if (!streets[index] || streets[index].length !== prov.numstreet) {
        const updatedStreets = streets[index] || [];
        while (updatedStreets.length < prov.numstreet) {
          updatedStreets.push({ name: '', numberOfStops: 0 });
        }
        setStreets((prev) => ({ ...prev, [index]: updatedStreets.slice(0, prov.numstreet) }));
      }
    });
  }, [provenances, setStreets]);

  const handleChange = (provIndex: number, streetIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedStreets = [...streets[provIndex]];
    updatedStreets[streetIndex] = { ...updatedStreets[streetIndex], [name]: name === 'numberOfStops' ? Number(value) : value };
    setStreets({ ...streets, [provIndex]: updatedStreets });
  };

  const handleRemoveStreet = async(provIndex: number, streetIndex: number,id:any) => {
    await deleteStreet(id);
    const updatedStreets = [...streets[provIndex]];
    updatedStreets.splice(streetIndex, 1);
    setStreets({ ...streets, [provIndex]: updatedStreets });
  };

  return (
    <div>
      {provenances.map((provenance, provIndex) => (
        <div key={provIndex} className="pb-8">
          <h3 className='text-black'>{provenance.name}</h3>
          {streets[provIndex]?.map((street, streetIndex) => (
            <div key={streetIndex} className="flex flex-row gap-3 pb-5">
              <div className="flex flex-col justify-center items-start gap-[12px] w-full">
                <label htmlFor="name" className="text-black">Street Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Street Name"
                  value={street.name}
                  onChange={(e) => handleChange(provIndex, streetIndex, e)}
                  className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
                />
              </div>
              <div className="flex flex-col justify-center items-start gap-[12px] w-full">
                <label htmlFor="numberOfStops" className="text-black">Number of Stops</label>
                <input
                  type="number"
                  name="numberOfStops"
                  placeholder="Number of Stops"
                  value={street.numberOfStops}
                  onChange={(e) => handleChange(provIndex, streetIndex, e)}
                  className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
                />
              </div>
              {
            street.id ? (
              <button onClick={()=>{handleRemoveStreet(provIndex,streetIndex,street?.id)}} className="text-black">
        Delete
      </button>
            ):
             (
              <></>
             )
          }
            </div>
          ))}
         
        </div>
      ))}
    </div>
  );
};

export default Streets;

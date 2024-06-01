import { deleteStop } from '@/app/protected/cities/actions';
import { useState, useEffect } from 'react';

interface Street {
  id?:number,
  name: string;
  numberOfStops: number;
}

interface StopsProps {
  streets: { [key: number]: Street[] };
  stops : { [key: string]: {id?:number, longitude: number, latitude: number }[] }
  setStops : React.Dispatch<React.SetStateAction<{ [key: string]: { longitude: number, latitude: number }[] }>>;
  provenances: { name: string; numstreet: number }[];
}

const Stops: React.FC<StopsProps> = ({ streets,stops, setStops,provenances }) => {
  

  useEffect(() => {
    const initialStops: { [key: string]: { longitude: number, latitude: number }[] } = {};
    Object.keys(streets).forEach((provenanceId) => {
      streets[Number(provenanceId)].forEach((street, streetIndex) => {
        const key = `${provenanceId}-${streetIndex}`;
        const existingStops = stops[key] || [];
        const updatedStops = existingStops.slice(0, street.numberOfStops);
        while (updatedStops.length < street.numberOfStops) {
          updatedStops.push({ longitude: 0, latitude: 0 });
        }
        initialStops[key] = updatedStops;
      });
    });
    setStops(initialStops);
  }, [provenances,streets, setStops,]);

  const handleChange = (key: string, stopIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedStops = [...stops[key]];
    updatedStops[stopIndex] = { ...updatedStops[stopIndex], [name]: Number(value) };
    setStops({ ...stops, [key]: updatedStops });
  };

  const handleAddStop = (key: string) => {
    const updatedStops = [...stops[key], { longitude: 0, latitude: 0 }];
    setStops({ ...stops, [key]: updatedStops });
  };
  const handleRemoveStop =async  (key: string, stopIndex: number,id:any) => {
    await deleteStop(id);
    const updatedStops = stops[key].filter((_, index) => index !== stopIndex);
    setStops({ ...stops, [key]: updatedStops });
  };
  return (
    <div>
      {Object.keys(streets).map((provenanceId) => (
        streets[Number(provenanceId)].map((street:any, streetIndex:any) => {
          const key = `${provenanceId}-${streetIndex}`;
          return (
            <div key={key} className="pb-8">
              <h3 className='text-black'>Street: {street.name}</h3>
              {stops[key]?.map((stop, stopIndex) => (
                <div key={stopIndex} className="flex flex-row gap-3 pb-5">
                  <input
                    type="number"
                    name="longitude"
                    placeholder="Longitude"
                    value={stop.longitude}
                    onChange={(e) => handleChange(key, stopIndex, e)}
                    className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
                  />
                  <input
                    type="number"
                    name="latitude"
                    placeholder="Latitude"
                    value={stop.latitude}
                    onChange={(e) => handleChange(key, stopIndex, e)}
                    className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
                  />
                  {
            stop.id ? (
              <button onClick={() => handleRemoveStop(key, stopIndex,stop?.id)} className="text-black">
              Remove Stop
            </button>
            ):
             (
              <></>
             )
          }
                </div>
              ))}
              
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Stops;

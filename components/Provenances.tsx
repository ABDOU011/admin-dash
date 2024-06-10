import { deleteProv } from "@/app/protected/cities/actions";
import { useState } from "react";
import Modal from 'react-modal';
import { ToastContainer, toast } from "react-toastify";


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
  const [open, setOpen] = useState(false);
  const [UserId, setUserId] = useState('');

  const handleClickOpen = (userId:string) => {
    setUserId(userId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            provenance.id ? (<div>
              <button onClick={()=>{handleClickOpen(provenance.id!.toString())}} className="text-black mt-10">
        Delete
      </button>
      <Modal
        isOpen={open}
        onRequestClose={handleClose}
        contentLabel="Edit User Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            width: "400px",
            height: "250px",
            marginRight: "-125px",
            marginBottom: "-75px",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div className="flex flex-col justify-center items-center gap-[24px] w-[350px] h-[200px]  rounded-[16px] p-[24px]">
          <h1 className="text-black text-[14px] font-bold">Are you sure you want to permanently delete it?</h1>
          <div className="flex flex-row items-end justify-end w-full gap-2">
            <button onClick={handleClose} className="flex flex-row justify-center items-center p-0 gap-[10px] w-[120px] h-[56px] text-black border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]">Cancel</button>
            <button onClick={() => {
                  try {
                    handleRemoveProvenance(index,provenance?.id);
                    
                    handleClose();
                    toast.success("provenance deleted");
                  } catch (error) {
                    toast.error("error occured check console");
                  }
                }} className="flex flex-row justify-center items-center p-0 gap-[10px] w-[120px] h-[56px] bg-[#DE1C1C] rounded-[16px]">
              Confirm
            </button>
          </div>
        </div>
        <ToastContainer />
      </Modal>
      </div>
            ):
             (
              <></>
             )
          }
        </div>
      ))}

      <button onClick={handleAddProvenance} className="flex flex-row justify-center items-center gap-[10px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px] w-[566px] h-[56px] text-[#24BAEC]">
        Add New Provenance
      </button>
      
      
    </div>
  );
};

export default Provenances;

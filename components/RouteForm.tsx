import { fetchCities, fetchS } from "@/app/protected/cities/actions";
import { useEffect, useState } from "react";
import Select from "react-select";
interface CityFormProps {
  setLine: React.Dispatch<
    React.SetStateAction<{
      id?: number;
      name: string;
      namear: string;
      acrar: string;
      acr: string;
      city: string;
      type: string;
      stype: string;
    } | null>
  >;
  line: {
    id?: number;
    name: string;
    namear: string;
    acrar: string;
    acr: string;
    city: string;
    type: string;
    stype: string;
  } | null;
}

interface TransportOptionProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  customClass?: string;
}

const TransportOption: React.FC<TransportOptionProps> = ({
  label,
  isActive,
  onClick,
  customClass,
}) => (
  <button
    className={`flex-1 justify-center items-center px-16 py-5 rounded-2xl ${
      isActive ? "text-orange-500 border-2 border-orange-500" : ""
    } ${customClass} max-md:px-5`}
    onClick={onClick}
  >
    {label}
  </button>
);

const RouteForm: React.FC<CityFormProps> = ({ setLine, line }) => {
  const [activeOption, setActiveOption] = useState<string>(
    line?.type ? line.type : "bus"
  );
  const [activeOption2, setActiveOption2] = useState<string>(
    line?.stype ? line.stype : "Rotation"
  );
  const [searchResults, setSearchResults] = useState<
    { value?: number; label: string }[]
  >([]);

  const handleSearch = async () => {
    const data = await fetchCities();

    setSearchResults(data);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLine({ ...line!, [name]: value });
  };

  useEffect(() => {
    setLine({ ...line!, type: activeOption, stype: activeOption2 });
  }, [activeOption2, activeOption]);
  const handleChangetype = (r: string) => {
    setLine({ ...line!, type: r });
    setActiveOption(r);
  };
  const handleChangetype2 = (r: string) => {
    setLine({ ...line!, stype: r });
    setActiveOption2(r);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        <div className=" flex flex-row justify-center items-start gap-[12px] w-full ">
          <div className="flex flex-col justify-center items-start gap-[8px] w-full">
            <label className="text-black"> Line Name</label>
            <input
              value={line?.name}
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Route Name"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-[8px] w-full">
            <label className="text-black"> Line Arabic Name</label>
            <input
              value={line?.namear}
              onChange={handleChange}
              type="text"
              name="namear"
              placeholder="Route Arabic Name"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
        </div>
        <div className=" flex flex-row justify-center items-start gap-[12px] w-full ">
          <div className="flex flex-col justify-center items-start gap-[8px] w-full">
            <label className="text-black"> Line Acronyme</label>
            <input
              value={line?.acr}
              onChange={handleChange}
              type="text"
              name="acr"
              placeholder="Acronym"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-[8px] w-full">
            <label className="text-black"> Line Arabic Acronyme</label>
            <input
              value={line?.acrar}
              onChange={handleChange}
              type="text"
              name="acrar"
              placeholder="Arabic Acronym"
              className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            />
          </div>
        </div>
        <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
          <label className="text-black">City</label>
          <Select
            className="text-black w-full"
            required
            placeholder={
              searchResults.find(
                (result) => result.value === Number(line?.city)
              )?.label
            }
            options={searchResults}
            onChange={(NewValue) => {
              if (line) {
                line.city = NewValue!.value!.toString();
              }
            }}
          />
        </div>
        <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
          <label className="text-black"> Route Type</label>
          <section className="flex gap-0 self-stretch text-sm tracking-tight leading-4 text-center text-gray-900 whitespace-nowrap rounded-2xl bg-neutral-200 font-[556] w-[590px] max-md:flex-wrap">
            <TransportOption
              label="Bus"
              isActive={activeOption === "bus"}
              onClick={() => handleChangetype("bus")}
            />
            <TransportOption
              label="Taxi"
              isActive={activeOption === "taxi"}
              onClick={() => handleChangetype("taxi")}
            />
            <TransportOption
              label="Train"
              isActive={activeOption === "train"}
              onClick={() => handleChangetype("train")}
            />
          </section>
        </div>
        <div className=" flex flex-col justify-center items-start gap-[12px] w-full ">
          <label className="text-black"> Schedule Type</label>
          <section className="flex gap-0 self-stretch text-sm tracking-tight leading-4 text-center text-gray-900 whitespace-nowrap rounded-2xl bg-neutral-200 font-[556] w-[590px] max-md:flex-wrap">
            <TransportOption
              label="Rotation"
              isActive={activeOption2 === "Rotation"}
              onClick={() => handleChangetype2("Rotation")}
            />
            <TransportOption
              label="Schedule"
              isActive={activeOption2 === "Scheduled"}
              onClick={() => handleChangetype2("Scheduled")}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default RouteForm;

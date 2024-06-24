"use client";
import { useEffect, useRef, useState } from "react";

import City from "./icons/City";
import Provenance from "./icons/Provenance";
import Street from "./icons/Street";
import StopsIcon from "./icons/Stops";
import Hotspot from "./icons/Hotspot";

import CityForm from "./Cities";
import Provenances from "./Provenances";
import Streets from "./Streets";
import Stops from "./Stops";
import HotSpots from "./Hotspots";
import { fetchCityData, save, update } from "@/app/protected/cities/actions";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createClient } from "@/utils/supabase/client";

type NewCityProps = {
  cityId?: string; // cityId will be undefined for new city, defined for updating city
};

export default function NewCity({ cityId }: NewCityProps) {
  const [currentSegment, setCurrentSegment] = useState<string>("City");
  const [city, setCity] = useState<{
    id?: number;
    name: string;
    namear: string;
    number: number;
  } | null>(null);
  const [provenance, setProvenance] = useState<
    { id?: number; name: string; namear: string; numstreet: number }[]
  >([{ name: "", namear: "", numstreet: 0 }]);
  const [streets, setStreets] = useState<{
    [key: number]: {
      id?: number;
      name: string;
      namear: string;
      numberOfStops: number;
    }[];
  }>({});
  const [stops, setStops] = useState<{
    [key: string]: { id?: number; longitude: number; latitude: number }[];
  }>({});
  const [hotspot, setHotspot] = useState<
    {
      id?: number;
      name: string;
      namear: string;
      image: string | null;
      place: number | string;
    }[]
  >([{ name: "", namear: "", image: null, place: 0 }]);
  const router = useRouter();

  useEffect(() => {
    if (cityId) {
      // Fetch existing city data for update
      fetchData(cityId);
    }
  }, [cityId]);

  const handleNextSegment = () => {
    if (currentSegment === "City") setCurrentSegment("Provenances");
    if (currentSegment === "Provenances") setCurrentSegment("Streets");
    if (currentSegment === "Streets") setCurrentSegment("Stops");
    if (currentSegment === "Stops") setCurrentSegment("Hotspots");
  };

  const handlePreviousSegment = () => {
    if (currentSegment === "Hotspots") setCurrentSegment("Stops");
    if (currentSegment === "Stops") setCurrentSegment("Streets");
    if (currentSegment === "Streets") setCurrentSegment("Provenances");
    if (currentSegment === "Provenances") setCurrentSegment("City");
  };
  function isValidURL(url: any) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }

  const fetchData = async (cityId: string) => {
    await fetchCityData(cityId!)
      .then((data) => {
        setCity(data.city);
        setProvenance(data.provenances);
        setStreets(data.streets);
        setStops(data.stops);
        setHotspot(data.hotspots);
      })
      .catch((error) => {
        console.error("Error fetching city data:", error);
        toast.error("Error fetching city data");
      });
  };

  const renderSegment = () => {
    switch (currentSegment) {
      case "City":
        return <CityForm setCity={setCity} city={city} />;
      case "Provenances":
        return city ? (
          <Provenances
            provenances={provenance}
            setProvenance={setProvenance}
            streets={streets}
            setStreets={setStreets}
            stops={stops}
            setStops={setStops}
          />
        ) : (
          <p className="text-black">Fill Previous Form</p>
        );
      case "Streets":
        return (
          provenance !== null && (
            <Streets
              provenances={provenance}
              streets={streets}
              setStreets={setStreets}
            />
          )
        );
      case "Stops":
        return (
          <Stops
            provenances={provenance}
            streets={streets}
            stops={stops}
            setStops={setStops}
          />
        );
      case "Hotspots":
        return (
          <HotSpots
            hotspot={hotspot}
            setHotspot={setHotspot}
            streets={streets}
            provenances={provenance}
            cityID={Number(cityId!)}
          ></HotSpots>
        );
      default:
        return <CityForm setCity={setCity} city={city} />;
    }
  };
  async function fetchPlaceIds(data: any) {
    return Promise.all(
      data.map(async (item: any) => {
        if (
          item.stopLongitude !== undefined &&
          item.stopLatitude !== undefined
        ) {
          const supabase = createClient();
          const { data: place, error } = await supabase
            .from("places")
            .select("id")
            .eq("street", item.streetName)
            .limit(1);

          if (error) {
            console.log("map error");
            console.error(error.message);
            return null;
          }
          const idd = place?.[0].id;

          return {
            latitude: item.stopLatitude,
            longitude: item.stopLongitude,
            place: idd,
          };
        }

        return null;
      })
    );
  }

  function mergeData(provenances: any, streets: any, cityId: any) {
    const result: any = [];

    provenances.forEach((prov: any, index: any) => {
      streets[index].forEach((street: any) => {
        result.push({
          street: street.name+" | "+street.namear,
          provenance: prov.name + " | " + prov.namear,
          city: cityId!,
        });
      });
    });
    return result;
  }

  function mergeStreetsAndStops(streets: any, stops: any) {
    const result: any = [];

    Object.keys(streets).forEach((streetIndex: any) => {
      streets[streetIndex].forEach((street: any, stopIndex: any) => {
        const stopKey = `${streetIndex}-${stopIndex}`;
        const stop = stops[stopKey];

        stop?.forEach((element: any) => {
          result.push({
            streetName: street.name + " | " + street.namear,
            stopLongitude: element.longitude,
            stopLatitude: element.latitude,
          });
        });
      });
    });

    return result;
  }
  console.log(hotspot[0].place==="Oran - aaaaaa")
  
  const handleSubmit = async () => {
    if (cityId) {
      const supabase = createClient();
      await update(city, provenance, streets, stops, hotspot);
      for (const hots of hotspot) {
        
          if (hots.id) {
            const { data: bucket} = await supabase.from("hotspots").select("*").eq("id",hots.id).single();
            const names=bucket?.name.split(" | ");
           
            const r = await supabase.from("hotspots").update({ name: hots.name+" | "+hots.namear}).eq("id",hots.id)
            const { data, error } = await supabase
            .from("places")
            .update({ hotspot: null})
            .eq("hotspot", hots.id);
            const { data: place, error: perror } = await supabase
              .from("places")
              .update({ hotspot: hots.id })
              .eq("street", hots.place);
            if (!isValidURL(hots.image)) {
              console.log("hhhhhhhhh")
              const imageBase64Str = hots?.image?.replace(/^.+,/, "");
            const buf = Buffer.from(imageBase64Str!, "base64");
            const { error: bucketer } = await supabase.storage
              .from("hotspots")
              .update(`${names[0]}/cover.png`, buf, {
                contentType: "image/png",
              });
              if(bucketer){
                console.log(bucketer)
              }
            }
            
          } else {
            const { data: hot, error: herror } = await supabase
              .from("hotspots")
              .insert({ name: hots.name + " | " + hots.namear, city: cityId })
              .select("id");
            const { data: place, error: perror } = await supabase
              .from("places")
              .update({ hotspot: hot?.[0].id })
              .eq("street", hots.place);
            if (perror) {
              console.log("hotspot error");
              console.log(perror.message);
            }
            if(!isValidURL(hots.image)){
              const imageBase64Str = hots?.image?.replace(/^.+,/, "");
            const buf = Buffer.from(imageBase64Str!, "base64");
            const { data: bucket, error: bucketer } = await supabase.storage
              .from("hotspots")
              .update(`${hots?.name}/cover.png`, buf, {
                contentType: "image/png",
              });
            }
            
          }
        
      }
      toast.success("City updated");
    } else {
      const supabase = createClient();
      const city2 = {
        name: city?.name + " | " + city?.namear,
        number: city?.number,
      };
      const { data, error } = await supabase
        .from("cities")
        .insert(city2)
        .select("id");

      const cityId = data?.[0].id;

      if (error) {
        console.log("city error");
        console.log(error);
      } else {
        const mergedArray = mergeData(provenance, streets, cityId);
        const { data, error } = await supabase
          .from("places")
          .insert(mergedArray);
        if (error) {
          console.log("places error");
          console.log(error.message);
        } else {
          for (const hots of hotspot) {
            const { data: hot, error: herror } = await supabase
              .from("hotspots")
              .insert({ name: hots.name + " | " + hots.namear, city: cityId })
              .select("id");
              if(herror){

                console.log(herror)
              }
            const { data: place, error: perror } = await supabase
              .from("places")
              .update({ hotspot: hot?.[0].id })
              .eq("street", hots.place);
            if (perror) {
              console.log("hotspot error");
              console.log(perror.message);
            }
            const imageBase64Str = hots?.image?.replace(/^.+,/, "");
            const buf = Buffer.from(imageBase64Str!, "base64");
            const { data: bucket, error: bucketer } = await supabase.storage
              .from("hotspots")
              .upload(`${hots?.name}/cover.png`, buf, {
                contentType: "image/png",
              });
            if (bucketer) {
              console.log(bucketer?.message);
            }
          }
          const merged = mergeStreetsAndStops(streets, stops);

          const stops2 = await fetchPlaceIds(merged);

          const filteredResults = stops2.filter(Boolean);

          const { data, error } = await supabase
            .from("stops")
            .insert(filteredResults);
          if (error) {
            console.log("stops error");
            console.log(error.message);
          }
        }
      }
      toast.success("city added");
    }

    window.location.reload();
  };
console.log(streets)
  return (
    <div className="flex flex-row items-start pt-0 px-[24px] pb-[80px] gap-[40px] w-full">
      <div className="flex flex-col justify-between items-start px-0 py-[24px] w-[300px] h-[534px]">
        <div className="flex flex-col items-start px-[24px] py-0 gap-[8px] mx-[auto] my-[0]">
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${
              currentSegment === "City" ? "bg-[#24BAEC]" : "bg-[#F4F7FE]"
            }`}
            onClick={() => setCurrentSegment("City")}
          >
            <City color={currentSegment === "City" ? "white" : "black"} />
            <p
              className={`text-[14px] ${
                currentSegment === "City" ? "text-white" : "text-black"
              }`}
            >
              City Information
            </p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${
              currentSegment === "Provenances" ? "bg-[#24BAEC]" : "bg-[#F4F7FE]"
            }`}
            onClick={() => setCurrentSegment("Provenances")}
          >
            <Provenance
              color={currentSegment === "Provenances" ? "white" : "black"}
            />
            <p
              className={`text-[14px] ${
                currentSegment === "Provenances" ? "text-white" : "text-black"
              }`}
            >
              Provenances
            </p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${
              currentSegment === "Streets" ? "bg-[#24BAEC]" : "bg-[#F4F7FE]"
            }`}
            onClick={() => setCurrentSegment("Streets")}
          >
            <Street color={currentSegment === "Streets" ? "white" : "black"} />
            <p
              className={`text-[14px] ${
                currentSegment === "Streets" ? "text-white" : "text-black"
              }`}
            >
              Streets
            </p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${
              currentSegment === "Stops" ? "bg-[#24BAEC]" : "bg-[#F4F7FE]"
            }`}
            onClick={() => setCurrentSegment("Stops")}
          >
            <StopsIcon color={currentSegment === "Stops" ? "white" : "black"} />
            <p
              className={`text-[14px] ${
                currentSegment === "Stops" ? "text-white" : "text-black"
              }`}
            >
              Stops
            </p>
          </div>
          <div
            className={`flex flex-row items-center pl-[12px] pr-[80px] py-[12px] w-full gap-[8px] h-[38px] rounded-[8px] ${
              currentSegment === "Hotspots" ? "bg-[#24BAEC]" : "bg-[#F4F7FE]"
            }`}
            onClick={() => setCurrentSegment("Hotspots")}
          >
            <Hotspot
              color={currentSegment === "Hotspots" ? "white" : "black"}
            />
            <p
              className={`text-[14px] ${
                currentSegment === "Hotspots" ? "text-white" : "text-black"
              }`}
            >
              Hotspots
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full">
          <button
            className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#F4F7FE] text-black border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
            onClick={handlePreviousSegment}
          >
            Previous
          </button>
          {currentSegment === "Hotspots" ? (
            <button
              className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#24BAEC] rounded-[16px]"
              onClick={() => {
                handleSubmit();
              }}
            >
              Save
            </button>
          ) : (
            <button
              className="flex flex-row justify-center items-center p-0 w-1/2 gap-[10px] mx-[auto] my-[0] h-[56px] bg-[#24BAEC] rounded-[16px]"
              onClick={handleNextSegment}
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div className="w-0 h-[534px] border-[1px] border-[solid] border-[#E4E4E4]" />

      <div className="w-[590px] text-black">{renderSegment()}</div>
      <ToastContainer />
    </div>
  );
}

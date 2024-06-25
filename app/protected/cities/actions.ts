"use server"
import fs from "fs";
import { createClient } from "@/utils/supabase/server";
import { data } from "autoprefixer";
import HotSpots from '@/components/Hotspots';

export async function save(city:any,provenance:any,streets:any,stops:any,hotspot:any){
    const supabase = createClient();
    const { data, error } = await supabase
          .from('cities')
          .insert(city)
          .select('id')
          
    const cityId = data?.[0].id
    
    if(
        error
      ){
        console.log("city error")
        console.log(error)
      }
      else {
        const mergedArray = mergeData(provenance, streets, cityId);
        const { data, error } = await supabase
          .from('places')
          .insert(mergedArray)
          if(error) {
            console.log("places error")
            console.log(error.message)
          }
          else{
            for( const hots of hotspot){
              const { data:hot, error:herror } = await supabase
          .from('hotspots')
          .insert({ name: hots.name, city: cityId })
          .select('id')
          const { data:place, error:perror } = await supabase
          .from('places')
          .update({ hotspot: hot?.[0].id})
          .eq('street', hots.place)
          if(perror){
            console.log("hotspot error")
            console.log(perror.message)
          }
          const imageBase64Str = hotspot.image.replace(/^.+,/, '');
          const buf = Buffer.from(imageBase64Str, 'base64');
          const { data:bucket, error:bucketer } = await supabase.storage
                .from('hotspots')
                .upload(`${hotspot?.name}/cover.png`, buf, 
                {
                  
                  contentType:'image/png',
                
                })
              if(bucketer){
                console.log(bucketer?.message)
              }
            }
            const merged = mergeStreetsAndStops(streets,stops)
            
            const stops2 = await fetchPlaceIds(merged)
            
            const filteredResults = stops2.filter(Boolean);
            
            const { data, error } = await supabase
          .from('stops')
          .insert(filteredResults)
          if(error){
            console.log("stops error")
            console.log(error.message)
          }
          }
      }
  }

  
  

  

  export async function update(city:any,prov:any,streets:any,stops:any,hotspot:any) {
    
    const supabase = createClient()
    try {
      
      const provadd: {id?:number,name:string,namear:string, numstreet:number}[]=[]
      const streetadd: { [key: number]: { id?: number, name: string,namear:string, numberOfStops: number }[] } = {};
      const stopadd: { [key: string]: {id?:number, longitude: number, latitude: number }[] } = {};

      let nextKey = 0;
      let x = 0;
      let y = 0;
      
      const cityId= city.id;
      const { error: cityError } = await supabase
        .from('cities')
        .update({ name: city.name+" | "+city?.namear,number:city.number })
        .eq('id', city.id);
  
      if (cityError) throw cityError;
  
      // Assuming each provenances, streets, and stops item has an id
      
      for (const provenance of prov) {
        if(provenance.id){
          
          const { data,error: provenanceE } = await supabase
          .from('places')
          .select('provenance')
          .eq('id', provenance.id);
          
        const { error: provenanceError } = await supabase
          .from('places')
          .update({ provenance: provenance.name+" | "+provenance?.namear })
          .eq('provenance', data?.[0].provenance);
          
          if (provenanceError) {
            console.log(`Error updating ${provenance.name}: ${provenanceError.message}`);
          } else {
            
          }
        }
        else{
          
          provadd?.push(provenance)
          
        }
      }

      prov.map((provenance:any, provIndex:any) => (
        provenance.id ?(
          streets[provIndex]?.map(async (street:any, streetIndex:any) => {
            if (street.id) {

              const { error: sterror } = await supabase
                .from('places')
                .update({ street: street.name+" | "+street?.namear })
                .eq('id', street.id);
              
              if (sterror) {
                console.log(sterror.message);
              } else {
                
              }
            }
          })   )
          :(
            streets[provIndex].forEach((street: { id?: number | undefined; name: string;namear:string, numberOfStops: number; }) => {
              if (!streetadd[nextKey]) {
                  streetadd[nextKey] = [];
              }
              streetadd[nextKey].push(street);
              
          }),
      
            nextKey++
            
            
          )
          
      ));
        
      

    Object.keys(streets).forEach((streetIndex:any) => {
      y=0;
      streets[streetIndex].forEach(async (street:any, stopIndex:any) => {
        x=0;
        if (!street.id) {
          
          const stopKey = `${streetIndex}-${stopIndex}`;
          const stop = stops[stopKey];
        if (stop) {
          
          
          
          stop?.forEach((element: any) => {
            const Key = `${x}-${y}`;
            if (!stopadd[Key]) {
              stopadd[Key] = [];
            }
            stopadd[Key].push(element);
            
          });
          y++;
        }
        x++
    }
    
        const stopKey = `${streetIndex}-${stopIndex}`;
        const stop = stops[stopKey];
        stop?.forEach(async (stope:any, stopIndex:any) => {
          if (stope?.id) {
            
            const { error: sterror } = await supabase
              .from('stops')
              .update({ longitude: stope.longitude , latitude:stope.latitude})
              .eq('id', stope.id);
            
            if (sterror) {
              console.log(sterror.message);
            } else {
              
            }
          }
        })
        
      });
    });

    const mergedArray = mergeData(provadd, streetadd, cityId);
    const { data, error } = await supabase
      .from('places')
      .insert(mergedArray)
      if(error) {
        console.log("places error")
        console.log(error.message)
      }
      else{
        const merged = mergeStreetsAndStops(streetadd,stopadd)
        
        const stops2 = await fetchPlaceIds(merged)
        
        const filteredResults = stops2.filter((result) => result !== null);
        
        const { data, error } = await supabase
      .from('stops')
      .insert(filteredResults)
      if(error){
        console.log("stops error")
        console.log(error.message)
      }
      }

    // console.log(provadd)
    //  console.log(streetadd)
    // console.log(stopadd)
      
    } catch (error) {
      console.error('Error updating city:', error);
      throw error;
    }
  }
  

  async function fetchPlaceIds(data:any) {
    return Promise.all(data.map(async (item:any) => {
      if (item.stopLongitude !== undefined && item.stopLatitude !== undefined) {
        const supabase = createClient();
        const { data: place, error } = await supabase
          .from('places')
          .select('id')
          .eq('street', item.streetName)
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
          place: idd

        };
      }
  
      return null;
    }));
  }


  function mergeData(provenances:any, streets:any, cityId:any) {
    const result:any = [];
  
  provenances.forEach((prov:any, index:any) => {
    streets[index].forEach((street:any) => {
      result.push({
        street: street.name+" | "+street.namear,
        provenance: prov.name+" | "+prov.namear,
        city: cityId!
      });
    });
  });
  return result;
}

function mergeStreetsAndStops(streets:any, stops:any) {
    const result:any = [];
    
    Object.keys(streets).forEach((streetIndex:any) => {
      streets[streetIndex].forEach((street:any, stopIndex:any) => {
        const stopKey = `${streetIndex}-${stopIndex}`;
        const stop = stops[stopKey];
        
        stop?.forEach((element: any) => {
          result.push({
            streetName: street.name+" | "+street.namear,
            stopLongitude:  element.longitude,
            stopLatitude: element.latitude
          });
        });
        

      });
    });
  
    return result;
  }

  

  export async function getCities(){
 

    const supabase = createClient();
  
    const { data:citiesData, error } = await supabase.from("cities").select(`name,id,number`)
    
    const ids = citiesData?.map(data => data.id);
  
    
    if(error){
      console.log(error.message)
      return [];
    }

    const formattedData = [];
    for (const city of citiesData) {
      const cityId = city.id;
      
      // Query the places table for the number of unique provenances and streets
      const { data: placesData, error: placesError } = await supabase
        .from('places')
        .select('id,provenance, street')
        .eq('city', cityId);
  
      if (placesError) {
        console.log(placesError.message);
        continue;
      }
    const uniqueProvenances = new Set(placesData.map(place => place.provenance)).size;
    const uniqueStreets = new Set(placesData.map(place => place.street)).size;

    const placeIds = placesData.map(place => place.id);
    const { data: stopsData, error: stopsError } = await supabase
    .from('stops')
    .select('id')
    .in('place', placeIds);

  if (stopsError) {
    console.log(stopsError.message);
    continue;
  }

  const stopsCount = stopsData.length;

  const { data: hotspots, error: hotspotsError } = await supabase
    .from('hotspots')
    .select('id')
    .eq('city', cityId);
    if (hotspotsError) {
      console.log(hotspotsError.message);
      continue;
    }

    const HotSpotscount = hotspots.length;
  formattedData.push([
    {
    number: city.number.toString(),
    name: city.name ,
  },
    `${uniqueProvenances} Provenance`,
    `${uniqueStreets} Streets`,
    `${stopsCount} Stops`,
    `${HotSpotscount}	 Hot Spots`, // Assuming a static value for hot spots as per your example
    cityId.toString()
  ]);


  }
  return formattedData;
  
}
export async function deleteCity(cityId: string) {
  const supabase = createClient()

  // Start a transaction
  try {
    const { data: placesData, error: placesError } = await supabase
    .from('places')
    .select('id')
    .eq('city', cityId);


  if (placesError) {
    console.log('Error fetching places:', placesError.message);
    return;
  }

  const { data: hotspots, error: hError } = await supabase
    .from('hotspots')
    .select('name')
    .eq('city', cityId);

    for(const hotspot of hotspots!){
              const { data:bucket, error:bucketer } = await supabase.storage
                .from('hotspots')
                .remove([`${hotspot?.name}/cover.png`])
              if(bucketer){
                console.log(bucketer?.message)
              }
    }

  const placeIds = placesData.map(place => place.id);

  // Delete stops associated with the places
  const { error: stopsError } = await supabase
    .from('stops')
    .delete()
    .in('place', placeIds);

  if (stopsError) {
    console.log('Error deleting stops:', stopsError.message);
    return;
  }

  // Delete the places associated with the city
  const { error: placesDeleteError } = await supabase
    .from('places')
    .delete()
    .eq('city', cityId);

  if (placesDeleteError) {
    console.log('Error deleting places:', placesDeleteError.message);
    return;
  }

  // Delete the city itself
  const { error: cityDeleteError } = await supabase
    .from('cities')
    .delete()
    .eq('id', cityId);

  if (cityDeleteError) {
    console.log('Error deleting city:', cityDeleteError.message);
    return;
  }
  } catch (error) {
    return  error
  }

                
  

  
}

export async function deleteProv(Id: string) {
  const supabase = createClient()

  // Start a transaction
  try {
    const { data: placesData, error: placesError } = await supabase
    .from('places')
    .select('provenance')
    .eq('id', Id);

  if (placesError) {
    console.log('Error fetching places:', placesError.message);
    return;
  }
  const prov = placesData.map(place => place.provenance);
  // Delete stops associated with the places
  const { error: stopsError } = await supabase
    .from('places')
    .delete()
    .in('provenance', prov);
  if (stopsError) {
    console.log('Error deleting prov:', stopsError.message);
    return;
  }
  } catch (error) {
    return  error
  }

}
export async function deleteStreet(Id: string) {
  const supabase = createClient()

  // Start a transaction
  try {
    
  const { error: stopsError } = await supabase
    .from('places')
    .delete()
    .eq('id', Id);
  if (stopsError) {
    console.log('Error deleting street:', stopsError.message);
    return;
  }
  } catch (error) {
    return  error
  }

}
export async function deleteStop(Id: string) {
  const supabase = createClient()

  // Start a transaction
  try {
    
  const { error: stopsError } = await supabase
    .from('stops')
    .delete()
    .eq('id', Id);
  if (stopsError) {
    console.log('Error deleting stops:', stopsError.message);
    return;
  }
  } catch (error) {
    return  error
  }

}

export async function deleteHotspot(Id: string) {
  const supabase = createClient()

  // Start a transaction
  try {
    const { data:name } = await supabase
    .from('hotspots')
    .select("*")
    .eq('id', Id).single()
    
  

  const { error: stopsError } = await supabase
    .from('hotspots')
    .delete()
    .eq('id', Id);
  if (stopsError) {
    console.log('Error deleting hotspot:', stopsError.message);
    return;
  }
  const { data, error } = await supabase.storage
              .from("avatars")
              .remove([`${name}/cover.png`]);

              
  } catch (error) {
    return  error
  }

}


export async function fetchStops(id:any) {
  const supabase = createClient()

  // Start a transaction
  try {
    
  const { data,error: stopsError } = await supabase
    .from('places')
    .select('*')
    .eq('city', id);
    
  if (stopsError) {
    console.log('Error deleting stops:', stopsError.message);
    return;
  }
  const result = data.map(({ id, street }) => ({ id, label: street }));
  console.log("aaa",result)
  return result;
  
  } catch (error) {
    return  error
  }
  
}

export async function fetchCities() {
  const supabase = createClient()
  try { 
  const { data,error: stopsError } = await supabase
    .from('cities')
    .select('*')
  
  if (stopsError) {
    console.log('Error deleting stops:', stopsError.message);
    return;
  }
  const result = data.map(({ id, name }) => ({ value: id, label: name }));
  return result;
  
  } catch (error) {
    return  error
  }
  
}
export async function fetchS(id:any) {
  const supabase = createClient()

  try {
  const { data,error: stopsError } = await supabase
    .from('places')
    .select('*')
    .eq('city', id);
    
  if (stopsError) {
    console.log('Error deleting stops:', stopsError.message);
    return;
  }
  const result = data.map(place => place.id);
  
  const { data:stops,error: Error } = await supabase
    .from('stops')
    .select('*')
    .in('place', result);
    if(Error){
      console.log(Error.message)
    }
    
    const mergeArrays = (arr1: any[], arr2: any[]) => {
      return arr2.map(item1 => {
        const match = arr1.find(item2 => item1.place === item2.id);
        return match ? { value:item1.id,label:match.street+' - '+item1.latitude+' - '+item1.longitude } : item1;
      });
    };
    
    const mergedArray = mergeArrays(data, stops!);
    
  
    
  return mergedArray;
  
  } catch (error) {
    return  error
  }
  
}

export async function fetch(id:any) {
  const supabase = createClient()

  try {
  const { data,error: stopsError } = await supabase
    .from('places')
    .select('hotspot')
    .eq('city', id);
    
  if (stopsError) {
    console.log('Error deleting stops:', stopsError.message);
    return;
  }
  let count=0
  const { data:city,error } = await supabase
    .from('cities')
    .select('name')
    .eq('id', id)
    .single()

    for(const hot of data){
      if(hot.hotspot != null){
        count++
    }
  }
    return {count:count,name:city?.name}
  
  
  
  } catch (error) {
    return  error
  }
  
}

export async function fetchCityData(cityId: string) {
  const supabase = createClient(); // assuming you have a Supabase client instance

  try {
    const { data: city2, error: cityError } = await supabase
     .from('cities')
     .select('id,name, number')
     .eq('id', cityId)
     .single();

    if (cityError) throw cityError;
    const names=city2.name.split(" | ");
    const city = {id:city2.id,name:names[0],namear:names[1],number:city2.number}

    const { data: provenancesData, error: provenancesError } = await supabase
     .from('places')
     .select('id, provenance,street,hotspot')
     .eq('city', cityId);

    if (provenancesError) throw provenancesError;

    const { data: hotspot, error: hotspotsError } = await supabase
    .from('hotspots')
    .select('id,name')
    .eq('city', cityId)
    
    
    if (hotspotsError) throw hotspotsError;
    
    const hotspots = hotspot.map( (hot) => {
      const place = provenancesData.find((p) => p.hotspot === hot.id);
      const names=hot.name.split(" | ");

      const imagePath =  supabase.storage
      .from('hotspots')
      .getPublicUrl(`${names[0]}/cover.png`);
      
    
   
      return {
        id:hot.id,
        name: names[0],
        namear: names[1],
        image: imagePath?.data?.publicUrl,
        place : place?.street
      };
    })
    

    const uniqueProvenances = [...new Set(provenancesData.map((p) => p.provenance))];
    
    const provenanceCounts = provenancesData.reduce((acc:any, current) => {
      acc[current.provenance] = (acc[current.provenance] || 0) + 1;
      return acc;
    }, {});
    
    const provenances = uniqueProvenances.map((provenance:any) => {
      const { id } = provenancesData.find((p) => p.provenance === provenance) || {};
      const names=provenance.split(" | ");
      
      return {
        id,
        name: names[0],
        namear: names[1],
        numstreet: provenanceCounts[provenance],
      };
    });
    
    const placeIds = provenancesData.map(place => place.id);

// Fetch the stops data
const { data: stopsData, error: stopsError } = await supabase
  .from('stops')
  .select('id, place,longitude, latitude')
  .in('place', placeIds); 
    
if (stopsError) throw stopsError;

// Calculate the number of stops for each place
const stopsCountByPlace = stopsData.reduce((acc: any, stop: any) => {
  acc[stop.place] = (acc[stop.place] || 0) + 1;
  return acc;
}, {});

const stopsByPlace = stopsData.reduce((acc: any, stop: any) => {
  if (!acc[stop.place]) {
    acc[stop.place] = [];
  }
  acc[stop.place].push({id:stop.id, longitude: stop.longitude, latitude: stop.latitude });
  return acc;
}, {});

// Group streets by provenance and include the number of stops
const streetsGroupedByProvenance = provenancesData.reduce((acc: any, current: any) => {
  const numOfStops = stopsCountByPlace[current.id] || 0;
  if (!acc[current.provenance]) {
    acc[current.provenance] = [];
  }
  const names=current.street.split(" | ");

  acc[current.provenance].push({ id:current.id,name: names[0],
    namear: names[1], numberOfStops: numOfStops });
  return acc;
}, {});

// Convert the grouped object into the desired format
const streets = Object.keys(streetsGroupedByProvenance).reduce((acc: any, provenance: string, index: number) => {
  acc[index] = streetsGroupedByProvenance[provenance];
  return acc;
}, {});


const stops = Object.keys(streetsGroupedByProvenance).reduce((acc: any, provenance: string, provIndex: number) => {
  streetsGroupedByProvenance[provenance].forEach((street: any, streetIndex: number) => {
    const place = provenancesData.find((p: any) => p.provenance === provenance && p.street === street.name+" | "+street.namear);
    if (place) {
      const key = `${provIndex}-${streetIndex}`;
      acc[key] = stopsByPlace[place.id] || [];
    }
  });
  return acc;
}, {});

    
    


    return {
      city,
      provenances,
      streets,
      stops,
      hotspots
    };

  } catch (error) {
    console.error('Error fetching city data:', error);
    throw error;
  }
}

export async function history(){
  const supabase = createClient();
  const {data, error} = await supabase.from("admin_cities_log").select("*").order("created_at", { ascending: false });
  if (error) { 
    console.error(error);
    return;
  }
  const logs:any = []
  for(const city of data){
    const cities:any = []
    for(const id of city.cities){
      const {data, error} = await supabase.from("cities").select("name").eq("id", id);
      cities.push(data?.[0].name)
    }
    const {data:it, error} = await supabase.from("itineraries").select("user").eq("id", city.itinerary);
    const {data} = await supabase.from("profiles").select("name").eq("id", it?.[0].user);
    
    const log = {
      name: data?.[0].name,
      cities: cities,
      created_at: city.created_at
    }
    logs.push(log)
  }
  
  return logs
}

export async function piechart(){
  const supabase = createClient();
 
 

  const { data } = await supabase
  .from("reservations")
  .select('id,route')
  .in('state', ['done', 'cleared',"reserved"])
  let bus = 0;
  let train = 0;
  let taxi = 0;
  for (const reservation of data!) {
    const {data:it, error} = await supabase.from("routes").select("type").eq("id", reservation.route).single();
    if(it?.type === "bus"){
      bus += 1
    }else if(it?.type === "train"){
      train += 1
    }else if(it?.type === "taxi"){
      taxi += 1
    }
  }
  return {bus:bus,train:train,taxi:taxi,total:bus+train+taxi}
}

export async function chart(){
  const supabase = createClient();
 
 

  const { data } = await supabase
  .from("itineraries")
  .select('id,seats,to')
  .in('state', ['done', 'planned'])
  let seats = 0;
  const places:any = []
  for (const reservation of data!) {
    const {data:it, error} = await supabase.from("places").select("street").eq("id", reservation.to).single();
    places.push({name:it?.street,seats:reservation.seats})
    seats += reservation.seats
  }

  const result = places.reduce((acc:any, current:any) => {
    const existingIndex = acc.findIndex((item: { name: any; }) => item.name === current.name);
    if (existingIndex!== -1) {
      acc[existingIndex].seats += current.seats;
    } else {
      acc.push(current);
    }
    return acc;
  }, []);
  const labels = result.map((item: { name: any; }) => item.name);
  const values = result.map((item: { seats: any; }) => item.seats);
  

  
  return {
    labels:labels,
    values:values,
    total:seats}
  
}

export async function chart2(){
  const supabase = createClient();

  const { data } = await supabase
  .from("itineraries")
  .select('id,seats,to')
  .in('state', ['done', 'planned',"on-going"])
  
  const places:any = []
  for (const reservation of data!) {
    const {data:it, error} = await supabase.from("places").select("city").eq("id", reservation.to).single();
    places.push({id:it?.city,value:1,name:""})
    
  }

  const result = places.reduce((acc:any, current:any) => {
    const existingIndex = acc.findIndex((item: { id: any; }) => item.id === current.id);
    
    if (existingIndex!== -1) {
      acc[existingIndex].value += 1;
    } else {
      acc.push(current);
    }
    return acc;
  }, []);
  
  
  for(const item of result){
    const {data:it, error} = await supabase.from("cities").select("name").eq("id", item.id).single();
    item.name = it?.name
  }
 
  return {result:result,total:(places?.length)}

  
}

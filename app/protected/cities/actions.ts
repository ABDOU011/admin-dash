"use server"
import { createClient } from "@/utils/supabase/server";
import { data } from "autoprefixer";

export async function save(city:any,prov:any,streets:any,stops:any){
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
        const mergedArray = mergeData(prov, streets, cityId);
        const { data, error } = await supabase
          .from('places')
          .insert(mergedArray)
          if(error) {
            console.log("places error")
            console.log(error.message)
          }
          else{
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
      console.log(hotspot)
      const provadd: {id?:number,name:string, numstreet:number}[]=[]
      const streetadd: { [key: number]: { id?: number, name: string, numberOfStops: number }[] } = {};
      const stopadd: { [key: string]: {id?:number, longitude: number, latitude: number }[] } = {};

      let nextKey = 0;
      let x = 0;
      let y = 0;
      
      const cityId= city.id;
      const { error: cityError } = await supabase
        .from('cities')
        .update({ name: city.name,number:city.number })
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
          .update({ provenance: provenance.name })
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
                .update({ street: street.name })
                .eq('id', street.id);
              
              if (sterror) {
                console.log(sterror.message);
              } else {
                
              }
            }
          })   )
          :(
            streets[provIndex].forEach((street: { id?: number | undefined; name: string; numberOfStops: number; }) => {
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
    // console.log(streetadd)
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
        street: street.name,
        provenance: prov.name,
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
            streetName: street.name,
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

  formattedData.push([
    {
    number: city.number.toString(),
    name: city.name ,
  },
    `${uniqueProvenances} Provenance`,
    `${uniqueStreets} Streets`,
    `${stopsCount} Stops`,
    '0 Hot Spots', // Assuming a static value for hot spots as per your example
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
  

  console.log(`City with ID ${cityId} and all its associated data have been deleted.`);
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
  
  return result;
  
  } catch (error) {
    return  error
  }
  
}

export async function fetchCityData(cityId: string) {
  const supabase = createClient(); // assuming you have a Supabase client instance

  try {
    const { data: city, error: cityError } = await supabase
     .from('cities')
     .select('id,name, number')
     .eq('id', cityId)
     .single();

    if (cityError) throw cityError;

    const { data: provenancesData, error: provenancesError } = await supabase
     .from('places')
     .select('id, provenance,street')
     .eq('city', cityId);

    if (provenancesError) throw provenancesError;

    const uniqueProvenances = [...new Set(provenancesData.map((p) => p.provenance))];
    
    const provenanceCounts = provenancesData.reduce((acc:any, current) => {
      acc[current.provenance] = (acc[current.provenance] || 0) + 1;
      return acc;
    }, {});
    
    const provenances = uniqueProvenances.map((provenance) => {
      const { id } = provenancesData.find((p) => p.provenance === provenance) || {};
      return {
        id,
        name: provenance,
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
  acc[current.provenance].push({ id:current.id,name: current.street, numberOfStops: numOfStops });
  return acc;
}, {});

// Convert the grouped object into the desired format
const streets = Object.keys(streetsGroupedByProvenance).reduce((acc: any, provenance: string, index: number) => {
  acc[index] = streetsGroupedByProvenance[provenance];
  return acc;
}, {});


const stops = Object.keys(streetsGroupedByProvenance).reduce((acc: any, provenance: string, provIndex: number) => {
  streetsGroupedByProvenance[provenance].forEach((street: any, streetIndex: number) => {
    const place = provenancesData.find((p: any) => p.provenance === provenance && p.street === street.name);
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
      stops
    };
  } catch (error) {
    console.error('Error fetching city data:', error);
    throw error;
  }
}



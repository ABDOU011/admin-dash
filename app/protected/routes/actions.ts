"use server";
import fs from "fs";
import { createClient } from "@/utils/supabase/server";

export async function updateRoute(
  line: any,
  stops: any,
  fares: any,
  times: any,
  schedule: any,
  rotation: any,
  other: any,
  Id: string
) {
  const supabase = createClient();
  let sch = null;
  let rot = null;
  const { data, error } = await supabase
    .from("routes")
    .select("rotation,schedule")
    .eq("id", Id)
    .single();
  rot = data?.rotation;
  sch = data?.schedule;

  //case111
  if (rot && line.stype === "Scheduled") {
    const { data, error } = await supabase
      .from("schedules")
      .insert({
        start_times: schedule.start_times,
      })
      .select("id")
      .single();
      const scid= data?.id;
    const stopValues = stops.map((stop: any) => stop.value.toString());
    const lastArival =
      times.arival.length > 0 ? times.arival[times.arival.length - 1] : 20;
    const totalCost = fares.reduce(
      (total: any, fare: any) => total + parseFloat(fare.cost.toString()),
      0
    );
    const { data: route, error: r } = await supabase
      .from("routes")
      .update({
        type: line?.type,
        acronym: line?.acr+" | "+line.acrar,
        name: line?.name+" | "+line.namear,
        stops: stopValues,
        schedule: scid,
        rotation: null,
        seats_count: other.seats,
        trip_duration: lastArival,
        trip_cost: totalCost,
      })
      .eq("id", Id);

    if (r) {
      console.log(r.message);
    } else {
        const { data, error } = await supabase
      .from("rotaions")
      .delete()
      .eq("id", rot);
    }
  }


  // case2
  else if (sch && line.stype === "Rotation") {
    const { data, error } = await supabase
      .from("rotations")
      .insert({
        start_time: rotation.start_time,
        end_time: rotation.end_time,
        interval: rotation.interval,
      })
      .select("id")
      .single();
      const roid = data?.id;
    const stopValues = stops.map((stop: any) => stop.value.toString());
    const lastArival =
      times.arival.length > 0 ? times.arival[times.arival.length - 1] : 20;
    const totalCost = fares.reduce(
      (total: any, fare: any) => total + parseFloat(fare.cost.toString()),
      0
    );
    const { data: route, error: r } = await supabase
      .from("routes")
      .update({
        type: line?.type,
        acronym: line?.acr+" | "+line.acrar,
        name: line?.name+" | "+line.namear,
        stops: stopValues,
        schedule: null,
        rotation: roid,
        seats_count: other.seats,
        trip_duration: lastArival,
        trip_cost: totalCost,
      })
      .eq("id", Id);

    if (r) {
      console.log(r.message);
    } else {
        const { data, error } = await supabase
      .from("schedules")
      .delete()
      .eq("id", sch);
    }
  }
else{
    const stopValues = stops.map((stop: any) => stop.value.toString());
    const lastArival =
      times.arival.length > 0 ? times.arival[times.arival.length - 1] : 20;
    const totalCost = fares.reduce(
      (total: any, fare: any) => total + parseFloat(fare.cost.toString()),
      0
    );
    const { data: route, error: r } = await supabase
      .from("routes")
      .update({
        type: line?.type,
        acronym: line?.acr+" | "+line.acrar,
        name: line?.name+" | "+line.namear,
        stops: stopValues,
        
        seats_count: other.seats,
        trip_duration: lastArival,
        trip_cost: totalCost,
      })
      .eq("id", Id);

    if (r) {
      console.log(r.message);
    }
}

    if(line.stype==="Scheduled"){
        const { data, error } = await supabase
      .from("schedules")
      .update({
        start_times: schedule.start_times,
      })
      .eq("id", schedule.id);
    }
    if(line.stype==="Rotation"){
        const { data, error } = await supabase
      .from("rotations")
      .update({
        start_time: rotation.start_time,
        end_time: rotation.end_time,
        interval: rotation.interval,
      })
      .eq("id", rotation.id);
    }



  ////
  const { data: t, error: te } = await supabase
    .from("times")
    .update({
      departures: times.departure,
      arrivals: times.arival,
    })
    .eq("id", times.id);
  if (te) {
    console.log(te.message);
  }

  for (const fare of fares) {
    if (!fare.id) {
      const { data: fares, error: ferror } = await supabase
        .from("fares")
        .insert({
          from: fare.from,
          to: fare.to,
          cost: fare.cost,
          route: Id,
        });
      if (ferror) {
        console.log(ferror.message);
      }
    } else {
      const { data: fares, error: ferror } = await supabase
        .from("fares")
        .update({
          from: fare.from,
          to: fare.to,
          cost: fare.cost,
        })
        .eq("id", fare.id);
      if (ferror) {
        console.log(ferror.message);
      }
    }
  }
}
export async function saveRoute(
  line: any,
  stops: any,
  fares: any,
  times: any,
  schedule: any,
  rotation: any,
  other: any
) {
  const supabase = createClient();
  let sch = null;
  let rot = null;
  if (line.stype === "Rotation") {
    const { data, error } = await supabase
      .from("rotations")
      .insert({
        start_time: rotation.start_time,
        end_time: rotation.end_time,
        interval: rotation.interval,
      })
      .select("id");
    if (error) {
      console.log(error.message);
    }
    rot = data![0].id;
  } else {
    const { data, error } = await supabase
      .from("schedules")
      .insert({
        start_times: schedule.start_times,
      })
      .select("id");
    if (error) {
      console.log(error.message);
    }
    sch = data![0].id;
  }
  const stopValues = stops.map((stop: any) => stop.value.toString());
  const lastArival =
    times.arival.length > 0 ? times.arival[times.arival.length - 1] : 20;
  const totalCost = fares.reduce(
    (total: any, fare: any) => total + parseFloat(fare.cost.toString()),
    0
  );

  const { data, error } = await supabase
    .from("routes")
    .insert({
      name: line.name+" | "+line.namear,
      type: line.type.toLowerCase(),
      acronym: line.acr+" | "+line.acrar,
      stops: stopValues,
      busy: 25,
      schedule: sch,
      rotation: rot,

      seats_count: other.seats,
      trip_duration: lastArival,
      trip_cost: totalCost,
    })
    .select("id");
  const route = data![0].id;
  if (error) {
    console.log(error.message);
  } else {
    const { data, error } = await supabase.from("times").insert({
      departures: times.departure,
      arrivals: times.arival,
      route: route,
    });
    if (error) {
      console.log(error.message);
    }

    for (const fare of fares) {
      const { data: fares, error: ferror } = await supabase
        .from("fares")
        .insert({
          from: fare.from,
          to: fare.to,
          cost: fare.cost,
          route: route,
        });
      if (ferror) {
        console.log(ferror.message);
      }
    }
  }
}

export async function getRoutes() {
  const supabase = createClient();

  const { data: citiesData, error } = await supabase
    .from("routes")
    .select(`name,acronym,type,stops,id,busy,id,trip_cost`);

  const ids = citiesData?.map((data) => data.id);

  if (error) {
    console.log(error.message);
    return [];
  }

  const formattedData = [];

  for (const city of citiesData) {
    const cityId = city.id;
    const { count } = await supabase.from("trips").select('id', { count: 'exact' }).eq('route', cityId);
    
    const stopsCount = city.stops.length;
    
    formattedData.push([
      {
        acr: city.acronym.toString(),
        name: city.name,
      },
      `${stopsCount} Stops`,
      `${city.trip_cost}`,

      count, 
      cityId.toString(),
    ]);
  }
  return formattedData;
}
export async function deleteRoute(Id: string) {
  const supabase = createClient();

  // Start a transaction
  try {
    const { data, error: placesError } = await supabase
      .from("routes")
      .select("schedule,rotation")
      .eq("id", Id);
    const sch = data![0].schedule;
    const rot = data![0].rotation;
    if (placesError) {
      console.log("Error ", placesError.message);
      return;
    }
    if (sch) {
      const { data, error: placesError } = await supabase
        .from("routes")
        .delete()
        .eq("id", Id);

      if (placesError) {
        console.log("Error ", placesError.message);
      } else {
        const { data, error: placesError } = await supabase
          .from("schedules")
          .delete()
          .eq("id", sch);
        const { error } = await supabase.from("times").delete().eq("route", Id);
        if (error) {
          console.log(error.message);
        }
        const { error: e } = await supabase
          .from("fares")
          .delete()
          .eq("route", Id);
      }
    } else {
      const { data, error: placesError } = await supabase
        .from("routes")
        .delete()
        .eq("id", Id);

      if (placesError) {
        console.log("Error ", placesError.message);
      } else {
        const { data, error: placesError } = await supabase
          .from("rotations")
          .delete()
          .eq("id", rot);
        const { error } = await supabase.from("times").delete().eq("route", Id);
        if (error) {
          console.log(error.message);
        }
        const { error: e } = await supabase
          .from("fares")
          .delete()
          .eq("route", Id);
      }
    }
  } catch (error) {
    return error;
  }
}

export async function fetchRouteData(Id: string) {
  const supabase = createClient(); // assuming you have a Supabase client instance

  try {
    const { data: route, error: cityError } = await supabase
      .from("routes")
      .select("*")
      .eq("id", Id)
      .single();

    const stops = route.stops;

    const { data: places, error } = await supabase
      .from("stops")
      .select("place")
      .in("id", stops);

    const place = places![0].place;

    const { data: c, error: cc } = await supabase
      .from("places")
      .select("city")
      .eq("id", place)
      .single();

    const cityid = c?.city;
    const names=route.name.split(" | ");
    const names2=route.acronym.split(" | ");
    const line = {
      name: names[0],
      namear:names[1],
      id: route?.id,
      acr: names2[0],
      acrar:names2[1],
      city: cityid,
      type: route?.type,
      stype: route?.rotation ? "Rotation" : "Scheduled",
    };
    const finalstops = [];
    for (const stop of stops) {
      const { data, error } = await supabase
        .from("stops")
        .select("*")
        .eq("id", stop)
        .single();
      const p = data?.place;
      const s = data!;
      if (error) {
        console.log(error.message);
      } else {
        const { data, error } = await supabase
          .from("places")
          .select("*")
          .eq("id", p)
          .single();

        if (error) {
          console.log(error.message);
        } else {
          const place = data;
          finalstops.push({
            id: s.id,
            value: s.id,
            label: place?.street + " _ " + s.latitude + " _ " + s.longitude,
          });
        }
      }
    }

    const { data: fares, error: ferror } = await supabase
      .from("fares")
      .select("from,to,cost,id")
      .eq("route", Id);

    const { data: times, error: terror } = await supabase
      .from("times")
      .select("departures,arrivals,id")
      .eq("route", Id);

    const time = {
      id: times![0].id,
      departure: times![0].departures,
      arival: times![0].arrivals,
    };

    let r = null,
      s = null;

    if (line.stype === "Rotation") {
      const { data, error } = await supabase
        .from("rotations")
        .select("*")
        .eq("id", route.rotation)
        .single();
      r = data;
    }
    if (line.stype === "Scheduled") {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .eq("id", route.schedule)
        .single();
      s = data;
    }
    c;
    return {
      line,
      finalstops,
      fares,
      time,
      r,
      s,
      other: { seats: route.seats_count },
    };
  } catch (error) {
    console.error("Error fetching city data:", error);
    throw error;
  }
}

export async function history(){
  const supabase = createClient();
  const {data, error} = await supabase.from("reservations").select("*").order("created_at", { ascending: false });
  if (error) { 
    console.error(error);
    return;
  }
  const logs:any = []
  for(const city of data){
    const cities:any = []
    
    const {data:it, error} = await supabase.from("profiles").select("name").eq("id", city.user).single();
    const {data} = await supabase.from("routes").select("name").eq("id", city.route).single();
    
    const log = {
      name: it?.name,
      seats:city.seats,
      created_at: city.created_at,
      route: data?.name,
    }
    logs.push(log)
  }
  
  return logs
}

export async function chart(){
  const supabase = createClient();
 
  const { data } = await supabase
  .from("reservations")
  .select('id,route,seats')
  .in('state', ['done','cleared',"reserved"])

  let seats = 0;
  const places:any = []
  for (const reservation of data!) {
    const {data:it, error} = await supabase.from("routes").select("name").eq("id", reservation.route).single();
    places.push({name:it?.name,seats:reservation.seats})
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

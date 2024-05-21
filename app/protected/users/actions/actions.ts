"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

import fs from "fs";
import mime from "mime";
import { format } from "util";

export async function history(){
  const supabase = createClient();
  const {data, error} = await supabase.from("user_creation_history").select("*").limit(6);
  if (error) { 
    console.error(error);
    return;
  }
  else return data
}

export async function addUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const address = formData.get("Address") as string;
  const phone = formData.get("phone") as string;

  const supabase = createClient();

  const adminId = (await supabase.auth.getUser()).data.user?.id;
  const {data} = await supabase.from("profiles").select("name").eq('id',adminId);
  const adminName = data?.[0].name;
try {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  const id = data.user?.id;
  if (error) {
    console.log(error.message);
    return error
  }
  else{
    const { data, error } = await supabase.from("profiles").insert([
    {
      id: id,
      email: email,
      name: name,
      address: address ? address : "",
      phone: phone ? phone : "",
      is_admin: false,
    },
  ]);
   
  if (error) {
    console.log(error.message);
    return error
  }
  else{
    const avatarFile = fs.readFileSync("../../../../assets/avatar.png");
    const avatarMimeType = mime.getType("../../../../assets/avatar.png");
  
  const { data, error } = await supabase
  .storage
  .from('avatars')
  .upload(`${id}/avatar.png`, avatarFile, {
    cacheControl: '3600',
    upsert: false,
    contentType: avatarMimeType?avatarMimeType: 'image/png',

  })
  if(error) console.log(error.message)
  else {
    const { data, error } = await supabase.from("user_creation_history").insert([
      {
        name: name,
        admin_name: adminName,
      },
    ]);
    if (error) {
      console.log(error.message);
      return error;
    }
}
  }
}
} catch (error) {
  return error;
}
  
}

export async function updateUser(formData: FormData) {
  const id = formData.get("id") as string;
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const address = formData.get("Address") as string;
  const phone = formData.get("phone") as string;

  const supabase = createClient();
try {
  
    const { data, error } = await supabase.from("profiles").update([{ id: id,  name, address, phone }
  ]).eq("id", id);
   
  if (error) {
    console.log(error.message);
    return error
  }
  

} catch (error) {
  return error;
}
  
}

export async function addAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    const id = data.user?.id;
    if (error) {
      console.log(error.message);
      return error
      
    } else {
      const { data, error } = await supabase.from("profiles").insert([
        {
          id: id,
          email: email,
          name: name,
  
          is_admin: true,
        },
      ]);
      if (error) {
        
        console.log(error.message);
        return error
      }
      else{
        const avatarFile = fs.readFileSync("../../../../assets/avatar.png");
    const avatarMimeType = mime.getType("../../../../assets/avatar.png");
  console.log(avatarFile)
  const { data, error } = await supabase
  .storage
  .from('avatars')
  .upload(`${id}/avatar.png`, avatarFile, {
    cacheControl: '3600',
    upsert: false,
    contentType: avatarMimeType?avatarMimeType: 'image/png',

  })
  if(error) {console.log(error.message)
  }
      }
      
    }
  } catch (error) {
    return error
  }
}

export async function getUsers(): Promise<(object | string[] | number[])[]>{
 

  const supabase = createClient();

  const { data, error } = await supabase.from("profiles").select(`name,email,created_at,is_admin,id,address`)
  
  const ids = data?.map(data => data.id);

  
  if(error){
    console.log(error)
    return [];
  }
  if (data){
    var urls:string[]= []
    
    for (let index = 0; index < data.length; index++) {
      const { data : file } = await supabase.storage.from("avatars").list(ids?.[index]);

      const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(`${ids?.[index]}/${file?.[0]?.name}`)

      urls.push(data.publicUrl)
    }
  }
  const formattedData: (object | string[] | number[])[] = data?.map((user, index) => [
    {
      name: user.name,
      email: user.email,
      pic: urls[index % urls.length] // Cycle through pictures if there are fewer pictures than users
    },
    new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }),
    user.address,
    user.is_admin ? "Admin" : "User",
    user.id
  ]);
  
  return formattedData;
  
}

export async function deleteUser(userId : string){
 
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.admin.deleteUser(userId);
  if (error){
    console.log(error)
    return error
  }
  else{
    const { data, error } = await supabase
    .from('profiles')
    .delete()
    .match({ id: userId })
    if (error) {
      console.log(error);
      return error;
    } else {
      const { data } = await supabase.storage.from("avatars").list(userId);
      if (data?.length)
					{
					supabase.storage
						.from("avatars")
						.remove([`${userId}/${data[0].name}`]);}
      
    }
  }
  } catch (error) {
    return error
  }
  

}

export async function getUser(userId : string){
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select(`name,email,created_at,is_admin,id,address,phone`).eq("id", userId);
  return data?.[0];
}
export async function usersCount(){
  const supabase = createClient();
  const { count } = await supabase.from("profiles").select('id', { count: 'exact' });
  
  return count;
}
export async function monthchart(){
  const supabase = createClient();
  const { data: countData, error: countError } = await supabase
  .rpc("monthly_count", { table_name: "profiles", column_name: "created_at" });

  if (countError) {
    console.error("Error getting monthly count:", countError);
    return;
  }
  
  const months = Array.from({length: 12}, (_, i) => i + 1);

  const result = months.map(month => {
    const matchingData = countData.find((data: { month: number; }) => data.month === month);
    return {
      month,
      count: matchingData ? matchingData.count : 0
    };
  });
  const counts = result.map(data => data.count);
  
  return counts;

}

// export async function activeusers(){
//   const supabase = createClient();
//   const { data: users, error } = await supabase.auth.admin.listUsers();

// if (error) {
//   console.error('Error executing query:', error);
//   return;
// }

// const today = new Date();
// today.setHours(0, 0, 0, 0);
// if (!Array.isArray(users)) {
//   // Convert users to an array
//   users = Object.values(users)
// }
// const usersWhoSignedInToday = users.filter(user => {
//   const lastSignIn = new Date(user.last_sign_in_at);
//   lastSignIn.setHours(0, 0, 0, 0);
//   return lastSignIn.getTime() === today.getTime();
// });

// console.log(`Number of users who last signed in today: ${usersWhoSignedInToday.length}`);
// }

export async function newUsers(){
  const supabase = createClient();
  const startDate = new Date();
startDate.setDate(startDate.getDate() - 7);
const endDate = new Date();
const startDateString = startDate.toISOString().split('.')[0] + '+00';
const endDateString = endDate.toISOString().split('.')[0] + '+00';

const { count } = await supabase
  .from("profiles")
  .select('id', { count: 'exact' })
  .gte('created_at', startDateString)
  .lte('created_at', endDateString);


return count;


  
}


export async function userLogs(){
  const supabase = createClient();
  const query = supabase
  .from('private.auth_logs')
  .select('id, timestamp')
  .ilike('path', '%admin/users%')
  .ilike('status', '200')
  .ilike('event_message', 'user_signedup')
  .order('timestamp', { ascending: false })
  .limit(6)

// Execute the query
const { data, error } = await query

if (error) {
  console.error('Error executing query:', error)
  return
}else{
  return data?.[0];
}
}
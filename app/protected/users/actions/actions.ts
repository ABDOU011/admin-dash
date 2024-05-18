"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";


  
export async function addUser(formData: FormData)  {
      
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const name = formData.get('name') as string
      const address = formData.get('Address') as string
      const phone = formData.get('phone') as string

      const supabase = createClient();
  
      const { data,error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm:true
      })
      const id = data.user?.id
      if (error) {
        console.log(error.message)
       
      }
      else{
        
        const { data, error } = await supabase.from('profiles').insert([
            {
              id: id,
              email: email,
              name: name,
              address: address? address : "",
              phone: phone? phone : "",
              is_admin: false
              
            },
          ]);
          if (error){
            console.log(error.message)
          }
          console.log(data)
          
      }

      
    };

    export async function addAdmin(formData: FormData)  {
      
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const name = formData.get('name') as string
        
  
        const supabase = createClient();
    
        const { data,error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm:true
        })
        const id = data.user?.id
        if (error) {
          console.log(error.message)
         
        }
        else{
          
          const { data, error } = await supabase.from('profiles').insert([
              {
                id: id,
                email: email,
                name: name,
                
                is_admin: true
                
              },
            ]);
            if (error){
              console.log(error.message)
            }
            console.log(data)
            
        }
  
        
      }
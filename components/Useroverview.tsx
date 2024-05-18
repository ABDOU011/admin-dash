import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default function Login({
 
}: {
 
}) {
  const isAdmin = async (id: string | undefined) => {
    "use server";
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", id)
        .single();

      if (!error) return data.is_admin;
      return false;
    } catch (error) {
      return false;
    }
  };


  return (
    <></>
  );
}

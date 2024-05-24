
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";


export default async function ProtectedPage() {
  

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }
  

  return (
    <div className="bg-[#F4F7FE] w-full">
            home
    </div>
  );
}

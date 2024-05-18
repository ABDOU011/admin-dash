import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
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

  const signIn = async (formData: FormData) => {
    "use server";
    const supabase = createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    const userId = data?.user?.id;
    if (userId && (await isAdmin(userId))) {
      return redirect("/protected");
    } else {
      await supabase.auth.signOut();
      return redirect("/login?message=Could not authenticate user");
    }
  };

  return (
    <div className="flex flex-row  items-center w-full h-screen">
      <div className="flex flex-row justify-center items-center  w-full h-screen">
        <div className="flex  justify-center items-start w-1/2">
          <div className="flex w-2/3 h-2/3 gap-[56px] flex-col justify-center items-start">
            <div className="flex flex-col justify-center items-start gap-[8px]">
              <h1 className="not-italic font-semibold text-[36px] leading-[56px] text-black">
                Sign In
              </h1>
              <p className="font-['SF_Compact_Text'] not-italic font-normal text-[16px] opacity-50 text-black">
                Enter your email and password to sign in
              </p>
            </div>

            <form className="animate-in flex-1 flex flex-col items-start p-0  justify-center gap-[29px] text-foreground">
              <div className="flex flex-col gap-3">
                <label className="text-md text-black" htmlFor="email">
                  Email
                </label>
                <input
                  className="rounded-2xl px-4 py-2 bg-inherit border-[#E4E4E4] border mb-6 w-[410px] text-black"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-md text-black" htmlFor="password">
                  Password
                </label>
                <input
                  className="rounded-2xl px-4 py-2 bg-inherit border-[#E4E4E4] border mb-6 w-[410px] text-black"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <SubmitButton
                formAction={signIn}
                className="bg-[#24BAEC] w-full rounded-2xl px-4 py-2 text-foreground mb-2"
                pendingText="Signing In..."
              >
                Sign In
              </SubmitButton>

              {searchParams?.message && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                  {searchParams.message}
                </p>
              )}
            </form>
          </div>
        </div>
        <div className="w-1/2 h-screen">
          <img className="h-screen w-full" src="https://cdn.discordapp.com/attachments/730134376129626225/1240764478283583539/image.png?ex=664910f7&is=6647bf77&hm=c9700b758f2caef14616fe20dd859048452015749482343b4013dd72e57a7d09&"></img>
        </div>
      </div>
    </div>
  );
}

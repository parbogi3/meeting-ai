"use client";

import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function DashboardHeader() {
  const logout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/login";
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="px-8 py-4 flex items-center justify-between">

        <div className="flex items-center gap-5">

          <Image
            src="/logo.png"
            alt="BIPA"
            width={220}
            height={110}
            priority
          />

          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              BIPA AI NOTE
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              부산정보산업진흥원 AI·AX산업팀
            </p>
          </div>

        </div>

        <button
          onClick={logout}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition"
        >
          로그아웃
        </button>

      </div>
    </header>
  );
}

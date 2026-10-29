import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function DashboardHeader() {
  const logout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="BIPA"
          width={42}
          height={42}
        />

        <div>
          <h1 className="font-bold text-slate-900">
            Meeting AI
          </h1>

          <p className="text-xs text-slate-500">
            (재)부산정보산업진흥원 
          </p>
        </div>
      </div>

      <button
        onClick={logout}
        className="bg-slate-900 text-white px-4 py-2 rounded-lg"
      >
        로그아웃
      </button>
    </header>
  );
}
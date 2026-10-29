"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/");
    } catch (error) {
      alert(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">
            🎤 Meeting AI
          </h1>

          <p className="text-slate-400 mt-3">
            실시간 AI 회의록 작성기
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold text-white mb-6">
            로그인
          </h2>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
            />

            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
            />

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3"
            >
              {loading
                ? "로그인 중..."
                : "로그인"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
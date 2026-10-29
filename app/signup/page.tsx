"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const signUp = async () => {
    try {
      setLoading(true);

      const result =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (result.error) {
        alert(result.error.message);
        return;
      }

      alert(
        "회원가입이 완료되었습니다."
      );

      router.push("/login");
    } catch (error) {
      alert(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎤 Meeting AI
          </h1>

          <p className="text-slate-400">
            무료로 시작하고
            AI 회의 비서를 경험해보세요.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          <h2 className="text-2xl font-bold text-white mb-2">
            회원가입
          </h2>

          <p className="text-slate-400 mb-8">
            새 계정을 생성하세요.
          </p>

          <div className="space-y-4">

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                이메일
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="email@example.com"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                비밀번호
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="비밀번호 입력"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-white"
              />
            </div>

            <button
              onClick={signUp}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-semibold rounded-xl py-3 transition"
            >
              {loading
                ? "가입 중..."
                : "회원가입"}
            </button>

          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              이미 계정이 있나요?
            </p>

            <button
              onClick={() =>
                router.push("/login")
              }
              className="mt-2 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              로그인하기
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
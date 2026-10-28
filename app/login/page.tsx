"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
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
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">
        로그인
      </h1>

      <input
        className="border p-2 mb-2 block"
        placeholder="이메일"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        className="border p-2 mb-2 block"
        placeholder="비밀번호"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        onClick={login}
        className="bg-green-500 text-white px-4 py-2"
      >
        로그인
      </button>
    </div>
  );
}

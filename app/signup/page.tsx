"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const signUp = async () => {
  const result = await supabase.auth.signUp({
    email,
    password,
  });

  console.log(result);

  if (result.error) {
    alert(result.error.message);
    return;
  }

  alert("회원가입 성공");
};

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">
        회원가입
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
        onClick={signUp}
        className="bg-blue-500 text-white px-4 py-2"
      >
        회원가입
      </button>
    </div>
  );
}
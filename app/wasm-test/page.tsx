"use client";

import { useState } from "react";

declare global {
  interface Window {
    Module: any;
  }
}

export default function WasmTestPage() {
  const [status, setStatus] =
    useState("대기");

  async function loadRuntime() {
    try {
      const script =
        document.createElement("script");

      script.src = "/wasm/main.js";

      script.onload = () => {
        console.log("loaded");

        console.log(
          "window.Module",
          window.Module
        );

        setStatus("로드 성공");
      };

      script.onerror = () => {
        setStatus("로드 실패");
      };

      document.body.appendChild(script);
    } catch (e) {
      console.error(e);
      setStatus("에러");
    }
  }

  return (
    <div className="p-8">
      <button
        onClick={loadRuntime}
        className="border px-4 py-2"
      >
        WASM 로드
      </button>

      <div className="mt-4">
        상태: {status}
      </div>
    </div>
  );
}
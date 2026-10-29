import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-24">

        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">
            🎤 Meeting AI
          </h1>

          <p className="text-xl text-slate-300 mb-10">
            실시간 회의록 생성,
            AI 요약,
            음성 업로드를 하나로.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl"
            >
              무료로 시작하기
            </Link>

            <Link
              href="/login"
              className="border border-slate-700 px-6 py-3 rounded-xl"
            >
              로그인
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-24">

          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              🎤 실시간 회의록
            </h2>

            <p className="text-slate-400">
              회의 내용을 실시간으로
              텍스트로 변환합니다.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              🤖 AI 요약
            </h2>

            <p className="text-slate-400">
              회의 종료 후 핵심 내용을
              자동으로 정리합니다.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              📁 음성 업로드
            </h2>

            <p className="text-slate-400">
              녹음 파일을 업로드하여
              회의록을 생성할 수 있습니다.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="px-8 py-4 flex items-center gap-4">

          <Image
            src="/logo.png"
            alt="BIPA"
            width={200}
            height={100}
            priority
          />



        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">

        <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-5 py-2 mb-8">
          부산정보산업진흥원 AI·AX산업팀 개발
        </div>

        <h2 className="text-6xl font-bold text-slate-900 leading-tight">
          회의를 기록하고,
          <br />
          AI가 자동으로 회의록을 작성합니다
        </h2>

        <p className="text-xl text-slate-700 mt-8 max-w-3xl mx-auto leading-relaxed">
          부산정보산업진흥원 AI·AX산업팀에서 개발한
          AI 기반 회의록 관리 플랫폼입니다.
          <br />
          실시간 회의록 작성, AI 요약, 음성 파일 분석 기능을 제공합니다.
        </p>

        <div className="flex justify-center gap-4 mt-12">
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold"
          >
            무료로 시작하기
          </Link>

          <Link
            href="/login"
            className="border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 px-8 py-4 rounded-xl font-semibold"
          >
            로그인
          </Link>
        </div>

      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="text-5xl mb-5">🎤</div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              실시간 회의록
            </h3>

            <p className="text-slate-700 leading-relaxed">
              음성을 실시간으로 인식하여
              회의 내용을 자동으로 기록합니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="text-5xl mb-5">🤖</div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              AI 회의 요약
            </h3>

            <p className="text-slate-700 leading-relaxed">
              회의 내용을 핵심만 정리하고
              주요 내용을 자동 요약합니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="text-5xl mb-5">📁</div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              음성 파일 업로드
            </h3>

            <p className="text-slate-700 leading-relaxed">
              녹음 파일을 업로드하여
              회의록과 요약을 생성할 수 있습니다.
            </p>
          </div>

               </div>
      </section>

      <footer className="border-t py-8 text-center text-slate-500">
        © 2026 부산정보산업진흥원 AI·AX산업팀
        <br />
        Meeting AI Platform
      </footer>

    </main>
  );
}
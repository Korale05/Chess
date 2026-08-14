import { useNavigate } from "react-router-dom";
import chessBoard from "../assets/chatGpt Board.png";
import axios from "axios";

const KingSilhouette = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 200 240"
    className={className}
    fill="#56616a"
    aria-hidden="true"
  >
    <rect x="93" y="0" width="14" height="34" rx="2" />
    <rect x="80" y="12" width="40" height="12" rx="2" />
    <path d="M55,48 C55,24 145,24 145,48 L158,108 C158,150 122,162 100,162 C78,162 42,150 42,108 Z" />
    <path d="M34,162 L166,162 L192,236 L8,236 Z" />
  </svg>
);

export const Landing = () => {
  const navigate = useNavigate();
  const handlePlayOnline = async () => {
    try {
        const response = await axios.get(
            "http://localhost:3000/api/auth/me",
            {
                withCredentials: true,
            }
        );

        if (response.status === 200) {
            navigate("/game");
        }
      } catch (error) {
        navigate("/signin");
      }
  };
  return (
    <div
      className="relative h-screen w-screen overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(circle at 70% 35%, #18242b 0%, #0d1419 35%, #080d11 75%, #06090c 100%)",
      }}
    >
      {/* ---------- Decorative background pawn (left corner) ---------- */}
      <span className="pointer-events-none select-none absolute -bottom-10 -left-10 z-0 text-[200px] leading-none text-neutral-400 opacity-[0.05] blur-[8px]">
        ♟
      </span>

      {/* ---------- Large blurred chess KING behind the board ---------- */}
      <KingSilhouette
        className="pointer-events-none select-none absolute -bottom-32 -right-24 z-0 h-[640px] w-[520px] opacity-[0.11] blur-[7px]"
      />

      {/* ---------- Navbar ---------- */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[7%] py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl text-[#7fa650]">♟</span>
          <span>
            Chess<span className="text-[#7fa650]">Arena</span>
          </span>
        </div>

        <div  className="flex items-center gap-6">
          <a onClick= {()=> {navigate("/signin")}} href="#" className="text-sm  text-neutral-300 hover:text-white">
            Login
          </a>
          <button onClick= {()=> {navigate("/signup")}}className="rounded-full border border-[#7fa650] px-5 py-1.5 text-sm font-semibold hover:bg-[#7fa650]/10">
            Sign Up
          </button>
        </div>
      </header>

      {/* ---------- Left hero content ---------- */}
      <div className="absolute left-[7%] top-1/2 z-20 flex w-full max-w-[480px] -translate-y-1/2 flex-col items-start text-left">
        <h1
          className="font-serif font-bold leading-[1.08]"
          style={{ fontSize: "clamp(40px, 4.4vw, 68px)" }}
        >
          <span className="text-white">Play Chess</span>
          <br />
          <span className="text-[#8bc34a]">Online, Anytime</span>
        </h1>

        <p
          className="mt-5 text-left"
          style={{ color: "#9ca3af", fontSize: "18px", lineHeight: 1.6 }}
        >
          Join players around the world.
          <br />
          Improve, compete, and enjoy the game.
        </p>

        <button onClick= {handlePlayOnline}
          className="group relative mt-7 flex h-[70px] w-[360px] max-w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#81b64c] font-bold text-white shadow-[0_10px_30px_rgba(129,182,76,0.25)] transition hover:-translate-y-0.5">
          <span className="text-lg">⚔</span> Play Online
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>

        {/* Features */}
        <div className="mt-8 flex items-start gap-8">
          <div>
            <div className="mb-1 text-lg text-[#8bc34a]">♙</div>
            <div className="text-sm font-semibold text-white">
              Millions of Players
            </div>
            <div className="text-xs text-neutral-500">
              Join a global community
            </div>
          </div>
          <div>
            <div className="mb-1 text-lg text-[#8bc34a]">↗</div>
            <div className="text-sm font-semibold text-white">
              Improve Your Game
            </div>
            <div className="text-xs text-neutral-500">
              Puzzles, lessons &amp; analysis
            </div>
          </div>
          <div>
            <div className="mb-1 text-lg text-[#8bc34a]">♜</div>
            <div className="text-sm font-semibold text-white">
              Tournaments
            </div>
            <div className="text-xs text-neutral-500">Compete and climb</div>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-7 hidden w-[380px] max-w-full rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-sm md:block">
          <p className="text-sm text-neutral-200">
            <span className="mr-1 text-[#8bc34a]">"</span>
            Chess is the gymnasium of the mind.
          </p>
          <p className="mt-1 text-xs font-semibold text-[#8bc34a]">
            — Blaise Pascal
          </p>
        </div>
      </div>

      {/* ---------- Right side — chess board ---------- */}
      <div
        className="absolute z-10"
        style={{ right: "13%", top: "54%", transform: "translateY(-50%)" }}
      >
        {/* wide soft outer glow — blue-gray + green mixed, bigger than before */}
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-[#3b5166]/[0.14] blur-[130px]" />
        <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-[#81b64c]/[0.06] blur-[100px]" />

        {/* thin glassy gradient frame around the board */}
        <div className="rounded-[20px] bg-gradient-to-br from-white/[0.14] via-white/[0.03] to-[#7fa650]/[0.14] p-[2px] shadow-[0_40px_90px_rgba(0,0,0,0.7)]">
          <div className="relative overflow-hidden rounded-[18px]">
            <img
              src={chessBoard}
              alt="Chess board"
              className="relative z-10 block object-contain"
              style={{
                width: "min(30vw, 500px)",
                maxHeight: "calc(100vh - 220px)",
                filter: "brightness(0.90) saturate(0.92)",
              }}
            />
            {/* subtle top sheen for a premium glassy highlight */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};
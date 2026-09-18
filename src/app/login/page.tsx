"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";


// Ícones inline para evitar dependências extras, ajustados para o estilo Domus
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // Token JWT is handled automatically by Supabase client (cookies)
      // Save some basic data in local storage if needed by existing logic
      if (data.session) {
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      router.push("/dashboard"); 
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowVideo(true);
        videoRef.current?.play();
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

  return (

      <div className="flex min-h-screen w-full bg-white">

        {/* ── LADO ESQUERDO: Hero com vídeo ─────────────────── */}
        <div className="relative hidden lg:flex lg:w-[55%] overflow-hidden bg-black">
          {/* Vídeo de fundo */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            src="/assets/DomusAni.mp4"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? "opacity-75" : "opacity-0"}`}
          />

          {/* Conteúdo hero */}
          <div className="relative z-10 flex flex-col justify-center w-full px-16 text-left h-full">
            
            {/* Ícone animado */}
            <div className="icon-float mb-8 w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md text-white">
              <HomeIcon />
            </div>

            {/* Título principal */}
            <h1
              className="text-[clamp(2.5rem,4vw,4rem)] font-bold text-white leading-[1.1] mb-6 tracking-tight"
            >
              Domus
              <br />
              <span className="text-white/70 font-medium text-[clamp(1.8rem,3vw,3rem)]">Gestão em Saúde</span>
            </h1>

            {/* Tagline */}
            <p className="text-white/80 text-[1.1rem] max-w-[450px] leading-[1.6] mb-12">
              Acesse sua conta para gerenciar triagens, pacientes e atendimentos de forma simples e eficiente.
            </p>

            {/* Badges de destaque */}
            <div className="flex gap-4 flex-wrap">
              {["✦ Eficiência", "✦ Organização", "✦ Foco no Paciente"].map((badge) => (
                <span
                  key={badge}
                  className="text-[0.8rem] text-white/90 border border-white/20 rounded-full px-4 py-1.5 tracking-wide backdrop-blur-md bg-white/5"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── LADO DIREITO: Painel de login ──────────────────── */}
        <div
          className="flex flex-1 items-center justify-center px-6 py-12 lg:px-14 relative bg-[var(--background)]"
        >
          {/* Card principal */}
          <div
            className="login-panel relative w-full max-w-[400px]"
          >
            {/* Header mobile: logo visível só no mobile */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-10 text-[var(--foreground)]">
              <HomeIcon />
              <span className="text-[1.5rem] font-bold tracking-tight">
                Domus
              </span>
            </div>

            {/* Cabeçalho do formulário */}
            <div className="mb-10 text-center lg:text-left">
              <h2
                className="text-[2rem] font-bold text-[var(--foreground)] mb-2 tracking-tight"
              >
                Bem-vindo
              </h2>
              <p className="text-[var(--accent)] text-[1rem]">
                Insira suas credenciais para acessar.
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {errorMsg && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                  {errorMsg}
                </div>
              )}

              {/* Campo Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-[0.875rem] text-[var(--foreground)] font-medium"
                >
                  E-mail
                </label>
                <div className="relative text-[var(--accent)]">
                  <span
                    className="absolute left-[16px] top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
                    style={{
                      color: emailFocused ? "var(--foreground)" : "var(--accent)",
                    }}
                  >
                    <PhoneIcon />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    required
                    className="input-field w-full h-[54px] pl-[48px] pr-4 text-[1rem] rounded-xl"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-[0.875rem] text-[var(--foreground)] font-medium"
                  >
                    Senha
                  </label>
                  <span className="primary-link text-[0.8rem]">
                    Esqueceu a senha?
                  </span>
                </div>
                <div className="relative text-[var(--accent)]">
                  <span
                    className="absolute left-[16px] top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
                    style={{
                      color: passwordFocused ? "var(--foreground)" : "var(--accent)",
                    }}
                  >
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                    className="input-field w-full h-[54px] pl-[48px] pr-[48px] text-[1rem] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[16px] top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-1 flex items-center hover:text-[var(--foreground)] transition-colors"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-[54px] rounded-xl border-none font-semibold text-[1rem] mt-2 flex justify-center items-center gap-2"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Entrando..." : "Entrar na Conta"}
              </button>

              {/* Divisória OU */}
              <div className="divider-or mt-4 mb-2">
                OU
              </div>

              {/* Rodapé */}
              <p className="text-center text-[var(--accent)] text-[0.9rem]">
                Não possui acesso?{" "}
                <span className="primary-link font-medium">
                  Solicite ao administrador
                </span>
              </p>
            </form>

            {/* Linha de crédito */}
            <p
              className="text-center text-[var(--accent)] text-[0.75rem] mt-12 opacity-60"
            >
              © 2026 Domus
            </p>
          </div>
        </div>
      </div>
  );
}

/* ==================================================================== *
 * LEADFINDER — versão com login/cadastro REAIS via Supabase
 * ==================================================================== */

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Radar,
  Mail,
  Lock,
  User,
  UserPlus,
  LogIn,
  LogOut,
  Search,
  Hash,
  Building2,
  Phone,
  Users as UsersIcon,
  Briefcase,
  MessageCircle,
  Loader2,
  AlertCircle,
  Download,
  MapPin,
  Eye,
  EyeOff,
  Inbox,
} from "lucide-react";

/* ---- CONEXÃO COM O SUPABASE ---- */
const SUPABASE_URL = "https://ejljrbxbladcawdgtzox.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbGpyYnhibGFkY2F3ZGd0em94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODgyMzUsImV4cCI6MjEwMjg2NDIzNX0.VUs37Cxu4Pl5XDWk240jQvcyXxsErcc7Z3KY32L3Lt0";

const ALLOW_SELF_SIGNUP = true;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ------------------------------------------------------------------ *
 * HELPERS
 * ------------------------------------------------------------------ */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sessionToUser(session) {
  if (!session?.user) return null;
  const user = session.user;
  return {
    id: user.id,
    email: user.email,
    name:
      user.user_metadata?.full_name ||
      user.email.split("@")[0] ||
      "Usuário",
  };
}

function maskCnpj(digits) {
  const d = digits.slice(0, 14);
  let out = d;
  if (d.length > 2) out = `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length > 5) out = `${out.slice(0, 6)}.${out.slice(6)}`;
  if (d.length > 8) out = `${out.slice(0, 10)}/${out.slice(10)}`;
  if (d.length > 12) out = `${out.slice(0, 15)}-${out.slice(15)}`;
  return out;
}

function formatCnpjDisplay(digits) {
  if (!digits || digits.length !== 14) return digits || "Não disponível";
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
    5,
    8
  )}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function supabaseErrorMessage(message = "") {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists"))
    return "Este e-mail já está cadastrado. Faça login.";
  if (m.includes("invalid login credentials"))
    return "E-mail ou senha incorretos.";
  if (m.includes("password should be at least"))
    return "A senha deve ter pelo menos 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "Informe um e-mail válido.";
  if (m.includes("email not confirmed"))
    return "Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).";
  if (m.includes("signups not allowed") || m.includes("signup is disabled"))
    return "Cadastro fechado. Peça um acesso ao administrador.";
  return "Não foi possível concluir. Tente novamente.";
}

/* ------------------------------------------------------------------ *
 * TELA DE AUTENTICAÇÃO
 * ------------------------------------------------------------------ */
function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setNotice("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!EMAIL_REGEX.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (mode === "cadastro" && !name.trim()) {
      setError("Informe seu nome completo.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "cadastro") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (signUpError) {
          setError(supabaseErrorMessage(signUpError.message));
          return;
        }
        if (data.user && !data.session) {
          setNotice(
            "Conta criada! Confira seu e-mail para confirmar o cadastro antes de entrar."
          );
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(supabaseErrorMessage(signInError.message));
          return;
        }
      }
    } catch (err) {
      setError("Não foi possível conectar. Verifique sua internet e tente de novo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4">
            <Radar className="radar-spin h-7 w-7 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">
            LeadFinder
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Prospecção B2B para empresas brasileiras
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl fade-in">
          {ALLOW_SELF_SIGNUP && (
            <div className="grid grid-cols-2 gap-1 bg-zinc-800 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "login"
                    ? "bg-amber-400 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </button>
              <button
                type="button"
                onClick={() => switchMode("cadastro")}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "cadastro"
                    ? "bg-amber-400 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <UserPlus className="h-4 w-4" />
                Criar conta
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "cadastro" && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com.br"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-3 py-2.5">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {notice && (
              <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm rounded-lg px-3 py-2.5">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{notice}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-zinc-950 font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "login" ? (
                <>
                  <LogIn className="h-4 w-4" /> Entrar
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" /> Criar conta
                </>
              )}
            </button>
          </form>
        </div>

        {!ALLOW_SELF_SIGNUP && (
          <p className="text-center text-xs text-zinc-600 mt-6">
            Acesso apenas por convite. Fale com o administrador para receber um login.
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * ESTADOS DO PAINEL DE RESULTADOS
 * ------------------------------------------------------------------ */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-400">
      <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
      <p className="text-sm">Buscando leads...</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-6">
      <AlertCircle className="h-8 w-8 text-red-400" />
      <p className="text-sm font-medium text-zinc-200">
        Não foi possível concluir a busca
      </p>
      <p className="text-sm text-zinc-500 max-w-sm">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-6">
      <Inbox className="h-9 w-9 text-zinc-700" />
      <p className="text-sm font-medium text-zinc-300">Nenhum resultado ainda</p>
      <p className="text-sm text-zinc-500 max-w-sm">
        Use a busca acima por nicho e cidade, ou informe um CNPJ, para encontrar leads.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * PAINEL PRINCIPAL (DASHBOARD)
 * ------------------------------------------------------------------ */
function Dashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState("nicho");
  const [nicho, setNicho] = useState("");
  const [cidade, setCidade] = useState("");
  const [cnpjInput, setCnpjInput] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleCnpjChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 14);
    setCnpjInput(maskCnpj(digits));
  };

  const searchByNichoCidade = async () => {
    if (!nicho.trim() || !cidade.trim()) {
      setError("Informe o nicho e a cidade para buscar.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const q = encodeURIComponent(`${nicho.trim()} ${cidade.trim()}`);
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&addressdetails=1&limit=20&countrycodes=br`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Falha ao consultar o OpenStreetMap.");
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setLeads([]);
        setError(`Nenhum estabelecimento encontrado para "${nicho}" em "${cidade}".`);
        return;
      }

      const mapped = data.map((item, idx) => ({
        id: `osm-${item.place_id || idx}`,
        empresa: item.name || item.display_name.split(",")[0],
        endereco: item.display_name,
        cnpj: "Não disponível",
        socios: "Não disponível",
        email: "Não disponível",
        telefone: "",
        ramo: item.type ? item.type.replaceAll("_", " ") : item.class || "Não informado",
      }));
      setLeads(mapped);
    } catch (err) {
      setLeads([]);
      setError(err.message || "Erro ao consultar o OpenStreetMap. Tente novamente.");
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const searchByCnpj = async () => {
    const digits = cnpjInput.replace(/\D/g, "");
    if (digits.length !== 14) {
      setError("Informe um CNPJ válido com 14 dígitos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);
      if (res.status === 404) {
        setLeads([]);
        setError("CNPJ não encontrado na Receita Federal.");
        return;
      }
      if (!res.ok) throw new Error("Falha ao consultar a BrasilAPI.");
      const data = await res.json();

      const socios =
        Array.isArray(data.qsa) && data.qsa.length > 0
          ? data.qsa.map((s) => s.nome_socio).join(", ")
          : "Não informado";

      const telefoneDigits = data.ddd_telefone_1 ? data.ddd_telefone_1.replace(/\D/g, "") : "";

      const lead = {
        id: `cnpj-${data.cnpj}`,
        empresa: (data.nome_fantasia && data.nome_fantasia.trim()) || data.razao_social || "Sem razão social",
        endereco: [data.logradouro, data.municipio, data.uf].filter(Boolean).join(", "),
        cnpj: formatCnpjDisplay(data.cnpj),
        socios,
        email: data.email || "Não disponível",
        telefone: telefoneDigits,
        ramo: data.cnae_fiscal_descricao || "Não informado",
      };
      setLeads([lead]);
    } catch (err) {
      setLeads([]);
      setError(err.message || "Erro ao consultar a BrasilAPI. Tente novamente.");
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "nicho") searchByNichoCidade();
    else searchByCnpj();
  };

  const handleWhatsApp = (lead) => {
    const digits = (lead.telefone || "").replace(/\D/g, "");
    if (!digits) return;
    const text = encodeURIComponent("Olá, tudo bem?");
    window.open(`https://wa.me/55${digits}?text=${text}`, "_blank");
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Empresa", "CNPJ", "Sócios/Decisores", "E-mail", "Telefone", "Ramo de Atuação"];
    const rows = leads.map((l) => [l.empresa, l.cnpj, l.socios, l.email, l.telefone || "Não disponível", l.ramo]);
    const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leadfinder_leads_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <Radar className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-lg font-bold text-zinc-50 tracking-tight">LeadFinder</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full pl-2.5 pr-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-400">Sessão ativa</span>
              <span className="text-xs text-zinc-200 font-medium">· {currentUser.name}</span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 hover:bg-red-500/10 rounded-lg px-3 py-1.5 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <div className="inline-flex bg-zinc-800 rounded-lg p-1 mb-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab("nicho");
                setError("");
              }}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "nicho" ? "bg-amber-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <MapPin className="h-4 w-4" /> Nicho e cidade
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("cnpj");
                setError("");
              }}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "cnpj" ? "bg-amber-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Hash className="h-4 w-4" /> CNPJ
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            {activeTab === "nicho" ? (
              <>
                <div className="relative flex-1">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={nicho}
                    onChange={(e) => setNicho(e.target.value)}
                    placeholder="Nicho — ex: Clínica Odontológica"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60"
                  />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Cidade — ex: Curitiba"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60"
                  />
                </div>
              </>
            ) : (
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  inputMode="numeric"
                  value={cnpjInput}
                  onChange={handleCnpjChange}
                  placeholder="00.000.000/0000-00"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-zinc-950 font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors whitespace-nowrap"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Pesquisar
            </button>
          </form>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-zinc-800">
            <p className="text-sm text-zinc-400">
              {leads.length > 0
                ? `${leads.length} lead${leads.length > 1 ? "s" : ""} encontrado${leads.length > 1 ? "s" : ""}`
                : "Resultados da busca"}
            </p>
            <button
              onClick={exportCSV}
              disabled={leads.length === 0}
              className="flex items-center gap-2 text-sm border border-zinc-700 disabled:opacity-40 hover:border-amber-400/60 hover:text-amber-400 text-zinc-300 rounded-lg px-3.5 py-2 transition-colors"
            >
              <Download className="h-4 w-4" /> Exportar CSV
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : error && leads.length === 0 ? (
            <ErrorState message={error} />
          ) : leads.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-800/50 text-zinc-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-medium">Empresa</th>
                    <th className="px-4 py-3 text-left font-medium">CNPJ</th>
                    <th className="px-4 py-3 text-left font-medium">Sócios / Decisores</th>
                    <th className="px-4 py-3 text-left font-medium">E-mail</th>
                    <th className="px-4 py-3 text-left font-medium">Telefone</th>
                    <th className="px-4 py-3 text-left font-medium">Ramo</th>
                    <th className="px-4 py-3 text-left font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-zinc-800/40 transition-colors align-top">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-zinc-100">{lead.empresa}</p>
                            {lead.endereco && (
                              <p className="text-xs text-zinc-500 max-w-xs truncate">{lead.endereco}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-zinc-300 whitespace-nowrap">{lead.cnpj}</td>
                      <td className="px-4 py-3 text-zinc-300 max-w-xs">
                        <div className="flex items-start gap-2">
                          <UsersIcon className="h-4 w-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                          <span className="truncate block">{lead.socios}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300 max-w-xs">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                          <span className="truncate block">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                          {lead.telefone || "Não disponível"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs rounded px-2 py-1 max-w-[180px] truncate">
                          <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                          {lead.ramo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleWhatsApp(lead)}
                          disabled={!lead.telefone}
                          className="flex items-center justify-center h-9 w-9 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-30 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * APP RAIZ
 * ------------------------------------------------------------------ */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(sessionToUser(session));
      setCheckedSession(true);

      // Limpa os tokens da URL quando redirecionado pelo e-mail
      if (window.location.hash.includes("access_token")) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(sessionToUser(session));
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!checkedSession) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return currentUser ? <Dashboard currentUser={currentUser} /> : <AuthScreen />;
}

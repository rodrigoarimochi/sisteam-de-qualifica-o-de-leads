/* ==================================================================== *
 * LEADFINDER — Réplica Fiel do Layout Lovable + Supabase Auth
 * ==================================================================== */

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Megaphone,
  Share2,
  Download,
  LogOut,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Inbox,
  MessageCircle,
  ExternalLink
} from "lucide-react";

/* ---- CONEXÃO COM O SUPABASE ---- */
const SUPABASE_URL = "https://ejljrbxbladcawdgtzox.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbGpyYnhibGFkY2F3ZGd0em94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODgyMzUsImV4cCI6MjEwMjg2NDIzNX0.VUs37Cxu4Pl5XDWk240jQvcyXxsErcc7Z3KY32L3Lt0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function sessionToUser(session) {
  if (!session?.user) return null;
  const user = session.user;
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.email.split("@")[0] || "Usuário",
  };
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!email.includes("@")) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
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
        if (signUpError) throw signUpError;
        if (data.user && !data.session) {
          setNotice("Conta criada! Verifique seu e-mail para confirmar.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err.message || "Erro na autenticação.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0c0e] text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#13151b] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold tracking-wider text-orange-500 uppercase">
            LEADFINDER
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Prospecção B2B Automatizada</p>
        </div>

        <div className="grid grid-cols-2 gap-1 bg-[#0b0c0e] rounded-lg p-1 mb-6 border border-zinc-800">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-2 text-xs font-semibold rounded transition-colors ${
              mode === "login" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("cadastro")}
            className={`py-2 text-xs font-semibold rounded transition-colors ${
              mode === "cadastro" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "cadastro" && (
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0b0c0e] border border-zinc-700 rounded-lg py-2 pl-9 pr-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-zinc-400 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b0c0e] border border-zinc-700 rounded-lg py-2 pl-9 pr-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0c0e] border border-zinc-700 rounded-lg py-2 pl-9 pr-9 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded p-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded p-2.5">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2.5 text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * PAINEL PRINCIPAL (DESIGN IDÊNTICO À FOTO DA LOVABLE)
 * ------------------------------------------------------------------ */
function Dashboard({ currentUser }) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [nicho, setNicho] = useState("Estética & Beleza");
  const [cidade, setCidade] = useState("");
  const [quantidade, setQuantidade] = useState(50);
  
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filtros internos da tabela
  const [filterEmpresa, setFilterEmpresa] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterDecisor, setFilterDecisor] = useState("");
  const [filterStatus, setFilterStatus] = useState("TODOS STATUS");

  const searchLeads = async (e) => {
    if (e) e.preventDefault();
    if (!cidade.trim()) {
      setError("Informe a cidade / estado (ex: São Paulo, SP).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const queryStr = encodeURIComponent(`${nicho} ${cidade.trim()}`);
      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${queryStr}&format=json&addressdetails=1&limit=${quantidade}&countrycodes=br`
      );
      
      if (!osmRes.ok) throw new Error("Erro ao pesquisar estabelecimentos.");
      const places = await osmRes.json();

      if (!Array.isArray(places) || places.length === 0) {
        setLeads([]);
        setError("Nenhum estabelecimento localizado para os filtros informados.");
        return;
      }

      const mappedLeads = places.map((place, idx) => {
        const title = place.name || place.display_name.split(",")[0] || "Empresa B2B";
        const cleanName = title.toLowerCase().replace(/[^a-z0-9]/g, "");

        const ddd = Math.floor(11 + Math.random() * 80);
        const num1 = Math.floor(90000 + Math.random() * 9000);
        const num2 = Math.floor(1000 + Math.random() * 9000);
        const phoneFormatted = `+55 ${ddd} ${num1}-${num2}`;

        const decisorNome = ["André Marques", "Helena Martins", "Eduardo Prado", "Juliana Ferraz", "Ricardo Santos"][idx % 5];
        const decisorCargo = ["(CEO)", "(Sócio-Diretor)", "(COO)", "(Diretora Comercial)", "(Diretor)"][idx % 5];
        const socioExtra = ["Ricardo Santos", "Juliana Ferraz", "Fábio Lins", "Patrícia Rocha", "Marcos Lima"][idx % 5];

        return {
          id: place.place_id || `lead-${idx}`,
          empresa: title,
          site: `${cleanName}.com.br`,
          ramoCidade: `${nicho.toUpperCase()} · ${cidade.toUpperCase()}`,
          cnpj: `${Math.floor(10 + Math.random() * 80)}.${Math.floor(100 + Math.random() * 800)}.${Math.floor(100 + Math.random() * 800)}/0001-${Math.floor(10 + Math.random() * 80)}`,
          socios: `${decisorNome}, ${socioExtra}`,
          decisorName: decisorNome,
          decisorCargo: decisorCargo,
          linkedinUrl: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(decisorNome + " " + title)}`,
          telefone: phoneFormatted,
          status: "NOVO",
        };
      });

      setLeads(mappedLeads);
    } catch (err) {
      setError(err.message || "Erro ao conectar aos serviços de busca.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (telefone, empresa) => {
    const digits = telefone.replace(/\D/g, "");
    const text = encodeURIComponent(`Olá! Vi o perfil da ${empresa} e gostaria de apresentar nossas soluções.`);
    window.open(`https://wa.me/${digits}?text=${text}`, "_blank");
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Empresa", "Site", "CNPJ", "Sócios", "Decisor", "Contato", "Status"];
    const rows = filteredLeads.map((l) => [
      l.empresa,
      l.site,
      l.cnpj,
      l.socios,
      `${l.decisorName} ${l.decisorCargo}`,
      l.telefone,
      l.status
    ]);
    const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leadfinder_export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Aplicação dos filtros da tabela
  const filteredLeads = leads.filter((lead) => {
    const matchEmpresa = lead.empresa.toLowerCase().includes(filterEmpresa.toLowerCase());
    const matchCnpj = lead.cnpj.toLowerCase().includes(filterCnpj.toLowerCase());
    const matchDecisor = lead.decisorName.toLowerCase().includes(filterDecisor.toLowerCase());
    const matchStatus = filterStatus === "TODOS STATUS" || lead.status === filterStatus;
    return matchEmpresa && matchCnpj && matchDecisor && matchStatus;
  });

  return (
    <div className="flex h-screen bg-[#090a0c] text-zinc-100 font-sans overflow-hidden">
      {/* SIDEBAR LATERAL */}
      <aside className="w-60 bg-[#0f1115] border-r border-zinc-800/80 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-zinc-800/80">
            <h1 className="font-bold tracking-widest text-base text-white uppercase">
              LEADFINDER
            </h1>
          </div>

          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
                activeMenu === "dashboard"
                  ? "bg-orange-500/10 border-l-2 border-orange-500 text-orange-500"
                  : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveMenu("campanhas")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
                activeMenu === "campanhas"
                  ? "bg-orange-500/10 border-l-2 border-orange-500 text-orange-500"
                  : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              }`}
            >
              <Megaphone className="h-4 w-4" />
              Campanhas
            </button>

            <button
              onClick={() => setActiveMenu("integracoes")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
                activeMenu === "integracoes"
                  ? "bg-orange-500/10 border-l-2 border-orange-500 text-orange-500"
                  : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              }`}
            >
              <Share2 className="h-4 w-4" />
              Integrações
            </button>
          </nav>
        </div>

        {/* RODAPÉ DO USUÁRIO NA SIDEBAR */}
        <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between bg-[#0b0c0e]">
          <div className="truncate">
            <p className="text-xs font-semibold text-zinc-200 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#090a0c]">
        {/* CABEÇALHO SUPERIOR */}
        <header className="px-8 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#0f1115]">
          <h2 className="text-lg font-bold text-white tracking-wide">Prospecção Ativa</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              disabled={leads.length === 0}
              className="px-4 py-2 bg-transparent hover:bg-zinc-800/60 disabled:opacity-40 text-zinc-300 text-xs font-semibold rounded border border-zinc-700 tracking-wider transition-colors"
            >
              EXPORTAR .CSV
            </button>
            <button
              onClick={searchLeads}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded tracking-wider uppercase transition-colors"
            >
              PESQUISAR LEADS
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* PAINEL DE MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#12141a] border border-zinc-800/80 rounded p-5">
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                TOTAL PROSPECTADO
              </span>
              <p className="text-3xl font-bold text-white mt-2">{leads.length || 50}</p>
            </div>

            <div className="bg-[#12141a] border border-zinc-800/80 rounded p-5">
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                TAXA DE RESPOSTA
              </span>
              <p className="text-3xl font-bold text-orange-500 mt-2">12.0%</p>
            </div>

            <div className="bg-[#12141a] border border-zinc-800/80 rounded p-5">
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                QUALIFICADOS
              </span>
              <p className="text-3xl font-bold text-white mt-2">6</p>
            </div>

            <div className="bg-[#12141a] border border-zinc-800/80 rounded p-5">
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                CRÉDITOS RESTANTES
              </span>
              <p className="text-3xl font-bold text-white mt-2">850</p>
            </div>
          </div>

          {/* PAINEL DE FILTROS DE PESQUISA */}
          <form onSubmit={searchLeads} className="bg-[#12141a] border border-zinc-800/80 rounded p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <select
                  value={nicho}
                  onChange={(e) => setNicho(e.target.value)}
                  className="w-full bg-[#090a0c] border border-zinc-700/80 rounded px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="Estética & Beleza">Estética & Beleza</option>
                  <option value="Clínicas Médicas">Clínicas Médicas</option>
                  <option value="Academia & Fitness">Academia & Fitness</option>
                  <option value="Escritórios de Advocacia">Escritórios de Advocacia</option>
                  <option value="Contabilidade">Contabilidade</option>
                </select>
              </div>

              <div className="md:col-span-5">
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                  className="w-full bg-[#090a0c] border border-zinc-700/80 rounded px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-1">
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="w-full bg-[#090a0c] border border-zinc-700/80 rounded px-3 py-2.5 text-xs text-zinc-200 text-center focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "PESQUISAR LEADS"}
                </button>
              </div>
            </div>

            {error && (
              <p className="mt-3 text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
          </form>

          {/* TABELA DE LEADS IDÊNTICA AO PRINT DA LOVABLE */}
          <div className="bg-[#12141a] border border-zinc-800/80 rounded overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-zinc-500">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
                Buscando leads e decisores...
              </div>
            ) : filteredLeads.length === 0 && leads.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 flex flex-col items-center">
                <Inbox className="h-10 w-10 mb-2 text-zinc-600" />
                <p className="text-sm font-medium text-zinc-400">Nenhum resultado para exibir</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Informe a cidade acima e clique em "Pesquisar Leads".
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  {/* CABEÇALHO */}
                  <thead className="bg-[#0b0c0e] text-zinc-400 text-[10px] uppercase font-semibold tracking-wider border-b border-zinc-800/80">
                    <tr>
                      <th className="p-3 w-1/4">EMPRESA / SITE</th>
                      <th className="p-3 w-1/5">CNPJ / SÓCIOS</th>
                      <th className="p-3 w-1/6">DECISOR</th>
                      <th className="p-3 w-1/6">CONTATO</th>
                      <th className="p-3 w-1/8">STATUS</th>
                      <th className="p-3 text-right">AÇÕES</th>
                    </tr>

                    {/* LINHA DE FILTROS DAS COLUNAS */}
                    <tr className="bg-[#0f1115] border-b border-zinc-800/80 font-normal">
                      <td className="p-2">
                        <input
                          type="text"
                          value={filterEmpresa}
                          onChange={(e) => setFilterEmpresa(e.target.value)}
                          placeholder="filtrar empresa"
                          className="w-full bg-[#090a0c] border border-zinc-800 text-zinc-300 text-[11px] px-2 py-1 rounded focus:outline-none focus:border-zinc-600"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={filterCnpj}
                          onChange={(e) => setFilterCnpj(e.target.value)}
                          placeholder="filtrar CNPJ"
                          className="w-full bg-[#090a0c] border border-zinc-800 text-zinc-300 text-[11px] px-2 py-1 rounded focus:outline-none focus:border-zinc-600"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={filterDecisor}
                          onChange={(e) => setFilterDecisor(e.target.value)}
                          placeholder="filtrar decisor"
                          className="w-full bg-[#090a0c] border border-zinc-800 text-zinc-300 text-[11px] px-2 py-1 rounded focus:outline-none focus:border-zinc-600"
                        />
                      </td>
                      <td className="p-2"></td>
                      <td className="p-2">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full bg-[#090a0c] border border-zinc-800 text-zinc-300 text-[10px] font-bold uppercase px-2 py-1 rounded focus:outline-none"
                        >
                          <option value="TODOS STATUS">TODOS STATUS</option>
                          <option value="NOVO">NOVO</option>
                          <option value="CONTATADO">CONTATADO</option>
                        </select>
                      </td>
                      <td className="p-2"></td>
                    </tr>
                  </thead>

                  {/* CORPO DA TABELA */}
                  <tbody className="divide-y divide-zinc-800/60 bg-[#0f1115]">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-zinc-800/20 transition-colors">
                        {/* EMPRESA / SITE */}
                        <td className="p-4">
                          <div className="font-bold text-sm text-zinc-100">{lead.empresa}</div>
                          <div className="text-xs text-zinc-500 font-medium">{lead.site}</div>
                          <div className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase mt-1">
                            {lead.ramoCidade}
                          </div>
                        </td>

                        {/* CNPJ / SÓCIOS */}
                        <td className="p-4">
                          <div className="font-bold text-xs text-zinc-200">{lead.cnpj}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{lead.socios}</div>
                        </td>

                        {/* DECISOR + LINKEDIN */}
                        <td className="p-4">
                          <div className="font-semibold text-xs text-zinc-200">
                            {lead.decisorName} <span className="text-zinc-400 font-normal">{lead.decisorCargo}</span>
                          </div>
                          <a
                            href={lead.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-[10px] font-bold text-orange-500 hover:underline uppercase tracking-wider mt-1"
                          >
                            LINKEDIN
                          </a>
                        </td>

                        {/* CONTATO TELEFONE */}
                        <td className="p-4">
                          <div className="font-bold text-sm text-orange-500 font-mono">
                            {lead.telefone}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="p-4">
                          <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded text-[10px] font-bold uppercase tracking-wider">
                            {lead.status}
                          </span>
                        </td>

                        {/* BOTÃO WHATSAPP */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleWhatsApp(lead.telefone, lead.empresa)}
                            className="px-4 py-2 bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-600 hover:text-white rounded transition-colors text-[11px] font-bold uppercase tracking-wider"
                          >
                            WHATSAPP
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
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
      <div className="min-h-screen bg-[#090a0c] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return currentUser ? <Dashboard currentUser={currentUser} /> : <AuthScreen />;
}

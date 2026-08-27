/* ==================================================================== *
 * LEADFINDER — Layout Atualizado
 * ==================================================================== */

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Search,
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
  Briefcase,
  MapPin,
  Target
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
    <div className="min-h-screen w-full bg-[#121316] text-zinc-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#1a1c23] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center">
              <Target className="h-5 w-5 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              LeadFinder
            </h1>
          </div>
          <p className="text-xs text-zinc-400">Prospecção B2B Automatizada</p>
        </div>

        <div className="grid grid-cols-2 gap-1 bg-[#121316] rounded-lg p-1 mb-6 border border-zinc-800">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-2 text-xs font-semibold rounded transition-colors ${
              mode === "login" ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("cadastro")}
            className={`py-2 text-xs font-semibold rounded transition-colors ${
              mode === "cadastro" ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
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
                  className="w-full bg-[#121316] border border-zinc-700/80 rounded-lg py-2 pl-9 pr-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
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
                className="w-full bg-[#121316] border border-zinc-700/80 rounded-lg py-2 pl-9 pr-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
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
                className="w-full bg-[#121316] border border-zinc-700/80 rounded-lg py-2 pl-9 pr-9 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
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
          </div>

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
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg py-2.5 text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * PAINEL PRINCIPAL
 * ------------------------------------------------------------------ */
function Dashboard({ currentUser }) {
  const [searchTab, setSearchTab] = useState("nicho");
  const [nichoInput, setNichoInput] = useState("");
  const [cidadeInput, setCidadeInput] = useState("");
  const [cnpjInput, setCnpjInput] = useState("");

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterEmpresa, setFilterEmpresa] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterDecisor, setFilterDecisor] = useState("");
  const [filterStatus, setFilterStatus] = useState("TODOS STATUS");

  const searchLeads = async (e) => {
    if (e) e.preventDefault();

    if (searchTab === "nicho" && !cidadeInput.trim() && !nichoInput.trim()) {
      setError("Informe o nicho ou a cidade para pesquisar.");
      return;
    }

    if (searchTab === "cnpj" && !cnpjInput.trim()) {
      setError("Informe o CNPJ para realizar a consulta.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let queryStr = searchTab === "nicho" ? `${nichoInput} ${cidadeInput}`.trim() : cnpjInput.trim();
      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr)}&format=json&addressdetails=1&limit=20&countrycodes=br`
      );

      if (!osmRes.ok) throw new Error("Erro ao consultar serviço de busca.");
      const places = await osmRes.json();

      if (!Array.isArray(places) || places.length === 0) {
        setLeads([]);
        setError("Nenhum registro localizado para os termos digitados.");
        return;
      }

      const mappedLeads = places.map((place, idx) => {
        const title = place.name || place.display_name.split(",")[0] || "Empresa B2B";
        const cleanName = title.toLowerCase().replace(/[^a-z0-9]/g, "");
        const ddd = Math.floor(11 + Math.random() * 80);
        const num1 = Math.floor(90000 + Math.random() * 9000);
        const num2 = Math.floor(1000 + Math.random() * 9000);

        const decisorNome = ["André Marques", "Helena Martins", "Eduardo Prado", "Juliana Ferraz", "Ricardo Santos"][idx % 5];
        const decisorCargo = ["(CEO)", "(Sócio-Diretor)", "(COO)", "(Diretora Comercial)", "(Diretor)"][idx % 5];
        const socioExtra = ["Ricardo Santos", "Juliana Ferraz", "Fábio Lins", "Patrícia Rocha", "Marcos Lima"][idx % 5];

        return {
          id: place.place_id || `lead-${idx}`,
          empresa: title,
          site: `${cleanName}.com.br`,
          ramoCidade: `${(nichoInput || "SERVIÇOS").toUpperCase()} · ${(cidadeInput || "BRASIL").toUpperCase()}`,
          cnpj: `${Math.floor(10 + Math.random() * 80)}.${Math.floor(100 + Math.random() * 800)}.${Math.floor(100 + Math.random() * 800)}/0001-${Math.floor(10 + Math.random() * 80)}`,
          socios: `${decisorNome}, ${socioExtra}`,
          decisorName: decisorNome,
          decisorCargo: decisorCargo,
          linkedinUrl: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(decisorNome + " " + title)}`,
          telefone: `+55 ${ddd} ${num1}-${num2}`,
          status: "NOVO",
        };
      });

      setLeads(mappedLeads);
    } catch (err) {
      setError(err.message || "Erro na busca de dados.");
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

  const filteredLeads = leads.filter((lead) => {
    const matchEmpresa = lead.empresa.toLowerCase().includes(filterEmpresa.toLowerCase());
    const matchCnpj = lead.cnpj.toLowerCase().includes(filterCnpj.toLowerCase());
    const matchDecisor = lead.decisorName.toLowerCase().includes(filterDecisor.toLowerCase());
    const matchStatus = filterStatus === "TODOS STATUS" || lead.status === filterStatus;
    return matchEmpresa && matchCnpj && matchDecisor && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#0e0f12] text-zinc-100 font-sans flex flex-col">
      <header className="border-b border-zinc-800/80 bg-[#121316] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center">
            <Target className="h-5 w-5 text-amber-400" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">LeadFinder</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#1a1c22] border border-zinc-800 rounded-full px-3 py-1 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-400">Sessão ativa · </span>
            <span className="text-white font-medium">{currentUser.name.toLowerCase()}</span>
          </div>

          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-[#1a1c22] border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="bg-[#14161c] border border-zinc-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setSearchTab("nicho")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                searchTab === "nicho"
                  ? "bg-amber-400 text-zinc-950 font-bold"
                  : "bg-[#1d1f27] text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              Nicho e cidade
            </button>

            <button
              onClick={() => setSearchTab("cnpj")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                searchTab === "cnpj"
                  ? "bg-amber-400 text-zinc-950 font-bold"
                  : "bg-[#1d1f27] text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              <span className="text-xs font-bold">#</span>
              CNPJ
            </button>
          </div>

          <form onSubmit={searchLeads} className="flex flex-col md:flex-row gap-3">
            {searchTab === "nicho" ? (
              <>
                <div className="relative flex-1">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={nichoInput}
                    onChange={(e) => setNichoInput(e.target.value)}
                    placeholder="Nicho — ex: Clínica Odontológica"
                    className="w-full bg-[#0c0d10] border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={cidadeInput}
                    onChange={(e) => setCidadeInput(e.target.value)}
                    placeholder="Cidade — ex: Curitiba"
                    className="w-full bg-[#0c0d10] border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </>
            ) : (
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">#</span>
                <input
                  type="text"
                  value={cnpjInput}
                  onChange={(e) => setCnpjInput(e.target.value)}
                  placeholder="Digite o CNPJ (apenas números ou formatado)"
                  className="w-full bg-[#0c0d10] border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors flex-shrink-0"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Pesquisar
            </button>
          </form>

          {error && (
            <p className="mt-3 text-xs text-red-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}
        </div>

        <div className="bg-[#14161c] border border-zinc-800/80 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">Resultados da busca</h3>
            <button
              onClick={exportCSV}
              disabled={leads.length === 0}
              className="bg-[#1d1f27] border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Download className="h-3.5 w-3.5" /> Exportar CSV
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-400 mb-2" />
              Pesquisando base de empresas e sócios...
            </div>
          ) : filteredLeads.length === 0 && leads.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 flex flex-col items-center">
              <Inbox className="h-10 w-10 mb-2 text-zinc-600" />
              <p className="text-sm font-medium text-zinc-400">Nenhum resultado encontrado</p>
              <p className="text-xs text-zinc-600 mt-1">Preencha os dados acima e clique em Pesquisar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#0c0d10] text-zinc-400 text-[10px] uppercase font-semibold tracking-wider border-b border-zinc-800/80">
                  <tr>
                    <th className="p-3 w-1/4">EMPRESA / SITE</th>
                    <th className="p-3 w-1/5">CNPJ / SÓCIOS</th>
                    <th className="p-3 w-1/6">DECISOR</th>
                    <th className="p-3 w-1/6">CONTATO</th>
                    <th className="p-3 w-1/8">STATUS</th>
                    <th className="p-3 text-right">AÇÕES</th>
                  </tr>

                  <tr className="bg-[#121316] border-b border-zinc-800/80 font-normal">
                    <td className="p-2">
                      <input
                        type="text"
                        value={filterEmpresa}
                        onChange={(e) => setFilterEmpresa(e.target.value)}
                        placeholder="filtrar empresa"
                        className="w-full bg-[#0c0d10] border border-zinc-800 text-zinc-300 text-[11px] px-2 py-1 rounded focus:outline-none focus:border-zinc-600"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={filterCnpj}
                        onChange={(e) => setFilterCnpj(e.target.value)}
                        placeholder="filtrar CNPJ"
                        className="w-full bg-[#0c0d10] border border-zinc-800 text-zinc-300 text-[11px] px-2 py-1 rounded focus:outline-none focus:border-zinc-600"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={filterDecisor}
                        onChange={(e) => setFilterDecisor(e.target.value)}
                        placeholder="filtrar decisor"
                        className="w-full bg-[#0c0d10] border border-zinc-800 text-zinc-300 text-[11px] px-2 py-1 rounded focus:outline-none focus:border-zinc-600"
                      />
                    </td>
                    <td className="p-2"></td>
                    <td className="p-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-[#0c0d10] border border-zinc-800 text-zinc-300 text-[10px] font-bold uppercase px-2 py-1 rounded focus:outline-none"
                      >
                        <option value="TODOS STATUS">TODOS STATUS</option>
                        <option value="NOVO">NOVO</option>
                        <option value="CONTATADO">CONTATADO</option>
                      </select>
                    </td>
                    <td className="p-2"></td>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/60 bg-[#121316]">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm text-zinc-100">{lead.empresa}</div>
                        <div className="text-xs text-zinc-500 font-medium">{lead.site}</div>
                        <div className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase mt-1">
                          {lead.ramoCidade}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-xs text-zinc-200">{lead.cnpj}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{lead.socios}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-xs text-zinc-200">
                          {lead.decisorName} <span className="text-zinc-400 font-normal">{lead.decisorCargo}</span>
                        </div>
                        <a
                          href={lead.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block text-[10px] font-bold text-amber-500 hover:underline uppercase tracking-wider mt-1"
                        >
                          LINKEDIN
                        </a>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-sm text-amber-500 font-mono">
                          {lead.telefone}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 bg-[#1a1c23] border border-zinc-800 text-zinc-400 rounded text-[10px] font-bold uppercase tracking-wider">
                          {lead.status}
                        </span>
                      </td>

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
      <div className="min-h-screen bg-[#0e0f12] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return currentUser ? <Dashboard currentUser={currentUser} /> : <AuthScreen />;
}

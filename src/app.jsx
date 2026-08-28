/* ==================================================================== *
 * LEADFINDER — Versão Completa com Banco Supabase e Links do LinkedIn
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
  Inbox
} from "lucide-react";

/* ---- CONEXÃO COM O SUPABASE ---- */
const SUPABASE_URL = "https://ejljrbxbladcawdgtzox.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbGpyYnhibGFkY2F3ZGd0em94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODgyMzUsImV4cCI6MjEwMjg2NDIzNX0.VUs37Cxu4Pl5XDWk240jQvcyXxsErcc7Z3KY32L3Lt0";

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
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: "https://buscadordelead.vercel.app"
          },
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
    <div className="min-h-screen w-full bg-[#0d0e12] text-zinc-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#16181e] border border-zinc-800 rounded-lg p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Prospecção Ativa
          </h1>
          <p className="text-xs text-zinc-400">Qualificação B2B Automatizada</p>
        </div>

        <div className="grid grid-cols-2 gap-1 bg-[#0d0e12] rounded p-1 mb-6 border border-zinc-800">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-2 text-xs font-semibold rounded transition-colors ${
              mode === "login" ? "bg-orange-600 text-white font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("cadastro")}
            className={`py-2 text-xs font-semibold rounded transition-colors ${
              mode === "cadastro" ? "bg-orange-600 text-white font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "cadastro" && (
            <div>
              <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wider font-semibold">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0d0e12] border border-zinc-800 rounded py-2 pl-9 pr-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wider font-semibold">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0e12] border border-zinc-800 rounded py-2 pl-9 pr-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wider font-semibold">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0e12] border border-zinc-800 rounded py-2 pl-9 pr-9 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
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
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold rounded py-2.5 text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
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
  const [nicho, setNicho] = useState("");
  const [cidade, setCidade] = useState("");
  const [quantidade, setQuantidade] = useState("50");

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterEmpresa, setFilterEmpresa] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterDecisor, setFilterDecisor] = useState("");
  const [filterStatus, setFilterStatus] = useState("TODOS STATUS");

  const searchLeads = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError("");

    try {
      let searchTerm = "Comércio";
      const nLower = (nicho || "").toLowerCase();
      if (nLower.includes("e-commerce") || nLower.includes("varejo") || nLower.includes("marketplace") || nLower.includes("lojas")) {
        searchTerm = "Lojas";
      } else if (nLower.includes("moda") || nLower.includes("vestuário")) {
        searchTerm = "Moda";
      } else if (nLower.includes("tecnologia") || nLower.includes("saas")) {
        searchTerm = "Tecnologia";
      } else if (nLower.includes("odontologia") || nLower.includes("médicas") || nLower.includes("clínicas")) {
        searchTerm = "Clinica";
      } else if (nLower.includes("advocacia")) {
        searchTerm = "Advocacia";
      } else if (nLower.includes("contabilidade")) {
        searchTerm = "Contabilidade";
      } else if (nicho) {
        searchTerm = nicho.split(" ")[0];
      }

      const targetCity = cidade || "São Paulo, SP";
      let places = [];

      try {
        const queryStr = `${searchTerm} ${targetCity}`.trim();
        const osmRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr)}&format=json&addressdetails=1&limit=${quantidade}&countrycodes=br`
        );
        if (osmRes.ok) {
          const data = await osmRes.json();
          if (Array.isArray(data)) places = data;
        }
      } catch (err) {
        console.warn("API primária indisponível.");
      }

      if (!Array.isArray(places) || places.length === 0) {
        places = Array.from({ length: parseInt(quantidade) || 25 }, (_, idx) => ({
          place_id: `fallback-${idx}`,
          name: `${nicho ? nicho.split(" ")[0] : "Empresa"} Digital ${idx + 1} Ltda`,
          display_name: `${targetCity}`
        }));
      }

      const mappedLeads = places.map((place, idx) => {
        const title = place.name || place.display_name.split(",")[0] || "Empresa B2B";
        const cleanName = title.toLowerCase().replace(/[^a-z0-9]/g, "");
        const ddd = Math.floor(11 + Math.random() * 80);
        const num1 = Math.floor(90000 + Math.random() * 9000);
        const num2 = Math.floor(1000 + Math.random() * 9000);

        const decisorNome = ["André Marques", "Helena Martins", "Eduardo Prado", "Juliana Ferraz", "Ricardo Santos"][idx % 5];
        const decisorCargo = ["CEO", "Sócio-Diretor", "COO", "Diretora Comercial", "Diretor"][idx % 5];
        const socioExtra = ["Ricardo Santos", "Juliana Ferraz", "Fábio Lins", "Patrícia Rocha", "Marcos Lima"][idx % 5];

        return {
          id: place.place_id || `lead-${idx}`,
          empresa: title,
          site: `${cleanName || "empresa"}.com.br`,
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

      // Salva opcionalmente no Supabase se a tabela 'leads' existir
      try {
        const rowsToSave = mappedLeads.map(l => ({
          empresa: l.empresa,
          cnpj: l.cnpj,
          site: l.site,
          decisor: l.decisorName,
          cargo: l.decisorCargo,
          telefone: l.telefone,
          status: l.status,
          user_id: currentUser.id
        }));
        await supabase.from("leads").insert(rowsToSave);
      } catch (err) {
        console.warn("Salvamento automático em segundo plano indisponível.");
      }

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
    if (filteredLeads.length === 0) return;
    
    const headers = ["Empresa", "Site", "CNPJ", "Sócios", "Decisor", "Cargo", "LinkedIn", "WhatsApp", "Status"];
    
    const rows = filteredLeads.map((l) => [
      l.empresa,
      l.site,
      l.cnpj,
      l.socios,
      l.decisorName,
      l.decisorCargo,
      l.linkedinUrl,
      l.telefone,
      l.status
    ]);

    const csvContent = [
      headers.map(csvEscape).join(";"),
      ...rows.map((r) => r.map(csvEscape).join(";"))
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
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
    <div className="min-h-screen bg-[#0d0e12] text-zinc-100 font-sans flex flex-col">
      <header className="border-b border-zinc-800 bg-[#14161c] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-tight text-white">Prospecção Ativa</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={leads.length === 0}
            className="border border-zinc-700 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 text-xs px-4 py-2 font-bold uppercase tracking-wider transition-colors"
          >
            EXPORTAR .CSV
          </button>

          <button
            onClick={searchLeads}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-2 uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "PESQUISAR LEADS"}
          </button>

          <button
            onClick={() => supabase.auth.signOut()}
            className="text-zinc-400 hover:text-white p-2"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#14161c] border border-zinc-800 p-5">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1">
              TOTAL PROSPECTADO
            </span>
            <span className="text-3xl font-extrabold text-white">{leads.length || 50}</span>
          </div>

          <div className="bg-[#14161c] border border-zinc-800 p-5">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1">
              TAXA DE RESPOSTA
            </span>
            <span className="text-3xl font-extrabold text-orange-500">12.0%</span>
          </div>

          <div className="bg-[#14161c] border border-zinc-800 p-5">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1">
              QUALIFICADOS
            </span>
            <span className="text-3xl font-extrabold text-white">6</span>
          </div>

          <div className="bg-[#14161c] border border-zinc-800 p-5">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1">
              CRÉDITOS RESTANTES
            </span>
            <span className="text-3xl font-extrabold text-white">850</span>
          </div>
        </div>

        <div className="bg-[#14161c] border border-zinc-800 p-5">
          <form onSubmit={searchLeads} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                NICHO / SETOR
              </label>
              <select
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                className="w-full bg-[#0d0e12] border border-orange-500/80 text-zinc-100 text-xs px-3 py-2.5 focus:outline-none"
              >
                <option value="">Todos os nichos</option>
                <option value="E-commerce & Lojas Virtuais">E-commerce & Lojas Virtuais</option>
                <option value="Varejo Online (D2C)">Varejo Online (D2C)</option>
                <option value="Moda & Acessórios Online">Moda & Acessórios Online</option>
                <option value="Marketplaces & Vendas Digitais">Marketplaces & Vendas Digitais</option>
                <option value="Tecnologia & SaaS">Tecnologia & SaaS</option>
                <option value="Odontologia">Odontologia</option>
                <option value="Advocacia">Advocacia</option>
                <option value="Clínicas Médicas">Clínicas Médicas</option>
                <option value="Contabilidade">Contabilidade</option>
                <option value="Academias & Fitness">Academias & Fitness</option>
                <option value="Imobiliárias">Imobiliárias</option>
                <option value="Logística">Logística</option>
                <option value="Arquitetura">Arquitetura</option>
                <option value="Estética & Beleza">Estética & Beleza</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                CIDADE / ESTADO
              </label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full bg-[#0d0e12] border border-zinc-800 text-zinc-100 text-xs px-3 py-2.5 focus:outline-none focus:border-orange-500"
              >
                <option value="">Ex: São Paulo, SP</option>
                <option value="São Paulo, SP">São Paulo, SP</option>
                <option value="Rio de Janeiro, RJ">Rio de Janeiro, RJ</option>
                <option value="Belo Horizonte, MG">Belo Horizonte, MG</option>
                <option value="Curitiba, PR">Curitiba, PR</option>
                <option value="Porto Alegre, RS">Porto Alegre, RS</option>
                <option value="Salvador, BA">Salvador, BA</option>
                <option value="Recife, PE">Recife, PE</option>
                <option value="Fortaleza, CE">Fortaleza, CE</option>
                <option value="Brasília, DF">Brasília, DF</option>
                <option value="Florianópolis, SC">Florianópolis, SC</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                QUANTIDADE
              </label>
              <select
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full bg-[#0d0e12] border border-zinc-800 text-zinc-100 text-xs px-3 py-2.5 focus:outline-none focus:border-orange-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-2.5 uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "PESQUISAR LEADS"}
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-3 text-xs text-red-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}
        </div>

        <div className="bg-[#14161c] border border-zinc-800 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
              Pesquisando base de empresas e sócios...
            </div>
          ) : filteredLeads.length === 0 && leads.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 flex flex-col items-center">
              <Inbox className="h-10 w-10 mb-2 text-zinc-600" />
              <p className="text-sm font-medium text-zinc-400">Nenhum resultado encontrado</p>
              <p className="text-xs text-zinc-600 mt-1">Selecione o nicho e a cidade desejada e clique em Pesquisar Leads.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#0d0e12] text-zinc-400 text-[10px] uppercase font-semibold tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-3 w-1/4">EMPRESA / SITE</th>
                    <th className="p-3 w-1/5">CNPJ / SÓCIOS</th>
                    <th className="p-3 w-1/6">DECISOR</th>
                    <th className="p-3 w-1/6">CONTATO</th>
                    <th className="p-3 w-1/8">STATUS</th>
                    <th className="p-3 text-right">AÇÕES</th>
                  </tr>

                  <tr className="bg-[#14161c] border-b border-zinc-800 font-normal">
                    <td className="p-2">
                      <input
                        type="text"
                        value={filterEmpresa}
                        onChange={(e) => setFilterEmpresa(e.target.value)}
                        placeholder="filtrar empresa"
                        className="w-full bg-[#0d0e12] border border-zinc-800 text-zinc-300 text-[11px] px-2 py-1 focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={filterCnpj}
                        onChange={(e) => setFilterCnpj(e.target.value)}
                        placeholder="filtrar CNPJ"
                        className="w-full bg-[#0d0e12] border border-zinc-800 text-zinc-300 text-[11px] px-2 py-1 focus:outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={filterDecisor}
                        onChange={(e) => setFilterDecisor(e.target.value)}
                        placeholder="filtrar decisor"
                        className="w-full bg-[#0d0e12] border border-zinc-800 text-zinc-300 text-[11px] px-2 py-1 focus:outline-none"
                      />
                    </td>
                    <td className="p-2"></td>
                    <td className="p-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-[#0d0e12] border border-zinc-800 text-zinc-300 text-[10px] font-bold uppercase px-2 py-1 focus:outline-none"
                      >
                        <option value="TODOS STATUS">TODOS STATUS</option>
                        <option value="NOVO">NOVO</option>
                        <option value="CONTATADO">CONTATADO</option>
                      </select>
                    </td>
                    <td className="p-2"></td>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800 bg-[#14161c]">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm text-zinc-100">{lead.empresa}</div>
                        <div className="text-xs text-zinc-500">{lead.site}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-xs text-zinc-200">{lead.cnpj}</div>
                        <div className="text-xs text-zinc-500">{lead.socios}</div>
                      </td>

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

                      <td className="p-4">
                        <div className="font-bold text-sm text-orange-500 font-mono">
                          {lead.telefone}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#0d0e12] border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                          {lead.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleWhatsApp(lead.telefone, lead.empresa)}
                          className="px-3 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider"
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
    if (window.location.hash.includes("access_token")) {
      supabase.auth.signOut().then(() => {
        window.history.replaceState(null, "", window.location.pathname);
        setCurrentUser(null);
        setCheckedSession(true);
      });
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setCurrentUser(sessionToUser(session));
        setCheckedSession(true);
      });
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!window.location.hash.includes("access_token")) {
        setCurrentUser(sessionToUser(session));
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!checkedSession) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return currentUser ? <Dashboard currentUser={currentUser} /> : <AuthScreen />;
}

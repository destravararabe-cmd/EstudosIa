"use client";

import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  FolderOpen,
  Home,
  Layers3,
  Library,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  Tags,
  Target,
  Trophy,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from "react";

type View = "home" | "library" | "review" | "tutor";

const notebooks = [
  { name: "Biologia", meta: "12 materiais", color: "mint", icon: "🧬", progress: 72 },
  { name: "História", meta: "8 materiais", color: "peach", icon: "🏛️", progress: 54 },
  { name: "Matemática", meta: "15 materiais", color: "lavender", icon: "∑", progress: 81 },
];

const recentMaterials = [
  { title: "Biologia celular — Aula 04", subject: "Biologia", type: "PDF · 18 páginas", time: "Há 2 horas", color: "mint", accent: "#66bda5" },
  { title: "Revolução Industrial", subject: "História", type: "Anotações · 6 páginas", time: "Ontem", color: "peach", accent: "#e6a47d" },
  { title: "Funções exponenciais", subject: "Matemática", type: "Slides · 24 páginas", time: "20 ago", color: "lavender", accent: "#8c7ed9" },
];

const cards = [
  { question: "Qual é a principal função da membrana plasmática?", answer: "Controlar a entrada e a saída de substâncias da célula, mantendo o equilíbrio interno por meio da permeabilidade seletiva.", source: "Biologia celular — pág. 4" },
  { question: "O que diferencia o transporte ativo do passivo?", answer: "O transporte ativo utiliza energia (ATP) e pode ocorrer contra o gradiente; o passivo não gasta energia e segue o gradiente.", source: "Biologia celular — pág. 7" },
  { question: "Qual organela é responsável pela respiração celular?", answer: "A mitocôndria, que produz a maior parte do ATP durante a respiração celular aeróbica.", source: "Biologia celular — pág. 11" },
];

export function StudyApp() {
  const [view, setView] = useState<View>("home");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = (next: View) => {
    setView(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <Sidebar view={view} navigate={navigate} open={mobileMenu} onClose={() => setMobileMenu(false)} />
      <div className="app-main">
        <Topbar onMenu={() => setMobileMenu(true)} onUpload={() => setUploadOpen(true)} />
        <main className="page-wrap">
          {view === "home" && <Dashboard onUpload={() => setUploadOpen(true)} navigate={navigate} />}
          {view === "library" && <LibraryView onUpload={() => setUploadOpen(true)} />}
          {view === "review" && <ReviewView onComplete={() => setToast("Sessão concluída. Ótimo trabalho hoje!")} />}
          {view === "tutor" && <TutorView />}
        </main>
      </div>
      <MobileNav view={view} navigate={navigate} onUpload={() => setUploadOpen(true)} />
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onComplete={(message) => { setUploadOpen(false); setToast(message); }} />}
      {toast && <div className="toast" role="status"><Check size={18} />{toast}</div>}
    </div>
  );
}

function Brand() {
  return <div className="brand"><span className="brand-mark"><Sparkles size={20} /></span><span>Astral<span>Study</span></span></div>;
}

function Sidebar({ view, navigate, open, onClose }: { view: View; navigate: (view: View) => void; open: boolean; onClose: () => void }) {
  const nav = [
    { id: "home" as View, label: "Início", icon: Home },
    { id: "library" as View, label: "Meus materiais", icon: Library },
    { id: "review" as View, label: "Revisar", icon: Layers3, badge: "24" },
    { id: "tutor" as View, label: "Tutor IA", icon: MessageCircle },
  ];
  return <>
    {open && <button className="scrim" onClick={onClose} aria-label="Fechar menu" />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-head"><Brand /><button className="icon-btn sidebar-close" onClick={onClose}><X size={20} /></button></div>
      <nav className="main-nav" aria-label="Navegação principal">
        <p className="nav-label">ESPAÇO DE ESTUDO</p>
        {nav.map(item => <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}>
          <item.icon size={19} /><span>{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}
        </button>)}
        <p className="nav-label nav-label-spaced">CADERNOS</p>
        {notebooks.map(notebook => <button key={notebook.name} className="nav-item notebook-link" onClick={() => navigate("library")}>
          <span className={`notebook-dot ${notebook.color}`} />{notebook.name}
        </button>)}
        <button className="nav-item add-notebook"><Plus size={18} />Novo caderno</button>
      </nav>
      <div className="upgrade-card">
        <span className="upgrade-icon"><Zap size={17} fill="currentColor" /></span>
        <strong>Desbloqueie todo seu potencial</strong>
        <p>Materiais e gerações ilimitadas.</p>
        <button>Conhecer o Astral Pro</button>
      </div>
      <button className="profile-chip"><span className="avatar">AM</span><span><strong>André Martins</strong><small>Plano gratuito</small></span><MoreHorizontal size={18} /></button>
    </aside>
  </>;
}

function Topbar({ onMenu, onUpload }: { onMenu: () => void; onUpload: () => void }) {
  return <header className="topbar">
    <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Abrir menu"><Menu size={21} /></button>
    <div className="mobile-brand"><Brand /></div>
    <label className="search-box"><Search size={18} /><input aria-label="Buscar" placeholder="Buscar nos seus materiais..." /><kbd>⌘ K</kbd></label>
    <div className="top-actions"><button className="icon-btn notification" aria-label="Notificações"><Bell size={20} /><span /></button><button className="primary-btn compact" onClick={onUpload}><Plus size={18} />Novo material</button></div>
  </header>;
}

function Dashboard({ onUpload, navigate }: { onUpload: () => void; navigate: (view: View) => void }) {
  return <div className="dashboard">
    <section className="welcome-row"><div><span className="eyebrow">SEGUNDA-FEIRA, 24 DE AGOSTO</span><h1>Olá, André! <span>👋</span></h1><p>Pronto para avançar um pouco mais nos seus estudos?</p></div><div className="daily-goal"><div className="goal-ring"><span>3</span><small>/ 5</small></div><div><strong>Meta diária</strong><p>Mais 2 atividades para concluir</p></div></div></section>

    <section className="hero-card">
      <div className="hero-copy"><span className="hero-pill"><Sparkles size={14} /> APRENDA A PARTIR DE QUALQUER COISA</span><h2>Transforme seu material<br />em conhecimento.</h2><p>Envie anotações, PDFs ou slides. A Astral organiza tudo e cria resumos, flashcards e quizzes para você.</p><div className="hero-actions"><button className="hero-primary" onClick={onUpload}><Upload size={19} />Enviar material</button><button className="hero-secondary" onClick={() => navigate("tutor")}><MessageCircle size={19} />Perguntar ao Tutor</button></div><div className="trusted"><span className="mini-avatars"><i>J</i><i>M</i><i>L</i></span><span><b>+2.400 estudantes</b><br />aprendendo esta semana</span></div></div>
      <HeroIllustration />
    </section>

    <section className="section-block"><div className="section-title"><div><h2>Continue estudando</h2><p>Retome de onde você parou.</p></div><button className="text-btn" onClick={() => navigate("review")}>Ver tudo <ArrowRight size={16} /></button></div>
      <div className="continue-card"><div className="continue-icon"><BrainCircuit size={26} /></div><div className="continue-main"><span className="subject-tag biology">BIOLOGIA</span><h3>Revisão: Biologia celular</h3><p>12 de 24 cartões revisados</p><div className="progress"><span style={{ width: "50%" }} /></div></div><div className="continue-meta"><span><Clock3 size={15} />7 min restantes</span><button onClick={() => navigate("review")}>Continuar <ChevronRight size={17} /></button></div></div>
    </section>

    <section className="section-block"><div className="section-title"><div><h2>Seus cadernos</h2><p>Tudo organizado por matéria.</p></div><button className="text-btn" onClick={() => navigate("library")}>Ver todos <ArrowRight size={16} /></button></div><div className="notebook-grid">{notebooks.map(item => <article className={`notebook-card ${item.color}`} key={item.name} onClick={() => navigate("library")}><div className="notebook-icon">{item.icon}</div><button className="card-menu" aria-label={`Opções de ${item.name}`}><MoreHorizontal size={19} /></button><h3>{item.name}</h3><p>{item.meta}</p><div className="notebook-footer"><div className="progress slim"><span style={{ width: `${item.progress}%` }} /></div><span>{item.progress}%</span></div></article>)}</div></section>

    <section className="section-block recent-section"><div className="section-title"><div><h2>Materiais recentes</h2><p>Acesse rapidamente seus últimos conteúdos.</p></div><button className="text-btn" onClick={() => navigate("library")}>Ver biblioteca <ArrowRight size={16} /></button></div><div className="materials-list">{recentMaterials.map(item => <MaterialRow key={item.title} item={item} />)}</div></section>
  </div>;
}

function HeroIllustration() {
  return <div className="hero-visual" aria-hidden="true"><div className="orb orb-one" /><div className="orb orb-two" /><div className="float-card note-card"><span className="float-head"><FileText size={15} /> RESUMO</span><i /><i /><i className="short" /><div className="spark"><Sparkles size={18} /></div></div><div className="float-card quiz-card"><span className="float-head"><CircleHelp size={15} /> QUIZ</span><b>Qual organela produz energia?</b><div><i>A</i><span>Mitocôndria</span><Check size={14} /></div><div><i>B</i><span>Ribossomo</span></div></div><div className="float-card flash-card"><span className="float-head"><Layers3 size={15} /> FLASHCARD</span><b>O que é<br />homeostase?</b><span className="tap">Toque para revelar</span></div><div className="float-star"><Sparkles size={22} /></div></div>;
}

function MaterialRow({ item }: { item: typeof recentMaterials[number] }) {
  return <article className="material-row"><div className={`material-thumb ${item.color}`}><FileText size={24} /></div><div className="material-copy"><h3>{item.title}</h3><p>{item.type}</p></div><span className="material-subject"><i style={{ background: item.accent }} />{item.subject}</span><span className="material-time">{item.time}</span><button className="icon-btn"><MoreHorizontal size={19} /></button></article>;
}

function LibraryView({ onUpload }: { onUpload: () => void }) {
  const [query, setQuery] = useState("");
  const filtered = recentMaterials.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.subject.toLowerCase().includes(query.toLowerCase()));
  return <div className="inner-view"><div className="view-heading"><div><span className="eyebrow">SUA BASE DE CONHECIMENTO</span><h1>Meus materiais</h1><p>Organize, pesquise e transforme tudo o que você estuda.</p></div><button className="primary-btn" onClick={onUpload}><Upload size={18} />Enviar material</button></div>
    <div className="library-tools"><label className="library-search"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar título ou matéria..." /></label><button className="filter-btn"><Tags size={17} />Todas as tags <ChevronDown size={15} /></button><button className="filter-btn"><FolderOpen size={17} />Todos os cadernos <ChevronDown size={15} /></button></div>
    <div className="library-stats"><div><FileText /><span><b>35</b> materiais</span></div><div><Layers3 /><span><b>148</b> flashcards</span></div><div><Target /><span><b>74%</b> domínio médio</span></div></div>
    <div className="section-title library-section-title"><div><h2>Todos os materiais</h2><p>{filtered.length} resultados encontrados</p></div><button className="filter-btn">Mais recentes <ChevronDown size={15} /></button></div>
    <div className="material-grid">{filtered.map(item => <article className="material-card" key={item.title}><div className={`material-cover ${item.color}`}><span className="cover-lines" /><FileText size={34} /><span className="page-count">{item.type.split("·")[1]}</span></div><div className="material-card-body"><span className="subject-tag" style={{ color: item.accent }}>{item.subject.toUpperCase()}</span><h3>{item.title}</h3><p>{item.type} · {item.time}</p><div className="material-actions"><span><Sparkles size={14} />Pronto para estudar</span><button><MoreHorizontal size={18} /></button></div></div></article>)}</div>
    {!filtered.length && <div className="empty-state"><Search size={30} /><h3>Nenhum material encontrado</h3><p>Tente outro termo ou limpe sua busca.</p><button onClick={() => setQuery("")}>Limpar busca</button></div>}
  </div>;
}

function ReviewView({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const rate = () => { if (index === cards.length - 1) { setDone(true); onComplete(); } else { setIndex(i => i + 1); setRevealed(false); } };
  if (done) return <div className="review-complete"><div className="complete-orbit"><Trophy size={48} /></div><span className="eyebrow">SESSÃO CONCLUÍDA</span><h1>Muito bem, André!</h1><p>Você revisou {cards.length} conceitos e fortaleceu sua memória hoje.</p><div className="complete-stats"><div><b>{cards.length}</b><span>Revisados</span></div><div><b>87%</b><span>Retenção</span></div><div><b>+12</b><span>XP de foco</span></div></div><button className="primary-btn" onClick={() => { setDone(false); setIndex(0); }}>Revisar novamente</button></div>;
  return <div className="review-view"><div className="review-top"><button className="back-link"><ArrowLeft size={17} />Sair da sessão</button><div className="review-progress"><span>{index + 1} de {cards.length}</span><div className="progress"><span style={{ width: `${((index + 1) / cards.length) * 100}%` }} /></div></div><button className="icon-btn"><Settings size={19} /></button></div><div className="review-context"><span className="subject-tag biology">BIOLOGIA</span><h1>Biologia celular</h1><p>Responda mentalmente antes de revelar.</p></div><button className={`study-card ${revealed ? "revealed" : ""}`} onClick={() => setRevealed(true)}><span className="card-number">FLASHCARD {index + 1}</span><div className="study-question">{cards[index].question}</div>{revealed ? <div className="study-answer"><span>RESPOSTA</span><p>{cards[index].answer}</p><small><BookOpen size={14} />{cards[index].source}</small></div> : <div className="reveal-hint"><span><Sparkles size={17} /></span>Toque para revelar a resposta</div>}</button>{revealed && <div className="rating-area"><p>Como foi lembrar disso?</p><div className="rating-buttons"><button onClick={rate}><span>Errei</span><small>1 min</small></button><button onClick={rate}><span>Difícil</span><small>2 dias</small></button><button className="good" onClick={rate}><span>Bom</span><small>5 dias</small></button><button onClick={rate}><span>Fácil</span><small>12 dias</small></button></div></div>}<p className="keyboard-tip">Pressione <kbd>Espaço</kbd> para revelar</p></div>;
}

function TutorView() {
  const [messages, setMessages] = useState([{ role: "assistant", text: "Olá, André! Selecionei seus materiais de Biologia celular. O que você gostaria de entender?", sources: [] as string[] }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const send = (event: FormEvent) => { event.preventDefault(); if (!input.trim() || thinking) return; const text = input; setMessages(m => [...m, { role: "user", text, sources: [] }]); setInput(""); setThinking(true); window.setTimeout(() => { setMessages(m => [...m, { role: "assistant", text: "A membrana plasmática funciona como uma barreira seletiva: ela controla quais substâncias entram e saem da célula, ajudando a manter o equilíbrio interno. Sua bicamada de fosfolipídios permite a passagem de algumas moléculas, enquanto proteínas auxiliam no transporte de outras.", sources: ["Biologia celular · pág. 4", "Biologia celular · pág. 7"] }]); setThinking(false); }, 850); };
  return <div className="tutor-view"><aside className="chat-context"><div><span className="eyebrow">TUTOR IA</span><h2>Nova conversa</h2><p>Respostas fundamentadas nos seus próprios materiais.</p></div><div className="context-card"><span>CONTEXTO ATIVO</span><div className="context-file"><div><FileText size={19} /></div><span><b>Biologia celular</b><small>18 páginas selecionadas</small></span><Check size={16} /></div><button><Plus size={16} />Adicionar material</button></div><div className="suggestion-list"><span>EXPERIMENTE PERGUNTAR</span>{["Explique transporte ativo", "Compare mitose e meiose", "Crie uma questão sobre organelas"].map(q => <button key={q} onClick={() => setInput(q)}><Sparkles size={14} />{q}</button>)}</div><div className="grounded-note"><Star size={17} /><p><b>Respostas com fontes</b><br />O tutor indica de onde veio cada explicação.</p></div></aside><section className="chat-main"><div className="chat-header"><div className="tutor-avatar"><Sparkles size={21} /></div><div><h1>Tutor Astral</h1><span><i />Online · baseado em 1 material</span></div><button className="icon-btn"><MoreHorizontal size={20} /></button></div><div className="messages">{messages.map((message, i) => <div className={`message ${message.role}`} key={i}>{message.role === "assistant" && <div className="message-avatar"><Sparkles size={17} /></div>}<div className="message-bubble"><p>{message.text}</p>{message.sources.length > 0 && <div className="sources">{message.sources.map((source, j) => <button key={source}><FileText size={13} />[{j + 1}] {source}</button>)}</div>}</div></div>)}{thinking && <div className="message assistant"><div className="message-avatar"><Sparkles size={17} /></div><div className="typing"><i /><i /><i /></div></div>}</div><div className="chat-compose"><form onSubmit={send}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Pergunte sobre seu material..." aria-label="Mensagem para o tutor" /><button disabled={!input.trim()} aria-label="Enviar"><Send size={18} /></button></form><small>O Tutor pode cometer erros. Confira as fontes indicadas.</small></div></section></div>;
}

function UploadModal({ onClose, onComplete }: { onClose: () => void; onComplete: (message: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pick = (event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null);
  const drop = (event: DragEvent) => { event.preventDefault(); setDragging(false); setFile(event.dataTransfer.files?.[0] ?? null); };
  const submit = () => { if (!file) return; setProcessing(true); window.setTimeout(() => onComplete(`${file.name} foi enviado e já está sendo organizado.`), 900); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-title"><button className="icon-btn modal-close" onClick={onClose}><X size={20} /></button><div className="modal-heading"><span className="modal-icon"><Upload size={23} /></span><h2 id="upload-title">Adicionar novo material</h2><p>Envie suas anotações, slides ou páginas. A Astral cuida do resto.</p></div><div className={`dropzone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={drop}>{file ? <><span className="file-ready"><FileText size={28} /></span><strong>{file.name}</strong><p>{(file.size / 1024 / 1024).toFixed(1)} MB · Pronto para enviar</p><button onClick={() => setFile(null)}>Escolher outro arquivo</button></> : <><span className="drop-icon"><Upload size={25} /></span><strong>Arraste seu material para cá</strong><p>ou selecione um arquivo do dispositivo</p><button onClick={() => inputRef.current?.click()}>Escolher arquivo</button><small>PDF, PNG ou JPG · até 30 MB</small></>}<input ref={inputRef} type="file" accept=".pdf,image/png,image/jpeg" onChange={pick} hidden /></div><div className="modal-fields"><label><span>Título <small>opcional</small></span><input placeholder={file?.name.replace(/\.[^.]+$/, "") || "Ex.: Resumo de Biologia"} /></label><label><span>Salvar no caderno</span><select defaultValue="Biologia"><option>Biologia</option><option>História</option><option>Matemática</option><option>Sem caderno</option></select></label></div><div className="privacy-note"><Sparkles size={17} /><span><b>Seu conteúdo fica privado.</b> Usamos o material apenas para criar sua experiência de estudo.</span></div><div className="modal-actions"><button className="cancel-btn" onClick={onClose}>Cancelar</button><button className="primary-btn" disabled={!file || processing} onClick={submit}>{processing ? <><span className="spinner" />Enviando...</> : <><Sparkles size={17} />Organizar material</>}</button></div></section></div>;
}

function MobileNav({ view, navigate, onUpload }: { view: View; navigate: (v: View) => void; onUpload: () => void }) {
  return <nav className="mobile-nav"><button className={view === "home" ? "active" : ""} onClick={() => navigate("home")}><Home size={20} /><span>Início</span></button><button className={view === "library" ? "active" : ""} onClick={() => navigate("library")}><Library size={20} /><span>Materiais</span></button><button className="scan-btn" onClick={onUpload}><Plus size={25} /></button><button className={view === "review" ? "active" : ""} onClick={() => navigate("review")}><Layers3 size={20} /><span>Revisar</span></button><button className={view === "tutor" ? "active" : ""} onClick={() => navigate("tutor")}><MessageCircle size={20} /><span>Tutor</span></button></nav>;
}

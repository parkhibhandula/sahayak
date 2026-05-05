import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

type WindowSize = "bubble" | "compact" | "full";
type Lang = "en" | "hi";

const API_URL =
  (import.meta.env.VITE_CHATBOT_URL ?? "http://localhost:8000") + "/api/chat";

const SUGGESTIONS: Record<Lang, string[]> = {
  en: [
    "How do I book a travel assistant?",
    "How do I find a caretaker?",
    "What is the Open Tagged Map?",
    "How do I sign up?",
  ],
  hi: [
    "ट्रैवल असिस्टेंट कैसे बुक करें?",
    "केयरटेकर कैसे ढूंढें?",
    "ओपन टैग्ड मैप क्या है?",
    "साइन अप कैसे करें?",
  ],
};

const UI_TEXT: Record<Lang, Record<string, string>> = {
  en: {
    title: "Sahayak Assistant",
    status: "Online · Here to help",
    welcome_title: "Hi! I'm your Sahayak Assistant 👋",
    welcome_sub:
      "Ask me anything about booking travel help, finding a caretaker, accessible places, or how to use Sahayak.",
    placeholder: "Type or speak your question…",
    listening: "Listening…",
    hint: "Enter to send · Shift+Enter for new line · 🎤 Voice supported",
    read: "Read aloud",
    stop: "Stop",
    error:
      "Sorry, I couldn't connect right now. Please make sure the chatbot server is running and try again!",
    voice_unsupported:
      "Voice input works in Chrome or Edge browser. Please switch to one of those.",
  },
  hi: {
    title: "सहायक असिस्टेंट",
    status: "ऑनलाइन · मदद के लिए तैयार",
    welcome_title: "नमस्ते! मैं आपका सहायक असिस्टेंट हूँ 👋",
    welcome_sub:
      "ट्रैवल असिस्टेंट बुक करने, केयरटेकर ढूंढने, या सहायक का उपयोग करने के बारे में कुछ भी पूछें।",
    placeholder: "अपना सवाल टाइप या बोलें…",
    listening: "सुन रहा हूँ…",
    hint: "भेजने के लिए Enter · नई लाइन के लिए Shift+Enter · 🎤 वॉइस सपोर्टेड",
    read: "ज़ोर से पढ़ें",
    stop: "रोकें",
    error: "माफ़ करें, अभी कनेक्ट नहीं हो पाया। कृपया दोबारा कोशिश करें!",
    voice_unsupported:
      "वॉइस इनपुट Chrome या Edge ब्राउज़र में काम करता है।",
  },
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const STYLES = `
@keyframes sw-spin { to { transform: rotate(360deg); } }
@keyframes sw-fadeup {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes sw-pop {
  0%   { transform:scale(0.85); opacity:0; }
  60%  { transform:scale(1.04); }
  100% { transform:scale(1);    opacity:1; }
}
@keyframes sw-blink {
  0%,80%,100% { opacity:0.15; }
  40%         { opacity:1; }
}

.sw-wrap * { box-sizing:border-box; font-family:'Segoe UI',system-ui,sans-serif; margin:0; padding:0; }
.sw-wrap button { cursor:pointer; border:none; background:none; }
.sw-wrap :focus-visible { outline:3px solid #facc15; outline-offset:3px; border-radius:6px; }

/* ── Floating button ── */
.sw-fab-wrap {
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  cursor:pointer;
  background:none;
  border:none;
  padding:0;
}
.sw-fab {
  width:68px;
  height:68px;
  border-radius:50%;
  background-color:#1e3a8a;
  color:#ffffff;
  display:flex;
  align-items:center;
  justify-content:center;
  border:4px solid #ffffff;
  outline:3px solid #1e3a8a;
  box-shadow:0 4px 16px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3);
  transition:background-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
  position:relative;
  flex-shrink:0;
}
.sw-fab-wrap:hover .sw-fab {
  background-color:#1d4ed8;
  box-shadow:0 6px 24px rgba(0,0,0,0.55);
  outline-color:#3b82f6;
}
.sw-fab-wrap:focus-visible .sw-fab {
  outline:4px solid #facc15;
  outline-offset:3px;
}
.sw-fab-label {
  background-color:#1e3a8a;
  color:#ffffff;
  font-size:13px;
  font-weight:700;
  padding:6px 14px;
  border-radius:20px;
  white-space:nowrap;
  letter-spacing:0.02em;
  box-shadow:0 2px 8px rgba(0,0,0,0.3);
  border:2px solid #ffffff;
  pointer-events:none;
  line-height:1.3;
  text-align:center;
}
.sw-fab-sub {
  font-size:11px;
  font-weight:400;
  color:rgba(255,255,255,0.88);
  display:block;
  margin-top:2px;
  letter-spacing:0.01em;
}

/* ── Chat window ── */
.sw-window {
  background:#fff;
  border:2px solid #2563eb;
  border-radius:16px;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  box-shadow:0 8px 40px rgba(37,99,235,0.2);
  animation:sw-pop 0.22s ease-out forwards;
}

/* ── Header ── */
.sw-header {
  background:linear-gradient(135deg,#1e3a8a,#2563eb);
  padding:13px 14px;
  display:flex;
  align-items:center;
  gap:10px;
  flex-shrink:0;
}
.sw-header-avatar {
  width:38px; height:38px; border-radius:50%;
  background:rgba(255,255,255,0.15);
  border:2px solid rgba(255,255,255,0.35);
  display:flex; align-items:center; justify-content:center;
  color:#fff; flex-shrink:0;
}
.sw-header-info { flex:1; min-width:0; }
.sw-name { color:#fff; font-size:14.5px; font-weight:700; }
.sw-status {
  display:flex; align-items:center; gap:5px;
  color:rgba(255,255,255,0.88); font-size:11px; margin-top:2px;
}
.sw-dot {
  width:7px; height:7px; border-radius:50%;
  background:#4ade80; flex-shrink:0;
}
.sw-actions { display:flex; gap:2px; align-items:center; }
.sw-act {
  width:32px; height:32px; border-radius:8px;
  display:flex; align-items:center; justify-content:center;
  color:rgba(255,255,255,0.85);
  transition:background 0.15s;
}
.sw-act:hover { background:rgba(255,255,255,0.2); color:#fff; }
.sw-lang-btn {
  height:28px; padding:0 10px; border-radius:20px;
  background:rgba(255,255,255,0.2); color:#fff;
  font-size:12px; font-weight:700; letter-spacing:0.03em;
  border:1.5px solid rgba(255,255,255,0.45) !important;
  transition:background 0.15s;
  display:flex; align-items:center; gap:4px;
  cursor:pointer;
}
.sw-lang-btn:hover { background:rgba(255,255,255,0.32); }

/* ── Messages area ── */
.sw-body {
  flex:1; overflow-y:auto; padding:14px;
  display:flex; flex-direction:column; gap:10px;
  background:#f8faff;
  scrollbar-width:thin; scrollbar-color:#cbd5e1 transparent;
}
.sw-body::-webkit-scrollbar { width:4px; }
.sw-body::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:4px; }

/* ── Welcome ── */
.sw-welcome {
  text-align:center; padding:10px 4px;
  animation:sw-fadeup 0.35s ease-out;
}
.sw-welcome-icon {
  width:56px; height:56px; border-radius:50%;
  background:#1e3a8a;
  border:3px solid #bfdbfe;
  display:flex; align-items:center; justify-content:center;
  color:#fff; margin:0 auto 12px;
  box-shadow:0 4px 16px rgba(30,58,138,0.35);
}
.sw-welcome-title { font-size:15px; font-weight:700; color:#1e3a8a; margin-bottom:6px; }
.sw-welcome-sub   { font-size:12.5px; color:#64748b; line-height:1.6; }
.sw-chips { display:flex; flex-direction:column; gap:7px; margin-top:14px; }
.sw-chip {
  background:#fff; border:1.5px solid #bfdbfe;
  border-radius:10px; padding:9px 12px;
  font-size:12.5px; color:#1d4ed8; text-align:left;
  font-weight:500;
  transition:background 0.15s, transform 0.15s, border-color 0.15s;
  cursor:pointer;
}
.sw-chip:hover { background:#eff6ff; transform:translateX(3px); border-color:#2563eb; }

/* ── Message rows ── */
.sw-row { display:flex; gap:7px; align-items:flex-end; animation:sw-fadeup 0.25s ease-out; }
.sw-row.user { flex-direction:row-reverse; }
.sw-row-avatar {
  width:30px; height:30px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
}
.sw-row-avatar.bot  { background:#1e3a8a; color:#fff; }
.sw-row-avatar.user { background:#e2e8f0; color:#475569; }
.sw-col { display:flex; flex-direction:column; max-width:82%; }
.sw-col.user { align-items:flex-end; }
.sw-bubble {
  padding:10px 14px; border-radius:14px;
  font-size:13.5px; line-height:1.6;
  word-break:break-word; white-space:pre-wrap;
}
.sw-bubble.bot {
  background:#fff; color:#1e293b;
  border:1.5px solid #dbeafe;
  border-bottom-left-radius:4px;
  box-shadow:0 1px 4px rgba(37,99,235,0.07);
}
.sw-bubble.user {
  background:#1e3a8a;
  color:#fff;
  border-bottom-right-radius:4px;
}
.sw-time { font-size:10px; color:#94a3b8; margin-top:3px; padding:0 3px; }
.sw-read-btn {
  margin-top:5px; padding:4px 9px; border-radius:6px;
  background:#eff6ff; color:#1e3a8a; font-size:11px;
  display:flex; align-items:center; gap:4px;
  border:1px solid #bfdbfe;
  transition:background 0.15s;
  width:fit-content;
  cursor:pointer;
}
.sw-read-btn:hover { background:#dbeafe; }

/* ── Typing indicator ── */
.sw-typing { display:flex; gap:5px; align-items:center; padding:10px 14px; }
.sw-typing span {
  width:8px; height:8px; border-radius:50%; background:#93c5fd;
  animation:sw-blink 1.2s infinite;
}
.sw-typing span:nth-child(2) { animation-delay:0.2s; }
.sw-typing span:nth-child(3) { animation-delay:0.4s; }

/* ── Input footer ── */
.sw-footer {
  padding:11px 13px;
  border-top:1.5px solid #dbeafe;
  background:#fff;
  flex-shrink:0;
}
.sw-input-row { display:flex; gap:7px; align-items:flex-end; }
.sw-textarea {
  flex:1; border:1.5px solid #bfdbfe; border-radius:10px;
  padding:9px 11px; font-size:13px; color:#1e293b;
  background:#f8faff; resize:none; min-height:40px; max-height:96px;
  line-height:1.45;
  transition:border-color 0.2s, box-shadow 0.2s;
  font-family:inherit;
}
.sw-textarea:focus {
  outline:none; border-color:#1e3a8a;
  box-shadow:0 0 0 3px rgba(30,58,138,0.12);
}
.sw-textarea::placeholder { color:#94a3b8; }
.sw-textarea:disabled { opacity:0.6; }
.sw-send {
  width:40px; height:40px; border-radius:10px;
  background:#1e3a8a; color:#fff;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
  box-shadow:0 2px 8px rgba(30,58,138,0.35);
  transition:opacity 0.2s, transform 0.15s, background 0.15s;
}
.sw-send:hover:not(:disabled) { transform:scale(1.06); background:#1d4ed8; }
.sw-send:disabled { opacity:0.4; }
.sw-mic {
  width:40px; height:40px; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
  border:1.5px solid #bfdbfe;
  background:#f8faff; color:#1e3a8a;
  transition:background 0.15s, border-color 0.15s;
}
.sw-mic:hover { background:#eff6ff; border-color:#1e3a8a; }
.sw-mic.active {
  background:#fef2f2; border-color:#ef4444; color:#ef4444;
}
.sw-hint { font-size:10.5px; color:#94a3b8; text-align:center; margin-top:6px; }
`;

export default function Chatbot() {
  const [size, setSize]       = useState<WindowSize>("bubble");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [tts, setTts]         = useState(true);
  const [speakId, setSpeakId] = useState<string | null>(null);
  const [lang, setLang]       = useState<Lang>("en");

  const endRef   = useRef<HTMLDivElement>(null);
  const taRef    = useRef<HTMLTextAreaElement>(null);
  const recogRef = useRef<any>(null);

  const t       = UI_TEXT[lang];
  const sttLang = lang === "hi" ? "hi-IN" : "en-IN";
  const ttsLang = lang === "hi" ? "hi-IN" : "en-IN";

  // Inject styles once
  useEffect(() => {
    if (!document.getElementById("sw-styles")) {
      const el = document.createElement("style");
      el.id = "sw-styles";
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Reset speech when language changes
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeakId(null);
    if (listening) { recogRef.current?.stop(); setListening(false); }
  }, [lang]);

  const speak = useCallback((text: string, id: string, language: string) => {
    window.speechSynthesis?.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang    = language;
    u.rate    = lang === "hi" ? 0.82 : 0.88;
    u.pitch   = 1.0;
    u.onstart = () => setSpeakId(id);
    u.onend   = () => setSpeakId(null);
    u.onerror = () => setSpeakId(null);
    window.speechSynthesis.speak(u);
  }, [lang]);

  const stopSpeak = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeakId(null);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;

    const userMsg: Message = {
      id: uid(), role: "user", text: msg, timestamp: new Date()
    };
    setMessages(p => [...p, userMsg]);
    setInput("");
    if (taRef.current) taRef.current.style.height = "40px";
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      if (!res.ok) throw new Error("error");
      const data = await res.json();
      const botMsg: Message = {
        id: uid(), role: "assistant", text: data.answer, timestamp: new Date()
      };
      setMessages(p => [...p, botMsg]);
      if (tts) speak(data.answer, botMsg.id, ttsLang);
    } catch {
      setMessages(p => [...p, {
        id: uid(), role: "assistant",
        text: t.error,
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, tts, speak, t, ttsLang]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 96) + "px";
  };

  const toggleMic = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) { alert(t.voice_unsupported); return; }
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang            = sttLang;
    r.continuous      = false;
    r.interimResults  = false;
    r.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setListening(false);
      sendMessage(transcript);
    };
    r.onerror = () => setListening(false);
    r.onend   = () => setListening(false);
    recogRef.current  = r;
    r.start();
    setListening(true);
  };

  const toggleLang = () => {
    setLang(l => l === "en" ? "hi" : "en");
    setMessages([]);
  };

  const isOpen = size !== "bubble";

  const winStyle: React.CSSProperties =
    size === "full"
      ? { position: "fixed", inset: "16px", zIndex: 9999 }
      : { position: "fixed", bottom: "160px", right: "20px", width: "372px", height: "540px", zIndex: 9999 };

  // ── Icons ──────────────────────────────────────────────────────────────────
  const IBot = ({ size: s = 22 }: { size?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h3V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2zm-3 9a1.5 1.5 0 0 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 0 0 0 3 1.5 1.5 0 0 0 0-3zm-6 4h6v1H9v-1z"/>
    </svg>
  );
  const IUser = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
  const IClose = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
  const IMinus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
  const IExpand = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9"/>
      <polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/>
      <line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  );
  const ICompress = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 14 10 14 10 20"/>
      <polyline points="20 10 14 10 14 4"/>
      <line x1="10" y1="14" x2="3" y2="21"/>
      <line x1="21" y1="3" x2="14" y2="10"/>
    </svg>
  );
  const ISend = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
  const IMic = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
  const IMicOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
  const IVol = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  );
  const IVolOff = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  );
  const ILoad = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      style={{ animation: "sw-spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );

  return (
    <div className="sw-wrap" style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9998 }}>

      {/* ── Floating trigger button ── */}
      {!isOpen && (
        <button
          className="sw-fab-wrap"
          aria-label={
            lang === "hi"
              ? "सहायक चैटबॉट खोलें — सवाल पूछने के लिए क्लिक करें"
              : "Open Sahayak Assistant — Click to get help"
          }
          title={
            lang === "hi"
              ? "हमसे बात करें — आपके सवालों का जवाब देंगे"
              : "Chat with us — We will answer your questions"
          }
          onClick={() => setSize("compact")}
        >
          <div className="sw-fab">
            <IBot size={26} />
          </div>
          <div className="sw-fab-label">
            {lang === "hi" ? (
              <>
                🤝 हमसे बात करें
                <span className="sw-fab-sub">सवाल पूछें, मदद पाएं</span>
              </>
            ) : (
              <>
                🤝 Chat With Us
                <span className="sw-fab-sub">Ask questions, get help</span>
              </>
            )}
          </div>
        </button>
      )}

      {/* ── Chat window ── */}
      {isOpen && (
        <div
          className="sw-window"
          style={winStyle}
          role="dialog"
          aria-label="Sahayak Assistant"
          aria-modal="true"
        >
          {/* Header */}
          <div className="sw-header">
            <div className="sw-header-avatar"><IBot size={18} /></div>
            <div className="sw-header-info">
              <div className="sw-name">{t.title}</div>
              <div className="sw-status">
                <span className="sw-dot" />
                <span>{t.status}</span>
              </div>
            </div>
            <div className="sw-actions">
              <button
                className="sw-lang-btn"
                aria-label="Switch language / भाषा बदलें"
                title="Switch language / भाषा बदलें"
                onClick={toggleLang}
              >
                {lang === "en" ? "🇮🇳 HI" : "🇬🇧 EN"}
              </button>
              <button className="sw-act" title={tts ? "Mute voice" : "Enable voice"} aria-label="Toggle voice"
                onClick={() => { setTts(v => !v); stopSpeak(); }}>
                {tts ? <IVol /> : <IVolOff />}
              </button>
              <button className="sw-act" title="Minimize" aria-label="Minimize"
                onClick={() => { stopSpeak(); setSize("bubble"); }}>
                <IMinus />
              </button>
              <button className="sw-act"
                title={size === "full" ? "Restore" : "Full screen"}
                aria-label="Toggle fullscreen"
                onClick={() => setSize(s => s === "full" ? "compact" : "full")}>
                {size === "full" ? <ICompress /> : <IExpand />}
              </button>
              <button className="sw-act" title="Close" aria-label="Close"
                onClick={() => { stopSpeak(); setSize("bubble"); }}>
                <IClose />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="sw-body" role="log" aria-live="polite">
            {messages.length === 0 && (
              <div className="sw-welcome">
                <div className="sw-welcome-icon"><IBot size={26} /></div>
                <div className="sw-welcome-title">{t.welcome_title}</div>
                <div className="sw-welcome-sub">{t.welcome_sub}</div>
                <div className="sw-chips">
                  {SUGGESTIONS[lang].map(q => (
                    <button key={q} className="sw-chip"
                      onClick={() => sendMessage(q)} disabled={loading}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(m => (
              <div key={m.id} className={`sw-row ${m.role}`}>
                <div className={`sw-row-avatar ${m.role === "assistant" ? "bot" : "user"}`}>
                  {m.role === "assistant" ? <IBot size={15} /> : <IUser />}
                </div>
                <div className={`sw-col ${m.role}`}>
                  <div className={`sw-bubble ${m.role === "assistant" ? "bot" : "user"}`}>
                    {m.text}
                  </div>
                  <div className="sw-time">{formatTime(m.timestamp)}</div>
                  {m.role === "assistant" && (
                    <button
                      className="sw-read-btn"
                      aria-label={speakId === m.id ? t.stop : t.read}
                      onClick={() =>
                        speakId === m.id
                          ? stopSpeak()
                          : speak(m.text, m.id, ttsLang)
                      }
                    >
                      {speakId === m.id ? <IVolOff /> : <IVol />}
                      <span>{speakId === m.id ? t.stop : t.read}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="sw-row">
                <div className="sw-row-avatar bot"><IBot size={15} /></div>
                <div className="sw-bubble bot">
                  <div className="sw-typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input footer */}
          <div className="sw-footer">
            <div className="sw-input-row">
              <button
                className={`sw-mic ${listening ? "active" : ""}`}
                aria-label={listening ? "Stop listening" : "Voice input"}
                title={lang === "hi" ? "बोलें" : "Speak your question"}
                onClick={toggleMic}
              >
                {listening ? <IMicOff /> : <IMic />}
              </button>
              <textarea
                ref={taRef}
                className="sw-textarea"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKey}
                placeholder={listening ? t.listening : t.placeholder}
                rows={1}
                aria-label="Your message"
                disabled={loading}
              />
              <button
                className="sw-send"
                aria-label="Send message"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
              >
                {loading ? <ILoad /> : <ISend />}
              </button>
            </div>
            <div className="sw-hint">{t.hint}</div>
          </div>
        </div>
      )}
    </div>
  );
}

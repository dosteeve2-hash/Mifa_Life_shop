'use client';

import type { Metadata } from 'next';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, Bot, User, ShoppingBag, Sparkles } from 'lucide-react';

interface Message { id: string; role: 'user' | 'assistant'; text: string; ts: number }

const QUICK_REPLIES = [
  'Je cherche un téléphone sous 100 000 FCFA',
  'Quelle est la politique de retour ?',
  'Comment payer avec Orange Money ?',
  'Recommande-moi des chaussures tendance',
  'Quels sont les délais de livraison à Bamako ?',
];

const BOT_RESPONSES: Record<string, string> = {
  default: "Je suis votre assistant Mifa Life ! Je peux vous aider à trouver des produits, répondre à vos questions sur la livraison, les retours ou les paiements. Comment puis-je vous aider ?",
  téléphone: "Voici quelques téléphones populaires sous 100 000 FCFA sur Mifa Life :\n\n• **Tecno Spark 10** — 65 000 FCFA\n• **Itel A70** — 42 000 FCFA\n• **Samsung Galaxy A05** — 89 000 FCFA\n\nVoulez-vous que je vous montre la boutique complète ?",
  retour: "Notre politique de retour est simple :\n\n✅ **14 jours** pour retourner un article\n✅ Retour gratuit pour les produits défectueux\n✅ Remboursement sous 3–5 jours ouvrables\n\nPour initier un retour, rendez-vous sur [Ma page retours](/returns).",
  paiement: "Mifa Life accepte plusieurs modes de paiement :\n\n📱 **Orange Money** — Envoyez au +223 XX XX XX XX\n💳 **Wave** — Scan du QR code\n🤝 **Paiement à la livraison** — Disponible à Bamako\n\nTous les paiements sont sécurisés.",
  livraison: "Les délais de livraison selon votre ville :\n\n🏙️ **Bamako** — 24h à 48h\n🌍 **Autres villes Mali** — 2 à 4 jours\n⚡ **Livraison express Bamako** — Même jour (+5 000 FCFA)\n\nLivraison gratuite à partir de 50 000 FCFA d'achat !",
  chaussures: "Voici les chaussures tendance du moment :\n\n👟 **Nike Air Max 270** — 95 000 FCFA\n👞 **Baskets casual homme** — 38 000 FCFA\n👠 **Sandales femme** — 22 000 FCFA\n\nVoulez-vous explorer notre catalogue complet ?",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('téléphone') || lower.includes('telephone') || lower.includes('phone') || lower.includes('smartphone')) return BOT_RESPONSES.téléphone;
  if (lower.includes('retour') || lower.includes('remboursement')) return BOT_RESPONSES.retour;
  if (lower.includes('payer') || lower.includes('paiement') || lower.includes('orange money') || lower.includes('wave')) return BOT_RESPONSES.paiement;
  if (lower.includes('livraison') || lower.includes('délai') || lower.includes('bamako') || lower.includes('livrer')) return BOT_RESPONSES.livraison;
  if (lower.includes('chaussure') || lower.includes('shoe') || lower.includes('basket') || lower.includes('sandal')) return BOT_RESPONSES.chaussures;
  return "Merci pour votre message ! Je suis en cours d'amélioration pour mieux répondre à toutes vos questions. En attendant, vous pouvez consulter notre [boutique](/shop) ou [nous contacter](/contact) directement.";
}

function renderText(text: string) {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const linked = bold.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:var(--em);font-weight:700;">$1</a>');
    return <span key={i} dangerouslySetInnerHTML={{ __html: linked }} style={{ display: 'block', lineHeight: 1.65 }} />;
  });
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', text: BOT_RESPONSES.default, ts: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: String(Date.now()), role: 'user', text: text.trim(), ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotResponse(text);
      setMessages((prev) => [...prev, { id: String(Date.now() + 1), role: 'assistant', text: reply, ts: Date.now() }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--sl3) 0%, #1a3a2e 100%)', padding: 'clamp(20px,3vw,32px) 0', flexShrink: 0 }}>
        <div className="wrap">
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Assistant shopping</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--em)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: '#fff', marginBottom: 2 }}>Assistant Mifa Life</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CAF50', display: 'inline-block' }} />
                En ligne — répond en quelques secondes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div className="wrap" style={{ flex: 1, paddingTop: 24, paddingBottom: 0, display: 'flex', flexDirection: 'column', maxWidth: 760 }}>
        <div style={{ flex: 1, background: 'var(--white)', borderRadius: '16px 16px 0 0', border: '1px solid var(--bg3)', borderBottom: 'none', padding: '20px 16px', overflowY: 'auto', maxHeight: 'calc(100vh - 340px)', minHeight: 300, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: msg.role === 'assistant' ? 'var(--em)' : 'var(--sl)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {msg.role === 'assistant' ? <Bot size={15} color="#fff" /> : <User size={15} color="#fff" />}
              </div>
              <div style={{ maxWidth: '72%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: msg.role === 'user' ? 'var(--em)' : 'var(--bg)', border: msg.role === 'assistant' ? '1px solid var(--bg3)' : 'none', fontSize: 13.5, color: msg.role === 'user' ? '#fff' : 'var(--t1)', lineHeight: 1.6 }}>
                {renderText(msg.text)}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--em)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={15} color="#fff" />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '4px 16px 16px 16px', background: 'var(--bg)', border: '1px solid var(--bg3)', display: 'flex', gap: 5 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--t4)', animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div style={{ background: 'var(--white)', borderLeft: '1px solid var(--bg3)', borderRight: '1px solid var(--bg3)', padding: '10px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {QUICK_REPLIES.map((q) => (
            <button key={q} onClick={() => send(q)} style={{ padding: '6px 12px', border: '1.5px solid var(--bg3)', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'var(--t2)', background: 'var(--bg)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} style={{ display: 'flex', gap: 10, background: 'var(--white)', borderRadius: '0 0 16px 16px', border: '1px solid var(--bg3)', padding: '12px 14px', marginBottom: 32 }}>
          <ShoppingBag size={16} color="var(--t4)" style={{ marginTop: 10, flexShrink: 0 }} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question… (produit, livraison, retour, paiement)"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13.5, color: 'var(--t1)', background: 'transparent' }}
          />
          <button type="submit" disabled={!input.trim() || typing} style={{ width: 38, height: 38, borderRadius: '50%', background: !input.trim() || typing ? 'var(--bg3)' : 'var(--em)', border: 'none', cursor: !input.trim() || typing ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
            <Send size={15} color="#fff" />
          </button>
        </form>
      </div>
      <style>{`
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}

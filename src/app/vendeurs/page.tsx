'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Package, MessageCircle, X, Send, ChevronRight, Search, BadgeCheck } from 'lucide-react';

/* ─── Types & Data ──────────────────────────────────────── */
export interface Vendeur {
  id: string;
  nom: string;
  proprietaire: string;
  specialite: string;
  ville: string;
  pays: string;
  drapeau: string;
  produits: number;
  note: number;
  avis: number;
  bio: string;
  initiales: string;
  couleur: string;
  verifie: boolean;
}

export const VENDEURS: Vendeur[] = [
  { id: 'aminata-kone', nom: 'Aminata Textile', proprietaire: 'Aminata Koné', specialite: 'Wax & Bogolan', ville: 'Ouagadougou', pays: 'Burkina Faso', drapeau: '🇧🇫', produits: 24, note: 4.8, avis: 127, bio: 'Artisane depuis 15 ans, Aminata crée des pièces uniques en wax et bogolan authentique du Burkina Faso.', initiales: 'AK', couleur: '#D4AF37', verifie: true },
  { id: 'diallo-bijoux', nom: 'Diallo Créations', proprietaire: 'Ibrahim Diallo', specialite: 'Bijoux artisanaux', ville: 'Dakar', pays: 'Sénégal', drapeau: '🇸🇳', produits: 41, note: 4.9, avis: 203, bio: "Maître joaillier sénégalais formé à Saint-Louis, Ibrahim perpétue l'art de la bijouterie traditionnelle wolof.", initiales: 'ID', couleur: '#00D4FF', verifie: true },
  { id: 'fatoumata-mode', nom: 'Fatoumata Mode', proprietaire: 'Fatoumata Traoré', specialite: 'Prêt-à-porter africain', ville: 'Abidjan', pays: "Côte d'Ivoire", drapeau: '🇨🇮', produits: 67, note: 4.7, avis: 318, bio: "Styliste autodidacte basée à Abidjan, Fatoumata mêle couture africaine et tendances contemporaines.", initiales: 'FT', couleur: '#F97316', verifie: true },
  { id: 'oumar-maroquinerie', nom: 'Oumar Cuir & Co', proprietaire: 'Oumar Coulibaly', specialite: 'Maroquinerie artisanale', ville: 'Bamako', pays: 'Mali', drapeau: '🇲🇱', produits: 33, note: 4.6, avis: 89, bio: "Héritier d'une longue tradition de maroquiniers maliens, Oumar confectionne sacs, ceintures et portefeuilles en cuir tanné.", initiales: 'OC', couleur: '#8B5CF6', verifie: false },
  { id: 'rasmane-poterie', nom: 'Rasmané Poterie', proprietaire: 'Rasmané Sawadogo', specialite: 'Poterie & céramique', ville: 'Koupéla', pays: 'Burkina Faso', drapeau: '🇧🇫', produits: 18, note: 4.5, avis: 64, bio: 'Potier de la région du Plateau Central, Rasmané crée des pièces décoratives en argile locale selon les techniques Mossi.', initiales: 'RS', couleur: '#EF4444', verifie: true },
  { id: 'mariama-broderie', nom: 'Mariama Broderie', proprietaire: 'Mariama Ba', specialite: 'Broderie & tie-dye', ville: 'Thiès', pays: 'Sénégal', drapeau: '🇸🇳', produits: 29, note: 4.8, avis: 155, bio: "Broderie sur wax, tissus Ndop et teinture tie-dye. Mariama fait rayonner l'artisanat textile sénégalais.", initiales: 'MB', couleur: '#10B981', verifie: true },
  { id: 'kouassi-sculptures', nom: 'Kouassi Art', proprietaire: 'Kouassi Brou', specialite: 'Sculptures & masques', ville: 'Bouaké', pays: "Côte d'Ivoire", drapeau: '🇨🇮', produits: 15, note: 4.7, avis: 72, bio: 'Sculpteur baoulé de troisième génération, Kouassi taille des masques et statuettes selon les traditions Akan.', initiales: 'KB', couleur: '#F59E0B', verifie: false },
  { id: 'sahel-tissage', nom: 'Sahel Tissage', proprietaire: 'Djeneba Coulibaly', specialite: 'Tissage Bogolan & Kente', ville: 'Ségou', pays: 'Mali', drapeau: '🇲🇱', produits: 38, note: 4.9, avis: 241, bio: "Tisserande d'excellence de la ville de Ségou, Djeneba produit des étoffes bogolan et kente aux motifs géométriques.", initiales: 'DC', couleur: '#6366F1', verifie: true },
  { id: 'aissatou-cosmetiques', nom: 'Aïssatou Naturel', proprietaire: 'Aïssatou Bah', specialite: 'Cosmétiques naturels', ville: 'Conakry', pays: 'Guinée', drapeau: '🇬🇳', produits: 52, note: 4.6, avis: 188, bio: "Formulatrice de cosmétiques 100% naturels à base de beurre de karité, d'huile de baobab et de plantes médicinales guinéennes.", initiales: 'AB', couleur: '#EC4899', verifie: true },
  { id: 'kwame-alimentation', nom: 'Kwame Saveurs', proprietaire: 'Kwame Asante', specialite: 'Épices & alimentation', ville: 'Accra', pays: 'Ghana', drapeau: '🇬🇭', produits: 44, note: 4.4, avis: 96, bio: "Spécialiste des épices et condiments d'Afrique de l'Ouest — graines de néré, poivre selim, soumbala.", initiales: 'KA', couleur: '#14B8A6', verifie: false },
  { id: 'nafi-mode-bazin', nom: 'Nafi Bazin', proprietaire: 'Nafissatou Diarra', specialite: 'Mode bazin riche', ville: 'Lomé', pays: 'Togo', drapeau: '🇹🇬', produits: 31, note: 4.8, avis: 143, bio: "Couturière spécialisée dans le bazin riche brodé. Nafissatou confectionne boubous, grands complets et tenues de cérémonie sur mesure.", initiales: 'ND', couleur: '#A855F7', verifie: true },
  { id: 'hamadou-vannerie', nom: 'Hamadou Artisan', proprietaire: 'Hamadou Maïga', specialite: 'Vannerie & paniers', ville: 'Niamey', pays: 'Niger', drapeau: '🇳🇪', produits: 22, note: 4.3, avis: 57, bio: "Vannier traditionnel de Niamey, Hamadou tisse paniers, nattes et objets décoratifs en raphia et jonc.", initiales: 'HM', couleur: '#FB923C', verifie: false },
];

const PAYS_OPTIONS = ['Tous', 'Burkina Faso', 'Sénégal', "Côte d'Ivoire", 'Mali', 'Guinée', 'Ghana', 'Togo', 'Niger'];
const SPEC_OPTIONS = ['Toutes', 'Wax & Bogolan', 'Bijoux artisanaux', 'Prêt-à-porter africain', 'Maroquinerie artisanale', 'Poterie & céramique', 'Broderie & tie-dye', 'Sculptures & masques', 'Tissage Bogolan & Kente', 'Cosmétiques naturels', 'Épices & alimentation', 'Mode bazin riche', 'Vannerie & paniers'];
const NOTE_OPTIONS = [0, 3, 3.5, 4, 4.5] as const;

/* ─── Contact Modal ─────────────────────────────────────── */
function ContactModal({ vendeur, onClose }: { vendeur: Vendeur; onClose: () => void }) {
  const [form, setForm] = useState({ nom: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(onClose, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 700, color: 'var(--text)', fontStyle: 'italic' }}>
            Contacter {vendeur.proprietaire}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)' }}>
            <X size={18} />
          </button>
        </div>
        {sent ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
            <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 16 }}>Message envoyé !</p>
            <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 6 }}>{vendeur.proprietaire} vous répondra sous 24h.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[{ key: 'nom', label: 'VOTRE NOM', type: 'text', placeholder: 'Moussa Kaboré' }, { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'vous@exemple.com' }].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 6, fontFamily: '"JetBrains Mono", monospace' }}>{label}</label>
                <input required type={type} placeholder={placeholder} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 6, fontFamily: '"JetBrains Mono", monospace' }}>MESSAGE</label>
              <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder={`Bonjour ${vendeur.proprietaire.split(' ')[0]}, je suis intéressé(e) par...`}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'var(--gold)', color: 'var(--bg)', fontWeight: 700, fontSize: 14 }}>
              <Send size={14} /> Envoyer le message
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Star Rating ───────────────────────────────────────── */
function StarRating({ note }: { note: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} fill={i <= Math.round(note) ? 'var(--gold)' : 'none'} color={i <= Math.round(note) ? 'var(--gold)' : 'var(--text3)'} />
      ))}
    </div>
  );
}

/* ─── Vendeur Card ──────────────────────────────────────── */
function VendeurCard({ vendeur, onContact }: { vendeur: Vendeur; onContact: () => void }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* Badge vérifié */}
      {vendeur.verifie && (
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(34,217,138,0.18)', border: '1px solid rgba(34,217,138,0.4)', borderRadius: 20, padding: '2px 8px', zIndex: 2 }}>
          <BadgeCheck size={11} color="#22d98a" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#22d98a', fontFamily: '"JetBrains Mono", monospace' }}>Vérifié</span>
        </div>
      )}

      {/* Avatar */}
      <div style={{ height: 110, position: 'relative', background: `linear-gradient(135deg, ${vendeur.couleur}22, ${vendeur.couleur}08)`, borderBottom: `1px solid ${vendeur.couleur}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${vendeur.couleur}, ${vendeur.couleur}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: '"Playfair Display", serif', boxShadow: `0 6px 24px ${vendeur.couleur}44` }}>
          {vendeur.initiales}
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 20 }}>{vendeur.drapeau}</div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 700, color: 'var(--text)', fontStyle: 'italic', lineHeight: 1.2, marginBottom: 2 }}>{vendeur.nom}</h3>
        <p style={{ fontSize: 12, color: 'var(--text3)', fontFamily: '"JetBrains Mono", monospace' }}>{vendeur.proprietaire}</p>

        <div style={{ margin: '10px 0 8px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: `${vendeur.couleur}18`, color: vendeur.couleur }}>{vendeur.specialite}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <MapPin size={11} color="var(--text3)" />
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{vendeur.ville}, {vendeur.pays}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <StarRating note={vendeur.note} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>{vendeur.note}</span>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>({vendeur.avis} avis)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16 }}>
          <Package size={11} color="var(--text3)" />
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{vendeur.produits} produits</span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
          <Link href={`/vendeurs/${vendeur.id}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', borderRadius: 10, background: 'var(--gold)', color: 'var(--bg)', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>
            Voir la boutique <ChevronRight size={12} />
          </Link>
          <button onClick={onContact}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)', cursor: 'pointer' }}
            aria-label="Contacter">
            <MessageCircle size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function VendeursPage() {
  const [recherche, setRecherche] = useState('');
  const [filterPays, setFilterPays] = useState('Tous');
  const [filterSpec, setFilterSpec] = useState('Toutes');
  const [filterNote, setFilterNote] = useState(0);
  const [contactVendeur, setContactVendeur] = useState<Vendeur | null>(null);

  const filtered = useMemo(() => VENDEURS.filter(v => {
    const q = recherche.toLowerCase();
    const matchSearch = !q || v.nom.toLowerCase().includes(q) || v.specialite.toLowerCase().includes(q) || v.proprietaire.toLowerCase().includes(q) || v.ville.toLowerCase().includes(q);
    return matchSearch
      && (filterPays === 'Tous' || v.pays === filterPays)
      && (filterSpec === 'Toutes' || v.specialite === filterSpec)
      && v.note >= filterNote;
  }), [recherche, filterPays, filterSpec, filterNote]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)', padding: 'clamp(32px,5vw,64px) 0', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(212,175,55,0.06)', pointerEvents: 'none' }} />
        <div className="wrap">
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'var(--text2)' }}>Vendeurs</span>
          </nav>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: 'var(--text)', lineHeight: 1.1, marginBottom: 12 }}>
            Marketplace <span style={{ color: 'var(--gold)' }}>Artisans</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text2)', maxWidth: 520, lineHeight: 1.7 }}>
            Découvrez {VENDEURS.length} artisans et créateurs africains — Burkina Faso, Sénégal, Côte d&apos;Ivoire, Mali et plus encore. Achetez directement aux sources authentiques.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>

        {/* Barre de recherche */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Rechercher un vendeur, une spécialité, une ville…"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border2)')}
          />
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32, padding: '16px 20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text3)', fontFamily: '"JetBrains Mono", monospace', display: 'block', marginBottom: 6 }}>PAYS</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PAYS_OPTIONS.map(p => (
                <button key={p} onClick={() => setFilterPays(p)}
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: filterPays === p ? 'var(--gold)' : 'var(--bg3)', color: filterPays === p ? 'var(--bg)' : 'var(--text2)', border: filterPays === p ? '1px solid var(--gold)' : '1px solid var(--border2)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text3)', fontFamily: '"JetBrains Mono", monospace', display: 'block', marginBottom: 6 }}>SPÉCIALITÉ</label>
            <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 10, fontSize: 12, background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none', cursor: 'pointer' }}>
              {SPEC_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text3)', fontFamily: '"JetBrains Mono", monospace', display: 'block', marginBottom: 6 }}>NOTE MIN</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {NOTE_OPTIONS.map(n => (
                <button key={n} onClick={() => setFilterNote(n)}
                  style={{ padding: '5px 10px', borderRadius: 20, fontSize: 12, cursor: 'pointer', background: filterNote === n ? 'var(--gold)' : 'var(--bg3)', color: filterNote === n ? 'var(--bg)' : 'var(--text2)', border: filterNote === n ? '1px solid var(--gold)' : '1px solid var(--border2)', fontWeight: 600 }}>
                  {n === 0 ? 'Tous' : `★ ${n}+`}
                </button>
              ))}
            </div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)', alignSelf: 'flex-end' }}>
            {filtered.length} vendeur{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          <AnimatePresence>
            {filtered.map(v => (
              <VendeurCard key={v.id} vendeur={v} onContact={() => setContactVendeur(v)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>Aucun vendeur ne correspond à ces critères.</p>
            <button onClick={() => { setRecherche(''); setFilterPays('Tous'); setFilterSpec('Toutes'); setFilterNote(0); }}
              style={{ marginTop: 8, padding: '8px 18px', borderRadius: 10, background: 'var(--gold)', color: 'var(--bg)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {contactVendeur && <ContactModal vendeur={contactVendeur} onClose={() => setContactVendeur(null)} />}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Save, Send, AlertCircle,
  ImageIcon, Tag, DollarSign, Layers, ArrowLeft,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ── Types ──────────────────────────────────────────────────────────────────
type Category = 'mode' | 'accessoires' | 'maison' | 'electronique' | 'artisanat' | 'alimentaire';

interface ProductForm {
  nom: string; description: string; categorie: Category | '';
  prix: string; stock: string; sku: string;
  imageUrl: string; taille: string; couleur: string; matiere: string;
}

const EMPTY: ProductForm = {
  nom:'', description:'', categorie:'',
  prix:'', stock:'', sku:'',
  imageUrl:'', taille:'', couleur:'', matiere:'',
};

const REQUIRED: (keyof ProductForm)[] = ['nom', 'prix', 'stock', 'categorie'];

const CATEGORIES: { value: Category; label: string }[] = [
  { value:'mode',         label:'Mode & Vêtements'    },
  { value:'accessoires',  label:'Accessoires'          },
  { value:'maison',       label:'Maison & Décoration'  },
  { value:'electronique', label:'Électronique'         },
  { value:'artisanat',    label:'Artisanat'            },
  { value:'alimentaire',  label:'Alimentaire'          },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontSize:11, fontWeight:700, color:'var(--t2)', marginBottom:6,
      textTransform:'uppercase', letterSpacing:'0.07em' }}>
      {children}{required && <span style={{ color:'#dc2626', marginLeft:3 }}>*</span>}
    </div>
  );
}

function InputField({ value, onChange, placeholder, type='text', error=false, rows }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: boolean; rows?: number;
}) {
  const base: React.CSSProperties = {
    width:'100%', padding:'10px 12px', background:'var(--bg)',
    border: `1.5px solid ${error ? '#dc2626' : 'var(--border)'}`,
    borderRadius:9, fontSize:13, color:'var(--t1)',
    fontFamily:'inherit', outline:'none', boxSizing:'border-box',
  };
  if (rows) {
    return <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows} style={{ ...base, resize:'vertical' }} />;
  }
  return <input type={type} value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} style={base} />;
}

function ErrHint() {
  return (
    <div style={{ fontSize:11, color:'#dc2626', marginTop:4,
      display:'flex', alignItems:'center', gap:4 }}>
      <AlertCircle size={10} /> Champ requis
    </div>
  );
}

function FormSection({ icon, title, children, delay=0 }: {
  icon: React.ReactNode; title: string;
  children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      transition={{ type:'spring' as const, stiffness:300, damping:26, delay }}
      style={{ background:'var(--white)', borderRadius:14, border:'1px solid var(--border)',
        padding:'20px 22px', marginBottom:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:'var(--em-l)',
          display:'flex', alignItems:'center', justifyContent:'center', color:'var(--em)' }}>
          {icon}
        </div>
        <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:16,
          fontWeight:700, color:'var(--t1)', margin:0 }}>{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function NouveauProduitPage() {
  const [form, setForm]     = useState<ProductForm>(EMPTY);
  const [errors, setErrors] = useState<Set<keyof ProductForm>>(new Set());
  const [toast, setToast]   = useState<'draft' | 'published' | null>(null);

  const set = useCallback((key: keyof ProductForm) => (val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => { const n = new Set(prev); n.delete(key); return n; });
  }, []);

  const validate = useCallback(() => {
    const errs = new Set<keyof ProductForm>(REQUIRED.filter(k => !form[k].trim()));
    setErrors(errs);
    return errs.size === 0;
  }, [form]);

  const handleSave = useCallback((mode: 'draft' | 'published') => {
    if (!validate()) return;
    setToast(mode);
    setTimeout(() => setToast(null), 3000);
  }, [validate]);

  const e = errors;

  // Derived preview values
  const previewPrice = form.prix ? parseInt(form.prix, 10) : null;
  const previewStock = form.stock ? parseInt(form.stock, 10) : null;
  const previewCat   = CATEGORIES.find(c => c.value === form.categorie)?.label ?? null;
  const completeness = [
    { label:'Nom',         done: !!form.nom },
    { label:'Description', done: !!form.description },
    { label:'Catégorie',   done: !!form.categorie },
    { label:'Prix',        done: !!form.prix },
    { label:'Stock',       done: !!form.stock },
    { label:'Image',       done: !!form.imageUrl },
  ];

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }}
            transition={{ type:'spring' as const, stiffness:400, damping:28 }}
            style={{ position:'fixed', top:20, right:20, zIndex:300,
              background: toast === 'published' ? '#16a34a' : '#2f6fed',
              color:'#fff', borderRadius:12, padding:'12px 20px',
              fontSize:13, fontWeight:700, boxShadow:'var(--sh-m)' }}>
            {toast === 'published' ? '✅ Produit publié !' : '💾 Brouillon sauvegardé !'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ background:'linear-gradient(135deg,#0e1c33 0%,#1a3a6e 100%)', padding:'clamp(24px,4vw,40px) 0' }}>
        <div className="wrap">
          <nav style={{ display:'flex', gap:6, fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:14 }}>
            <Link href="/" style={{ color:'inherit' }}>Accueil</Link><span>›</span>
            <Link href="/admin" style={{ color:'inherit' }}>Admin</Link><span>›</span>
            <Link href="/admin/produits" style={{ color:'inherit' }}>Produits</Link><span>›</span>
            <span style={{ color:'rgba(255,255,255,0.75)' }}>Nouveau</span>
          </nav>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Package size={22} color="#2f6fed" />
              <h1 style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(22px,4vw,30px)',
                fontWeight:700, color:'#fff', margin:0 }}>Ajouter un Produit</h1>
            </div>
            <Link href="/admin" style={{ display:'flex', alignItems:'center', gap:6,
              padding:'9px 18px', background:'rgba(255,255,255,0.1)',
              border:'1px solid rgba(255,255,255,0.2)', borderRadius:9,
              fontSize:12, fontWeight:600, color:'#fff', textDecoration:'none' }}>
              <ArrowLeft size={14} /> Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop:32, paddingBottom:60 }}>
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1.4fr) minmax(280px,1fr)', gap:24, alignItems:'start' }}>

          {/* ══ LEFT: Form ══ */}
          <div>

            {/* Section 1: Infos de base */}
            <FormSection icon={<Tag size={15} />} title="Informations de base" delay={0.05}>
              <div style={{ marginBottom:14 }}>
                <FieldLabel required>Nom du produit</FieldLabel>
                <InputField value={form.nom} onChange={set('nom')} error={e.has('nom')}
                  placeholder="Ex : Bazin Royal brodé — collection 2024" />
                {e.has('nom') && <ErrHint />}
              </div>
              <div style={{ marginBottom:14 }}>
                <FieldLabel>Description</FieldLabel>
                <InputField value={form.description} onChange={set('description')}
                  placeholder="Décrivez le produit en détail…" rows={4} />
              </div>
              <div>
                <FieldLabel required>Catégorie</FieldLabel>
                <select value={form.categorie} onChange={e => set('categorie')(e.target.value)}
                  style={{ width:'100%', padding:'10px 12px', background:'var(--bg)',
                    border:`1.5px solid ${errors.has('categorie') ? '#dc2626' : 'var(--border)'}`,
                    borderRadius:9, fontSize:13,
                    color: form.categorie ? 'var(--t1)' : 'var(--t3)',
                    outline:'none', cursor:'pointer', boxSizing:'border-box' }}>
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                {errors.has('categorie') && <ErrHint />}
              </div>
            </FormSection>

            {/* Section 2: Prix & Stock */}
            <FormSection icon={<DollarSign size={15} />} title="Prix & Stock" delay={0.1}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div>
                  <FieldLabel required>Prix (FCFA)</FieldLabel>
                  <InputField value={form.prix} onChange={set('prix')} type="number"
                    placeholder="Ex : 45 000" error={e.has('prix')} />
                  {e.has('prix') && <ErrHint />}
                </div>
                <div>
                  <FieldLabel required>Stock</FieldLabel>
                  <InputField value={form.stock} onChange={set('stock')} type="number"
                    placeholder="Ex : 25" error={e.has('stock')} />
                  {e.has('stock') && <ErrHint />}
                </div>
              </div>
              <div>
                <FieldLabel>SKU (référence)</FieldLabel>
                <InputField value={form.sku} onChange={set('sku')}
                  placeholder="Ex : BAZIN-ROYAL-XL-BLEU" />
              </div>
            </FormSection>

            {/* Section 3: Image */}
            <FormSection icon={<ImageIcon size={15} />} title="Image principale" delay={0.15}>
              <FieldLabel>URL de l&apos;image</FieldLabel>
              <InputField value={form.imageUrl} onChange={set('imageUrl')}
                placeholder="https://exemple.com/image.jpg" />
              {form.imageUrl && (
                <div style={{ marginTop:10, borderRadius:9, overflow:'hidden',
                  border:'1px solid var(--border)', maxHeight:120 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="Aperçu"
                    style={{ width:'100%', height:120, objectFit:'cover' }}
                    onError={ev => { (ev.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </FormSection>

            {/* Section 4: Attributs */}
            <FormSection icon={<Layers size={15} />} title="Attributs" delay={0.2}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                <div>
                  <FieldLabel>Taille</FieldLabel>
                  <InputField value={form.taille} onChange={set('taille')} placeholder="S, M, L, XL…" />
                </div>
                <div>
                  <FieldLabel>Couleur</FieldLabel>
                  <InputField value={form.couleur} onChange={set('couleur')} placeholder="Bleu, rouge…" />
                </div>
                <div>
                  <FieldLabel>Matière</FieldLabel>
                  <InputField value={form.matiere} onChange={set('matiere')} placeholder="Coton, bazin…" />
                </div>
              </div>
            </FormSection>

            {/* Action buttons */}
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', paddingTop:8 }}>
              <button onClick={() => handleSave('draft')} style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'12px 28px', borderRadius:11,
                background:'var(--white)', border:'2px solid var(--em)',
                color:'var(--em)', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                <Save size={16} /> Sauvegarder brouillon
              </button>
              <button onClick={() => handleSave('published')} style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'12px 28px', borderRadius:11,
                background:'var(--em)', border:'none',
                color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                <Send size={16} /> Publier le produit
              </button>
            </div>
          </div>

          {/* ══ RIGHT: Preview ══ */}
          <div style={{ position:'sticky', top:24 }}>
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ type:'spring' as const, stiffness:280, damping:26, delay:0.25 }}>

              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                letterSpacing:'0.08em', color:'var(--t3)', marginBottom:12 }}>
                Aperçu en temps réel
              </div>

              {/* Product card */}
              <div style={{ background:'var(--white)', borderRadius:16,
                border:'1px solid var(--border)', overflow:'hidden', boxShadow:'var(--sh-m)' }}>

                {/* Image area */}
                <div style={{ width:'100%', height:220, position:'relative', overflow:'hidden',
                  background:'linear-gradient(135deg,var(--bg4) 0%,var(--bg) 100%)',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {form.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={form.imageUrl} alt={form.nom || 'Produit'}
                      style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }}
                      onError={ev => { (ev.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div style={{ textAlign:'center', color:'var(--t4)' }}>
                      <ImageIcon size={40} strokeWidth={1} />
                      <div style={{ fontSize:11, marginTop:8 }}>Image du produit</div>
                    </div>
                  )}
                  {previewCat && (
                    <div style={{ position:'absolute', top:10, left:10, padding:'3px 10px',
                      borderRadius:20, background:'rgba(47,111,237,0.9)', color:'#fff',
                      fontSize:10, fontWeight:700 }}>{previewCat}</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding:'16px 18px' }}>
                  <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:17, fontWeight:700,
                    color:'var(--t1)', marginBottom:8, lineHeight:1.3,
                    opacity: form.nom ? 1 : 0.3 }}>
                    {form.nom || 'Nom du produit'}
                  </h3>

                  {form.description && (
                    <p style={{ fontSize:12, color:'var(--t3)', marginBottom:12, lineHeight:1.5 }}>
                      {form.description.slice(0,90)}{form.description.length > 90 ? '…' : ''}
                    </p>
                  )}

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                    <div style={{ fontSize:22, fontWeight:800, color:'var(--em)',
                      fontFamily:'"JetBrains Mono",monospace', opacity: previewPrice ? 1 : 0.3 }}>
                      {previewPrice ? previewPrice.toLocaleString('fr-FR') + ' F' : '— F'}
                    </div>
                    {previewStock !== null && (
                      <div style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                        color: previewStock > 5 ? '#16a34a' : '#E65100',
                        background: previewStock > 5 ? '#E8F5E9' : '#FFF3E0' }}>
                        Stock : {previewStock}
                      </div>
                    )}
                  </div>

                  {/* Attribute chips */}
                  {(form.taille || form.couleur || form.matiere) && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
                      {[form.taille, form.couleur, form.matiere].filter(Boolean).map((v, i) => (
                        <span key={i} style={{ fontSize:10, padding:'2px 8px',
                          background:'var(--bg4)', borderRadius:6,
                          color:'var(--t2)', fontWeight:600 }}>{v}</span>
                      ))}
                    </div>
                  )}

                  <button style={{ width:'100%', padding:11, background:'var(--em)',
                    border:'none', borderRadius:9, color:'#fff',
                    fontSize:13, fontWeight:700, cursor:'pointer' }}>
                    Ajouter au panier
                  </button>
                </div>
              </div>

              {/* Completeness meter */}
              <div style={{ marginTop:16, background:'var(--white)', borderRadius:12,
                border:'1px solid var(--border)', padding:'14px 16px' }}>
                <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                  letterSpacing:'0.07em', color:'var(--t3)', marginBottom:10 }}>Complétude</div>
                {completeness.map(({ label, done }) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <div style={{ width:16, height:16, borderRadius:'50%', flexShrink:0,
                      background: done ? '#16a34a' : 'var(--bg4)',
                      display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {done && <span style={{ color:'#fff', fontSize:9, fontWeight:900 }}>✓</span>}
                    </div>
                    <div style={{ fontSize:12, fontWeight: done ? 600 : 400,
                      color: done ? 'var(--t1)' : 'var(--t3)' }}>{label}</div>
                  </div>
                ))}
                {/* Progress bar */}
                <div style={{ marginTop:10, height:4, borderRadius:2, background:'var(--bg4)' }}>
                  <div style={{ height:'100%', borderRadius:2, background:'var(--em)',
                    width: `${Math.round(completeness.filter(c => c.done).length / completeness.length * 100)}%`,
                    transition:'width 0.4s ease' }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

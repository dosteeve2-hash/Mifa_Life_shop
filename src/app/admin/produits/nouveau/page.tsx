'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Save, Send, AlertCircle, ImageIcon, Tag, DollarSign, Layers, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

// ── TYPES ─────────────────────────────────────────────────────────────────
type Category = 'mode' | 'accessoires' | 'maison' | 'electronique' | 'artisanat' | 'alimentaire';

interface ProductForm {
  nom: string; description: string; categorie: Category | '';
  prix: string; stock: string; sku: string;
  imageUrl: string; taille: string; couleur: string; matiere: string;
}

const EMPTY_FORM: ProductForm = {
  nom: '', description: '', categorie: '',
  prix: '', stock: '', sku: '',
  imageUrl: '', taille: '', couleur: '', matiere: '',
};

const REQUIRED_FIELDS: (keyof ProductForm)[] = ['nom', 'prix', 'stock', 'categorie'];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'mode',         label: 'Mode & Vêtements' },
  { value: 'accessoires',  label: 'Accessoires' },
  { value: 'maison',       label: 'Maison & Décoration' },
  { value: 'electronique', label: 'Électronique' },
  { value: 'artisanat',    label: 'Artisanat' },
  { value: 'alimentaire',  label: 'Alimentaire' },
];

// ── FIELD LABEL ───────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', marginBottom: 6,
      textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {children}
    </div>
  );
}

// ── INPUT FIELD ───────────────────────────────────────────────────────────
interface FieldProps {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: boolean;
  multiline?: boolean; rows?: number;
}
function InputField({ value, onChange, placeholder, type = 'text', error = false, multiline = false, rows = 4 }: FieldProps) {
  const base: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    background: 'var(--bg)', border: `1.5px solid ${error ? '#dc2626' : 'var(--border)'}`,
    borderRadius: 9, fontSize: 13, color: 'var(--t1)',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  };
  if (multiline) {
    return <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows} style={{ ...base, resize: 'vertical' }} />;
  }
  return <input type={type} value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} style={base} />;
}

// ── FORM SECTION ──────────────────────────────────────────────────────────
interface SectionProps {
  icon: React.ReactNode; title: string;
  children: React.ReactNode; delay?: number;
}
function FormSection({ icon, title, children, delay = 0 }: SectionProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 26, delay }}
      style={{ background: 'var(--white)', borderRadius: 14, border: '1px solid var(--border)',
        padding: '20px 22px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--em-l)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--em)' }}>
          {icon}
        </div>
        <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 16,
          fontWeight: 700, color: 'var(--t1)', margin: 0 }}>{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// ── ERROR HINT ────────────────────────────────────────────────────────────
function ErrorHint() {
  return (
    <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4,
      display: 'flex', alignItems: 'center', gap: 4 }}>
      <AlertCircle size={10} /> Champ requis
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────────────────
function fmtFCFA(n: number): string {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

// ── PREVIEW CARD ──────────────────────────────────────────────────────────
function PreviewCard({ form }: { form: ProductForm }) {
  const prixNum = Number(form.prix) || 0;
  const stockNum = Number(form.stock) || 0;
  const catLabel = CATEGORIES.find(c => c.value === form.categorie)?.label ?? '';

  return (
    <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid var(--border)',
      overflow: 'hidden', boxShadow: 'var(--sh-m)' }}>
      <div style={{ aspectRatio: '1', background: 'var(--bg4)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: 'var(--t3)' }}>
        {form.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.imageUrl} alt={form.nom || 'Aperçu produit'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <ImageIcon size={40} strokeWidth={1.2} />
        )}
      </div>
      <div style={{ padding: '16px 18px' }}>
        {catLabel && (
          <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20,
            background: 'var(--em-l)', color: 'var(--em)', fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            {catLabel}
          </div>
        )}
        <div style={{ fontFamily: '"Playfair Display",serif', fontSize: 16, fontWeight: 700,
          color: 'var(--t1)', marginBottom: 4, minHeight: 22 }}>
          {form.nom || 'Nom du produit'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 10,
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {form.description || 'Description du produit…'}
        </div>
        {(form.taille || form.couleur || form.matiere) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {[form.taille, form.couleur, form.matiere].filter(Boolean).map((attr, i) => (
              <span key={i} style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--bg)',
                border: '1px solid var(--border)', fontSize: 10, color: 'var(--t2)', fontWeight: 600 }}>
                {attr}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--em)',
            fontFamily: '"JetBrains Mono",monospace' }}>
            {prixNum > 0 ? fmtFCFA(prixNum) : '— FCFA'}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700,
            color: stockNum > 0 ? '#2E7D32' : '#C62828' }}>
            {stockNum > 0 ? `${stockNum} en stock` : 'Rupture'}
          </div>
        </div>
        {form.sku && (
          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--t4)',
            fontFamily: '"JetBrains Mono",monospace' }}>
            SKU : {form.sku}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function NouveauProduitPage() {
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Set<keyof ProductForm>>(new Set());
  const [saved, setSaved] = useState<'draft' | 'publish' | null>(null);

  const setField = useCallback(<K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const validate = useCallback((): boolean => {
    const missing = new Set<keyof ProductForm>();
    for (const field of REQUIRED_FIELDS) {
      if (!form[field] || form[field].trim() === '') missing.add(field);
    }
    if (form.prix && (isNaN(Number(form.prix)) || Number(form.prix) <= 0)) missing.add('prix');
    if (form.stock && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) missing.add('stock');
    setErrors(missing);
    return missing.size === 0;
  }, [form]);

  const handleSubmit = useCallback((mode: 'draft' | 'publish') => {
    if (mode === 'publish' && !validate()) { setSaved(null); return; }
    if (mode === 'draft' && form.nom.trim() === '') { setErrors(new Set(['nom'])); return; }
    setSaved(mode);
    window.setTimeout(() => setSaved(null), 2500);
  }, [form, validate]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0e1c33 0%,#1a3a6e 100%)',
        padding: 'clamp(24px,4vw,40px) 0' }}>
        <div className="wrap">
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit' }}>Accueil</Link><span>›</span>
            <Link href="/admin" style={{ color: 'inherit' }}>Admin</Link><span>›</span>
            <Link href="/admin/produits" style={{ color: 'inherit' }}>Produits</Link><span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>Nouveau</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Package size={22} color="#2f6fed" />
              <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(22px,4vw,30px)',
                fontWeight: 700, color: '#fff', margin: 0 }}>Nouveau Produit</h1>
            </div>
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 9,
              fontSize: 12, fontWeight: 600, color: '#fff' }}>
              <ArrowLeft size={14} /> Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60,
        display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(260px,1fr)', gap: 24,
        alignItems: 'start' }}>
        {/* Form column */}
        <div>
          <FormSection icon={<Tag size={16} />} title="Informations générales">
            <div style={{ marginBottom: 14 }}>
              <FieldLabel>Nom du produit *</FieldLabel>
              <InputField value={form.nom} onChange={v => setField('nom', v)}
                placeholder="Ex : Bazin Royal Bleu" error={errors.has('nom')} />
              {errors.has('nom') && <ErrorHint />}
            </div>
            <div style={{ marginBottom: 14 }}>
              <FieldLabel>Description</FieldLabel>
              <InputField value={form.description} onChange={v => setField('description', v)}
                placeholder="Décrivez le produit, la matière, l'origine…" multiline rows={4} />
            </div>
            <div>
              <FieldLabel>Catégorie *</FieldLabel>
              <select value={form.categorie}
                onChange={e => setField('categorie', e.target.value as Category)}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg)',
                  border: `1.5px solid ${errors.has('categorie') ? '#dc2626' : 'var(--border)'}`,
                  borderRadius: 9, fontSize: 13, color: 'var(--t1)', cursor: 'pointer', outline: 'none' }}>
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {errors.has('categorie') && <ErrorHint />}
            </div>
          </FormSection>

          <FormSection icon={<DollarSign size={16} />} title="Prix & Stock" delay={0.05}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
              <div>
                <FieldLabel>Prix (FCFA) *</FieldLabel>
                <InputField value={form.prix} onChange={v => setField('prix', v)}
                  placeholder="18500" type="number" error={errors.has('prix')} />
                {errors.has('prix') && <ErrorHint />}
              </div>
              <div>
                <FieldLabel>Stock *</FieldLabel>
                <InputField value={form.stock} onChange={v => setField('stock', v)}
                  placeholder="25" type="number" error={errors.has('stock')} />
                {errors.has('stock') && <ErrorHint />}
              </div>
              <div>
                <FieldLabel>SKU</FieldLabel>
                <InputField value={form.sku} onChange={v => setField('sku', v)}
                  placeholder="MIFA-BZ-001" />
              </div>
            </div>
          </FormSection>

          <FormSection icon={<ImageIcon size={16} />} title="Images" delay={0.1}>
            <div style={{ border: '2px dashed var(--border2)', borderRadius: 12,
              padding: '32px 20px', textAlign: 'center', background: 'var(--bg)' }}>
              <ImageIcon size={28} color="var(--t3)" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
                Glissez une image ou cliquez pour parcourir
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 14 }}>
                JPG, PNG — 5 Mo max
              </div>
              <InputField value={form.imageUrl} onChange={v => setField('imageUrl', v)}
                placeholder="Ou collez une URL d'image pour l'aperçu" />
            </div>
          </FormSection>

          <FormSection icon={<Layers size={16} />} title="Attributs" delay={0.15}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
              <div>
                <FieldLabel>Taille</FieldLabel>
                <InputField value={form.taille} onChange={v => setField('taille', v)} placeholder="M, L, XL…" />
              </div>
              <div>
                <FieldLabel>Couleur</FieldLabel>
                <InputField value={form.couleur} onChange={v => setField('couleur', v)} placeholder="Bleu roi" />
              </div>
              <div>
                <FieldLabel>Matière</FieldLabel>
                <InputField value={form.matiere} onChange={v => setField('matiere', v)} placeholder="Bazin, Coton…" />
              </div>
            </div>
          </FormSection>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={() => handleSubmit('draft')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 22px', background: 'var(--white)', border: '1px solid var(--border2)',
              borderRadius: 10, fontSize: 13, fontWeight: 700, color: 'var(--t2)', cursor: 'pointer' }}>
              <Save size={15} /> Enregistrer brouillon
            </button>
            <button onClick={() => handleSubmit('publish')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 26px', background: 'var(--em)', border: 'none',
              borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
              boxShadow: 'var(--sh-s)' }}>
              <Send size={15} /> Publier
            </button>
          </div>

          <AnimatePresence>
            {saved && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }} transition={{ type: 'spring' as const, stiffness: 350, damping: 28 }}
                style={{ marginTop: 14, padding: '11px 16px', borderRadius: 10,
                  background: '#E8F5E9', color: '#2E7D32', fontSize: 12, fontWeight: 700,
                  textAlign: 'right' }}>
                {saved === 'draft' ? 'Brouillon enregistré ✓' : 'Produit publié ✓'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preview column */}
        <div style={{ position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 10 }}>
            Aperçu en direct
          </div>
          <PreviewCard form={form} />
        </div>
      </div>
    </div>
  );
}

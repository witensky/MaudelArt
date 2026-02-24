import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, FileText, Quote, Image, Plus, Trash2, CheckCircle, GripVertical, Camera } from 'lucide-react';

// ─── Types (must match Biography.tsx) ─────────────────────────────────────────
interface Chapter {
    id: number;
    title: string;
    icon: 'Scissors' | 'Palette' | 'Piano';
    period?: string;
    text: string;
}

interface Exhibition {
    year: string;
    title: string;
    location: string;
}

interface BioContent {
    mainTitle: string;
    subtitle: string;
    quote: string;
    quoteAuthor?: string;
    secondaryQuote?: string;
    secondaryQuoteAuthor?: string;
    chapters: Chapter[];
    exhibitions: Exhibition[];
    photoUrl?: string;
    finalStatement?: string;
}

const DEFAULT: BioContent = {
    mainTitle: 'Marie Maude Eliacin',
    subtitle: 'Artist Narrative',
    quote: "My painting is a journey of self-discovery...",
    quoteAuthor: 'Marie Maude Eliacin',
    secondaryQuote: "Maude Eliacin's pictorial universe has no room for gloom...",
    secondaryQuoteAuthor: '— Soucaneau Gabriel, Raj Magazine (2007)',
    chapters: [
        { id: 1, title: 'Precision in Every Thread', icon: 'Scissors', period: '2003 Transition', text: '...' },
        { id: 2, title: 'From Piano Keys to Pencils', icon: 'Palette', period: 'The Encounter', text: '...' },
        { id: 3, title: 'Order and Fantasy', icon: 'Palette', period: 'Mastery', text: '...' },
        { id: 4, title: 'A Continuous Journey', icon: 'Palette', period: 'Present', text: '...' },
    ],
    exhibitions: [
        { year: '2015', title: 'Order and Fantasy', location: 'Private Residence, Pétion-Ville, Haiti' },
        { year: '2007', title: 'International Caribbean Art Fair (ICA)', location: 'New York, USA' },
        { year: '2007', title: 'Art and Spectacle', location: 'Festival Arts, Pétion Ville, Haiti' },
        { year: '2007', title: 'Open-Air Creations', location: 'Kenscoff, Haiti' },
    ],
    photoUrl: '',
    finalStatement: "Today, she invites you to admire some of her old and recent works...",
};

// ─── Field component ──────────────────────────────────────────────────────────
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-emerald-900/40 font-black block">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full bg-[#fcfcf9] border border-emerald-950/10 rounded-xl px-4 py-3 text-emerald-950 focus:border-emerald-500 outline-none text-sm";
const textareaCls = `${inputCls} resize-none leading-relaxed`;

// ─── Main Component ───────────────────────────────────────────────────────────
export const BioManager: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [content, setContent] = useState<BioContent>(DEFAULT);
    const photoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchBio(); }, []);

    const fetchBio = async () => {
        const { data } = await supabase.from('site_content').select('content').eq('key', 'biography').single();
        if (data?.content) setContent({ ...DEFAULT, ...(data.content as BioContent) });
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        await supabase.from('site_content').upsert({ key: 'biography', type: 'json', content });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    // ── Photo upload ─────────────────────────────────────────────────────────
    const handlePhotoUpload = async (file: File) => {
        if (!file) return;
        setUploadingPhoto(true);
        const ext = file.name.split('.').pop();
        const path = `biography/artist-photo.${ext}`;
        const { error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: true });
        if (!upErr) {
            const { data } = supabase.storage.from('media').getPublicUrl(path);
            setContent(c => ({ ...c, photoUrl: data.publicUrl }));
        }
        setUploadingPhoto(false);
    };

    // ── Chapter helpers ──────────────────────────────────────────────────────
    const updateChapter = (idx: number, field: keyof Chapter, value: string) => {
        setContent(c => {
            const chapters = [...c.chapters];
            chapters[idx] = { ...chapters[idx], [field]: value };
            return { ...c, chapters };
        });
    };

    const addChapter = () => {
        setContent(c => ({
            ...c,
            chapters: [...c.chapters, { id: Date.now(), title: 'Nouveau chapitre', icon: 'Palette', period: '', text: '' }]
        }));
    };

    const removeChapter = (idx: number) => {
        setContent(c => ({ ...c, chapters: c.chapters.filter((_, i) => i !== idx) }));
    };

    // ── Exhibition helpers ───────────────────────────────────────────────────
    const updateExhibition = (idx: number, field: keyof Exhibition, value: string) => {
        setContent(c => {
            const exhibitions = [...c.exhibitions];
            exhibitions[idx] = { ...exhibitions[idx], [field]: value };
            return { ...c, exhibitions };
        });
    };

    const addExhibition = () => {
        setContent(c => ({ ...c, exhibitions: [{ year: '', title: '', location: '' }, ...c.exhibitions] }));
    };

    const removeExhibition = (idx: number) => {
        setContent(c => ({ ...c, exhibitions: c.exhibitions.filter((_, i) => i !== idx) }));
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-emerald-500" size={24} /></div>;

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif text-emerald-950 font-bold">Biographie & À Propos</h2>
                    <p className="text-gray-500 mt-1 text-sm">Tout ce qui s'affiche sur la page publique "À propos".</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                        }`}
                >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
                    {saved ? 'Publié ✓' : saving ? 'Sauvegarde…' : 'Publier'}
                </button>
            </div>

            {/* ── Section 1 : En-tête ─────────────────────────────────────────── */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-950/5 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
                    <FileText className="text-emerald-600" size={20} />
                    <h3 className="text-lg font-bold text-emerald-950">En-tête</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Nom / Titre principal">
                        <input value={content.mainTitle} onChange={e => setContent(c => ({ ...c, mainTitle: e.target.value }))} className={inputCls} />
                    </Field>
                    <Field label="Sous-titre (sur-titre)">
                        <input value={content.subtitle} onChange={e => setContent(c => ({ ...c, subtitle: e.target.value }))} className={inputCls} />
                    </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <Field label="Citation principale">
                        <textarea value={content.quote} onChange={e => setContent(c => ({ ...c, quote: e.target.value }))} className={`${textareaCls} h-28`} />
                    </Field>
                    <Field label="Auteur de la citation principale">
                        <input value={content.quoteAuthor || ''} onChange={e => setContent(c => ({ ...c, quoteAuthor: e.target.value }))} className={inputCls} placeholder="Marie Maude Eliacin" />
                    </Field>
                </div>
            </div>

            {/* ── Section 2 : Photo principale ────────────────────────────────── */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-950/5 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
                    <Camera className="text-emerald-600" size={20} />
                    <h3 className="text-lg font-bold text-emerald-950">Photo Principale</h3>
                </div>
                <div className="flex items-start gap-8">
                    {/* Preview */}
                    <div
                        className="w-36 h-48 rounded-2xl border-2 border-dashed border-emerald-200 overflow-hidden flex-shrink-0 cursor-pointer hover:border-emerald-400 transition-colors relative group"
                        onClick={() => photoInputRef.current?.click()}
                    >
                        {content.photoUrl ? (
                            <>
                                <img src={content.photoUrl} alt="preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-emerald-300">
                                <Image size={28} />
                                <span className="text-xs font-bold uppercase tracking-wider text-center px-2">Cliquer pour ajouter</span>
                            </div>
                        )}
                        {uploadingPhoto && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <Loader2 className="animate-spin text-emerald-500" size={20} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <p className="text-sm text-gray-500">Upload une nouvelle photo de l'artiste (JPG, PNG, WebP, max 5 MB).</p>
                        <button
                            onClick={() => photoInputRef.current?.click()}
                            disabled={uploadingPhoto}
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors border border-emerald-100"
                        >
                            {uploadingPhoto ? <Loader2 size={14} className="animate-spin" /> : <Image size={14} />}
                            {uploadingPhoto ? 'Upload en cours…' : 'Choisir une photo'}
                        </button>
                        <Field label="Ou coller une URL directe">
                            <input value={content.photoUrl || ''} onChange={e => setContent(c => ({ ...c, photoUrl: e.target.value }))} className={inputCls} placeholder="https://…" />
                        </Field>
                    </div>
                    <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }}
                    />
                </div>
            </div>

            {/* ── Section 3 : Chapitres ────────────────────────────────────────── */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-950/5 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                    <div className="flex items-center gap-3">
                        <FileText className="text-emerald-600" size={20} />
                        <h3 className="text-lg font-bold text-emerald-950">Chapitres de l'histoire</h3>
                    </div>
                    <button onClick={addChapter} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black hover:bg-emerald-100 border border-emerald-100 transition-colors">
                        <Plus size={14} /> Ajouter
                    </button>
                </div>
                <div className="space-y-4">
                    {content.chapters.map((ch, idx) => (
                        <div key={ch.id} className="border border-emerald-950/5 rounded-2xl p-6 space-y-4 bg-[#fcfcf9]">
                            <div className="flex items-center gap-3">
                                <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Field label="Titre">
                                        <input value={ch.title} onChange={e => updateChapter(idx, 'title', e.target.value)} className={inputCls} />
                                    </Field>
                                    <Field label="Période / Label">
                                        <input value={ch.period || ''} onChange={e => updateChapter(idx, 'period', e.target.value)} className={inputCls} placeholder="ex: 2003 Transition" />
                                    </Field>
                                    <Field label="Icône">
                                        <select value={ch.icon} onChange={e => updateChapter(idx, 'icon', e.target.value)} className={inputCls}>
                                            <option value="Palette">🎨 Palette</option>
                                            <option value="Scissors">✂️ Scissors</option>
                                            <option value="Piano">🎹 Piano</option>
                                        </select>
                                    </Field>
                                </div>
                                <button onClick={() => removeChapter(idx)} className="text-red-400 hover:text-red-600 flex-shrink-0 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <Field label="Texte du chapitre">
                                <textarea value={ch.text} onChange={e => updateChapter(idx, 'text', e.target.value)} className={`${textareaCls} h-32`} />
                            </Field>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Section 4 : Citation secondaire ─────────────────────────────── */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-950/5 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
                    <Quote className="text-emerald-600" size={20} />
                    <h3 className="text-lg font-bold text-emerald-950">Citation Critique</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Texte de la citation">
                        <textarea value={content.secondaryQuote || ''} onChange={e => setContent(c => ({ ...c, secondaryQuote: e.target.value }))} className={`${textareaCls} h-36`} />
                    </Field>
                    <Field label="Source (auteur, publication, année)">
                        <input value={content.secondaryQuoteAuthor || ''} onChange={e => setContent(c => ({ ...c, secondaryQuoteAuthor: e.target.value }))} className={inputCls} placeholder="— Auteur, Publication (2007)" />
                    </Field>
                </div>
            </div>

            {/* ── Section 5 : Expositions ──────────────────────────────────────── */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-950/5 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                    <div className="flex items-center gap-3">
                        <FileText className="text-emerald-600" size={20} />
                        <h3 className="text-lg font-bold text-emerald-950">Chronologie / Expositions</h3>
                    </div>
                    <button onClick={addExhibition} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black hover:bg-emerald-100 border border-emerald-100 transition-colors">
                        <Plus size={14} /> Ajouter
                    </button>
                </div>
                <div className="space-y-3">
                    {content.exhibitions.map((ex, idx) => (
                        <div key={idx} className="grid grid-cols-[72px_1fr_1fr_auto] gap-3 items-center">
                            <input value={ex.year} onChange={e => updateExhibition(idx, 'year', e.target.value)} className={inputCls} placeholder="2007" />
                            <input value={ex.title} onChange={e => updateExhibition(idx, 'title', e.target.value)} className={inputCls} placeholder="Titre de l'exposition" />
                            <input value={ex.location} onChange={e => updateExhibition(idx, 'location', e.target.value)} className={inputCls} placeholder="Lieu, Pays" />
                            <button onClick={() => removeExhibition(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Section 6 : Déclaration finale ──────────────────────────────── */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-950/5 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
                    <FileText className="text-emerald-600" size={20} />
                    <h3 className="text-lg font-bold text-emerald-950">Déclaration Finale</h3>
                </div>
                <Field label="Texte de conclusion">
                    <textarea value={content.finalStatement || ''} onChange={e => setContent(c => ({ ...c, finalStatement: e.target.value }))} className={`${textareaCls} h-28`} />
                </Field>
            </div>

            {/* Bottom save */}
            <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-xl transition-all flex items-center justify-center gap-3 ${saved ? 'bg-emerald-500 text-white' : 'bg-emerald-900 hover:bg-emerald-950 text-[#d4af37]'
                    }`}
            >
                {saving ? <Loader2 className="animate-spin" size={18} /> : saved ? <CheckCircle size={18} /> : <Save size={18} />}
                {saved ? 'Publié avec succès ✓' : saving ? 'Sauvegarde en cours…' : 'Publier tous les changements'}
            </button>
        </div>
    );
};

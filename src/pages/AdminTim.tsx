import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, Crown, ArrowUp, ArrowDown,
  Image as ImageIcon, Upload, Layers, X,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { SectionCard, FieldLabel, PageActionBar } from "@/components/admin/AdminFormKit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useTimStore, fileToDataUrl,
  type TimData, type TimMember, type TimLevel, newId,
} from "@/data/profilStore";

const emptyMember = (): TimMember => ({ id: newId(), name: "", role: "" });
const emptyLevel = (idx: number): TimLevel => ({
  id: newId(),
  label: `Level ${idx}`,
  members: [emptyMember()],
});

/* ─────────────────────────────────────────────────────────── */

const AdminTim = () => {
  const { data, update, reset } = useTimStore();
  const [draft, setDraft] = useState<TimData>(data);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDraft(data); }, [data]);

  const patch = <K extends keyof TimData>(k: K, v: TimData[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  };

  /* ── Level helpers ───────────────────────────────────────── */
  const updateLevel = (id: string, p: Partial<TimLevel>) =>
    patch("levels", draft.levels.map((l) => (l.id === id ? { ...l, ...p } : l)));

  const moveLevel = (idx: number, dir: -1 | 1) => {
    const next = [...draft.levels];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    patch("levels", next);
  };

  const addLevel = () =>
    patch("levels", [...draft.levels, emptyLevel(draft.levels.length + 1)]);

  const removeLevel = (id: string) => {
    if (draft.levels.length <= 1) {
      toast.error("Minimal harus ada 1 level");
      return;
    }
    patch("levels", draft.levels.filter((l) => l.id !== id));
  };

  const addMember = (levelId: string) => {
    const lvl = draft.levels.find((l) => l.id === levelId);
    if (!lvl) return;
    updateLevel(levelId, { members: [...lvl.members, emptyMember()] });
  };

  const updateMember = (levelId: string, memberId: string, p: Partial<TimMember>) => {
    const lvl = draft.levels.find((l) => l.id === levelId);
    if (!lvl) return;
    updateLevel(levelId, {
      members: lvl.members.map((m) => (m.id === memberId ? { ...m, ...p } : m)),
    });
  };

  const removeMember = (levelId: string, memberId: string) => {
    const lvl = draft.levels.find((l) => l.id === levelId);
    if (!lvl) return;
    if (lvl.members.length <= 1) {
      toast.error("Minimal 1 anggota per level");
      return;
    }
    updateLevel(levelId, { members: lvl.members.filter((m) => m.id !== memberId) });
  };

  const moveMember = (levelId: string, idx: number, dir: -1 | 1) => {
    const lvl = draft.levels.find((l) => l.id === levelId);
    if (!lvl) return;
    const next = [...lvl.members];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    updateLevel(levelId, { members: next });
  };

  /* ── Photo upload (pengelola) ────────────────────────────── */
  const updatePengelola = (id: string, p: Partial<TimMember>) =>
    patch("pengelola", draft.pengelola.map((m) => (m.id === id ? { ...m, ...p } : m)));

  const handlePhotoFile = async (id: string, file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran maksimum 2MB");
      return;
    }
    try {
      const url = await fileToDataUrl(file);
      updatePengelola(id, { photo: url });
      toast.success("Foto berhasil diunggah");
    } catch {
      toast.error("Gagal membaca file");
    }
  };

  const handleSave = () => {
    update(() => draft);
    setDirty(false);
    toast.success("Halaman Tim berhasil diperbarui");
  };

  return (
    <AdminLayout title="Halaman Tim LPM">
      <div className="space-y-6 max-w-6xl pb-24">

        {/* ═══ STRUKTUR ORGANISASI (DINAMIS) ═══ */}
        <SectionCard
          title="Struktur Organisasi"
          description="Kelola level dan anggota struktur. Level pertama biasanya Kepala LPM."
          action={
            <Button size="sm" onClick={addLevel} className="rounded-xl gap-2">
              <Layers className="w-4 h-4" />Tambah Level
            </Button>
          }
        >
          <div className="space-y-4">
            {draft.levels.map((lvl, lIdx) => (
              <LevelEditor
                key={lvl.id}
                level={lvl}
                index={lIdx}
                isFirst={lIdx === 0}
                isLast={lIdx === draft.levels.length - 1}
                onLabelChange={(label) => updateLevel(lvl.id, { label })}
                onMoveUp={() => moveLevel(lIdx, -1)}
                onMoveDown={() => moveLevel(lIdx, 1)}
                onRemove={() => removeLevel(lvl.id)}
                onAddMember={() => addMember(lvl.id)}
                onMemberChange={(mId, p) => updateMember(lvl.id, mId, p)}
                onMemberRemove={(mId) => removeMember(lvl.id, mId)}
                onMemberMove={(mIdx, dir) => moveMember(lvl.id, mIdx, dir)}
              />
            ))}
          </div>
        </SectionCard>

        {/* ═══ TIM PENGELOLA ═══ */}
        <SectionCard
          title="Tim Pengelola"
          description="Kartu tim pengelola — foto bisa di-upload langsung atau pakai URL"
          action={
            <Button size="sm" onClick={() => patch("pengelola", [...draft.pengelola, emptyMember()])} className="rounded-xl gap-2">
              <Plus className="w-4 h-4" />Tambah Anggota
            </Button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {draft.pengelola.map((m) => (
              <PengelolaCard
                key={m.id}
                member={m}
                onChange={(p) => updatePengelola(m.id, p)}
                onUpload={(f) => handlePhotoFile(m.id, f)}
                onRemove={() => patch("pengelola", draft.pengelola.filter((x) => x.id !== m.id))}
              />
            ))}
          </div>
        </SectionCard>

        {/* ═══ AUDITOR ═══ */}
        <SectionCard
          title="Tim Auditor Internal"
          description="Daftar nama auditor"
          action={
            <Button size="sm" onClick={() => patch("auditor", [...draft.auditor, ""])} className="rounded-xl gap-2">
              <Plus className="w-4 h-4" />Tambah
            </Button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {draft.auditor.map((a, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <Input
                  value={a}
                  onChange={(e) => {
                    const next = [...draft.auditor];
                    next[i] = e.target.value;
                    patch("auditor", next);
                  }}
                  className="rounded-xl"
                />
                <Button
                  variant="ghost" size="icon"
                  className="h-9 w-9 text-destructive shrink-0"
                  onClick={() => patch("auditor", draft.auditor.filter((_, k) => k !== i))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <PageActionBar
          onSave={handleSave}
          onReset={() => { reset(); setDirty(false); toast.success("Direset"); }}
          dirty={dirty}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminTim;

/* ═══════════════════════════════════════════════════════════
   LEVEL EDITOR
   ═══════════════════════════════════════════════════════════ */
function LevelEditor(props: {
  level: TimLevel;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onLabelChange: (l: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onAddMember: () => void;
  onMemberChange: (id: string, p: Partial<TimMember>) => void;
  onMemberRemove: (id: string) => void;
  onMemberMove: (idx: number, dir: -1 | 1) => void;
}) {
  const { level, index, isFirst, isLast } = props;
  const isHead = index === 0;

  return (
    <div className={`border rounded-2xl overflow-hidden ${isHead ? "border-primary/40 bg-primary/[0.03]" : "border-border bg-muted/15"}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isHead ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
          {isHead ? <Crown className="w-4 h-4" /> : <span className="text-xs font-black">{index + 1}</span>}
        </div>
        <Input
          value={level.label}
          onChange={(e) => props.onLabelChange(e.target.value)}
          placeholder={`Level ${index + 1}`}
          className="rounded-lg h-9 font-bold flex-1"
        />
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={props.onMoveUp} disabled={isFirst}><ArrowUp className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={props.onMoveDown} disabled={isLast}><ArrowDown className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={props.onRemove}><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Members */}
      <div className="p-4 space-y-3">
        {level.members.map((m, i) => (
          <div key={m.id} className="border border-border rounded-xl p-3 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Anggota #{i + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => props.onMemberMove(i, -1)} disabled={i === 0}><ArrowUp className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => props.onMemberMove(i, 1)} disabled={i === level.members.length - 1}><ArrowDown className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => props.onMemberRemove(m.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <FieldLabel>Nama (boleh banyak baris)</FieldLabel>
                <Textarea
                  value={m.name}
                  onChange={(e) => props.onMemberChange(m.id, { name: e.target.value })}
                  rows={2}
                  className="mt-1.5 rounded-xl"
                />
              </div>
              <div>
                <FieldLabel>Jabatan / Unit</FieldLabel>
                <Textarea
                  value={m.role}
                  onChange={(e) => props.onMemberChange(m.id, { role: e.target.value })}
                  rows={2}
                  className="mt-1.5 rounded-xl"
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          size="sm" variant="outline"
          onClick={props.onAddMember}
          className="rounded-xl gap-2 w-full border-dashed"
        >
          <Plus className="w-4 h-4" />Tambah Anggota di Level Ini
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PENGELOLA CARD (with photo upload)
   ═══════════════════════════════════════════════════════════ */
function PengelolaCard({
  member, onChange, onUpload, onRemove,
}: {
  member: TimMember;
  onChange: (p: Partial<TimMember>) => void;
  onUpload: (f: File | null) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="border border-border rounded-2xl p-3 bg-muted/20">
      <div className="aspect-square mb-3 rounded-xl bg-muted overflow-hidden flex items-center justify-center relative group">
        {member.photo ? (
          <>
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <button
              type="button"
              onClick={() => onChange({ photo: undefined })}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground/70 text-background opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              aria-label="Hapus foto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
      />
      <Button
        type="button" variant="outline" size="sm"
        onClick={() => fileRef.current?.click()}
        className="w-full mb-2 rounded-lg gap-2"
      >
        <Upload className="w-3.5 h-3.5" />
        {member.photo ? "Ganti Foto" : "Upload Foto"}
      </Button>
      <Input value={member.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Nama" className="rounded-lg mb-2 text-[13px]" />
      <Input value={member.role} onChange={(e) => onChange({ role: e.target.value })} placeholder="Jabatan" className="rounded-lg mb-2 text-[13px]" />
      <Input
        value={member.photo?.startsWith("data:") ? "" : (member.photo ?? "")}
        onChange={(e) => onChange({ photo: e.target.value || undefined })}
        placeholder="Atau URL foto (opsional)"
        className="rounded-lg text-[12px]"
      />
      <Button
        variant="ghost" size="sm"
        className="w-full mt-2 text-destructive hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="w-3.5 h-3.5 mr-1" />Hapus
      </Button>
    </div>
  );
}

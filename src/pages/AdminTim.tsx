import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Crown, ArrowUp, ArrowDown, Image as ImageIcon } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { SectionCard, FieldLabel, PageActionBar } from "@/components/admin/AdminFormKit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTimStore, type TimData, type TimMember, newId } from "@/data/profilStore";

const empty = (): TimMember => ({ id: newId(), name: "", role: "" });

const AdminTim = () => {
  const { data, update, reset } = useTimStore();
  const [draft, setDraft] = useState<TimData>(data);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDraft(data); }, [data]);

  const patch = <K extends keyof TimData>(k: K, v: TimData[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  };

  const updateMember = (key: "level2" | "pengelola", id: string, p: Partial<TimMember>) => {
    patch(key, draft[key].map((m) => (m.id === id ? { ...m, ...p } : m)));
  };

  const move = (key: "level2" | "pengelola", idx: number, dir: -1 | 1) => {
    const next = [...draft[key]];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    patch(key, next);
  };

  const handleSave = () => {
    update(() => draft);
    setDirty(false);
    toast.success("Halaman Tim berhasil diperbarui");
  };

  return (
    <AdminLayout title="Halaman Tim LPM">
      <div className="space-y-6 max-w-6xl pb-24">
        {/* Kepala */}
        <SectionCard title="Kepala LPM" description="Pimpinan tertinggi struktur organisasi">
          <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Crown className="w-5 h-5" /></div>
            <div className="text-[12px] text-foreground/70"><strong className="text-foreground">{draft.kepala.name || "—"}</strong> · {draft.kepala.role || "—"}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Nama</FieldLabel>
              <Input value={draft.kepala.name} onChange={(e) => patch("kepala", { ...draft.kepala, name: e.target.value })} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <FieldLabel required>Jabatan</FieldLabel>
              <Input value={draft.kepala.role} onChange={(e) => patch("kepala", { ...draft.kepala, role: e.target.value })} className="mt-1.5 rounded-xl" />
            </div>
          </div>
        </SectionCard>

        {/* Level 2 */}
        <SectionCard
          title="Struktur Level 2"
          description="SPMF & Administrasi (gunakan baris baru untuk multi nama)"
          action={<Button size="sm" onClick={() => patch("level2", [...draft.level2, empty()])} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Tambah</Button>}
        >
          <div className="space-y-3">
            {draft.level2.map((m, i) => (
              <div key={m.id} className="border border-border rounded-2xl p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Anggota #{i + 1}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move("level2", i, -1)} disabled={i === 0}><ArrowUp className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move("level2", i, 1)} disabled={i === draft.level2.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => patch("level2", draft.level2.filter((x) => x.id !== m.id))}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Nama (boleh banyak baris)</FieldLabel>
                    <Textarea value={m.name} onChange={(e) => updateMember("level2", m.id, { name: e.target.value })} rows={3} className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <FieldLabel>Jabatan / Unit</FieldLabel>
                    <Textarea value={m.role} onChange={(e) => updateMember("level2", m.id, { role: e.target.value })} rows={3} className="mt-1.5 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Level 3 */}
        <SectionCard title="Anggota Level 3" description="Anggota di bawah SPMF">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <FieldLabel>Nama</FieldLabel>
              <Textarea value={draft.level3.name} onChange={(e) => patch("level3", { ...draft.level3, name: e.target.value })} rows={2} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <FieldLabel>Jabatan</FieldLabel>
              <Input value={draft.level3.role} onChange={(e) => patch("level3", { ...draft.level3, role: e.target.value })} className="mt-1.5 rounded-xl" />
            </div>
          </div>
        </SectionCard>

        {/* Tim Pengelola */}
        <SectionCard
          title="Tim Pengelola"
          description="Kartu tim pengelola dengan foto"
          action={<Button size="sm" onClick={() => patch("pengelola", [...draft.pengelola, empty()])} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Tambah Anggota</Button>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {draft.pengelola.map((m) => (
              <div key={m.id} className="border border-border rounded-2xl p-3 bg-muted/20">
                <div className="aspect-square mb-3 rounded-xl bg-muted overflow-hidden flex items-center justify-center">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
                  )}
                </div>
                <Input value={m.name} onChange={(e) => updateMember("pengelola", m.id, { name: e.target.value })} placeholder="Nama" className="rounded-lg mb-2 text-[13px]" />
                <Input value={m.role} onChange={(e) => updateMember("pengelola", m.id, { role: e.target.value })} placeholder="Jabatan" className="rounded-lg mb-2 text-[13px]" />
                <Input value={m.photo ?? ""} onChange={(e) => updateMember("pengelola", m.id, { photo: e.target.value })} placeholder="URL foto (opsional)" className="rounded-lg text-[12px]" />
                <Button variant="ghost" size="sm" className="w-full mt-2 text-destructive hover:text-destructive" onClick={() => patch("pengelola", draft.pengelola.filter((x) => x.id !== m.id))}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" />Hapus
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Auditor */}
        <SectionCard
          title="Tim Auditor Internal"
          description="Daftar nama auditor"
          action={<Button size="sm" onClick={() => patch("auditor", [...draft.auditor, ""])} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Tambah</Button>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {draft.auditor.map((a, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <Input value={a} onChange={(e) => {
                  const next = [...draft.auditor]; next[i] = e.target.value; patch("auditor", next);
                }} className="rounded-xl" />
                <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive shrink-0" onClick={() => patch("auditor", draft.auditor.filter((_, k) => k !== i))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <PageActionBar onSave={handleSave} onReset={() => { reset(); setDirty(false); toast.success("Direset"); }} dirty={dirty} />
      </div>
    </AdminLayout>
  );
};

export default AdminTim;

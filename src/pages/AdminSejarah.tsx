import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { SectionCard, FieldLabel, PageActionBar } from "@/components/admin/AdminFormKit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSejarahStore, type SejarahData, type SejarahItem, newId } from "@/data/profilStore";
import { profilApi } from "@/services/profilApi";

const AdminSejarah = () => {
  const { data, update, reset } = useSejarahStore();
  const [draft, setDraft] = useState<SejarahData>(data);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDraft(data); }, [data]);
  useEffect(() => {
    profilApi.sejarah.get()
      .then((value) => {
        setDraft(value);
        update(() => value);
      })
      .catch(() => undefined);
  }, [update]);

  const patch = <K extends keyof SejarahData>(k: K, v: SejarahData[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  };

  const updateEvent = (id: string, patchObj: Partial<SejarahItem>) => {
    patch("events", draft.events.map((e) => (e.id === id ? { ...e, ...patchObj } : e)));
  };

  const addEvent = () => {
    patch("events", [...draft.events, { id: newId(), year: "", title: "", content: "" }]);
  };

  const removeEvent = (id: string) => {
    patch("events", draft.events.filter((e) => e.id !== id));
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...draft.events];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    patch("events", next);
  };

  const updateTask = (i: number, v: string) => {
    const next = [...draft.legalTasks];
    next[i] = v;
    patch("legalTasks", next);
  };

  const handleSave = async () => {
    if (draft.events.some((e) => !e.year.trim() || !e.title.trim())) {
      toast.error("Tahun & judul setiap item Sejarah wajib diisi");
      return;
    }
    try {
      const saved = await profilApi.sejarah.save(draft);
      update(() => saved);
      setDraft(saved);
      setDirty(false);
      toast.success("Halaman Sejarah berhasil diperbarui");
    } catch {
      toast.error("Gagal menyimpan halaman Sejarah");
    }
  };

  const handleReset = () => {
    reset();
    toast.success("Direset ke nilai default");
    setDirty(false);
  };

  return (
    <AdminLayout title="Halaman Sejarah">
      <div className="space-y-6 max-w-5xl pb-24">
        <SectionCard title="Pengantar" description="Paragraf pembuka di halaman Sejarah">
          <FieldLabel>Teks pengantar</FieldLabel>
          <Textarea value={draft.intro} onChange={(e) => patch("intro", e.target.value)} rows={5} className="mt-2 rounded-xl" />
        </SectionCard>

        <SectionCard
          title="Timeline Peristiwa"
          description="Setiap kartu tahun yang muncul di timeline"
          action={<Button size="sm" onClick={addEvent} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Tambah</Button>}
        >
          <div className="space-y-4">
            {draft.events.map((ev, i) => (
              <div key={ev.id} className="border border-border rounded-2xl p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <GripVertical className="w-3.5 h-3.5" />Event #{i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(i, 1)} disabled={i === draft.events.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeEvent(ev.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-3">
                  <div>
                    <FieldLabel required>Tahun</FieldLabel>
                    <Input value={ev.year} onChange={(e) => updateEvent(ev.id, { year: e.target.value })} placeholder="2003" className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <FieldLabel required>Judul</FieldLabel>
                    <Input value={ev.title} onChange={(e) => updateEvent(ev.id, { title: e.target.value })} className="mt-1.5 rounded-xl" />
                  </div>
                </div>
                <div className="mt-3">
                  <FieldLabel>Konten</FieldLabel>
                  <Textarea value={ev.content} onChange={(e) => updateEvent(ev.id, { content: e.target.value })} rows={3} className="mt-1.5 rounded-xl" />
                </div>
              </div>
            ))}
            {draft.events.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">Belum ada event. Klik "Tambah".</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Kotak Legal" description="Box tugas & wewenang berdasarkan Permenristekdikti">
          <div className="space-y-3">
            <div>
              <FieldLabel>Judul</FieldLabel>
              <Input value={draft.legalTitle} onChange={(e) => patch("legalTitle", e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <FieldLabel>Pengantar</FieldLabel>
              <Textarea value={draft.legalIntro} onChange={(e) => patch("legalIntro", e.target.value)} rows={3} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel>Daftar Tugas</FieldLabel>
                <Button size="sm" variant="outline" className="rounded-lg gap-1.5 h-8" onClick={() => patch("legalTasks", [...draft.legalTasks, ""])}>
                  <Plus className="w-3.5 h-3.5" />Tambah
                </Button>
              </div>
              <div className="space-y-2">
                {draft.legalTasks.map((t, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-1.5 shrink-0">{i + 1}</span>
                    <Textarea value={t} onChange={(e) => updateTask(i, e.target.value)} rows={2} className="flex-1 rounded-xl" />
                    <Button variant="ghost" size="icon" className="h-9 w-9 mt-0.5 text-destructive" onClick={() => patch("legalTasks", draft.legalTasks.filter((_, k) => k !== i))}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Footer kecil (sumber)</FieldLabel>
              <Input value={draft.legalFooter} onChange={(e) => patch("legalFooter", e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
          </div>
        </SectionCard>

        <PageActionBar onSave={handleSave} onReset={handleReset} dirty={dirty} />
      </div>
    </AdminLayout>
  );
};

export default AdminSejarah;

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Star, ArrowUp, ArrowDown } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { SectionCard, FieldLabel, PageActionBar } from "@/components/admin/AdminFormKit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRoadMapStore, type RoadMapData, type RoadMapItem, newId } from "@/data/profilStore";

const AdminRoadMap = () => {
  const { data, update, reset } = useRoadMapStore();
  const [draft, setDraft] = useState<RoadMapData>(data);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDraft(data); }, [data]);

  const patch = <K extends keyof RoadMapData>(k: K, v: RoadMapData[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  };

  const updateItem = (id: string, p: Partial<RoadMapItem>) => {
    patch("items", draft.items.map((it) => (it.id === id ? { ...it, ...p } : it)));
  };

  const setActive = (id: string) => {
    patch("items", draft.items.map((it) => ({ ...it, active: it.id === id })));
  };

  const addItem = () => patch("items", [...draft.items, { id: newId(), period: "", title: "", description: "", active: false }]);
  const removeItem = (id: string) => patch("items", draft.items.filter((i) => i.id !== id));

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...draft.items];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    patch("items", next);
  };

  const handleSave = () => {
    update(() => draft);
    setDirty(false);
    toast.success("Halaman Road Map berhasil diperbarui");
  };

  return (
    <AdminLayout title="Halaman Road Map">
      <div className="space-y-6 max-w-5xl pb-24">
        <SectionCard
          title="Tahapan Road Map"
          description="Tahap-tahap pengembangan SPMI Itenas"
          action={<Button size="sm" onClick={addItem} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Tambah Tahap</Button>}
        >
          <div className="space-y-4">
            {draft.items.map((it, i) => (
              <div key={it.id} className={`border rounded-2xl p-4 transition-colors ${it.active ? "border-primary bg-primary/5" : "border-border bg-muted/20"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tahap #{i + 1}</span>
                    {it.active && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full"><Star className="w-3 h-3" />Aktif</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(i, 1)} disabled={i === draft.items.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(it.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel required>Periode</FieldLabel>
                    <Input value={it.period} onChange={(e) => updateItem(it.id, { period: e.target.value })} placeholder="2021 – 2025" className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <FieldLabel required>Judul Tahap</FieldLabel>
                    <Input value={it.title} onChange={(e) => updateItem(it.id, { title: e.target.value })} className="mt-1.5 rounded-xl" />
                  </div>
                </div>
                <div className="mt-3">
                  <FieldLabel>Deskripsi</FieldLabel>
                  <Textarea value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} rows={3} className="mt-1.5 rounded-xl" />
                </div>
                <div className="mt-3 flex items-center gap-3 pt-3 border-t border-border">
                  <Switch checked={it.active} onCheckedChange={(v) => v ? setActive(it.id) : updateItem(it.id, { active: false })} />
                  <span className="text-[12px] text-muted-foreground">Tandai sebagai tahap yang sedang berjalan</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Siklus PPEPP"
          description="Label tahapan siklus penjaminan mutu"
          action={<Button size="sm" onClick={() => patch("ppepp", [...draft.ppepp, ""])} className="rounded-xl gap-2"><Plus className="w-4 h-4" />Tambah</Button>}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {draft.ppepp.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input value={p} onChange={(e) => {
                  const next = [...draft.ppepp]; next[i] = e.target.value; patch("ppepp", next);
                }} className="rounded-xl" />
                <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive shrink-0" onClick={() => patch("ppepp", draft.ppepp.filter((_, k) => k !== i))}>
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

export default AdminRoadMap;

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { SectionCard, FieldLabel, PageActionBar } from "@/components/admin/AdminFormKit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useVisiMisiStore, type VisiMisiData } from "@/data/profilStore";

const AdminVisiMisi = () => {
  const { data, update, reset } = useVisiMisiStore();
  const [draft, setDraft] = useState<VisiMisiData>(data);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDraft(data); }, [data]);

  const patch = <K extends keyof VisiMisiData>(k: K, v: VisiMisiData[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  };

  const updateList = (key: "misi" | "sasaran", i: number, v: string) => {
    const next = [...draft[key]];
    next[i] = v;
    patch(key, next);
  };

  const handleSave = () => {
    if (!draft.visi.trim()) { toast.error("Visi tidak boleh kosong"); return; }
    update(() => draft);
    setDirty(false);
    toast.success("Halaman Visi & Misi berhasil diperbarui");
  };

  return (
    <AdminLayout title="Halaman Visi & Misi">
      <div className="space-y-6 max-w-5xl pb-24">
        <SectionCard title="Visi" description="Pernyataan visi LPM Itenas">
          <FieldLabel required>Teks Visi</FieldLabel>
          <Textarea value={draft.visi} onChange={(e) => patch("visi", e.target.value)} rows={5} className="mt-2 rounded-xl" />
        </SectionCard>

        <SectionCard
          title="Misi"
          description="Daftar poin misi"
          action={
            <Button size="sm" className="rounded-xl gap-2" onClick={() => patch("misi", [...draft.misi, ""])}>
              <Plus className="w-4 h-4" />Tambah
            </Button>
          }
        >
          <div className="space-y-2">
            {draft.misi.map((m, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-1.5 shrink-0">{i + 1}</span>
                <Textarea value={m} onChange={(e) => updateList("misi", i, e.target.value)} rows={2} className="flex-1 rounded-xl" />
                <Button variant="ghost" size="icon" className="h-9 w-9 mt-0.5 text-destructive" onClick={() => patch("misi", draft.misi.filter((_, k) => k !== i))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Sasaran Mutu"
          description="Setiap kartu sasaran (max 3 ditampilkan rapi)"
          action={
            <Button size="sm" className="rounded-xl gap-2" onClick={() => patch("sasaran", [...draft.sasaran, ""])}>
              <Plus className="w-4 h-4" />Tambah
            </Button>
          }
        >
          <div className="space-y-2">
            {draft.sasaran.map((s, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-1.5 shrink-0">{i + 1}</span>
                <Input value={s} onChange={(e) => updateList("sasaran", i, e.target.value)} className="flex-1 rounded-xl" />
                <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => patch("sasaran", draft.sasaran.filter((_, k) => k !== i))}>
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

export default AdminVisiMisi;

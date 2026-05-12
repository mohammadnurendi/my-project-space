import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { SectionCard, FieldLabel, PageActionBar } from "@/components/admin/AdminFormKit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  BERANDA_DEFAULT,
  newContentId,
  type BerandaData,
  type HomeContactCard,
  type HomeContactType,
  type HomeFaq,
  type HomeStat,
} from "@/data/berandaContent";
import { profilApi } from "@/services/profilApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactTypeLabels: Record<HomeContactType, string> = {
  address: "Alamat",
  phone: "Telepon",
  email: "Email",
};

const AdminBeranda = () => {
  const [draft, setDraft] = useState<BerandaData>(BERANDA_DEFAULT);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profilApi.beranda.get()
      .then((data) => setDraft({ ...BERANDA_DEFAULT, ...data }))
      .catch(() => {
        setDraft(BERANDA_DEFAULT);
        toast.error("Gagal memuat konten beranda", {
          description: "Konten default tetap ditampilkan.",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const patch = <K extends keyof BerandaData>(key: K, value: BerandaData[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const updateStat = (id: string, value: Partial<HomeStat>) => {
    patch("stats", draft.stats.map((item) => (item.id === id ? { ...item, ...value } : item)));
  };

  const updateFaq = (id: string, value: Partial<HomeFaq>) => {
    patch("faqs", draft.faqs.map((item) => (item.id === id ? { ...item, ...value } : item)));
  };

  const updateContact = (id: string, value: Partial<HomeContactCard>) => {
    patch("contactCards", draft.contactCards.map((item) => (item.id === id ? { ...item, ...value } : item)));
  };

  const handleSave = async () => {
    if (draft.stats.some((item) => !item.value.trim() || !item.label.trim())) {
      toast.error("Nilai dan label statistik wajib diisi");
      return;
    }

    if (draft.faqs.some((item) => !item.question.trim() || !item.answer.trim())) {
      toast.error("Pertanyaan dan jawaban FAQ wajib diisi");
      return;
    }

    if (draft.contactCards.some((item) => !item.label.trim() || !item.value.trim())) {
      toast.error("Label dan isi kontak wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const saved = await profilApi.beranda.save(draft);
      setDraft({ ...BERANDA_DEFAULT, ...saved });
      setDirty(false);
      toast.success("Konten beranda berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan konten beranda");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDraft(BERANDA_DEFAULT);
    setDirty(true);
    toast.success("Form dikembalikan ke teks default");
  };

  if (loading) {
    return (
      <AdminLayout title="Halaman Beranda">
        <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">
          Memuat konten beranda...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Halaman Beranda">
      <div className="space-y-6 max-w-5xl pb-24">
        <SectionCard
          title="Pencapaian Kami"
          description="Teks pada kotak statistik di bagian hero beranda"
          action={
            <Button
              size="sm"
              onClick={() => patch("stats", [...draft.stats, { id: newContentId("stat"), value: "", label: "" }])}
              className="rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />Tambah Statistik
            </Button>
          }
        >
          <div className="space-y-4">
            <div>
              <FieldLabel>Judul kecil</FieldLabel>
              <Input value={draft.statsTitle} onChange={(e) => patch("statsTitle", e.target.value)} className="mt-1.5 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draft.stats.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Statistik #{index + 1}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => patch("stats", draft.stats.filter((stat) => stat.id !== item.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
                    <div>
                      <FieldLabel>Angka</FieldLabel>
                      <Input value={item.value} onChange={(e) => updateStat(item.id, { value: e.target.value })} className="mt-1.5 rounded-xl" />
                    </div>
                    <div>
                      <FieldLabel>Label</FieldLabel>
                      <Input value={item.label} onChange={(e) => updateStat(item.id, { label: e.target.value })} className="mt-1.5 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="FAQ"
          description="Pertanyaan dan jawaban yang muncul di accordion beranda"
          action={
            <Button
              size="sm"
              onClick={() => patch("faqs", [...draft.faqs, { id: newContentId("faq"), question: "", answer: "" }])}
              className="rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />Tambah FAQ
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Label kecil</FieldLabel>
                <Input value={draft.faqEyebrow} onChange={(e) => patch("faqEyebrow", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <FieldLabel>Judul section</FieldLabel>
                <Input value={draft.faqTitle} onChange={(e) => patch("faqTitle", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
            </div>

            {draft.faqs.map((item, index) => (
              <div key={item.id} className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">FAQ #{index + 1}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => patch("faqs", draft.faqs.filter((faq) => faq.id !== item.id))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <FieldLabel>Pertanyaan</FieldLabel>
                    <Input value={item.question} onChange={(e) => updateFaq(item.id, { question: e.target.value })} className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <FieldLabel>Jawaban</FieldLabel>
                    <Textarea value={item.answer} onChange={(e) => updateFaq(item.id, { answer: e.target.value })} rows={4} className="mt-1.5 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Lokasi dan Kontak"
          description="Judul section dan kartu alamat, telepon, email di bawah peta"
          action={
            <Button
              size="sm"
              onClick={() => patch("contactCards", [...draft.contactCards, { id: newContentId("contact"), type: "address", label: "", value: "" }])}
              className="rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />Tambah Kontak
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Label kecil</FieldLabel>
                <Input value={draft.locationEyebrow} onChange={(e) => patch("locationEyebrow", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <FieldLabel>Judul section</FieldLabel>
                <Input value={draft.locationTitle} onChange={(e) => patch("locationTitle", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {draft.contactCards.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Kontak #{index + 1}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => patch("contactCards", draft.contactCards.filter((contact) => contact.id !== item.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <FieldLabel>Ikon</FieldLabel>
                      <Select value={item.type} onValueChange={(value) => updateContact(item.id, { type: value as HomeContactType })}>
                        <SelectTrigger className="mt-1.5 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(contactTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <FieldLabel>Label</FieldLabel>
                      <Input value={item.label} onChange={(e) => updateContact(item.id, { label: e.target.value })} className="mt-1.5 rounded-xl" />
                    </div>
                    <div>
                      <FieldLabel>Isi</FieldLabel>
                      <Textarea value={item.value} onChange={(e) => updateContact(item.id, { value: e.target.value })} rows={3} className="mt-1.5 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <PageActionBar onSave={handleSave} onReset={handleReset} dirty={dirty || saving} />
      </div>
    </AdminLayout>
  );
};

export default AdminBeranda;

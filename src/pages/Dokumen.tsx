import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, BookMarked, FileText, Lock, Download, Eye,
  GitBranch, Calendar, History, CheckCircle2, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  useDokumenStore, latestRevision, formatDate, countDocs,
  type Cover, type DocumentItem,
} from "@/data/dokumenStore";
import { toast } from "sonner";

type View =
  | { kind: "covers" }
  | { kind: "docs"; coverId: string }
  | { kind: "doc"; docId: string };

const Dokumen = () => {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const { data } = useDokumenStore();
  const [view, setView] = useState<View>({ kind: "covers" });

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const cover =
    view.kind === "docs" ? data.covers.find((c) => c.id === view.coverId)
    : view.kind === "doc" ? data.covers.find((c) => c.id === data.documents.find((d) => d.id === view.docId)?.coverId)
    : undefined;
  const doc = view.kind === "doc" ? data.documents.find((d) => d.id === view.docId) : undefined;
  const docsInCover = view.kind === "docs" ? data.documents.filter((d) => d.coverId === view.coverId) : [];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 bg-foreground">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-primary/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-5">
                <Lock className="w-3 h-3" />Area Pengguna
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-background leading-tight tracking-tight">
                Dokumen <span className="text-primary">LPM Itenas</span>
              </h1>
              <p className="mt-3 text-background/60 text-base max-w-xl">
                Pilih cover untuk melihat daftar dokumen. Setiap dokumen menampilkan revisi terbaru beserta riwayatnya.
              </p>
            </div>
            {email && (
              <div className="flex items-center gap-3 bg-background/5 border border-background/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-background/50 font-semibold">Login sebagai</p>
                  <p className="text-sm font-semibold text-background">{email}</p>
                </div>
                <button onClick={handleLogout} className="text-xs font-semibold text-primary hover:text-primary-light transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface to-transparent" />
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            <button onClick={() => setView({ kind: "covers" })} className="font-semibold text-muted-foreground hover:text-primary transition-colors">
              Semua Cover
            </button>
            {cover && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                <button
                  onClick={() => setView({ kind: "docs", coverId: cover.id })}
                  className={`font-semibold transition-colors ${view.kind === "doc" ? "text-muted-foreground hover:text-primary" : "text-foreground"}`}
                >
                  {cover.title}
                </button>
              </>
            )}
            {doc && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                <span className="font-semibold text-foreground">{doc.name}</span>
              </>
            )}
          </nav>

          {/* COVERS GRID */}
          {view.kind === "covers" && (
            <>
              {data.covers.length === 0 ? (
                <EmptyState icon={<BookMarked />} text="Belum ada dokumen yang dipublikasikan." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.covers.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setView({ kind: "docs", coverId: c.id })}
                      className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-up text-left"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary to-primary-light overflow-hidden">
                        {c.image ? (
                          <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-3xl bg-background/15 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                              <BookMarked className="w-12 h-12 text-background" strokeWidth={1.5} />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-foreground/70 backdrop-blur-sm text-background text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                          <FileText className="w-3 h-3" />{countDocs(data, c.id)} Dokumen
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-black text-foreground text-lg leading-tight group-hover:text-primary transition-colors">{c.title}</h3>
                        {c.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{c.description}</p>}
                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          Lihat Dokumen <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* DOCS LIST */}
          {view.kind === "docs" && cover && (
            <DocsListPublic
              cover={cover}
              docs={docsInCover}
              onOpen={(id) => setView({ kind: "doc", docId: id })}
            />
          )}

          {/* DOC DETAIL */}
          {view.kind === "doc" && doc && cover && (
            <DocDetailPublic
              doc={doc}
              cover={cover}
              onBack={() => setView({ kind: "docs", coverId: cover.id })}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Dokumen;

/* ─────────────────────────────────────────────────────────── */

function DocsListPublic({
  cover, docs, onOpen,
}: { cover: Cover; docs: DocumentItem[]; onOpen: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex items-center gap-5 shadow-sm">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shrink-0 overflow-hidden shadow-lg shadow-primary/20">
          {cover.image
            ? <img src={cover.image} alt={cover.title} className="w-full h-full object-cover" />
            : <BookMarked className="w-9 h-9 text-primary-foreground" />}
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-black text-foreground">{cover.title}</h2>
          {cover.description && <p className="text-sm text-muted-foreground mt-1">{cover.description}</p>}
        </div>
      </div>

      {docs.length === 0 ? (
        <EmptyState icon={<FileText />} text="Belum ada dokumen di cover ini." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((d) => {
            const last = latestRevision(d);
            return (
              <button
                key={d.id}
                onClick={() => onOpen(d.id)}
                className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{d.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground flex-wrap">
                      {d.jenis && <span>{d.jenis}</span>}
                      {d.jenis && <span>·</span>}
                      <span>{d.unit}</span>
                    </div>
                    {last && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />{last.version}
                        </span>
                        {d.revisions.length > 1 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-500 font-semibold">
                            <GitBranch className="w-3 h-3" />{d.revisions.length} Revisi
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">· {formatDate(last.uploadedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DocDetailPublic({
  doc, cover, onBack,
}: { doc: DocumentItem; cover: Cover; onBack: () => void }) {
  const last = latestRevision(doc);
  const older = doc.revisions.slice(1);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />Kembali ke {cover.title}
      </button>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">{cover.title}</p>
        <h1 className="text-3xl font-black text-foreground mt-1">{doc.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {doc.jenis && <span className="inline-flex items-center gap-1 bg-muted text-foreground/80 px-2.5 py-1 rounded-full text-[11px] font-semibold">{doc.jenis}</span>}
          <span className="inline-flex items-center gap-1 bg-muted text-foreground/80 px-2.5 py-1 rounded-full text-[11px] font-semibold">{doc.unit}</span>
          <span className="inline-flex items-center gap-1 bg-muted text-foreground/80 px-2.5 py-1 rounded-full text-[11px] font-semibold">{doc.kegiatan}</span>
        </div>
      </div>

      {/* Latest version (revisi terbaru tampil pertama) */}
      {last && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />Versi Terbaru
            </span>
            <span className="text-sm text-muted-foreground font-mono">{last.version}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{last.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  Diunggah {formatDate(last.uploadedAt)}
                  {last.fileSize && ` · ${(last.fileSize / 1024).toFixed(0)} KB`}
                </p>
                {last.alasanRevisi && <p className="text-sm text-foreground/80 mt-1 italic">"{last.alasanRevisi}"</p>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toast(`Pratinjau: ${last.fileName}`)} className="inline-flex items-center gap-2 bg-card border border-border hover:border-primary/40 text-foreground rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors">
                <Eye className="w-4 h-4" />Lihat
              </button>
              <button onClick={() => toast.success("Unduhan dimulai", { description: last.fileName })} className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-md shadow-primary/20">
                <Download className="w-4 h-4" />Unduh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {older.length > 0 && (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-bold text-sm">Riwayat Revisi Sebelumnya</h3>
            <span className="text-xs text-muted-foreground">({older.length})</span>
          </div>
          <div>
            {older.map((rev, i) => (
              <div key={rev.id} className="flex gap-4 px-6 py-4 border-t border-border first:border-t-0">
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/40 ring-4 ring-muted" />
                  {i < older.length - 1 && <div className="flex-1 w-px bg-border mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-foreground font-mono">{rev.version}</span>
                      <p className="text-sm text-foreground mt-1 truncate">{rev.fileName}</p>
                      <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />{formatDate(rev.uploadedAt)}
                        {rev.fileSize && <> · {(rev.fileSize / 1024).toFixed(0)} KB</>}
                      </p>
                      {rev.alasanRevisi && <p className="text-xs text-muted-foreground mt-1.5 italic">"{rev.alasanRevisi}"</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toast(`Pratinjau: ${rev.fileName}`)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-muted">
                        <Eye className="w-3.5 h-3.5" />Lihat
                      </button>
                      <button onClick={() => toast.success("Unduhan dimulai", { description: rev.fileName })} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-muted">
                        <Download className="w-3.5 h-3.5" />Unduh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center">
      <div className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3">{icon}</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

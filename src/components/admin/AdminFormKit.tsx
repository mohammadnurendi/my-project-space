import { ReactNode } from "react";
import { Save, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/* ─── Section card ───────────────────────────────────────── */
export function SectionCard({ title, description, children, action }: {
  title: string; description?: string; children: ReactNode; action?: ReactNode;
}) {
  return (
    <section className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 md:px-6 py-4 border-b border-border bg-muted/30">
        <div>
          <h2 className="text-base md:text-lg font-black text-foreground">{title}</h2>
          {description && <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {action}
      </header>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

/* ─── Field label ────────────────────────────────────────── */
export function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <Label className="text-[13px] font-semibold text-foreground/80">
      {children}{required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );
}

export function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-destructive mt-1.5 font-medium">
      <AlertCircle className="w-3 h-3 shrink-0" />{msg}
    </p>
  );
}

/* ─── Page action bar (sticky bottom) ─────────────────────── */
export function PageActionBar({ onSave, onReset, dirty }: { onSave: () => void; onReset?: () => void; dirty?: boolean }) {
  return (
    <div className="sticky bottom-4 z-20 mt-8">
      <div className="bg-card border border-border rounded-2xl shadow-lg shadow-foreground/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className={`w-2 h-2 rounded-full ${dirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
          {dirty ? "Ada perubahan belum disimpan" : "Tersimpan"}
        </div>
        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset} className="rounded-xl gap-2">
              <RotateCcw className="w-4 h-4" />Reset Default
            </Button>
          )}
          <Button onClick={onSave} size="sm" className="rounded-xl gap-2 shadow-md shadow-primary/20">
            <Save className="w-4 h-4" />Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}

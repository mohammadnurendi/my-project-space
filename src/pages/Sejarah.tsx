import HeroSection from "@/components/HeroSection";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const history = [
  {
    year: "2003",
    title: "Penetapan LPM dalam Statuta Itenas",
    content:
      "Keberadaan Lembaga Penjaminan Mutu (LPM) dalam struktur organisasi Itenas ditetapkan dalam Statuta Itenas, sebagai tindak lanjut dari keberhasilan empat jurusan dalam memperoleh hibah TPSDP dari Dikti.",
  },
  {
    year: "2005",
    title: "Pembentukan Resmi LPM",
    content:
      "Secara resmi LPM (dahulu UPM) baru dibentuk pada bulan Juli 2005. Selama 2005-2006 LPM belum dapat menjalankan fungsinya secara efektif, antara lain karena pemahaman para dosen dan karyawan tentang sistem penjaminan mutu masih sangat rendah.",
  },
  {
    year: "2006",
    title: "Hibah ISS-QA dari TPSDP",
    content:
      "Pada bulan Juni 2006 sampai Juli 2007 LPM Itenas memperoleh Hibah Institutional Support System- Quality Assurance (ISS-QA) dari TPSDP. Hibah ini membantu meletakkan dasar proses pembangunan sistem penjaminan mutu.",
  },
  {
    year: "2016",
    title: "Perubahan Struktur Organisasi",
    content:
      "Dalam Statuta ITENAS tahun 2016, struktur organisasi LPM terdiri dari kepala LPM dan dibantu oleh dua Wakil Kepala, yaitu Wakil Kepala Bidang Pengembangan Standar dan Wakil Kepala Pengawasan Internal. LPM dibantu oleh peer group jurusan dalam menjalankan penjaminan mutu.",
  },
];

const tasks = [
  "Merencanakan, melaksanakan, mengevaluasi, mengendalikan, dan mengembangkan SPMI;",
  "Menyusun dokumen SPMI yang terdiri atas dokumen kebijakan SPMI, dokumen manual SPMI, dokumen standar dalam SPMI, dan dokumen formulir yang digunakan dalam SPMI;",
  "Membentuk unit penjaminan mutu atau mengintegrasikan SPMI pada manajemen perguruan tinggi;",
  "Mengelola Pangkalan Data Pendidikan Tinggi (PD Dikti) pada tingkat perguruan tinggi;",
];

const Sejarah = () => {
  return (
    <div>
      <HeroSection
        titleBlack="SEJARAH"
        titleOrange="LPM ITENAS"
        badge="Profil"
        subtitle="Perjalanan panjang Lembaga Penjaminan Mutu Institut Teknologi Nasional Bandung"
      />

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="text-center mb-16 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Sejarah
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Sejarah <span className="text-primary">LPM Itenas</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Keberadaan Lembaga Penjaminan Mutu (LPM) dalam struktur organisasi Itenas telah ditetapkan sejak tahun 2003 dalam Statuta Itenas, sebagai tindak lanjut dari keberhasilan empat jurusan yaitu jurusan Teknik Industri, Teknik Sipil, Teknik Mesin dan Teknik Kimia dalam memperoleh hibah Technological and Professional Skills Development Sector Project (TPSDP) dari Dikti pada tahun 2002 dan 2003.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            {history.map((event, i) => (
              <div
                key={i}
                className="flex gap-6 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-sm leading-tight text-center",
                      i % 2 === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-primary border-2 border-primary/20"
                    )}
                  >
                    {event.year}
                  </div>
                  {i < history.length - 1 && (
                    <div className="w-0.5 flex-1 bg-primary/10 mt-3 min-h-8" />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all duration-300">
                    <h3 className="font-bold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{event.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legal box */}
          <div className="mt-12 bg-accent border border-primary/10 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Scale className="text-primary w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-3">Tugas & Wewenang Perguruan Tinggi</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Program penjaminan mutu di Itenas dilaksanakan berdasarkan Permenristekdikti No 62 tahun 2016, sebagaimana dicantumkan dalam BAB III pasal 8 ayat 4 mengenai Tugas dan wewenang, yaitu:
                </p>
                <ol className="space-y-2">
                  {tasks.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-xs text-muted-foreground italic">
                  - Permenristekdikti No 62 tahun 2016 BAB III pasal 8 ayat 4 mengenai Tugas dan wewenang
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sejarah;

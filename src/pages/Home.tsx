import { Link } from "react-router-dom";
import { ArrowRight, FileText, Files, BookOpen, ClipboardList, MapPin, Phone, Mail } from "lucide-react";
import FaqAccordion, { FaqItem } from "@/components/FaqAccordion";
import { cn } from "@/lib/utils";

const documents = [
  { title: "Dokumen Pedoman", sub: "Sistem Penjaminan Mutu", bg: "bg-blue-900", Icon: FileText },
  { title: "Formulir", sub: "Sistem Penjaminan Mutu", bg: "bg-foreground", Icon: Files },
  { title: "Dokumen Kebijakan", sub: "Sistem Penjaminan Mutu", bg: "bg-primary", Icon: ClipboardList },
  { title: "Dokumen Manual", sub: "Sistem Penjaminan Mutu", bg: "bg-purple-900", Icon: BookOpen },
];

const faqs: FaqItem[] = [
  {
    question: "Apa itu Lembaga Penjamin Mutu?",
    answer:
      "Lembaga penjamin mutu (LPM) di perguruan tinggi adalah salah satu elemen yang penting dalam sistem pendidikan tinggi. LPM berfungsi untuk memastikan bahwa proses pendidikan yang diberikan oleh perguruan tinggi memiliki kualitas yang terjaga dan memenuhi standar yang telah ditetapkan oleh otoritas pendidikan nasional maupun kebutuhan masyarakat.",
  },
  {
    question: "Hotline Lembaga Penjamin Mutu?",
    answer:
      "Lembaga Penjamin Mutu adalah memiliki hotline di platform Whatsapp. Dapat diakses melalui: +62-227-2722-15",
  },
  {
    question: "Apa saja tugas dan wewenang LPM?",
    answer:
      "LPM bertugas merencanakan, melaksanakan, mengevaluasi, mengendalikan, dan mengembangkan SPMI; menyusun dokumen SPMI; membentuk unit penjaminan mutu; serta mengelola Pangkalan Data Pendidikan Tinggi (PD Dikti) pada tingkat perguruan tinggi.",
  },
  {
    question: "Bagaimana cara mengakses dokumen LPM?",
    answer:
      "Dokumen LPM dapat diakses melalui menu Dokumen di website ini. Tersedia berbagai jenis dokumen seperti Dokumen Manual, Formulir, Dokumen Standar, Dokumen Kebijakan, dan lainnya.",
  },
];

const locationInfo = [
  { Icon: MapPin, label: "Alamat", value: "Jl. PH.H. Mustofa No.23 Bandung, 40124" },
  { Icon: Phone, label: "Telepon", value: "+62-227-2722-15" },
  { Icon: Mail, label: "Email", value: "lpm@itenas.ac.id" },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 bg-foreground min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-primary/30" />
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-60 h-60 bg-primary-light/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Institut Teknologi Nasional Bandung
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-background leading-[1.05] tracking-tight">
              SELAMAT DATANG DI<br />
              <span className="text-primary">LEMBAGA</span><br />
              <span className="text-background">PENJAMINAN MUTU</span>
            </h1>
            <p className="mt-6 text-background/60 text-lg leading-relaxed max-w-lg">
              Memastikan kualitas pendidikan yang terjaga dan memenuhi standar otoritas pendidikan nasional maupun kebutuhan masyarakat.
            </p>
            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <Link
                to="/sejarah"
                className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
              >
                Pelajari Lebih Lanjut
              </Link>
              <Link
                to="/tim"
                className="text-background/60 hover:text-background flex items-center gap-2 text-sm font-medium transition-colors duration-200"
              >
                Tim LPM Itenas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Document Cards */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Dokumen Kami
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Dokumen <span className="text-primary">LPM Itenas</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">
              Akses semua dokumen resmi Sistem Penjaminan Mutu Internal Itenas
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {documents.map((doc, i) => {
              const { Icon } = doc;
              return (
                <div
                  key={i}
                  className={cn(
                    "group cursor-pointer relative rounded-2xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2",
                    doc.bg
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent z-10" />
                  <div className="absolute top-4 right-4 w-10 h-10 bg-background/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
                    <Icon className="text-background w-5 h-5" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <h3 className="text-background font-bold text-sm leading-tight">{doc.title}</h3>
                    <p className="text-background/60 text-xs mt-1">{doc.sub}</p>
                  </div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              F.A.Q
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Pertanyaan Yang Sering Diajukan <span className="text-primary">LPM ITENAS</span>
            </h2>
          </div>

          <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Lokasi
            </span>
            <h2 className="text-3xl font-black text-foreground">Lokasi Kami</h2>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-border">
            <iframe
              title="Lokasi LPM Itenas"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.196843706265!2d107.63271731477248!3d-6.919249695003085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e763c5d72989%3A0x1235c16ec0af5ef1!2sInstitut%20Teknologi%20Nasional%20Bandung!5e0!3m2!1sid!2sid!4v1680000000000!5m2!1sid!2sid"
              width="100%"
              height={420}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {locationInfo.map((info) => {
              const { Icon } = info;
              return (
                <div key={info.label} className="flex items-start gap-3 bg-surface rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {info.label}
                    </p>
                    <p className="text-sm text-foreground font-medium mt-0.5">{info.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

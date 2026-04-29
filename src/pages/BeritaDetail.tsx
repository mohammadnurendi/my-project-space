import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, Clock, User, Tag,
  ChevronRight, Newspaper, TrendingUp, BookOpen, Megaphone,
  Eye,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
type BeritaItem = {
  id: string;
  judul: string;
  kategori: string;
  ringkasan: string;
  isi: string;
  penulis: string;
  tanggal: string;
  gambar: string;
  featured: boolean;
  tags: string[];
};

/* ─── Shared seed data ───────────────────────────────────── */
const seedBerita: BeritaItem[] = [
  {
    id: "BRT-001",
    judul: "LPM Itenas Sukses Laksanakan Audit Mutu Internal Semester Ganjil 2024/2025",
    kategori: "Audit",
    ringkasan: "Audit Mutu Internal (AMI) semester ganjil tahun akademik 2024/2025 telah dilaksanakan secara menyeluruh di seluruh unit kerja Itenas, mencakup 12 program studi dan 6 unit layanan.",
    isi: `Lembaga Penjaminan Mutu (LPM) Institut Teknologi Nasional Bandung (Itenas) telah berhasil melaksanakan Audit Mutu Internal (AMI) untuk semester ganjil tahun akademik 2024/2025 secara menyeluruh dan komprehensif.

Pelaksanaan AMI kali ini mencakup 12 program studi yang tersebar di seluruh fakultas di lingkungan Itenas, serta 6 unit layanan pendukung akademik. Kegiatan audit berlangsung selama dua minggu penuh, yakni dari tanggal 10 hingga 24 Oktober 2025.

**Cakupan dan Metodologi Audit**

Tim auditor yang terdiri dari 27 auditor internal terlatih melaksanakan audit dengan menggunakan standar dan instrumen yang telah ditetapkan dalam dokumen SPMI Itenas. Metodologi yang digunakan meliputi desk evaluation terhadap dokumen dan laporan kinerja, wawancara mendalam dengan pimpinan unit, observasi lapangan terhadap proses pembelajaran dan pelayanan, serta verifikasi data capaian standar mutu.

Setiap program studi dinilai berdasarkan delapan standar utama yang mencakup standar kompetensi lulusan, standar isi pembelajaran, standar proses pembelajaran, standar penilaian pembelajaran, standar dosen dan tenaga kependidikan, standar sarana dan prasarana, standar pengelolaan, serta standar pembiayaan.

**Hasil dan Temuan**

Secara umum, hasil AMI semester ganjil 2024/2025 menunjukkan peningkatan yang signifikan dibandingkan periode sebelumnya. Sebanyak 9 dari 12 program studi berhasil memenuhi seluruh standar yang ditetapkan dengan kategori sangat baik. Tiga program studi lainnya masih memerlukan beberapa perbaikan minor pada aspek dokumentasi dan pelaporan.

Kepala LPM Itenas menyampaikan apresiasinya atas komitmen seluruh civitas akademika dalam mendukung kegiatan penjaminan mutu. Beliau menekankan bahwa AMI bukan sekadar formalitas, melainkan instrumen strategis untuk terus meningkatkan kualitas pendidikan di Itenas.

**Tindak Lanjut dan Rekomendasi**

Seluruh temuan audit telah didokumentasikan dan akan ditindaklanjuti oleh masing-masing unit dalam bentuk Rencana Tindak Lanjut (RTL) yang harus diselesaikan dalam 30 hari kerja. LPM akan melakukan pemantauan terhadap implementasi RTL tersebut pada periode berikutnya.

Dengan suksesnya pelaksanaan AMI ini, LPM Itenas berharap seluruh program studi dapat mempertahankan dan bahkan meningkatkan capaian standar mutu pada periode-periode berikutnya demi mewujudkan Itenas sebagai perguruan tinggi unggulan di tingkat nasional maupun internasional.`,
    penulis: "Tim LPM Itenas",
    tanggal: "2025-10-24",
    gambar: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1200&auto=format&fit=crop",
    featured: true,
    tags: ["Audit", "AMI", "Mutu", "SPMI"],
  },
  {
    id: "BRT-002",
    judul: "Workshop Penyusunan Kurikulum Berbasis OBE bersama Seluruh Program Studi",
    kategori: "Kegiatan",
    ringkasan: "LPM Itenas menyelenggarakan workshop penyusunan kurikulum berbasis Outcome-Based Education (OBE) yang diikuti oleh seluruh ketua program studi dan tim kurikulum.",
    isi: `Lembaga Penjaminan Mutu (LPM) Itenas kembali menyelenggarakan workshop strategis dalam rangka pengembangan kurikulum berbasis Outcome-Based Education (OBE) yang diikuti oleh seluruh Ketua Program Studi beserta tim kurikulum masing-masing.

Workshop yang berlangsung selama dua hari penuh ini bertujuan untuk menyamakan pemahaman dan memperkuat kapasitas seluruh program studi dalam menyusun kurikulum yang berorientasi pada capaian pembelajaran (learning outcomes).

**Latar Belakang**

Implementasi OBE merupakan tuntutan dari Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi yang mengharuskan seluruh program studi menyusun kurikulum yang berpusat pada mahasiswa dan berorientasi pada capaian. LPM sebagai lembaga penjaminan mutu berperan aktif dalam memfasilitasi proses ini.

**Narasumber dan Materi**

Workshop menghadirkan narasumber dari Direktorat Pembelajaran dan Kemahasiswaan Kemendikbudristek serta pakar pendidikan tinggi dari Universitas Gadjah Mada. Materi yang disampaikan mencakup konsep dasar OBE dan perbedaannya dengan pendekatan konvensional, teknik penyusunan Capaian Pembelajaran Lulusan (CPL), pemetaan CPL ke dalam Capaian Pembelajaran Mata Kuliah (CPMK), desain asesmen berbasis capaian, serta integrasi soft skills dalam kurikulum.

**Hasil Workshop**

Seluruh peserta berhasil menyusun draft rencana revisi kurikulum berbasis OBE untuk program studi masing-masing. Draft tersebut akan menjadi acuan dalam proses revisi kurikulum yang dijadwalkan selesai pada akhir semester ganjil 2024/2025.

LPM akan terus mendampingi setiap program studi dalam proses implementasi OBE dan memberikan asistensi teknis yang diperlukan.`,
    penulis: "Divisi Akademik LPM",
    tanggal: "2025-10-18",
    gambar: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop",
    featured: true,
    tags: ["Workshop", "OBE", "Kurikulum", "Pembelajaran"],
  },
  {
    id: "BRT-003",
    judul: "Itenas Raih Akreditasi Unggul dari BAN-PT untuk 8 Program Studi",
    kategori: "Prestasi",
    ringkasan: "Sebanyak 8 program studi di Institut Teknologi Nasional Bandung berhasil meraih akreditasi Unggul dari Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT) pada periode penilaian 2025.",
    isi: `Sebuah pencapaian membanggakan diraih Institut Teknologi Nasional Bandung (Itenas) pada tahun 2025 ini. Sebanyak 8 program studi berhasil meraih predikat Akreditasi Unggul dari Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT), menjadikan Itenas sebagai salah satu perguruan tinggi dengan capaian akreditasi tertinggi di Jawa Barat.

**Program Studi yang Meraih Akreditasi Unggul**

Kedelapan program studi yang berhasil meraih predikat Unggul tersebut adalah Teknik Sipil, Teknik Mesin, Teknik Elektro, Teknik Informatika, Arsitektur, Desain Produk, Manajemen, dan Teknik Industri. Pencapaian ini merupakan hasil dari kerja keras seluruh sivitas akademika yang telah berjuang selama bertahun-tahun untuk memenuhi dan melampaui standar akreditasi nasional.

**Peran LPM dalam Proses Akreditasi**

LPM Itenas memainkan peran sentral dalam mempersiapkan seluruh program studi menuju akreditasi Unggul. Selama dua tahun terakhir, LPM telah melaksanakan berbagai program pendampingan, mulai dari workshop penyusunan laporan evaluasi diri, simulasi visitasi, hingga pembenahan dokumentasi standar mutu secara menyeluruh.

Kepala LPM Itenas mengungkapkan bahwa capaian ini bukan hanya kebanggaan LPM, melainkan kebanggaan seluruh Itenas. Pencapaian akreditasi Unggul ini membuktikan bahwa komitmen Itenas terhadap kualitas pendidikan tidak pernah surut.

**Dampak bagi Mahasiswa dan Lulusan**

Dengan predikat Unggul, para lulusan program studi tersebut akan semakin diakui kompetensinya di tingkat nasional maupun internasional. Selain itu, hal ini juga membuka peluang yang lebih luas dalam hal kerja sama dengan industri dan lembaga pendidikan internasional.

Rektor Itenas menyampaikan apresiasi yang setinggi-tingginya kepada seluruh dosen, tenaga kependidikan, mahasiswa, dan alumnus yang telah berkontribusi dalam pencapaian membanggakan ini.`,
    penulis: "Humas Itenas",
    tanggal: "2025-10-12",
    gambar: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop",
    featured: false,
    tags: ["Akreditasi", "BAN-PT", "Prestasi", "Unggul"],
  },
  {
    id: "BRT-004",
    judul: "Sosialisasi Standar Mutu Baru SPMI kepada Dosen dan Tenaga Kependidikan",
    kategori: "Pengumuman",
    ringkasan: "LPM Itenas melaksanakan sosialisasi standar mutu terbaru dalam Sistem Penjaminan Mutu Internal (SPMI) kepada seluruh dosen dan tenaga kependidikan di lingkungan Itenas.",
    isi: `LPM Itenas telah melaksanakan rangkaian kegiatan sosialisasi Standar Mutu terbaru dalam Sistem Penjaminan Mutu Internal (SPMI) kepada seluruh dosen dan tenaga kependidikan di lingkungan Itenas. Kegiatan ini dilaksanakan dalam beberapa sesi untuk menjangkau seluruh sivitas akademika.

**Latar Belakang Pembaruan Standar**

Pembaruan standar mutu SPMI Itenas dilakukan sebagai respons terhadap perubahan regulasi pendidikan tinggi yang diterbitkan oleh Kemendikbudristek, perkembangan standar internasional yang harus diadopsi, serta hasil evaluasi dan masukan dari proses Audit Mutu Internal periode sebelumnya. Standar yang diperbarui mencakup aspek pembelajaran, penelitian, pengabdian masyarakat, serta tata kelola institusi.

**Materi Sosialisasi**

Dalam sosialisasi ini, peserta mendapatkan pemaparan mengenai perubahan dan penambahan indikator standar mutu yang baru, mekanisme pelaporan dan dokumentasi yang lebih efisien, sistem monitoring dan evaluasi berbasis teknologi informasi, serta sanksi dan insentif dalam implementasi standar mutu.

**Respons Peserta**

Antusiasme peserta sangat tinggi dalam mengikuti kegiatan sosialisasi ini. Banyak pertanyaan dan diskusi produktif yang muncul terkait implementasi standar baru di unit kerja masing-masing. LPM berkomitmen untuk menyediakan panduan teknis dan helpdesk yang siap membantu seluruh unit dalam mengimplementasikan standar mutu yang baru.

**Jadwal Implementasi**

Implementasi standar mutu yang baru akan berlaku efektif mulai semester genap tahun akademik 2024/2025. LPM akan melakukan monitoring secara berkala dan menyediakan sesi tanya jawab lanjutan bagi unit yang memerlukan klarifikasi lebih lanjut.`,
    penulis: "Tim LPM Itenas",
    tanggal: "2025-10-05",
    gambar: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=1200&auto=format&fit=crop",
    featured: false,
    tags: ["SPMI", "Sosialisasi", "Standar", "Mutu"],
  },
  {
    id: "BRT-005",
    judul: "Pelatihan Auditor Internal Angkatan XII: Mencetak Auditor Kompeten",
    kategori: "Kegiatan",
    ringkasan: "Program pelatihan auditor internal angkatan ke-12 telah resmi dibuka. Sebanyak 35 peserta dari berbagai unit akan mengikuti rangkaian pelatihan intensif selama 3 hari.",
    isi: `Program Pelatihan Auditor Internal Angkatan XII resmi dibuka oleh Kepala LPM Itenas dalam sebuah upacara pembukaan yang sederhana namun penuh makna. Sebanyak 35 peserta dari berbagai unit kerja di lingkungan Itenas akan mengikuti rangkaian pelatihan intensif selama tiga hari penuh.

**Pentingnya Auditor Internal**

Auditor internal merupakan ujung tombak dari sistem penjaminan mutu di perguruan tinggi. Tanpa auditor yang kompeten dan berintegritas, proses AMI tidak akan berjalan efektif. Oleh karena itu, LPM secara rutin menyelenggarakan pelatihan untuk memperbarui kompetensi auditor yang sudah ada dan mencetak auditor-auditor baru.

**Materi Pelatihan**

Selama tiga hari pelatihan, peserta akan mendapatkan materi yang komprehensif meliputi konsep dan prinsip dasar audit mutu internal, teknik wawancara dan pengumpulan bukti audit, analisis gap dan penulisan temuan audit, penyusunan laporan audit yang efektif, kode etik auditor, serta simulasi dan praktik langsung audit.

**Profil Peserta**

Peserta yang mengikuti pelatihan ini berasal dari berbagai latar belakang, terdiri dari dosen dari berbagai program studi, tenaga kependidikan dari unit layanan, serta staf dari lembaga dan unit kerja non-akademik. Keberagaman peserta ini diharapkan dapat memperkaya perspektif dalam pelaksanaan audit.

**Sertifikasi**

Peserta yang berhasil menyelesaikan seluruh rangkaian pelatihan dan lulus ujian kompetensi akan mendapatkan sertifikat sebagai Auditor Internal Itenas yang diakui secara institusional. Sertifikat ini berlaku selama tiga tahun dan dapat diperpanjang melalui pelatihan penyegaran.`,
    penulis: "Divisi Audit LPM",
    tanggal: "2025-09-28",
    gambar: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop",
    featured: false,
    tags: ["Auditor", "Pelatihan", "AMI", "Kompetensi"],
  },
  {
    id: "BRT-006",
    judul: "Rapat Tinjauan Manajemen: Evaluasi Kinerja Tahunan LPM 2024",
    kategori: "Kegiatan",
    ringkasan: "Rapat Tinjauan Manajemen (RTM) tahunan LPM Itenas dilaksanakan untuk mengevaluasi capaian kinerja sepanjang tahun 2024 dan merumuskan program kerja strategis tahun 2025.",
    isi: `Lembaga Penjaminan Mutu (LPM) Itenas telah menyelenggarakan Rapat Tinjauan Manajemen (RTM) tahunan sebagai bagian dari siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan) dalam sistem penjaminan mutu internal.

RTM yang dihadiri oleh seluruh pimpinan LPM, ketua program studi, kepala unit kerja, serta perwakilan dari rektorat ini menjadi forum strategis untuk mengevaluasi seluruh capaian kinerja LPM sepanjang tahun 2024.

**Agenda Utama RTM**

RTM kali ini membahas beberapa agenda strategis, antara lain review hasil AMI semester genap dan ganjil 2024, evaluasi implementasi standar mutu di seluruh unit, perkembangan status akreditasi program studi, capaian indikator kinerja utama (IKU) Itenas, serta kendala dan hambatan dalam implementasi SPMI.

**Capaian Positif Tahun 2024**

Dalam paparannya, Kepala LPM menyampaikan beberapa capaian positif yang berhasil diraih sepanjang tahun 2024. Di antaranya adalah peningkatan persentase program studi dengan kategori Unggul dan Baik Sekali dalam AMI, berhasilnya 8 program studi meraih akreditasi Unggul dari BAN-PT, terlaksananya seluruh program kerja yang telah direncanakan, serta meningkatnya partisipasi sivitas akademika dalam kegiatan penjaminan mutu.

**Program Kerja 2025**

Berdasarkan hasil evaluasi, RTM merumuskan beberapa program kerja prioritas untuk tahun 2025, yang berfokus pada digitalisasi sistem pelaporan SPMI, persiapan akreditasi internasional untuk program studi unggulan, penguatan budaya mutu di kalangan mahasiswa, serta pengembangan sistem monev yang lebih real-time dan transparan.`,
    penulis: "Tim LPM Itenas",
    tanggal: "2025-09-15",
    gambar: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop",
    featured: false,
    tags: ["RTM", "Evaluasi", "Manajemen", "PPEPP"],
  },
];

/* ─── Helpers ────────────────────────────────────────────── */
const formatTanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const estimasiWaktuBaca = (isi: string) => {
  const words = isi.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const kategoriColor = (k: string) =>
  ({
    Audit: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    Kegiatan: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    Prestasi: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    Pengumuman: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  } as Record<string, string>)[k] ?? "bg-muted text-muted-foreground";

const kategoriIcon = (k: string) =>
  ({
    Audit: TrendingUp,
    Kegiatan: BookOpen,
    Prestasi: Newspaper,
    Pengumuman: Megaphone,
  } as Record<string, React.ElementType>)[k] ?? Newspaper;

/* ─── Render isi dengan bold/heading sederhana ─────────── */
function RenderIsi({ isi }: { isi: string }) {
  const paragraphs = isi.trim().split(/\n\n+/);
  return (
    <div className="space-y-5">
      {paragraphs.map((p, i) => {
        // heading jika diawali **teks**
        const headingMatch = p.match(/^\*\*(.+?)\*\*$/);
        if (headingMatch) {
          return (
            <h3 key={i} className="text-lg font-black text-foreground mt-8 mb-2 first:mt-0 border-l-4 border-primary pl-4">
              {headingMatch[1]}
            </h3>
          );
        }
        // inline bold
        const parts = p.split(/(\*\*.+?\*\*)/g);
        return (
          <p key={i} className="text-[15px] text-foreground/80 leading-relaxed">
            {parts.map((part, j) => {
              const bold = part.match(/^\*\*(.+?)\*\*$/);
              return bold ? <strong key={j} className="font-bold text-foreground">{bold[1]}</strong> : part;
            })}
          </p>
        );
      })}
    </div>
  );
}

/* ─── Related card ───────────────────────────────────────── */
function RelatedCard({ berita }: { berita: BeritaItem }) {
  const KatIcon = kategoriIcon(berita.kategori);
  return (
    <Link
      to={`/berita/${berita.id}`}
      className="group flex gap-3 items-start p-3 rounded-2xl hover:bg-muted/60 transition-colors"
    >
      <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
        <img src={berita.gambar} alt={berita.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${kategoriColor(berita.kategori)}`}>
          <KatIcon className="w-2.5 h-2.5" />{berita.kategori}
        </span>
        <p className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {berita.judul}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
          <Calendar className="w-3 h-3" />{formatTanggal(berita.tanggal)}
        </p>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const BeritaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const berita = seedBerita.find((b) => b.id === id);
  const related = seedBerita.filter((b) => b.id !== id).slice(0, 4);

  /* ── Not found ── */
  if (!berita) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center pt-16">
        <div className="text-center px-4">
          <Newspaper className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-foreground mb-2">Berita tidak ditemukan</h1>
          <p className="text-muted-foreground mb-6">Berita yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  const waktuBaca = estimasiWaktuBaca(berita.isi);
  const KatIcon = kategoriIcon(berita.kategori);

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Hero image ── */}
      <div className="relative w-full h-[320px] md:h-[480px] lg:h-[540px] bg-foreground overflow-hidden">
        <img
          src={berita.gambar}
          alt={berita.judul}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Breadcrumb di atas hero */}
        <div className="absolute top-0 left-0 right-0 pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <nav className="flex items-center gap-2 text-[12px] text-white/60 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/berita" className="hover:text-white transition-colors">Berita</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/40 truncate max-w-[200px]">{berita.judul}</span>
            </nav>
          </div>
        </div>

        {/* Judul di bawah hero */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
          <div className="max-w-5xl mx-auto">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full mb-4 ${kategoriColor(berita.kategori)}`}>
              <KatIcon className="w-3 h-3" />{berita.kategori}
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight max-w-3xl">
              {berita.judul}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* ── Main article ── */}
          <article className="flex-1 min-w-0">

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-primary" />
                {berita.penulis}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                {formatTanggal(berita.tanggal)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {waktuBaca} menit baca
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-primary" />
                1.2K views
              </span>
            </div>

            {/* Ringkasan / lead */}
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-2xl px-5 py-4 mb-8">
              <p className="text-[15px] font-semibold text-foreground/90 leading-relaxed italic">
                {berita.ringkasan}
              </p>
            </div>

            {/* Isi artikel */}
            <RenderIsi isi={berita.isi} />

            {/* Tags */}
            {berita.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-border">
                <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                {berita.tags.map((t) => (
                  <span key={t} className="inline-flex items-center bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground text-[12px] font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-colors">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Back button */}
            <div className="mt-10">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Kembali ke halaman sebelumnya
              </button>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">

            {/* Tentang LPM */}
            <div className="bg-card border border-border rounded-3xl p-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="font-black text-foreground text-base mb-2">LPM Itenas</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                Lembaga Penjaminan Mutu Institut Teknologi Nasional Bandung berkomitmen untuk menjaga dan meningkatkan kualitas pendidikan secara berkelanjutan.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5 transition-all"
              >
                Pelajari lebih lanjut <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Kategori */}
            <div className="bg-card border border-border rounded-3xl p-5">
              <h3 className="font-black text-foreground text-base mb-4">Kategori Berita</h3>
              <div className="space-y-1">
                {["Audit", "Kegiatan", "Prestasi", "Pengumuman"].map((k) => {
                  const KatIcon2 = kategoriIcon(k);
                  const count = seedBerita.filter((b) => b.kategori === k).length;
                  return (
                    <Link
                      key={k}
                      to={`/berita`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted group transition-colors"
                    >
                      <span className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                        <KatIcon2 className="w-4 h-4" />{k}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">{count}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Berita terkait */}
            <div className="bg-card border border-border rounded-3xl p-5">
              <h3 className="font-black text-foreground text-base mb-4">Berita Terkait</h3>
              <div className="space-y-1 -mx-2">
                {related.map((b) => (
                  <RelatedCard key={b.id} berita={b} />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link
                  to="/berita"
                  className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-primary hover:gap-3 transition-all w-full py-2.5 rounded-xl hover:bg-primary/5"
                >
                  Lihat semua berita <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default BeritaDetail;

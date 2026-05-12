export type HomeStat = {
  id: string;
  value: string;
  label: string;
};

export type HomeFaq = {
  id: string;
  question: string;
  answer: string;
};

export type HomeContactType = "address" | "phone" | "email";

export type HomeContactCard = {
  id: string;
  type: HomeContactType;
  label: string;
  value: string;
};

export type BerandaData = {
  statsTitle: string;
  stats: HomeStat[];
  faqEyebrow: string;
  faqTitle: string;
  faqs: HomeFaq[];
  locationEyebrow: string;
  locationTitle: string;
  contactCards: HomeContactCard[];
};

export const BERANDA_DEFAULT: BerandaData = {
  statsTitle: "Pencapaian Kami",
  stats: [
    { id: "stat-1", value: "20+", label: "Tahun Pengalaman" },
    { id: "stat-2", value: "100+", label: "Dokumen Standar" },
    { id: "stat-3", value: "27+", label: "Auditor Internal" },
    { id: "stat-4", value: "20", label: "Lab & Studio" },
  ],
  faqEyebrow: "F.A.Q",
  faqTitle: "Pertanyaan Yang Sering Diajukan LPM ITENAS",
  faqs: [
    {
      id: "faq-1",
      question: "Apa itu Lembaga Penjamin Mutu?",
      answer:
        "Lembaga penjamin mutu (LPM) di perguruan tinggi adalah salah satu elemen yang penting dalam sistem pendidikan tinggi. LPM berfungsi untuk memastikan bahwa proses pendidikan yang diberikan oleh perguruan tinggi memiliki kualitas yang terjaga dan memenuhi standar yang telah ditetapkan oleh otoritas pendidikan nasional maupun kebutuhan masyarakat.",
    },
    {
      id: "faq-2",
      question: "Hotline Lembaga Penjamin Mutu?",
      answer:
        "Lembaga Penjamin Mutu adalah memiliki hotline di platform Whatsapp. Dapat diakses melalui: +62-227-2722-15",
    },
    {
      id: "faq-3",
      question: "Apa saja tugas dan wewenang LPM?",
      answer:
        "LPM bertugas merencanakan, melaksanakan, mengevaluasi, mengendalikan, dan mengembangkan SPMI; menyusun dokumen SPMI; membentuk unit penjaminan mutu; serta mengelola Pangkalan Data Pendidikan Tinggi (PD Dikti) pada tingkat perguruan tinggi.",
    },
    {
      id: "faq-4",
      question: "Bagaimana cara mengakses dokumen LPM?",
      answer:
        "Dokumen LPM dapat diakses melalui menu Dokumen di website ini. Tersedia berbagai jenis dokumen seperti Dokumen Manual, Formulir, Dokumen Standar, Dokumen Kebijakan, dan lainnya.",
    },
  ],
  locationEyebrow: "Lokasi",
  locationTitle: "Lokasi Kami",
  contactCards: [
    { id: "contact-1", type: "address", label: "Alamat", value: "Jl. PH.H. Mustofa No.23 Bandung, 40124" },
    { id: "contact-2", type: "phone", label: "Telepon", value: "+62-227-2722-15" },
    { id: "contact-3", type: "email", label: "Email", value: "lpm@itenas.ac.id" },
  ],
};

export const newContentId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

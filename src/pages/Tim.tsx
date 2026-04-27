import HeroSection from "@/components/HeroSection";
import OrgCard from "@/components/OrgCard";
import TeamCard from "@/components/TeamCard";

const level2 = [
  { name: "Sri Lestari", role: "Administrasi Satuan Penjamin Mutu" },
  {
    name: "Kancitra Pharmawati, S.T., M.T\nTia Adelia Suryani, S.T., M.P.K\nIndrianawati, S.T., M.T.",
    role: "SPMF - Fakultas Teknik Sipil dan Perencanaan",
  },
  {
    name: "Dian Duhita Permata, S.T.M.T.\nAnwar Subkiman, S.Sn., M.Ds.\nMaharani Dian Permanasari, M. Ds.",
    role: "SPMF - Fakultas Arsitektur dan Desain",
  },
  {
    name: "Dyah Setyo Pertiwi, S.T., M.T., Ph.D\nFerry Hidayat, S.T., M.T.\nIwan Agustiawan, S.T., M.T.",
    role: "SPMF - Fakultas Teknologi Industri",
  },
];

const teamMembers = Array.from({ length: 12 }, () => ({
  name: "Muhammad Fulan, S.T.",
  role: "Kepala SPM Itenas",
}));

const auditors = [
  "Aldrian Agusta, S. Sn., M. Ds",
  "Ali, S.T., M.T",
  "Ambar Harsono, Ir., M.T",
  "Andika Dwicahyo Aribowo, M.Ds.",
  "Aprilana, Ir., M.T",
  "Boyke Arief Taufik, Drs., M.Ds",
  "Budi Rahardjo, S. S., M.T",
  "Deddy Ismail, S. Sn., M. Ds",
  "Dewi Rosmala, S. Si., M.T",
  "Elkhasnet, Ir., M.T",
  "Fifi Herni Mustofa, S.T., M.T",
  "Iwan Agustiawan, Ir., M.T",
  "Kancitra Pharmawati, S.T., M.T",
  "Kania Sawitri, S. Si., M.T",
  "Kusmaningrum, DR",
  "Lisye Fitria, Ir., M.T",
  "M. Alexin Putra, M.T, DR",
  "Ni Made Rai Ratih, S.T., M.T",
  "Saryanto, S. Sn., M.T",
  "Sugih Arijanto, S.T., M.M",
  "Taufan Hidjaz, Drs., M.Sn",
  "Theresia Pynkyawati, Ir., M.T",
  "Udjianto, Ir., M.SP",
  "Widji Indahing Tyas, Ir., M.T",
  "Yedida Yosananto, S.T., M.T",
  "Yuniar, Ir., M.T",
  "Yusril Irwan, S.T., M.",
];

const Tim = () => {
  return (
    <div>
      <HeroSection
        titleBlack="TIM"
        titleOrange="LPM ITENAS"
        badge="Profil"
        subtitle="Struktur organisasi dan tim pengelola Lembaga Penjaminan Mutu Institut Teknologi Nasional Bandung"
      />

      {/* Struktur Organisasi */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Struktur
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Struktur Organisasi <span className="text-primary">LPM ITENAS</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">Berikut ini adalah tim pengelola</p>
          </div>

          <div className="animate-fade-up overflow-x-auto pb-4">
            {/* Head */}
            <div className="flex justify-center mb-6">
              <OrgCard
                name="Ni Made Rai Ratih, S.T., M.Si"
                role="Kepala Lembaga Penjaminan Mutu Itenas"
                isHead
              />
            </div>

            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-primary/20" />
            </div>
            <div className="flex justify-center">
              <div className="w-3/4 h-0.5 bg-primary/20" />
            </div>

            {/* Level 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {level2.map((member) => (
                <div key={member.role} className="flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-primary/20" />
                  <OrgCard name={member.name} role={member.role} />
                </div>
              ))}
            </div>

            {/* Level 3 */}
            <div className="flex justify-center mt-4">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-primary/20" />
                <OrgCard
                  name="Andika Dwicahyo Aribowo, S.Ds., M.Ds. & Dr.rer.nat Dian Noor Handiani"
                  role="Anggota Lembaga Penjaminan Mutu Itenas"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tim Pengelola */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Tim Pengelola
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Tim Pengelola <span className="text-primary">LPM ITENAS</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">Berikut ini adalah tim pengelola</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {teamMembers.map((member, i) => (
              <TeamCard key={i} name={member.name} role={member.role} />
            ))}
          </div>
        </div>
      </section>

      {/* Auditor Internal */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl font-black text-foreground">
              Tim Auditor <span className="text-primary">Internal</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Berikut ini adalah tim auditor internal
            </p>
          </div>

          <div className="bg-surface rounded-3xl p-8 border border-border animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {auditors.map((auditor, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-sm border border-border hover:border-primary/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-accent border border-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-xs">{i + 1}</span>
                  </div>
                  <span className="text-sm text-foreground font-medium">{auditor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tim;

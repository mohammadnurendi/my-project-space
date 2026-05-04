/**
 * Service untuk konten Profil LPM:
 *   - Sejarah     (singleton + events[])
 *   - Visi & Misi (singleton)
 *   - Road Map    (singleton + items[] + ppepp[])
 *   - Tim LPM     (levels[] dinamis + pengelola[] + auditor[])
 *
 * Backend Laravel disarankan menyimpan tiap "halaman profil" sebagai
 * dokumen JSON tunggal pada tabel `profil_pages` (key,value JSON) supaya
 * struktur fleksibel & sinkron 1:1 dengan tipe di `src/data/profilStore.ts`.
 *
 * Endpoint:
 *   GET  /api/profil/sejarage   → SejarahData
 *   PUT  /api/profil/sejarah    → simpan SejarahData (JSON penuh)
 *   GET  /api/profil/visi-misi  → VisiMisiData
 *   PUT  /api/profil/visi-misi  → simpan VisiMisiData
 *   GET  /api/profil/roadmap    → RoadMapData
 *   PUT  /api/profil/roadmap    → simpan RoadMapData
 *   GET  /api/profil/tim        → TimData
 *   PUT  /api/profil/tim        → simpan TimData
 *
 * Untuk upload foto anggota tim:
 *   POST /api/profil/tim/upload (multipart: file) → { url: string }
 *   → URL hasil upload disimpan di field `photo` pada TimMember.
 */
import { api, toFormData, unwrap } from "./api";
import type {
  SejarahData, VisiMisiData, RoadMapData, TimData,
} from "@/data/profilStore";

const get = async <T>(path: string) => unwrap<T>((await api.get(path)).data);
const put = async <T>(path: string, body: T) =>
  unwrap<T>((await api.put(path, body)).data);

export const profilApi = {
  sejarah: {
    get: () => get<SejarahData>("/profil/sejarah"),
    save: (d: SejarahData) => put<SejarahData>("/profil/sejarah", d),
  },
  visiMisi: {
    get: () => get<VisiMisiData>("/profil/visi-misi"),
    save: (d: VisiMisiData) => put<VisiMisiData>("/profil/visi-misi", d),
  },
  roadmap: {
    get: () => get<RoadMapData>("/profil/roadmap"),
    save: (d: RoadMapData) => put<RoadMapData>("/profil/roadmap", d),
  },
  tim: {
    get: () => get<TimData>("/profil/tim"),
    save: (d: TimData) => put<TimData>("/profil/tim", d),
    uploadPhoto: async (file: File): Promise<string> => {
      const res = await api.post("/profil/tim/upload", toFormData({ file }));
      const data = unwrap<{ url: string }>(res.data);
      return data.url;
    },
  },
};

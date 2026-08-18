import React, { useState } from "react";
import {
  User, ClipboardList, ShoppingBag, Receipt, Wallet, HelpCircle,
  LifeBuoy, LogIn, Menu, X, ChevronRight, Copy, Check, ArrowRight,
  Image as ImageIcon, Video, FileText, BookOpen, Sparkles, Share2,
  Link2, TrendingUp, ShieldCheck, Clock, ChevronDown, HeartHandshake,
  Server, Info, AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const fonts = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }
  `}</style>
);

const COLORS = {
  bg: "#F5F3ED",
  surface: "#FFFFFF",
  primary: "#1F4B43",
  primaryDark: "#143530",
  accent: "#B8752E",
  success: "#3D7A5C",
  text: "#262420",
  textMuted: "#6B6558",
  border: "#E2DDD0",
  danger: "#B3432F",
};

const rupiah = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");

const STEPS = [
  { label: "Pilih produk", icon: ShoppingBag },
  { label: "Edit materi", icon: ImageIcon },
  { label: "Bagikan link", icon: Share2 },
  { label: "Komisi cair", icon: Wallet },
];

function JalurKerja({ compact }) {
  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3 md:gap-4"}`}>
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        return (
          <React.Fragment key={s.label}>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full shrink-0"
                style={{
                  width: compact ? 28 : 36,
                  height: compact ? 28 : 36,
                  background: COLORS.primary,
                  color: "#fff",
                }}
              >
                <Icon size={compact ? 14 : 17} />
              </div>
              {!compact && (
                <span className="font-body text-sm font-semibold" style={{ color: COLORS.text }}>
                  {s.label}
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-[2px] flex-1 min-w-[12px]"
                style={{ background: COLORS.border }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Badge({ children, tone = "primary" }) {
  const map = {
    primary: { bg: "#E9EFEC", color: COLORS.primary },
    accent: { bg: "#F5E9DA", color: COLORS.accent },
    success: { bg: "#E4EFE8", color: COLORS.success },
    muted: { bg: "#EFEDE6", color: COLORS.textMuted },
  };
  const t = map[tone] || map.primary;
  return (
    <span
      className="font-body text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
      style={{ background: t.bg, color: t.color }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, ...style }}
    >
      {children}
    </div>
  );
}

// ---------------- LANDING ----------------
function Landing({ goLogin, goRegister }) {
  return (
    <div className="min-h-screen font-body" style={{ background: COLORS.bg, color: COLORS.text }}>
      <header className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: COLORS.primary }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <span className="font-display font-semibold text-lg" style={{ color: COLORS.primaryDark }}>Mitra Berkah</span>
        </div>
        <div className="flex gap-2">
          <button onClick={goLogin} className="font-body text-sm font-semibold px-4 py-2 rounded-full" style={{ color: COLORS.primary }}>
            Masuk
          </button>
          <button onClick={goRegister} className="font-body text-sm font-semibold px-4 py-2 rounded-full text-white" style={{ background: COLORS.primary }}>
            Daftar gratis
          </button>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-5 pt-10 pb-12">
        <Badge tone="accent"><ShieldCheck size={13} /> Komisi resmi platform Shopee, TikTok, & Produk Digital</Badge>
        <h1 className="font-display mt-5 text-4xl md:text-5xl leading-tight" style={{ color: COLORS.primaryDark }}>
          Bantu jualan, dapat komisi.<br />Tanpa modal, tanpa ribet.
        </h1>
        <p className="mt-4 text-base md:text-lg max-w-xl" style={{ color: COLORS.textMuted }}>
          Pilih produk, edit materi dengan template siap pakai, bagikan link affiliate.
          Setiap penjualan tercatat otomatis dan resmi.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={goRegister} className="font-body font-semibold px-6 py-3 rounded-full text-white flex items-center gap-2" style={{ background: COLORS.accent }}>
            Mulai sekarang, gratis <ArrowRight size={16} />
          </button>
          <button onClick={goLogin} className="font-body font-semibold px-6 py-3 rounded-full" style={{ border: `1px solid ${COLORS.border}`, color: COLORS.primaryDark }}>
            Sudah punya akun
          </button>
        </div>

        {/* Card Gotong Royong / Server Info */}
        <Card className="mt-10 p-6 border-l-4" style={{ borderLeftColor: COLORS.accent }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F5E9DA" }}>
              <HeartHandshake size={20} color={COLORS.accent} />
            </div>
            <div>
              <p className="font-display text-lg" style={{ color: COLORS.primaryDark }}>Program Gotong Royong & Kelangsungan Server</p>
              <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
                Platform ini dibangun untuk membantu sesama agar punya penghasilan online gratis. Agar sistem, domain, database, dan bimbingan tetap berjalan aktif tanpa biaya pendaftaran, kami menerapkan <strong>infaq/donasi operasional minimal 10%</strong> dari setiap penarikan saldo (WD) yang berhasil.
              </p>
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <p className="font-body text-sm font-semibold mb-4" style={{ color: COLORS.textMuted }}>Cara kerja, 4 langkah</p>
          <JalurKerja />
        </Card>
      </section>

      <section className="max-w-5xl mx-auto px-5 pb-16 grid md:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, title: "Komisi transaksi nyata", body: "Komisi berasal dari produk fisik & digital yang terjual resmi lewat link Anda, bukan sistem skema piramida." },
          { icon: Clock, title: "Bimbingan langsung", body: "Tersedia admin dan grup bimbingan bagi yang baru pertama kali belajar jualan affiliate di internet." },
          { icon: Server, title: "Transparan & Berkah", body: "Sistem potongan donasi 10% langsung dialokasikan untuk biaya infrastruktur, domain, dan pengembangan aplikasi gratis." },
        ].map((f) => (
          <Card key={f.title} className="p-5">
            <f.icon size={20} color={COLORS.primary} />
            <p className="font-display text-lg mt-3" style={{ color: COLORS.primaryDark }}>{f.title}</p>
            <p className="text-sm mt-1.5" style={{ color: COLORS.textMuted }}>{f.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

// ---------------- LOGIN / REGISTER ----------------
function Auth({ mode, setMode, onSuccess, goLanding }) {
  return (
    <div className="min-h-screen font-body flex items-center justify-center px-5" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-sm p-6">
        <button onClick={goLanding} className="text-xs font-semibold mb-4" style={{ color: COLORS.textMuted }}>← Kembali</button>
        <p className="font-display text-2xl" style={{ color: COLORS.primaryDark }}>
          {mode === "login" ? "Masuk ke akun" : "Daftar mitra baru"}
        </p>
        <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
          {mode === "login" ? "Masukkan nomor HP dan kata sandi kamu." : "Pendaftaran gratis tanpa dipungut biaya registrasi."}
        </p>

        <div className="mt-5 space-y-3">
          <div>
            <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Nomor HP (WhatsApp)</label>
            <input placeholder="08xx xxxx xxxx" className="w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1px solid ${COLORS.border}` }} />
          </div>
          {mode === "register" && (
            <div>
              <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Nama lengkap</label>
              <input placeholder="Nama lengkap Anda" className="w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1px solid ${COLORS.border}` }} />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Kata sandi</label>
            <input type="password" placeholder="Minimal 6 karakter" className="w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1px solid ${COLORS.border}` }} />
          </div>
        </div>

        <button
          onClick={onSuccess}
          className="w-full mt-5 py-3 rounded-full font-semibold text-white"
          style={{ background: COLORS.primary }}
        >
          {mode === "login" ? "Masuk" : "Daftar sekarang"}
        </button>

        <p className="text-center text-sm mt-4" style={{ color: COLORS.textMuted }}>
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-semibold" style={{ color: COLORS.primary }}>
            {mode === "login" ? "Daftar" : "Masuk"}
          </button>
        </p>
      </Card>
    </div>
  );
}

// ---------------- DASHBOARD SHELL ----------------
const NAV = [
  { id: "beranda", label: "Beranda", icon: Sparkles },
  { id: "profil", label: "Profil", icon: User },
  { id: "cara-kerja", label: "Cara kerja", icon: ClipboardList },
  { id: "produk", label: "Produk", icon: ShoppingBag },
  { id: "transaksi", label: "Transaksi", icon: Receipt },
  { id: "penghasilan", label: "Penghasilan", icon: TrendingUp },
  { id: "wd", label: "Tarik Saldo (WD)", icon: Wallet },
  { id: "donasi", label: "Infaq & Server", icon: HeartHandshake },
  { id: "bantuan", label: "Bantuan admin", icon: LifeBuoy },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

const PRODUCTS = [
  { id: 1, name: "Serum Vitamin C Pencerah Wajah", cat: "Shopee Affiliate", komisi: "12%", potensi: 18000, type: ImageIcon, desc: "Produk skincare viral, materi foto before-after sudah disiapkan." },
  { id: 2, name: "Blender Portable USB 6 Pisau", cat: "TikTok Shop Affiliate", komisi: "9%", potensi: 22500, type: ImageIcon, desc: "Alat dapur praktis untuk demo video singkat di TikTok/Reels." },
  { id: 3, name: "E-course Bikin Video AI Tanpa Wajah", cat: "Produk Digital", komisi: "35%", potensi: 87500, type: Video, desc: "Panduan lengkap bikin video otomatis via HP Android & AI." },
  { id: 4, name: "Bundle 100+ Template Canva Affiliate", cat: "Produk Digital", komisi: "40%", potensi: 20000, type: FileText, desc: "Paket materi siap edit nama & link untuk story WA dan IG." },
];

const TRANSACTIONS = [
  { id: "TRX-2291", produk: "Serum Vitamin C", tanggal: "16 Agu 2026", status: "Selesai", komisi: 18000 },
  { id: "TRX-2270", produk: "Template Desain Canva", tanggal: "14 Agu 2026", status: "Selesai", komisi: 20000 },
  { id: "TRX-2255", produk: "Blender Mini USB", tanggal: "12 Agu 2026", status: "Diproses", komisi: 22500 },
  { id: "TRX-2240", produk: "E-course AI Video", tanggal: "9 Agu 2026", status: "Selesai", komisi: 87500 },
];

const WD_HISTORY = [
  { id: "WD-118", tanggal: "15 Agu 2026", bruto: 150000, donasi: 15000, neto: 135000, status: "Cair", ket: "BCA •••1234 (Infaq Server 10%)" },
  { id: "WD-104", tanggal: "1 Agu 2026", bruto: 100000, donasi: 12000, neto: 88000, status: "Cair", ket: "DANA •••9087 (Infaq Server 12%)" },
];

const CHART_DATA = [
  { minggu: "M1", komisi: 45000 }, { minggu: "M2", komisi: 62000 }, { minggu: "M3", komisi: 38000 },
  { minggu: "M4", komisi: 91000 }, { minggu: "M5", komisi: 76000 }, { minggu: "M6", komisi: 148000 },
];

const FAQS = [
  { q: "Mengapa ada potongan donasi server minimal 10% saat penarikan?", a: "Sistem aplikasi ini disediakan secara gratis untuk semua mitra tanpa modal. Potongan donasi minimal 10% digunakan untuk pemeliharaan server, domain, database, dan penyediaan materi harian agar ekosistem tetap berjalan mandiri." },
  { q: "Apakah platform ini gratis?", a: "100% Gratis untuk mendaftar dan mulai mempromosikan produk. Kami tidak menarik biaya di depan." },
  { q: "Kapan komisi affiliate dicairkan?", a: "Setelah komisi masuk ke saldo utama, Anda dapat melakukan penarikan ke Rekening Bank atau E-Wallet minimal Rp50.000." },
  { q: "Apakah bisa dijalankan hanya lewat HP?", a: "Bisa. Seluruh proses pengambilan link, download bahan, hingga pencairan komisi dapat diakses langsung lewat web browser di HP." },
];

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  return (
    <>
      <div className={`fixed inset-0 bg-black/30 z-30 md:hidden ${mobileOpen ? "block" : "hidden"}`} onClick={() => setMobileOpen(false)} />
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full md:h-auto w-64 shrink-0 p-4 transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: COLORS.primaryDark }}
      >
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COLORS.accent }}>
              <Sparkles size={14} color="#fff" />
            </div>
            <span className="font-display font-semibold text-white">Mitra Berkah</span>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        <nav className="space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setActive(n.id); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition"
              style={{
                background: active === n.id ? "rgba(255,255,255,0.12)" : "transparent",
                color: active === n.id ? "#fff" : "rgba(255,255,255,0.65)",
              }}
            >
              <n.icon size={17} />
              {n.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

function TopBar({ setMobileOpen, saldo, nama }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} color={COLORS.primaryDark} /></button>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs" style={{ color: COLORS.textMuted }}>Saldo Komisi</p>
          <p className="font-mono font-semibold" style={{ color: COLORS.primaryDark }}>{rupiah(saldo)}</p>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: COLORS.accent }}>
          {nama.charAt(0)}
        </div>
      </div>
    </div>
  );
}

// ---------------- TAB SECTIONS ----------------
function SectionBeranda({ nama, saldo, goTab }) {
  return (
    <div className="space-y-5">
      <Card className="p-5" style={{ background: COLORS.primary }}>
        <p className="text-white/80 text-sm">Selamat datang kembali,</p>
        <p className="font-display text-2xl text-white">{nama}</p>
        <p className="text-white/70 text-sm mt-3">Saldo siap ditarik</p>
        <p className="font-mono text-3xl text-white font-semibold">{rupiah(saldo)}</p>
        <div className="flex gap-2 mt-4">
          <button onClick={() => goTab("wd")} className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#fff", color: COLORS.primary }}>
            Tarik Saldo (WD)
          </button>
          <button onClick={() => goTab("donasi")} className="px-4 py-2 rounded-full text-sm font-semibold border border-white/40 text-white flex items-center gap-1.5">
            <HeartHandshake size={14} /> Donasi Server
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <p className="font-body text-sm font-semibold mb-4" style={{ color: COLORS.textMuted }}>Alur Kerja Mitra</p>
        <JalurKerja />
        <button onClick={() => goTab("produk")} className="mt-4 text-sm font-semibold flex items-center gap-1" style={{ color: COLORS.primary }}>
          Lihat katalog link produk <ChevronRight size={15} />
        </button>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs" style={{ color: COLORS.textMuted }}>Transaksi Berhasil</p>
          <p className="font-mono text-xl font-semibold mt-1" style={{ color: COLORS.primaryDark }}>18 Transaksi</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs" style={{ color: COLORS.textMuted }}>Total Komisi Masuk</p>
          <p className="font-mono text-xl font-semibold mt-1" style={{ color: COLORS.accent }}>{rupiah(485000)}</p>
        </Card>
      </div>
    </div>
  );
}

function SectionWD({ saldo }) {
  const [persenDonasi, setPersenDonasi] = useState(10);
  const [jumlahWd, setJumlahWd] = useState(saldo);
  const [rekeningTujuan, setRekeningTujuan] = useState("bca");
  const [notif, setNotif] = useState(false);

  const nominalDonasi = (jumlahWd * persenDonasi) / 100;
  const nominalDiterima = jumlahWd - nominalDonasi;

  const handleAjukan = () => {
    setNotif(true);
    setTimeout(() => setNotif(false), 4000);
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Penarikan Saldo (WD)</p>
        <p className="font-mono text-3xl font-semibold mt-1" style={{ color: COLORS.primaryDark }}>{rupiah(saldo)}</p>
        <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>Minimal penarikan Rp50.000. Diproses maks. 1x24 jam kerja.</p>

        <div className="mt-5 space-y-4 pt-4 border-t" style={{ borderColor: COLORS.border }}>
          <div>
            <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Nominal Penarikan</label>
            <input
              type="number"
              value={jumlahWd}
              max={saldo}
              min={50000}
              onChange={(e) => setJumlahWd(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm font-mono outline-none"
              style={{ border: `1px solid ${COLORS.border}` }}
            />
          </div>

                    <div>
            <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Pilih Rekening Tujuan</label>
            <select
              value={rekeningTujuan}
              onChange={(e) => setRekeningTujuan(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm outline-none bg-white"
              style={{ border: `1px solid ${COLORS.border}` }}
            >
              <option value="bca">BCA ••• 1234 (A.n Siti Aminah)</option>
              <option value="dana">DANA ••• 9087 (A.n Siti Aminah)</option>
              <option value="gopay">GoPay ••• 9087 (A.n Siti Aminah)</option>
            </select>
          </div>

          {/* Infaq / Donasi Server Block */}
          <div className="p-4 rounded-xl" style={{ background: "#F7F5F0", border: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: COLORS.primaryDark }}>
                <HeartHandshake size={15} color={COLORS.accent} />
                Infaq Server & Gotong Royong
              </span>
              <span className="text-xs font-bold font-mono" style={{ color: COLORS.accent }}>{persenDonasi}%</span>
            </div>

            <div className="flex gap-2 my-2">
              {[10, 12, 15, 20].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setPersenDonasi(pct)}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-semibold transition ${
                    persenDonasi === pct ? "text-white" : "bg-white text-gray-700"
                  }`}
                  style={{
                    background: persenDonasi === pct ? COLORS.accent : "#FFF",
                    border: `1px solid ${COLORS.border}`
                  }}
                >
                  {pct}% {pct === 10 && "(Min)"}
                </button>
              ))}
            </div>

            <div className="text-xs space-y-1 mt-3 pt-3 border-t" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>
              <div className="flex justify-between">
                <span>Infaq Server ({persenDonasi}%):</span>
                <span className="font-mono font-semibold" style={{ color: COLORS.danger }}>- {rupiah(nominalDonasi)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1" style={{ color: COLORS.primaryDark }}>
                <span>Diterima Bersih:</span>
                <span className="font-mono" style={{ color: COLORS.success }}>{rupiah(nominalDiterima)}</span>
              </div>
            </div>
          </div>

          {notif && (
            <div className="p-3 rounded-xl text-xs flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Check size={16} /> Pengajuan WD berhasil dikirim ke antrean admin!
            </div>
          )}

          <button
            onClick={handleAjukan}
            disabled={jumlahWd < 50000 || jumlahWd > saldo}
            className="w-full py-3 rounded-full text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: COLORS.accent }}
          >
            Ajukan Pencairan Sekarang
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <p className="font-body text-sm font-semibold mb-4" style={{ color: COLORS.textMuted }}>Riwayat Pencairan & Donasi</p>
        <div className="space-y-3">
          {WD_HISTORY.map((w) => (
            <div key={w.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: COLORS.border }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: COLORS.text }}>{w.id}</p>
                <p className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>{w.tanggal} · {w.ket}</p>
                <p className="text-xs font-mono" style={{ color: COLORS.textMuted }}>Infaq Server: {rupiah(w.donasi)}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold" style={{ color: COLORS.success }}>{rupiah(w.neto)}</p>
                <Badge tone="success">{w.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SectionDonasi() {
  const [copied, setCopied] = useState(false);
  const rekAdmin = "7123456789";

  const handleCopy = () => {
    navigator.clipboard?.writeText(rekAdmin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <Card className="p-5" style={{ background: COLORS.primaryDark, color: "#FFF" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.accent }}>
            <Server size={20} color="#FFF" />
          </div>
          <div>
            <p className="font-display text-lg">Kelangsungan Server & Sistem</p>
            <p className="text-xs text-white/70">Prinsip gotong royong agar platform tetap gratis</p>
          </div>
        </div>
        <p className="text-sm mt-4 leading-relaxed text-white/90">
          Aplikasi dan ekosistem ini dibuat tanpa biaya pendaftaran agar siapa saja bisa memiliki tambahan penghasilan melalui affiliate marketing. Setiap donasi & potongan 10% dialokasikan untuk:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-xs text-white/80">
          <div className="p-2.5 rounded-lg bg-white/10 flex items-center gap-2">
            <Check size={14} className="text-emerald-400 shrink-0" /> Biaya domain, server, & database
          </div>
          <div className="p-2.5 rounded-lg bg-white/10 flex items-center gap-2">
            <Check size={14} className="text-emerald-400 shrink-0" /> Pembuatan template & konten promosi harian
          </div>
          <div className="p-2.5 rounded-lg bg-white/10 flex items-center gap-2">
            <Check size={14} className="text-emerald-400 shrink-0" /> Pemeliharaan sistem termux/backend
          </div>
          <div className="p-2.5 rounded-lg bg-white/10 flex items-center gap-2">
            <Check size={14} className="text-emerald-400 shrink-0" /> Insentif admin bimbingan mitra pemula
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <p className="font-display text-lg" style={{ color: COLORS.primaryDark }}>Donasi / Infaq Sukarela Tambahan</p>
        <p className="text-sm mt-1 mb-4" style={{ color: COLORS.textMuted }}>
          Jika Anda ingin berdonasi di luar pemotongan WD untuk mendukung pengembangan fitur baru:
        </p>

        <div className="p-4 rounded-xl space-y-2" style={{ background: "#F5F3ED", border: `1px solid ${COLORS.border}` }}>
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: COLORS.textMuted }}>Bank Syariah Indonesia (BSI)</span>
            <Badge tone="accent">Rekening Server Admin</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-lg font-bold" style={{ color: COLORS.primaryDark }}>{rekAdmin}</span>
            <button
              onClick={handleCopy}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white flex items-center gap-1"
              style={{ border: `1px solid ${COLORS.border}`, color: COLORS.primaryDark }}
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              {copied ? "Tersalin" : "Salin No. Rek"}
            </button>
          </div>
          <p className="text-xs" style={{ color: COLORS.textMuted }}>A.n Admin Pengelola Mitra Berkah</p>
        </div>

        <div className="mt-4 p-3 rounded-xl flex items-start gap-2 bg-amber-50 text-amber-900 border border-amber-200 text-xs">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>Konfirmasi donasi sukarela dapat dikirimkan langsung ke menu <strong>Bantuan Admin</strong> agar tercatat di pembukuan server.</span>
        </div>
      </Card>
    </div>
  );
}

function SectionProduk() {
  const [copiedId, setCopiedId] = useState(null);
  return (
    <div className="space-y-4">
      {PRODUCTS.map((p) => (
        <Card key={p.id} className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#E9EFEC" }}>
              <p.type size={18} color={COLORS.primary} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-base leading-snug" style={{ color: COLORS.primaryDark }}>{p.name}</p>
                <Badge tone="accent">{p.komisi}</Badge>
              </div>
              <p className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>{p.cat}</p>
              <p className="text-sm mt-2" style={{ color: COLORS.text }}>{p.desc}</p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>Potensi komisi / penjualan</p>
                  <p className="font-mono font-semibold" style={{ color: COLORS.accent }}>{rupiah(p.potensi)}</p>
                </div>
                <button
                  onClick={() => { setCopiedId(p.id); setTimeout(() => setCopiedId(null), 1500); }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full text-white"
                  style={{ background: COLORS.primary }}
                >
                  {copiedId === p.id ? <><Check size={13} /> Tersalin</> : <><Link2 size={13} /> Salin Link</>}
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SectionProfil({ nama }) {
  return (
    <div className="space-y-5">
      <Card className="p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold" style={{ background: COLORS.accent }}>
          {nama.charAt(0)}
        </div>
        <div>
          <p className="font-display text-xl" style={{ color: COLORS.primaryDark }}>{nama}</p>
          <Badge tone="success"><ShieldCheck size={12} /> Akun Mitra Aktif</Badge>
        </div>
      </Card>
      <Card className="p-5 space-y-4">
        {[
          ["Nomor HP", "0812-3456-7890"],
          ["Email", "sitiaminah@email.com"],
          ["Status Infaq Server", "Aktif (Otomatis 10% saat WD)"],
          ["Rekening Utama", "BCA ••• 1234"],
        ].map(([label, val]) => (
          <div key={label} className="flex items-center justify-between text-sm border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: COLORS.border }}>
            <span style={{ color: COLORS.textMuted }}>{label}</span>
            <span className="font-medium" style={{ color: COLORS.text }}>{val}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function SectionTransaksi() {
  const statusTone = { "Selesai": "success", "Diproses": "accent", "Batal": "muted" };
  return (
    <Card className="p-5">
      <div className="space-y-3">
        {TRANSACTIONS.map((t) => (
          <div key={t.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: COLORS.border }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: COLORS.text }}>{t.produk}</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: COLORS.textMuted }}>{t.id} · {t.tanggal}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-semibold" style={{ color: t.komisi ? COLORS.accent : COLORS.textMuted }}>
                {t.komisi ? rupiah(t.komisi) : "—"}
              </p>
              <Badge tone={statusTone[t.status]}>{t.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SectionPenghasilan() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs" style={{ color: COLORS.textMuted }}>Total Komisi Masuk</p>
          <p className="font-mono text-xl font-semibold mt-1" style={{ color: COLORS.primaryDark }}>{rupiah(1480000)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs" style={{ color: COLORS.textMuted }}>Total Dicairkan (Neto)</p>
          <p className="font-mono text-xl font-semibold mt-1" style={{ color: COLORS.success }}>{rupiah(1223000)}</p>
        </Card>
      </div>
      <Card className="p-5">
        <p className="font-body text-sm font-semibold mb-4" style={{ color: COLORS.textMuted }}>Grafik Penjualan Mingguan</p>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="minggu" tick={{ fontSize: 12, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => rupiah(v)} contentStyle={{ borderRadius: 12, border: `1px solid ${COLORS.border}`, fontFamily: "Plus Jakarta Sans" }} />
              <Line type="monotone" dataKey="komisi" stroke={COLORS.accent} strokeWidth={2.5} dot={{ fill: COLORS.accent, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <SectionTransaksi />
    </div>
  );
}

function SectionCaraKerja() {
  const steps = [
    { title: "1. Pilih Produk & Ambil Link", body: "Pilih produk affiliate Shopee, TikTok, atau produk digital di katalog." },
    { title: "2. Edit & Unduh Konten", body: "Gunakan foto atau video demo yang disediakan, tambahkan kalimat rekomendasi Anda sendiri." },
    { title: "3. Sebarkan ke Media Sosial", body: "Bagikan ke status WhatsApp, grup Facebook, atau bio TikTok." },
    { title: "4. Cairkan Komisi Berkah", body: "Tarik saldo ke rekening kapan saja dengan potongan infak minimal 10% untuk menjaga server tetap gratis selamanya." },
  ];
  return (
    <div className="space-y-5">
      <Card className="p-5"><JalurKerja /></Card>
      {steps.map((s) => (
        <Card key={s.title} className="p-5">
          <p className="font-display text-lg" style={{ color: COLORS.primaryDark }}>{s.title}</p>
          <p className="text-sm mt-1.5" style={{ color: COLORS.textMuted }}>{s.body}</p>
        </Card>
      ))}
    </div>
  );
}

function SectionBantuan() {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <p className="font-display text-lg" style={{ color: COLORS.primaryDark }}>Pusat Bantuan & WhatsApp Admin</p>
        <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Butuh bimbingan atau konfirmasi penarikan? Tim admin kami siap merespons.</p>
        <button className="mt-4 w-full py-3 rounded-full text-sm font-semibold text-white" style={{ background: "#3D7A5C" }}>
          Hubungi Admin via WhatsApp
        </button>
      </Card>
    </div>
  );
}

function SectionFAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => (
        <Card key={f.q} className="p-4">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between text-left">
            <span className="font-semibold text-sm pr-3" style={{ color: COLORS.text }}>{f.q}</span>
            <ChevronDown size={16} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: COLORS.textMuted }} />
          </button>
          {open === i && <p className="text-sm mt-2.5" style={{ color: COLORS.textMuted }}>{f.a}</p>}
        </Card>
      ))}
    </div>
  );
}

function Dashboard({ nama }) {
  const [active, setActive] = useState("beranda");
  const [mobileOpen, setMobileOpen] = useState(false);
  const saldo = 250000;

  const titles = {
    beranda: "Beranda Mitra",
    profil: "Profil Saya",
    "cara-kerja": "Panduan & Cara Kerja",
    produk: "Katalog Produk Affiliate",
    transaksi: "Riwayat Transaksi",
    penghasilan: "Ringkasan Penghasilan",
    wd: "Tarik Saldo Komisi (WD)",
    donasi: "Infaq Operasional & Server",
    bantuan: "Bantuan & Kontak Admin",
    faq: "Tanya Jawab (FAQ)",
  };

  const renderSection = () => {
    switch (active) {
      case "beranda": return <SectionBeranda nama={nama} saldo={saldo} goTab={setActive} />;
      case "profil": return <SectionProfil nama={nama} />;
      case "cara-kerja": return <SectionCaraKerja />;
      case "produk": return <SectionProduk />;
      case "transaksi": return <SectionTransaksi />;
      case "penghasilan": return <SectionPenghasilan />;
      case "wd": return <SectionWD saldo={saldo} />;
      case "donasi": return <SectionDonasi />;
      case "bantuan": return <SectionBantuan />;
      case "faq": return <SectionFAQ />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen font-body flex" style={{ background: COLORS.bg }}>
      <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-1 p-5 md:p-8 max-w-3xl mx-auto w-full">
        <TopBar setMobileOpen={setMobileOpen} saldo={saldo} nama={nama} />
        <p className="font-display text-2xl mb-5" style={{ color: COLORS.primaryDark }}>{titles[active]}</p>
        {renderSection()}
      </main>
    </div>
  );
}

// ---------------- ROOT APP ----------------
export default function App() {
  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("login");

  if (page === "landing") {
    return (
      <>
        {fonts}
        <Landing goLogin={() => { setAuthMode("login"); setPage("auth"); }} goRegister={() => { setAuthMode("register"); setPage("auth"); }} />
      </>
    );
  }
  if (page === "auth") {
    return (
      <>
        {fonts}
        <Auth mode={authMode} setMode={setAuthMode} onSuccess={() => setPage("dashboard")} goLanding={() => setPage("landing")} />
      </>
    );
  }
  return (
    <>
      {fonts}
      <Dashboard nama="Siti Aminah" />
    </>
  );
}










          

















              

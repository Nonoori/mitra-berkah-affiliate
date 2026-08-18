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
              value

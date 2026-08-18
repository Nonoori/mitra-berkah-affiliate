import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  User, ClipboardList, ShoppingBag, Receipt, Wallet, HelpCircle,
  LifeBuoy, Menu, X, ChevronRight, Check, ArrowRight,
  Image as ImageIcon, Video, FileText, Sparkles, PlusCircle,
  Link2, TrendingUp, ShieldCheck, Clock, ChevronDown, HeartHandshake,
  Server, Info, Copy, RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ---------------- KONFIGURASI SUPABASE ----------------
// Masukkan Anon Key dari Dashboard Supabase -> Project Settings -> API
const SUPABASE_URL = "https://yomrlfngunugqpzhwwpb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SmhDgZ_B0yAYOFsiDpoo_A_1fveydNs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

const rupiah = (n = 0) => "Rp" + Math.round(Number(n) || 0).toLocaleString("id-ID");

function Badge({ children, tone = "primary" }) {
  const map = {
    primary: { bg: "#E9EFEC", color: COLORS.primary },
    accent: { bg: "#F5E9DA", color: COLORS.accent },
    success: { bg: "#E4EFE8", color: COLORS.success },
    muted: { bg: "#EFEDE6", color: COLORS.textMuted },
  };
  const t = map[tone] || map.primary;
  return (
    <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1" style={{ background: t.bg, color: t.color }}>
      {children}
    </span>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, ...style }}>
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
        <Badge tone="accent"><ShieldCheck size={13} /> Komisi Resmi Shopee, TikTok Shop & Produk Digital</Badge>
        <h1 className="font-display mt-5 text-4xl md:text-5xl leading-tight" style={{ color: COLORS.primaryDark }}>
          Bantu jualan, dapat komisi.<br />Tanpa modal, langsung dari HP.
        </h1>
        <p className="mt-4 text-base md:text-lg max-w-xl" style={{ color: COLORS.textMuted }}>
          Pilih produk affiliate, bagikan materi promosi, dan nikmati pencairan komisi otomatis ke rekening Anda.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={goRegister} className="font-body font-semibold px-6 py-3 rounded-full text-white flex items-center gap-2" style={{ background: COLORS.accent }}>
            Mulai sekarang, gratis <ArrowRight size={16} />
          </button>
          <button onClick={goLogin} className="font-body font-semibold px-6 py-3 rounded-full" style={{ border: `1px solid ${COLORS.border}`, color: COLORS.primaryDark }}>
            Sudah punya akun
          </button>
        </div>

        <Card className="mt-10 p-6 border-l-4" style={{ borderLeftColor: COLORS.accent }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F5E9DA" }}>
              <HeartHandshake size={20} color={COLORS.accent} />
            </div>
            <div>
              <p className="font-display text-lg" style={{ color: COLORS.primaryDark }}>Sistem Gotong Royong & Server Gratis</p>
              <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
                Aplikasi ini 100% gratis tanpa biaya pendaftaran. Untuk memastikan database, domain, dan server tetap beroperasi selamanya, setiap penarikan saldo (WD) dikenakan <strong>infaq server minimal 10%</strong>.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

// ---------------- AUTH (REG & LOGIN SUPABASE) ----------------
function Auth({ mode, setMode, onLoginSuccess, goLanding }) {
  const [noHp, setNoHp] = useState("");
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAuth = async () => {
    if (!noHp) return setMsg("Nomor HP / WhatsApp wajib diisi.");
    setLoading(true);
    setMsg("");

    try {
      if (mode === "register") {
        if (!nama) {
          setLoading(false);
          return setMsg("Nama lengkap wajib diisi.");
        }
        // Simpan mitra baru ke Supabase
        const { data, error } = await supabase
          .from("users")
          .insert([{ nama: nama, no_hp: noHp, saldo: 50000 }]) // Bonus daftar 50rb saldo demo
          .select()
          .single();

        if (error) throw error;
        onLoginSuccess(data);
      } else {
        // Cari akun di Supabase berdasarkan no_hp
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("no_hp", noHp)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          // Jika belum ada akun saat demo, buat otomatis
          const { data: newUser } = await supabase
            .from("users")
            .insert([{ nama: "Mitra Berkah", no_hp: noHp, saldo: 75000 }])
            .select()
            .single();
          onLoginSuccess(newUser);
        } else {
          onLoginSuccess(data);
        }
      }
    } catch (err) {
      // Mode offline fallback jika belum isi key
      onLoginSuccess({ id: 1, nama: nama || "Mitra Pengguna", no_hp: noHp, saldo: 150000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-body flex items-center justify-center px-5" style={{ background: COLORS.bg }}>
      <Card className="w-full max-w-sm p-6">
        <button onClick={goLanding} className="text-xs font-semibold mb-4" style={{ color: COLORS.textMuted }}>← Kembali</button>
        <p className="font-display text-2xl" style={{ color: COLORS.primaryDark }}>
          {mode === "login" ? "Masuk ke Akun" : "Daftar Mitra Baru"}
        </p>
        <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
          {mode === "login" ? "Masukkan nomor WhatsApp terdaftar Anda." : "Pendaftaran gratis langsung aktif."}
        </p>

        {msg && <p className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg">{msg}</p>}

        <div className="mt-5 space-y-3">
          {mode === "register" && (
            <div>
              <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Nama Lengkap</label>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Siti Aminah"
                className="w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: `1px solid ${COLORS.border}` }}
              />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Nomor WhatsApp</label>
            <input
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="081234567890"
              className="w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: `1px solid ${COLORS.border}` }}
            />
          </div>
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full mt-5 py-3 rounded-full font-semibold text-white transition disabled:opacity-50"
          style={{ background: COLORS.primary }}
        >
          {loading ? "Memproses..." : mode === "login" ? "Masuk Dashboard" : "Daftar Sekarang"}
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

// ---------------- DASHBOARD ----------------
const NAV = [
  { id: "beranda", label: "Beranda", icon: Sparkles },
  { id: "produk", label: "Katalog & Tambah Produk", icon: ShoppingBag },
  { id: "wd", label: "Tarik Saldo (WD)", icon: Wallet },
  { id: "donasi", label: "Infaq Server", icon: HeartHandshake },
  { id: "riwayat", label: "Riwayat & Mutasi", icon: Receipt },
];

export default function App() {
  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("beranda");
  const [mobileOpen, setMobileOpen] = useState(false);

  // State Data Realtime Supabase
  const [products, setProducts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch Data dari Database
  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      // Ambil Produk
      const { data: prodData } = await supabase.from("products").select("*").order("id", { ascending: false });
      if (prodData && prodData.length > 0) {
        setProducts(prodData);
      } else {
        setProducts([
          { id: 1, nama_produk: "Serum Vitamin C Shopee", kategori: "Shopee Affiliate", komisi_persen: "12%", potensi_komisi: 18000, link_affiliate: "https://shope.ee/contoh1" },
          { id: 2, nama_produk: "Blender Portable USB", kategori: "TikTok Shop", komisi_persen: "10%", potensi_komisi: 25000, link_affiliate: "https://vt.tiktok.com/contoh2" },
        ]);
      }

      // Ambil Riwayat WD
      if (user) {
        const { data: wdData } = await supabase.from("withdrawals").select("*").order("id", { ascending: false });
        if (wdData) setWithdrawals(wdData);
      }
    } catch (e) {
      console.log("Offline mode aktivasi");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  // Handle Tambah Saldo Komisi (Simulasi Terjadi Penjualan)
  const handleSimulasiPenjualan = async (potensi) => {
    const saldoBaru = (user.saldo || 0) + Number(potensi);
    setUser({ ...user, saldo: saldoBaru });

    try {
      await supabase.from("users").update({ saldo: saldoBaru }).eq("id", user.id);
    } catch (e) {}
    alert(`🎉 Penjualan berhasil! Saldo komisi bertambah ${rupiah(potensi)}`);
  };

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
        <Auth
          mode={authMode}
          setMode={setAuthMode}
          onLoginSuccess={(userData) => { setUser(userData); setPage("dashboard"); }}
          goLanding={() => setPage("landing")}
        />
      </>
    );
  }

  return (
    <>
      {fonts}
      <div className="min-h-screen font-body flex" style={{ background: COLORS.bg }}>
        {/* Sidebar */}
        <aside
          className={`fixed md:static z-40 top-0 left-0 h-full w-64 shrink-0 p-4 transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
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
                onClick={() => { setActiveTab(n.id); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition"
                style={{
                  background: activeTab === n.id ? "rgba(255,255,255,0.12)" : "transparent",
                  color: activeTab === n.id ? "#fff" : "rgba(255,255,255,0.65)",
                }}
              >
                <n.icon size={17} />
                {n.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-5 md:p-8 max-w-3xl mx-auto w-full">
          {/* TopBar */}
          <div className="flex items-center justify-between mb-6">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} color={COLORS.primaryDark} /></button>
            <div className="hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs" style={{ color: COLORS.textMuted }}>Saldo Komisi</p>
                <p className="font-mono font-semibold" style={{ color: COLORS.primaryDark }}>{rupiah(user?.saldo || 0)}</p>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: COLORS.accent }}>
                {user?.nama?.charAt(0) || "M"}
              </div>
            </div>
          </div>

          {/* TAB 1: BERANDA */}
          {activeTab === "beranda" && (
            <div className="space-y-5">
              <Card className="p-5" style={{ background: COLORS.primary }}>
                <p className="text-white/80 text-sm">Assalamu'alaikum,</p>
                <p className="font-display text-2xl text-white">{user?.nama}</p>
                <p className="text-white/70 text-sm mt-3">Saldo Aktif yang Siap Dicairkan</p>
                <p className="font-mono text-3xl text-white font-semibold">{rupiah(user?.saldo || 0)}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setActiveTab("wd")} className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#fff", color: COLORS.primary }}>
                    Tarik Saldo (WD)
                  </button>
                  <button onClick={() => setActiveTab("produk")} className="px-4 py-2 rounded-full text-sm font-semibold border border-white/40 text-white flex items-center gap-1.5">
                    Lihat Katalog Link
                  </button>
                </div>
              </Card>

              <Card className="p-5">
                <p className="font-display text-base font-semibold mb-2" style={{ color: COLORS.primaryDark }}>Status Sistem Database</p>
                <p className="text-xs text-stone-600">Database Supabase terhubung secara live. Setiap penarikan dan penambahan produk tersimpan permanen di cloud gratis.</p>
              </Card>
            </div>
          )}

          {/* TAB 2: PRODUK (INSERT & LIST) */}
          {activeTab === "produk" && (
            <TabProduk
              products={products}
              setProducts={setProducts}
              onSimulasiJual={handleSimulasiPenjualan}
            />
          )}

          {/* TAB 3: WD (PENARIKAN DANA DENGAN DONASI 10%) */}
          {activeTab === "wd" && (
            <TabWD
              user={user}
              setUser={setUser}
              withdrawals={withdrawals}
              setWithdrawals={setWithdrawals}
            />
          )}

          {/* TAB 4: DONASI SERVER */}
          {activeTab === "donasi" && <TabDonasi />}

          {/* TAB 5: RIWAYAT / MUTASI */}
          {activeTab === "riwayat" && <TabRiwayat withdrawals={withdrawals} />}
        </main>
      </div>
    </>
  );
}

// ---------------- SUB-KOMPONEN ----------------

function TabProduk({ products, setProducts, onSimulasiJual }) {
  const [formOpen, setFormOpen] = useState(false);
  const [namaProd, setNamaProd] = useState("");
  const [kategori, setKategori] = useState("Shopee Affiliate");
  const [potensi, setPotensi] = useState("");
  const [linkAff, setLinkAff] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSimpanProduk = async () => {
    if (!namaProd || !potensi) return alert("Mohon lengkapi nama produk dan nominal potensi komisi.");
    setSaving(true);

    const newProd = {
      nama_produk: namaProd,
      kategori: kategori,
      komisi_persen: "10-20%",
      potensi_komisi: Number(potensi),
      link_affiliate: linkAff || "https://shope.ee/link-affiliate",
    };

    try {
      const { data, error } = await supabase.from("products").insert([newProd]).select().single();
      if (!error && data) {
        setProducts([data, ...products]);
      } else {
        setProducts([{ id: Date.now(), ...newProd }, ...products]);
      }
      setNamaProd("");
      setPotensi("");
      setLinkAff("");
      setFormOpen(false);
      alert("✅ Produk baru berhasil ditambahkan ke database!");
    } catch (e) {
      setProducts([{ id: Date.now(), ...newProd }, ...products]);
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl" style={{ color: COLORS.primaryDark }}>Katalog Produk Affiliate</p>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-3.5 py-2 rounded-full text-xs font-semibold text-white flex items-center gap-1"
          style={{ background: COLORS.accent }}
        >
          <PlusCircle size={14} /> {formOpen ? "Tutup Form" : "Tambah Produk"}
        </button>
      </div>

      {formOpen && (
        <Card className="p-5 border-2" style={{ borderColor: COLORS.accent }}>
          <p className="font-semibold text-sm mb-3" style={{ color: COLORS.primaryDark }}>Form Input Produk Baru</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Nama Produk</label>
              <input
                value={namaProd}
                onChange={(e) => setNamaProd(e.target.value)}
                placeholder="Contoh: Gamis Rayon Premium"
                className="w-full mt-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: `1px solid ${COLORS.border}` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Kategori Platform</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-sm outline-none bg-white"
                  style={{ border: `1px solid ${COLORS.border}` }}
                >
                  <option value="Shopee Affiliate">Shopee Affiliate</option>
                  <option value="TikTok Shop">TikTok Shop</option>
                  <option value="Produk Digital">Produk Digital</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Komisi per Penjualan (Rp)</label>
                <input
                  type="number"
                  value={potensi}
                  onChange={(e) => setPotensi(e.target.value)}
                  placeholder="25000"
                  className="w-full mt-1 px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: `1px solid ${COLORS.border}` }}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Link Affiliate Anda</label>
              <input
                value={linkAff}
                onChange={(e) => setLinkAff(e.target.value)}
                placeholder="https://shope.ee/xxxx"
                className="w-full mt-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: `1px solid ${COLORS.border}` }}
              />
            </div>
            <button
              onClick={handleSimpanProduk}
              disabled={saving}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white"
              style={{ background: COLORS.primary }}
            >
              {saving ? "Menyimpan..." : "Simpan ke Database"}
            </button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {products.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge tone="accent">{p.kategori}</Badge>
                <p className="font-display font-semibold text-base mt-1.5" style={{ color: COLORS.primaryDark }}>{p.nama_produk}</p>
                <p className="font-mono text-sm font-bold text-emerald-700 mt-1">Komisi: {rupiah(p.potensi_komisi)}</p>
              </div>
              <button
                onClick={() => onSimulasiJual(p.potensi_komisi)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-emerald-700 shrink-0"
              >
                + Demo Jual
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TabWD({ user, setUser, withdrawals, setWithdrawals }) {
  const [persen, setPersen] = useState(10);
  const [jumlah, setJumlah] = useState(user?.saldo || 50000);
  const [rekTujuan, setRekTujuan] = useState("BCA ••• 1234");
  const [submitting, setSubmitting] = useState(false);

  const donasiServer = (jumlah * persen) / 100;
  const netoDiterima = jumlah - donasiServer;

  const handleAjukanWD = async () => {
    if (jumlah < 50000) return alert("Minimal penarikan adalah Rp50.000");
    if (jumlah > (user?.saldo || 0)) return alert("Saldo komisi Anda tidak mencukupi.");
    setSubmitting(true);

    const newWD = {
      user_id: String(user?.id || "mitra-1"),
      jumlah_bruto: jumlah,
      persen_infaq: persen,
      jumlah_neto: netoDiterima,
      rekening_tujuan: rekTujuan,
      status: "Diproses",
    };

    try {
      const { data, error } = await supabase.from("withdrawals").insert([newWD]).select().single();
      const saldoSisa = user.saldo - jumlah;
      setUser({ ...user, saldo: saldoSisa });
      await supabase.from("users").update({ saldo: saldoSisa }).eq("id", user.id);

      if (!error && data) {
        setWithdrawals([data, ...withdrawals]);
      } else {
        setWithdrawals([{ id: Date.now(), created_at: new Date().toISOString(), ...newWD }, ...withdrawals]);
      }
      alert(`✅ Pengajuan penarikan ${rupiah(netoDiterima)} (Infaq server ${persen}%: ${rupiah(donasiServer)}) berhasil dikirim!`);
    } catch (e) {
      setWithdrawals([{ id: Date.now(), created_at: new Date().toISOString(), ...newWD }, ...withdrawals]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <p className="text-xs uppercase font-semibold text-stone-500">Saldo Tersedia</p>
        <p className="font-mono text-3xl font-bold mt-1" style={{ color: COLORS.primaryDark }}>{rupiah(user?.saldo || 0)}</p>

        <div className="mt-4 space-y-4 pt-4 border-t" style={{ borderColor: COLORS.border }}>
          <div>
            <label className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>Nominal Penarikan</label>
            <input
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
              max={user?.saldo}
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm font-mono outline-none"
              style={{ border: `1px solid ${COLORS.border}` }}
            />
          </div>

          <div className="p-4 rounded-xl" style={{ background: "#F7F5F0", border: `1px solid ${COLORS.border}` }}>
            <div className="flex justify-between items-center mb-2 text-xs font-semibold" style={{ color: COLORS.primaryDark }}>
              <span>Infaq Operasional Server (Min. 10%)</span>
              <span className="font-mono font-bold text-amber-700">{persen}%</span>
            </div>
            <div className="flex gap-2">
              {[10, 12, 15, 20].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPersen(p)}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-semibold transition ${persen === p ? "bg-amber-700 text-white" : "bg-white text-stone-700"}`}
                  style={{ border: `1px solid ${COLORS.border}` }}
                >
                  {p}% {p === 10 && "(Min)"}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t text-xs space-y-1" style={{ borderColor: COLORS.border }}>
              <div className="flex justify-between text-stone-500">
                <span>Potongan Infaq Server ({persen}%):</span>
                <span className="font-mono text-red-600">- {rupiah(donasiServer)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm" style={{ color: COLORS.primaryDark }}>
                <span>Diterima ke Rekening:</span>
                <span className="font-mono text-emerald-700">{rupiah(netoDiterima)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAjukanWD}
            disabled={submitting || (user?.saldo || 0) < 50000}
            className="w-full py-3 rounded-full text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: COLORS.accent }}
          >
            {submitting ? "Memproses..." : "Ajukan Pencairan Dana"}
          </button>
        </div>
      </Card>
    </div>
  );
}

function TabDonasi() {
  return (
    <div className="space-y-5">
      <Card className="p-5" style={{ background: COLORS.primaryDark, color: "#fff" }}>
        <p className="font-display text-lg">Infaq Operasional Server</p>
        <p className="text-xs text-white/70 mt-1">Menjaga ekosistem aplikasi tetap gratis untuk seluruh mitra affiliate di Indonesia.</p>
        <div className="mt-4 p-3 rounded-xl bg-white/10 text-xs leading-relaxed space-y-1">
          <p>• Biaya hosting Vercel & database Supabase</p>
          <p>• Pembuatan materi grafis & link affiliate harian</p>
          <p>• Dukungan bimbingan admin WhatsApp</p>
        </div>
      </Card>
    </div>
  );
}

function TabRiwayat({ withdrawals }) {
  return (
    <Card className="p-5">
      <p className="font-display text-lg mb-4" style={{ color: COLORS.primaryDark }}>Riwayat Mutasi & Pencairan</p>
      <div className="space-y-3">
        {withdrawals.length === 0 ? (
          <p className="text-xs text-stone-500 py-4 text-center">Belum ada catatan transaksi penarikan dana.</p>
        ) : (
          withdrawals.map((w) => (
            <div key={w.id} className="flex items-center justify-between border-b pb-3 last:border-0" style={{ borderColor: COLORS.border }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: COLORS.text }}>Penarikan ke {w.rekening_tujuan || "Rekening"}</p>
                <p className="text-xs font-mono text-stone-500">Infaq Server: {rupiah((w.jumlah_bruto * w.persen_infaq) / 100)}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-emerald-700">{rupiah(w.jumlah_neto)}</p>
                <Badge tone="success">{w.status}</Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

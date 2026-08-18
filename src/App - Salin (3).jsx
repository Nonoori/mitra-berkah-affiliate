import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  User, ClipboardList, ShoppingBag, Receipt, Wallet, HelpCircle,
  LifeBuoy, Menu, X, ChevronRight, Check, ArrowRight,
  Image as ImageIcon, Video, FileText, Sparkles, PlusCircle,
  Link2, TrendingUp, ShieldCheck, Clock, ChevronDown, HeartHandshake,
  Server, Info, Copy, Edit, Trash2, ShieldAlert, CheckCircle2, XCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ---------------- KONFIGURASI SUPABASE ----------------
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
    danger: { bg: "#FBEAE8", color: COLORS.danger },
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

// ---------------- ROOT APLIKASI ----------------
export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [user, setUser] = useState({ id: 1, nama: "Siti Aminah", no_hp: "081234567890", saldo: 250000 });
  const [activeTab, setActiveTab] = useState("beranda");
  const [mobileOpen, setMobileOpen] = useState(false);

  // State Global Data Database
  const [members, setMembers] = useState([]);
  const [products, setProducts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil Data Live Supabase
  const loadData = async () => {
    setLoading(true);
    try {
      const { data: uData } = await supabase.from("users").select("*").order("id", { ascending: false });
      if (uData && uData.length > 0) setMembers(uData);

      const { data: pData } = await supabase.from("products").select("*").order("id", { ascending: false });
      if (pData && pData.length > 0) setProducts(pData);

      const { data: wData } = await supabase.from("withdrawals").select("*").order("id", { ascending: false });
      if (wData && wData.length > 0) setWithdrawals(wData);
    } catch (e) {
      console.log("Mode offline atau kunci API belum dipasang");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {fonts}
      <div className="min-h-screen font-body flex" style={{ background: COLORS.bg }}>
        {/* Sidebar Navigasi */}
        <aside
          className={`fixed md:static z-40 top-0 left-0 h-full w-64 shrink-0 p-4 transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{ background: isAdminView ? "#1E293B" : COLORS.primaryDark }}
        >
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COLORS.accent }}>
                {isAdminView ? <ShieldAlert size={15} color="#fff" /> : <Sparkles size={14} color="#fff" />}
              </div>
              <span className="font-display font-semibold text-white">
                {isAdminView ? "Admin Panel" : "Mitra Berkah"}
              </span>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileOpen(false)}><X size={18} /></button>
          </div>

          {/* Tombol Switch Mode Admin / Mitra */}
          <div className="mb-4">
            <button
              onClick={() => { setIsAdminView(!isAdminView); setActiveTab("beranda"); }}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition"
              style={{ background: isAdminView ? COLORS.accent : "rgba(255,255,255,0.15)" }}
            >
              {isAdminView ? "← Kembali ke Mode Mitra" : "Masuk Mode Admin (CRUD)"}
            </button>
          </div>

          <nav className="space-y-1">
            {isAdminView ? (
              <>
                <button onClick={() => setActiveTab("admin-members")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeTab === "admin-members" ? "bg-white/20 text-white" : "text-white/70"}`}><User size={16} /> Kelola Member</button>
                <button onClick={() => setActiveTab("admin-products")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeTab === "admin-products" ? "bg-white/20 text-white" : "text-white/70"}`}><ShoppingBag size={16} /> Kelola Produk</button>
                <button onClick={() => setActiveTab("admin-wd")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeTab === "admin-wd" ? "bg-white/20 text-white" : "text-white/70"}`}><Receipt size={16} /> Persetujuan WD</button>
              </>
            ) : (
              <>
                <button onClick={() => setActiveTab("beranda")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeTab === "beranda" ? "bg-white/20 text-white" : "text-white/70"}`}><Sparkles size={16} /> Beranda</button>
                <button onClick={() => setActiveTab("produk")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeTab === "produk" ? "bg-white/20 text-white" : "text-white/70"}`}><ShoppingBag size={16} /> Katalog Produk</button>
                <button onClick={() => setActiveTab("wd")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeTab === "wd" ? "bg-white/20 text-white" : "text-white/70"}`}><Wallet size={16} /> Tarik Saldo (WD)</button>
              </>
            )}
          </nav>
        </aside>

        {/* Konten Utama */}
        <main className="flex-1 p-5 md:p-8 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-200 text-stone-700">
              Mode: {isAdminView ? "Super Admin" : "Mitra Pengguna"}
            </span>
            <div className="text-right">
              <p className="text-xs text-stone-500">Saldo Akun Anda</p>
              <p className="font-mono font-bold" style={{ color: COLORS.primaryDark }}>{rupiah(user.saldo)}</p>
            </div>
          </div>

          {/* TAMPILAN ADMIN */}
          {isAdminView && activeTab === "admin-members" && (
            <AdminCrudMembers members={members} setMembers={setMembers} />
          )}
          {isAdminView && activeTab === "admin-products" && (
            <AdminCrudProducts products={products} setProducts={setProducts} />
          )}
          {isAdminView && activeTab === "admin-wd" && (
            <AdminWdApproval withdrawals={withdrawals} setWithdrawals={setWithdrawals} />
          )}

          {/* TAMPILAN MITRA */}
          {!isAdminView && activeTab === "beranda" && (
            <Card className="p-6" style={{ background: COLORS.primary, color: "#fff" }}>
              <p className="text-sm text-white/80">Selamat datang,</p>
              <p className="font-display text-2xl font-bold">{user.nama}</p>
              <p className="text-xs mt-3 text-white/70">Saldo Komisi Tersedia</p>
              <p className="font-mono text-3xl font-bold">{rupiah(user.saldo)}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setActiveTab("wd")} className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-emerald-900">Tarik Saldo</button>
                <button onClick={() => setActiveTab("produk")} className="px-4 py-2 rounded-full text-xs font-semibold bg-white/20 text-white">Lihat Produk</button>
              </div>
            </Card>
          )}
          {!isAdminView && activeTab === "produk" && (
            <div className="space-y-3">
              <p className="font-display text-xl font-bold" style={{ color: COLORS.primaryDark }}>Katalog Produk Affiliate</p>
              {products.map((p) => (
                <Card key={p.id} className="p-4 flex items-center justify-between">
                  <div>
                    <Badge tone="accent">{p.kategori}</Badge>
                    <p className="font-semibold text-sm mt-1">{p.nama_produk}</p>
                    <p className="font-mono text-xs font-bold text-emerald-700">Komisi: {rupiah(p.potensi_komisi)}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newSaldo = user.saldo + Number(p.potensi_komisi);
                      setUser({ ...user, saldo: newSaldo });
                      alert(`Penjualan berhasil! Saldo bertambah ${rupiah(p.potensi_komisi)}`);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-700 text-white"
                  >
                    + Demo Jual
                  </button>
                </Card>
              ))}
            </div>
          )}
          {!isAdminView && activeTab === "wd" && (
            <Card className="p-5">
              <p className="font-display text-lg font-bold">Penarikan Dana (WD)</p>
              <p className="text-xs text-stone-500 mt-1">Potongan Infaq Server Minimal 10%</p>
              <button
                onClick={async () => {
                  if (user.saldo < 50000) return alert("Saldo minimal Rp50.000");
                  const donasi = (user.saldo * 10) / 100;
                  const neto = user.saldo - donasi;
                  const newWd = { user_id: String(user.id), jumlah_bruto: user.saldo, persen_infaq: 10, jumlah_neto: neto, rekening_tujuan: "BCA", status: "Diproses" };
                  try {
                    await supabase.from("withdrawals").insert([newWd]);
                  } catch (e) {}
                  setWithdrawals([newWd, ...withdrawals]);
                  setUser({ ...user, saldo: 0 });
                  alert("Pengajuan WD berhasil dikirim ke panel admin!");
                }}
                className="mt-4 w-full py-3 rounded-full text-sm font-semibold text-white"
                style={{ background: COLORS.accent }}
              >
                Tarik Semua Saldo
              </button>
            </Card>
          )}
        </main>
      </div>
    </>
  );
}

// ---------------- PANEL ADMIN: CRUD MEMBER ----------------
function AdminCrudMembers({ members, setMembers }) {
  const [form, setForm] = useState(false);
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [editId, setEditId] = useState(null);

  const handleSave = async () => {
    if (!nama || !noHp) return alert("Lengkapi data");
    if (editId) {
      // Update Member
      try {
        await supabase.from("users").update({ nama, no_hp: noHp, saldo: Number(saldo) }).eq("id", editId);
      } catch (e) {}
      setMembers(members.map((m) => (m.id === editId ? { ...m, nama, no_hp: noHp, saldo: Number(saldo) } : m)));
      setEditId(null);
    } else {
      // Tambah Member Baru
      const newM = { nama, no_hp: noHp, saldo: Number(saldo) };
      try {
        const { data } = await supabase.from("users").insert([newM]).select().single();
        if (data) setMembers([data, ...members]);
        else setMembers([{ id: Date.now(), ...newM }, ...members]);
      } catch (e) {
        setMembers([{ id: Date.now(), ...newM }, ...members]);
      }
    }
    setNama(""); setNoHp(""); setSaldo(0); setForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus member ini?")) return;
    try {
      await supabase.from("users").delete().eq("id", id);
    } catch (e) {}
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="font-display text-xl font-bold text-slate-900">Kelola Data Member ({members.length})</p>
        <button onClick={() => { setEditId(null); setForm(!form); }} className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white flex items-center gap-1">
          <PlusCircle size={14} /> Tambah Member
        </button>
      </div>

      {form && (
        <Card className="p-4 border-2 border-slate-900 space-y-3">
          <p className="text-xs font-bold uppercase">{editId ? "Edit Member" : "Tambah Member Baru"}</p>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Lengkap" className="w-full p-2 text-sm border rounded-xl" />
          <input value={noHp} onChange={(e) => setNoHp(e.target.value)} placeholder="Nomor WhatsApp" className="w-full p-2 text-sm border rounded-xl" />
          <input type="number" value={saldo} onChange={(e) => setSaldo(e.target.value)} placeholder="Saldo Awal" className="w-full p-2 text-sm border rounded-xl" />
          <button onClick={handleSave} className="w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold">Simpan Data</button>
        </Card>
      )}

      <div className="space-y-2">
        {members.map((m) => (
          <Card key={m.id} className="p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm">{m.nama}</p>
              <p className="text-xs text-stone-500 font-mono">{m.no_hp}</p>
              <p className="text-xs font-bold text-emerald-700 font-mono mt-0.5">Saldo: {rupiah(m.saldo)}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => { setEditId(m.id); setNama(m.nama); setNoHp(m.no_hp); setSaldo(m.saldo); setForm(true); }} className="p-2 rounded-lg bg-stone-100 text-stone-700"><Edit size={14} /></button>
              <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg bg-red-50 text-red-600"><Trash2 size={14} /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------- PANEL ADMIN: CRUD PRODUK ----------------
function AdminCrudProducts({ products, setProducts }) {
  const [form, setForm] = useState(false);
  const [namaProd, setNamaProd] = useState("");
  const [kategori, setKategori] = useState("Shopee Affiliate");
  const [potensi, setPotensi] = useState("");
  const [linkAff, setLinkAff] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSave = async () => {
    if (!namaProd || !potensi) return alert("Lengkapi data");
    const item = { nama_produk: namaProd, kategori, potensi_komisi: Number(potensi), link_affiliate: linkAff };

    if (editId) {
      try {
        await supabase.from("products").update(item).eq("id", editId);
      } catch (e) {}
      setProducts(products.map((p) => (p.id === editId ? { ...p, ...item } : p)));
      setEditId(null);
    } else {
      try {
        const { data } = await supabase.from("products").insert([item]).select().single();
        if (data) setProducts([data, ...products]);
        else setProducts([{ id: Date.now(), ...item }, ...products]);
      } catch (e) {
        setProducts([{ id: Date.now(), ...item }, ...products]);
      }
    }
    setNamaProd(""); setPotensi(""); setLinkAff(""); setForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await supabase.from("products").delete().eq("id", id);
    } catch (e) {}
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="font-display text-xl font-bold text-slate-900">Kelola Katalog Produk ({products.length})</p>
        <button onClick={() => { setEditId(null); setForm(!form); }} className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white flex items-center gap-1">
          <PlusCircle size={14} /> Tambah Produk
        </button>
      </div>

      {form && (
        <Card className="p-4 border-2 border-slate-900 space-y-3">
          <p className="text-xs font-bold uppercase">{editId ? "Edit Produk" : "Tambah Produk Baru"}</p>
          <input value={namaProd} onChange={(e) => setNamaProd(e.target.value)} placeholder="Nama Produk" className="w-full p-2 text-sm border rounded-xl" />
          <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full p-2 text-sm border rounded-xl bg-white">
            <option value="Shopee Affiliate">Shopee Affiliate</option>
            <option value="TikTok Shop">TikTok Shop</option>
            <option value="Produk Digital">Produk Digital</option>
          </select>
          <input type="number" value={potensi} onChange={(e) => setPotensi(e.target.value)} placeholder="Nominal Komisi (Rp)" className="w-full p-2 text-sm border rounded-xl" />
          <input value={linkAff} onChange={(e) => setLinkAff(e.target.value)} placeholder="Link Affiliate" className="w-full p-2 text-sm border rounded-xl" />
          <button onClick={handleSave} className="w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold">Simpan Produk</button>
        </Card>
      )}

      <div className="space-y-2">
        {products.map((p) => (
          <Card key={p.id} className="p-3 flex justify-between items-center">
            <div>
              <Badge tone="accent">{p.kategori}</Badge>
              <p className="font-semibold text-sm mt-1">{p.nama_produk}</p>
              <p className="text-xs font-bold text-emerald-700 font-mono">Komisi: {rupiah(p.potensi_komisi)}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => { setEditId(p.id); setNamaProd(p.nama_produk); setKategori(p.kategori); setPotensi(p.potensi_komisi); setLinkAff(p.link_affiliate); setForm(true); }} className="p-2 rounded-lg bg-stone-100"><Edit size={14} /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-red-50 text-red-600"><Trash2 size={14} /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------- PANEL ADMIN: APPROVAL WD & REKAP INFAQ ----------------
function AdminWdApproval({ withdrawals, setWithdrawals }) {
  const updateStatus = async (id, status) => {
    try {
      await supabase.from("withdrawals").update({ status }).eq("id", id);
    } catch (e) {}
    setWithdrawals(withdrawals.map((w) => (w.id === id ? { ...w, status } : w)));
  };

  const totalInfaq = withdrawals.reduce((acc, w) => acc + ((w.jumlah_bruto * w.persen_infaq) / 100), 0);

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-slate-900 text-white">
        <p className="text-xs text-white/70">Total Infaq Server Terkumpul (Min. 10%)</p>
        <p className="font-mono text-2xl font-bold text-amber-400">{rupiah(totalInfaq)}</p>
        <p className="text-xs text-white/60 mt-1">Digunakan untuk pemeliharaan domain, database Supabase, dan server.</p>
      </Card>

      <p className="font-display text-xl font-bold text-slate-900">Antrean Penarikan Dana ({withdrawals.length})</p>
      <div className="space-y-2">
        {withdrawals.map((w) => (
          <Card key={w.id} className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono text-stone-500">Rekening Tujuan: {w.rekening_tujuan || "BCA"}</p>
                <p className="font-bold text-sm">Nominal Bersih: {rupiah(w.jumlah_neto)}</p>
                <p className="text-xs text-red-600 font-mono">Infaq Server ({w.persen_infaq}%): - {rupiah((w.jumlah_bruto * w.persen_infaq) / 100)}</p>
              </div>
              <Badge tone={w.status === "Selesai" ? "success" : w.status === "Ditolak" ? "danger" : "accent"}>{w.status}</Badge>
            </div>
            {w.status === "Diproses" && (
              <div className="flex gap-2 pt-2 border-t">
                <button onClick={() => updateStatus(w.id, "Selesai")} className="flex-1 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 size={14} /> Setujui & Cairkan
                </button>
                <button onClick={() => updateStatus(w.id, "Ditolak")} className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                  <XCircle size={14} /> Tolak
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

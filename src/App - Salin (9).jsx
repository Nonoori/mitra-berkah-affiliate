import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy
} from "firebase/firestore";
import {
  User, ShoppingBag, Receipt, Wallet, Sparkles, PlusCircle,
  Link2, TrendingUp, ShieldCheck, HeartHandshake, Server,
  Edit, Trash2, ShieldAlert, CheckCircle2, XCircle, Menu, X,
  Shield, Headset, Crown, ArrowRight, Lock, Phone, HelpCircle,
  Copy, AlertCircle, ShoppingCart, Tag, Filter, Search, Calendar,
  ArrowDownLeft, ArrowUpRight, StickyNote
} from "lucide-react";

// ---------------- 1. KONFIGURASI FIREBASE ----------------
const firebaseConfig = {
  apiKey: "MASUKKAN_API_KEY_ANDA",
  authDomain: "mitra-berkah-affiliate.firebaseapp.com",
  projectId: "mitra-berkah-affiliate",
  storageBucket: "mitra-berkah-affiliate.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const rupiah = (n = 0) => "Rp" + Math.round(Number(n) || 0).toLocaleString("id-ID");

export default function App() {
  // Status Pengguna & Navigasi
  const [currentUser, setCurrentUser] = useState(null);
  const [authPage, setAuthPage] = useState("login"); // 'login' | 'register' | 'forgot'
  const [activeTab, setActiveTab] = useState("beranda");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State Data Firestore
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Load Data Realtime
  const loadAppData = async () => {
    try {
      // Ambil Produk
      const pSnap = await getDocs(collection(db, "products"));
      if (!pSnap.empty) {
        setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setProducts([
          { id: "p1", nama_produk: "Serum Pencerah Kulit", kategori: "fisik", komisi_persen: 10, potensi_komisi: 15000, harga: 150000, link_affiliate: "https://shope.ee/demo1" },
          { id: "p2", nama_produk: "E-Course Video AI Pro", kategori: "digital", komisi_persen: 80, potensi_komisi: 120000, harga: 150000, link_affiliate: "https://kelasaiberkah.com/demo" }
        ]);
      }

      // Ambil Mutasi Transaksi
      const tSnap = await getDocs(collection(db, "transactions"));
      setTransactions(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Ambil List Pengguna
      const uSnap = await getDocs(collection(db, "users"));
      setUsersList(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("Offline / Firebase mode lokal:", e);
    }
  };

  useEffect(() => {
    loadAppData();
  }, [currentUser]);

  // Fungsi Tambah Transaksi Realtime dengan Waktu & Keterangan Asal
  const catatTransaksi = async (jenis, nominal, keterangan, userId, saldoSetelahnya) => {
    const newTrx = {
      user_id: userId,
      jenis: jenis, // 'JUAL', 'BELI_SENDIRI', 'WD', 'BAYAR'
      nominal: Number(nominal),
      keterangan: keterangan,
      saldo_akhir: Number(saldoSetelahnya),
      created_at: new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
      timestamp: Date.now()
    };

    try {
      const docRef = await addDoc(collection(db, "transactions"), newTrx);
      setTransactions([{ id: docRef.id, ...newTrx }, ...transactions]);
    } catch (e) {
      setTransactions([{ id: Date.now().toString(), ...newTrx }, ...transactions]);
    }
  };

  if (!currentUser) {
    return (
      <AuthView
        authPage={authPage}
        setAuthPage={setAuthPage}
        onLoginSuccess={(u) => { setCurrentUser(u); setActiveTab("beranda"); }}
      />
    );
  }

  const role = currentUser.role || "user";

  const getRoleBadge = (r) => {
    switch (r) {
      case "superadmin":
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-purple-100 text-purple-800 flex items-center gap-1"><Crown size={11} /> Superadmin</span>;
      case "admin":
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1"><Shield size={11} /> Admin</span>;
      case "cs":
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-teal-100 text-teal-800 flex items-center gap-1"><Headset size={11} /> CS</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1"><User size={11} /> Mitra</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-stone-800 font-sans">
      
      {/* ---------------- 1. STICKY NOTE BAR ATAS (SELALU NEMPEL) ---------------- */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-stone-900">{currentUser.nama}</span>
                {getRoleBadge(role)}
              </div>
              <p className="text-[11px] text-stone-500 font-mono">WA: {currentUser.no_hp}</p>
            </div>
          </div>

          {/* Sticky Note Ringkasan Saldo */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl">
            <StickyNote size={15} className="text-amber-700 shrink-0" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Saldo Bersih</span>
              <span className="font-mono font-bold text-sm text-emerald-800">{rupiah(currentUser.saldo)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-5xl w-full mx-auto">
        {/* ---------------- 2. SIDEBAR NAVIGATION (AUTO-HIDE ON CLICK) ---------------- */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white p-5 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" />
              <span className="font-bold text-base">Mitra Berkah</span>
            </div>
            <button className="md:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1 text-sm font-medium">
            <button
              onClick={() => { setActiveTab("beranda"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "beranda" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
            >
              <Sparkles size={16} /> Beranda
            </button>

            {/* Menu User / Mitra */}
            {role === "user" && (
              <>
                <button
                  onClick={() => { setActiveTab("produk-jual"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "produk-jual" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <Tag size={16} /> List Produk Dijual
                </button>

                <button
                  onClick={() => { setActiveTab("produk-beli"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "produk-beli" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <ShoppingCart size={16} /> Beli Sendiri (Cashback)
                </button>

                <button
                  onClick={() => { setActiveTab("transaksi"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "transaksi" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <Receipt size={16} /> Riwayat & Mutasi Lengkap
                </button>

                <button
                  onClick={() => { setActiveTab("wd"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "wd" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <Wallet size={16} /> Tarik Saldo (WD)
                </button>
              </>
            )}

            {/* Menu Staff & Admin */}
            {['admin', 'superadmin', 'cs'].includes(role) && (
              <button
                onClick={() => { setActiveTab("data-users"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "data-users" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
              >
                <User size={16} /> Data Pengguna & Filter
              </button>
            )}

            {['admin', 'superadmin'].includes(role) && (
              <>
                <button
                  onClick={() => { setActiveTab("kelola-produk"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "kelola-produk" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <ShoppingBag size={16} /> Kelola Produk (CRUD)
                </button>
                <button
                  onClick={() => { setActiveTab("kelola-wd"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "kelola-wd" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <CheckCircle2 size={16} /> Approval Penarikan
                </button>
              </>
            )}

            <div className="pt-4 mt-4 border-t border-white/20">
              <button
                onClick={() => { setCurrentUser(null); setSidebarOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl"
              >
                Keluar Akun
              </button>
            </div>
          </nav>
        </aside>

        {/* ---------------- 3. MAIN CONTENT AREA ---------------- */}
        <main className="flex-1 p-4 md:p-6 w-full space-y-5">

          {/* TAB: BERANDA */}
          {activeTab === "beranda" && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-sm">
                <p className="text-xs uppercase font-semibold text-blue-200">Dashboard Utama</p>
                <p className="text-2xl font-bold mt-1">Halo, {currentUser.nama}!</p>
                <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <p className="text-xs text-blue-200">Saldo Dompet Anda</p>
                    <p className="font-mono text-3xl font-bold text-amber-300">{rupiah(currentUser.saldo)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveTab("produk-jual")} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-white transition">Mulai Jualan</button>
                    <button onClick={() => setActiveTab("produk-beli")} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold text-white transition">Beli Sendiri</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LIST PRODUK YANG DIJUAL (PROMOSI AFFILIATE) */}
          {activeTab === "produk-jual" && (
            <div className="space-y-3">
              <div>
                <p className="text-lg font-bold text-stone-900">List Produk yang Dijual (Katalog Affiliate)</p>
                <p className="text-xs text-stone-500">Bagikan link referral ke orang lain untuk mendapatkan komisi penjualan penuh.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map(p => (
                  <div key={p.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.kategori === 'digital' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {p.kategori === 'digital' ? 'Digital 80%' : 'Fisik 10%'}
                      </span>
                      <p className="font-bold text-sm text-stone-900 mt-1">{p.nama_produk}</p>
                      <p className="text-xs text-stone-500">Harga: {rupiah(p.harga || 100000)}</p>
                      <p className="font-mono text-xs font-bold text-emerald-700 mt-1">Komisi Penjualan: {rupiah(p.potensi_komisi)}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(p.link_affiliate || "");
                          alert(" Link affiliate berhasil disalin!");
                        }}
                        className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Copy size={13} /> Salin Link
                      </button>

                      <button
                        onClick={async () => {
                          const saldoBaru = (currentUser.saldo || 0) + Number(p.potensi_komisi);
                          setCurrentUser({ ...currentUser, saldo: saldoBaru });
                          try {
                            await updateDoc(doc(db, "users", currentUser.id), { saldo: saldoBaru });
                          } catch (e) {}
                          await catatTransaksi("JUAL", p.potensi_komisi, `Komisi Penjualan: ${p.nama_produk}`, currentUser.id, saldoBaru);
                          alert(` Penjualan berhasil! Saldo bertambah ${rupiah(p.potensi_komisi)}`);
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                      >
                        + Demo Terjual
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

{/* TAB: LIST PRODUK BELI SENDIRI (HARGA NORMAL / NON-KOMISI) */}
{activeTab === "produk-beli" && (
  <div className="space-y-3">
    <div>
      <p className="text-lg font-bold text-stone-900">Beli Produk untuk Sendiri</p>
      <p className="text-xs text-stone-500">Beli produk dengan harga normal tanpa komisi affiliate.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {products.map((p) => (
        <div key={p.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-700 rounded">
              Konsumsi Pribadi
            </span>
            <p className="font-bold text-sm text-stone-900 mt-1">{p.nama_produk}</p>
            <p className="text-sm font-mono font-bold text-stone-800 mt-1">
              Harga: {rupiah(p.harga || 100000)}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              *Pembelian pribadi: tanpa cashback & tanpa komisi.
            </p>
          </div>

          <button
            onClick={async () => {
              const hargaBayar = Number(p.harga || 100000);
              
              // Catat riwayat pembelian saja (saldo tidak bertambah)
              await catatTransaksi(
                "BELI_SENDIRI", 
                0, 
                `Beli Sendiri (Normal): ${p.nama_produk} (${rupiah(hargaBayar)})`, 
                currentUser.id, 
                currentUser.saldo
              );

              // Jika ada link marketplace, langsung arahkan ke toko
              if (p.link_affiliate) {
                window.open(p.link_affiliate, "_blank");
              } else {
                alert(` Pesanan "${p.nama_produk}" tercatat. Total bayar: ${rupiah(hargaBayar)}`);
              }
            }}
            className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <ShoppingCart size={13} /> Beli Sekarang ({rupiah(p.harga || 100000)})
          </button>
        </div>
      ))}
    </div>
  </div>
)}


          {/* TAB: MUTASI & RIWAYAT TRANSAKSI LENGKAP */}
          {activeTab === "transaksi" && (
            <MutasiView transactions={transactions.filter(t => t.user_id === currentUser.id)} />
          )}

Zzzzzzzzz
<div className="text-right shrink-0">
  <p className={`font-mono text-sm font-bold ${
    t.jenis === 'WD' ? 'text-red-600' : t.jenis === 'JUAL' ? 'text-emerald-700' : 'text-stone-700'
  }`}>
    {t.jenis === 'WD' ? `-${rupiah(t.nominal)}` : t.jenis === 'JUAL' ? `+${rupiah(t.nominal)}` : 'Rp0'}
  </p>
  <p className="text-[10px] text-stone-400 font-mono">Saldo: {rupiah(t.saldo_akhir)}</p>
</div>
Zzzzzzzzzzzz




          {/* TAB: PENARIKAN SALDO DENGAN INFAQ SERVER 10% */}
          {activeTab === "wd" && (
            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <p className="text-lg font-bold">Penarikan Saldo (WD) & Infaq 10%</p>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Saldo Tersedia:</span>
                  <span className="font-mono font-bold text-stone-900">{rupiah(currentUser.saldo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Infaq Operasional Server (10%):</span>
                  <span className="font-mono text-red-600">- {rupiah(currentUser.saldo * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t pt-2 text-emerald-800">
                  <span>Neto yang Ditransfer:</span>
                  <span className="font-mono">{rupiah(currentUser.saldo - (currentUser.saldo * 0.1))}</span>
                </div>
              </div>

              <button
                onClick={async () => {
                  if (currentUser.saldo < 50000) return alert("Minimal penarikan adalah Rp50.000");
                  const bruto = currentUser.saldo;
                  const infaq = bruto * 0.1;
                  const neto = bruto - infaq;

                  setCurrentUser({ ...currentUser, saldo: 0 });
                  try {
                    await updateDoc(doc(db, "users", currentUser.id), { saldo: 0 });
                  } catch (e) {}

                  await catatTransaksi("WD", neto, `Penarikan Saldo (Infaq 10%: ${rupiah(infaq)})`, currentUser.id, 0);
                  alert(" Pengajuan penarikan dana berhasil dikirim ke Admin!");
                }}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
              >
                Tarik Semua Saldo
              </button>
            </div>
          )}

          {/* TAB: DATA USERS DENGAN FILTER & INDEX (STAFF/ADMIN/CS) */}
          {activeTab === "data-users" && (
            <DataUsersFilterPanel usersList={usersList} getRoleBadge={getRoleBadge} />
          )}

          {/* TAB: CRUD PRODUK (ADMIN/SUPERADMIN) */}
          {activeTab === "kelola-produk" && (
            <KelolaProdukAdmin products={products} setProducts={setProducts} />
          )}
        </main>
      </div>
    </div>
  );
}

// ---------------- 4. KOMPONEN MUTASI DENGAN TANGGAL & KETERANGAN ASAL ----------------
function MutasiView({ transactions }) {
  const [filterJenis, setFilterJenis] = useState("ALL");

  const filtered = transactions.filter(t => {
    if (filterJenis === "ALL") return true;
    return t.jenis === filterJenis;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <p className="text-lg font-bold text-stone-900">Riwayat Mutasi & Transaksi</p>
          <p className="text-xs text-stone-500">Mencatat tanggal, sumber komisi, potongan, dan saldo akhir secara akurat.</p>
        </div>

        {/* Filter Jenis */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
          {["ALL", "JUAL", "BELI_SENDIRI", "WD"].map(f => (
            <button
              key={f}
              onClick={() => setFilterJenis(f)}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${filterJenis === f ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"}`}
            >
              {f === "ALL" ? "Semua" : f === "JUAL" ? "Jual" : f === "BELI_SENDIRI" ? "Cashback" : "WD"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-400">
            Belum ada data transaksi yang tercatat.
          </div>
        ) : (
          filtered.map(t => (
            <div key={t.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.jenis === 'WD' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {t.jenis === 'WD' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>
                <div>
                  <p className="font-bold text-sm text-stone-900">{t.keterangan}</p>
                  <p className="text-[11px] text-stone-400 font-mono mt-0.5 flex items-center gap-1">
                    <Calendar size={11} /> {t.created_at}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={`font-mono text-sm font-bold ${t.jenis === 'WD' ? 'text-red-600' : 'text-emerald-700'}`}>
                  {t.jenis === 'WD' ? "-" : "+"}{rupiah(t.nominal)}
                </p>
                <p className="text-[10px] text-stone-400 font-mono">Sisa Saldo: {rupiah(t.saldo_akhir)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------- 5. KOMPONEN DATA USER DENGAN INDEX & FILTER CEPAT ----------------
function DataUsersFilterPanel({ usersList, getRoleBadge }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Filtering cepat
  const filteredUsers = usersList.filter(u => {
    const matchSearch = u.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || u.no_hp?.includes(searchTerm);
    const matchRole = roleFilter === "ALL" ? true : (u.role || "user") === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-3">
      <div>
        <p className="text-lg font-bold text-stone-900">Index & Data Kontak Pengguna ({filteredUsers.length})</p>
        <p className="text-xs text-stone-500">Gunakan pencarian nama/WA atau filter role untuk menemukan member dengan cepat.</p>
      </div>

      {/* Input Pencarian & Filter Index */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-3 text-stone-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau nomor WhatsApp..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-white outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white font-bold text-stone-700"
        >
          <option value="ALL">Semua Role</option>
          <option value="user">Mitra (User)</option>
          <option value="cs">CS</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>

      {/* List Hasil Filter */}
      <div className="space-y-2">
        {filteredUsers.map(u => (
          <div key={u.id} className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{u.nama}</span>
                {getRoleBadge(u.role || "user")}
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">WA: {u.no_hp} | Saldo: <span className="font-bold text-emerald-700">{rupiah(u.saldo)}</span></p>
            </div>

            <a
              href={`https://wa.me/${u.no_hp?.replace(/^0/, '62')}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Phone size={12} /> WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- 6. KOMPONEN AUTH: REGISTRASI WA UNIK ----------------
// ---------------- SMART AUTH 1-PINTU (CEK WA OTOMATIS) ----------------
function AuthView({ onLoginSuccess }) {
  // Step: 1 (Cek WA) -> 2 (Login WA Terdaftar) -> 3 (Daftar Akun Baru Lengkap)
  const [step, setStep] = useState(1);
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  
  // Data Form Registrasi Lengkap
  const [nama, setNama] = useState("");
  const [namaBank, setNamaBank] = useState("BCA");
  const [noRekening, setNoRekening] = useState("");
  const [namaPenerima, setNamaPenerima] = useState("");
  const [alamatKota, setAlamatKota] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userDataFound, setUserDataFound] = useState(null);

  // 1. LANGKAH 1: PERIKSA NOMOR WA
  const handleCekWA = async () => {
    if (!noHp || noHp.trim().length < 9) {
      return setErrorMsg("Masukkan nomor WhatsApp yang valid!");
    }
    setLoading(true);
    setErrorMsg("");

    const cleanWa = noHp.trim();

    try {
      // Ambil snapshot koleksi users
      const q = query(collection(db, "users"), where("no_hp", "==", cleanWa));
      const snap = await getDocs(q);

      if (!snap.empty) {
        // WA TERDAFTAR -> Lanjut Login
        const docUser = snap.docs[0];
        setUserDataFound({ id: docUser.id, ...docUser.data() });
        setStep(2);
      } else {
        // WA BELUM ADA -> Lanjut Isi Data Pendaftaran
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi database bermasalah: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. LANGKAH 2: PROSES LOGIN DENGAN PASSWORD
  const handleLoginSubmit = () => {
    if (!password) return setErrorMsg("Masukkan password Anda.");
    
    if (userDataFound.password === password) {
      onLoginSuccess(userDataFound);
    } else {
      setErrorMsg("Password salah! Silakan coba lagi.");
    }
  };

  // 3. LANGKAH 3: PROSES SIMPAN PENDAFTARAN LENGKAP
  const handleRegisterSubmit = async () => {
    if (!nama || !password || !noRekening || !namaPenerima || !alamatKota) {
      return setErrorMsg("Mohon lengkapi seluruh data pendaftaran!");
    }
    setLoading(true);
    setErrorMsg("");

    const newUser = {
      nama: nama.trim(),
      no_hp: noHp.trim(),
      password: password,
      role: "user",
      saldo: 0,
      bank: {
        nama_bank: namaBank,
        no_rekening: noRekening.trim(),
        nama_penerima: namaPenerima.trim()
      },
      kota: alamatKota.trim(),
      created_at: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "users"), newUser);
      alert("✅ Pendaftaran berhasil! Selamat datang di Mitra Berkah.");
      onLoginSuccess({ id: docRef.id, ...newUser });
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal menyimpan pendaftaran: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FA] font-sans">
      <div className="w-full max-w-sm p-6 bg-white rounded-3xl border border-stone-200 shadow-md">
        
        {/* Header Logo */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Mitra Berkah Affiliate</h2>
          <p className="text-xs text-stone-500">Platform Gotong Royong Komisi Affiliate</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
            <AlertCircle size={14} className="shrink-0" /> 
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: PERIKSA NO WHATSAPP */}
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700">Nomor WhatsApp Aktif</label>
              <input
                type="tel"
                value={noHp}
                onChange={e => setNoHp(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full mt-1 p-3 text-sm border border-stone-200 rounded-xl outline-none focus:border-blue-900"
              />
              <p className="text-[11px] text-stone-400 mt-1">*Sistem otomatis mendeteksi akun lama / baru.</p>
            </div>
            <button
              onClick={handleCekWA}
              disabled={loading}
              className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {loading ? "Memeriksa Nomor..." : "Lanjutkan"} <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* STEP 2: NOMOR WA ADA -> FORM LOGIN */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs text-blue-900 font-bold">Akun Terdaftar Ditemukan!</p>
              <p className="text-xs text-stone-600 mt-0.5">Nama: <strong>{userDataFound?.nama}</strong></p>
              <p className="text-[11px] text-stone-500 font-mono">WA: {noHp}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Masukkan Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 p-3 text-sm border border-stone-200 rounded-xl outline-none"
              />
            </div>

            <button
              onClick={handleLoginSubmit}
              className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition"
            >
              Masuk ke Dashboard
            </button>

            <button
              onClick={() => { setStep(1); setPassword(""); setErrorMsg(""); }}
              className="w-full py-2 text-xs text-stone-500 font-semibold hover:underline"
            >
              ← Ganti Nomor WhatsApp
            </button>
          </div>
        )}

        {/* STEP 3: NOMOR WA BELUM ADA -> FORM DAFTAR LENGKAP */}
        {step === 3 && (
          <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-900 font-bold">Nomor Baru Terdeteksi</p>
              <p className="text-[11px] text-stone-600">Lengkapi data di bawah ini untuk pendaftaran akun gratis.</p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Nama Lengkap</label>
              <input
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Siti Aminah"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Buat Password Akun</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            {/* Rekening / E-Wallet */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700">Bank / E-Wallet</label>
                <select
                  value={namaBank}
                  onChange={e => setNamaBank(e.target.value)}
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl bg-white"
                >
                  <option value="BCA">BCA</option>
                  <option value="BRI">BRI</option>
                  <option value="BNI">BNI</option>
                  <option value="Mandiri">Mandiri</option>
                  <option value="BSI">BSI</option>
                  <option value="DANA">DANA</option>
                  <option value="OVO">OVO</option>
                  <option value="Gopay">GoPay</option>
                  <option value="ShopeePay">ShopeePay</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700">No. Rek / No. E-Wallet</label>
                <input
                  value={noRekening}
                  onChange={e => setNoRekening(e.target.value)}
                  placeholder="1234567890"
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Nama Pemilik Rekening / Penerima</label>
              <input
                value={namaPenerima}
                onChange={e => setNamaPenerima(e.target.value)}
                placeholder="Nama sesuai buku tabungan/akun e-wallet"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Alamat / Kota Domisili</label>
              <input
                value={alamatKota}
                onChange={e => setAlamatKota(e.target.value)}
                placeholder="Contoh: Bandung, Jawa Barat"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <button
              onClick={handleRegisterSubmit}
              disabled={loading}
              className="w-full mt-2 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition"
            >
              {loading ? "Menyimpan Data..." : "Selesaikan Pendaftaran (Gratis)"}
            </button>

            <button
              onClick={() => { setStep(1); setErrorMsg(""); }}
              className="w-full py-1.5 text-xs text-stone-500 font-semibold hover:underline"
            >
              ← Kembali
            </button>
          </div>
        )}

      </div>
    </div>
  );
}


  // Handler Login
  const handleLogin = async () => {
    if (!noHp || !password) return setErrorMsg("Nomor WhatsApp dan Password wajib diisi.");
    setLoading(true);
    setErrorMsg("");

    try {
      const q = query(
        collection(db, "users"),
        where("no_hp", "==", noHp.trim()),
        where("password", "==", password)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const u = snap.docs[0];
        onLoginSuccess({ id: u.id, ...u.data() });
      } else {
        setErrorMsg("Nomor WhatsApp atau Password salah!");
      }
    } catch (e) {
      setErrorMsg("Koneksi gagal: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FA]">
      <div className="w-full max-w-sm p-6 bg-white rounded-3xl border border-stone-200 shadow-md">
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Mitra Berkah Affiliate</h2>
          <p className="text-xs text-stone-500">Aplikasi Komisi & Cashback Gotong Royong</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        {authPage === "login" ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-600">Nomor WhatsApp</label>
              <input value={noHp} onChange={e => setNoHp(e.target.value)} placeholder="081234567890" className="w-full mt-1 p-2.5 text-xs border rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-600">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="" className="w-full mt-1 p-2.5 text-xs border rounded-xl" />
            </div>
            <button onClick={handleLogin} disabled={loading} className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition">
              {loading ? "Memeriksa..." : "Masuk ke Akun"}
            </button>
            <p className="text-center text-xs text-stone-500 mt-3">
              Belum punya akun? <button onClick={() => setAuthPage("register")} className="text-blue-900 font-bold hover:underline">Daftar (1 WA = 1 Akun)</button>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-600">Nama Lengkap</label>
              <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama Lengkap" className="w-full mt-1 p-2.5 text-xs border rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-600">Nomor WhatsApp (Unik)</label>
              <input value={noHp} onChange={e => setNoHp(e.target.value)} placeholder="081234567890" className="w-full mt-1 p-2.5 text-xs border rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-600">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full mt-1 p-2.5 text-xs border rounded-xl" />
            </div>
            <button onClick={handleRegister} disabled={loading} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition">
              {loading ? "Mendaftarkan..." : "Daftar Akun Baru"}
            </button>
            <p className="text-center text-xs text-stone-500 mt-3">
              Sudah punya akun? <button onClick={() => setAuthPage("login")} className="text-blue-900 font-bold hover:underline">Masuk</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- 7. CRUD PRODUK ADMIN ----------------
function KelolaProdukAdmin({ products, setProducts }) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("fisik");
  const [komisi, setKomisi] = useState(10);
  const [potensi, setPotensi] = useState("");
  const [harga, setHarga] = useState("");
  const [link, setLink] = useState("");

  const handleAdd = async () => {
    if (!nama || !potensi) return alert("Lengkapi data");
    const item = {
      nama_produk: nama,
      kategori,
      komisi_persen: Number(komisi),
      potensi_komisi: Number(potensi),
      harga: Number(harga) || 100000,
      link_affiliate: link || "https://shope.ee/contoh"
    };

    try {
      const docRef = await addDoc(collection(db, "products"), item);
      setProducts([{ id: docRef.id, ...item }, ...products]);
    } catch (e) {
      setProducts([{ id: Date.now().toString(), ...item }, ...products]);
    }
    setNama(""); setPotensi(""); setHarga(""); setLink("");
    alert("Produk berhasil ditambahkan!");
  };

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-2xl bg-white border-2 border-blue-900 space-y-3">
        <p className="text-xs font-bold uppercase text-blue-900">Tambah Produk Baru</p>
        <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama Produk" className="w-full p-2 text-xs border rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <select value={kategori} onChange={e => { setKategori(e.target.value); setKomisi(e.target.value === 'digital' ? 80 : 10); }} className="p-2 text-xs border rounded-xl bg-white">
            <option value="fisik">Fisik (Komisi 10%)</option>
            <option value="digital">Digital (Komisi 80%)</option>
          </select>
          <input type="number" value={harga} onChange={e => setHarga(e.target.value)} placeholder="Harga Produk (Rp)" className="p-2 text-xs border rounded-xl" />
        </div>
        <input type="number" value={potensi} onChange={e => setPotensi(e.target.value)} placeholder="Potensi Komisi (Rp)" className="w-full p-2 text-xs border rounded-xl" />
        <button onClick={handleAdd} className="w-full py-2 bg-blue-900 text-white rounded-xl text-xs font-bold">Simpan Produk</button>
      </div>
    </div>
  );
}

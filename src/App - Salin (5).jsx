import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import {
  User, ShoppingBag, Receipt, Wallet, Sparkles, PlusCircle,
  Link2, TrendingUp, ShieldCheck, HeartHandshake, Server,
  Edit, Trash2, ShieldAlert, CheckCircle2, XCircle, Menu, X,
  Shield, Headset, Crown, ArrowRight
} from "lucide-react";

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyAZxR-pubY1ysyPKG5jGvWViOK71W9jtAQ",
  authDomain: "mitraberkahaffvercelapp.firebaseapp.com",
  projectId: "mitraberkahaffvercelapp",
  storageBucket: "mitraberkahaffvercelapp.firebasestorage.app",
  messagingSenderId: "238463383711",
  appId: "1:238463383711:web:e9b2836661bcbf6e25caaa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const rupiah = (n = 0) => "Rp" + Math.round(Number(n) || 0).toLocaleString("id-ID");

export default function App() {
  // Role Aktif: 'mitra' | 'cs' | 'admin' | 'superadmin'
  const [currentUser, setCurrentUser] = useState({
    id: "user-owner",
    nama: "Owner Pusat",
    no_hp: "081111111111",
    role: "superadmin",
    saldo: 1000000
  });

  const [activeTab, setActiveTab] = useState("beranda");
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [usersList, setUsersList] = useState([]);
  const [products, setProducts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  // Ambil Data Firestore
  const loadData = async () => {
    try {
      const uSnap = await getDocs(collection(db, "users"));
      setUsersList(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const pSnap = await getDocs(collection(db, "products"));
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const wSnap = await getDocs(collection(db, "withdrawals"));
      setWithdrawals(wSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("Offline / Data loaded locally");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case "superadmin":
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-800 flex items-center gap-1"><Crown size={12} /> Superadmin</span>;
      case "admin":
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1"><Shield size={12} /> Admin</span>;
      case "cs":
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1"><Headset size={12} /> CS</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-stone-100 text-stone-700">Mitra</span>;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-stone-800 font-sans">
      {/* Sidebar Navigasi Berdasarkan Role */}
      <aside className={`fixed md:static z-40 top-0 left-0 h-full w-64 p-4 transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${currentUser.role === 'superadmin' ? 'bg-slate-950 text-white' : currentUser.role === 'admin' ? 'bg-slate-900 text-white' : currentUser.role === 'cs' ? 'bg-emerald-950 text-white' : 'bg-emerald-900 text-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <span className="font-bold text-base">Mitra Berkah</span>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        {/* Demo Switch Role Panel */}
        <div className="p-2.5 rounded-xl bg-white/10 mb-5">
          <p className="text-[10px] uppercase font-bold text-white/60 mb-1.5">Ganti Akun Demo (Uji Coba)</p>
          <div className="grid grid-cols-2 gap-1.5">
            {["mitra", "cs", "admin", "superadmin"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setCurrentUser({ ...currentUser, role: r, nama: r === 'superadmin' ? 'Owner Pusat' : r === 'admin' ? 'Admin Operasional' : r === 'cs' ? 'CS Bimbingan' : 'Siti Aminah' });
                  setActiveTab("beranda");
                }}
                className={`py-1 text-xs font-semibold rounded capitalize ${currentUser.role === r ? 'bg-amber-500 text-white font-bold' : 'bg-white/10 text-white/80'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Navigasi Berdasarkan Izin Role */}
        <nav className="space-y-1 text-sm font-medium">
          <button onClick={() => setActiveTab("beranda")} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl ${activeTab === "beranda" ? "bg-white/20 text-white font-bold" : "text-white/70"}`}>
            <Sparkles size={16} /> Beranda
          </button>
          
          <button onClick={() => setActiveTab("produk")} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl ${activeTab === "produk" ? "bg-white/20 text-white font-bold" : "text-white/70"}`}>
            <ShoppingBag size={16} /> {['admin', 'superadmin'].includes(currentUser.role) ? "Kelola Produk (CRUD)" : "Katalog Produk"}
          </button>

          {['admin', 'superadmin', 'cs'].includes(currentUser.role) && (
            <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl ${activeTab === "users" ? "bg-white/20 text-white font-bold" : "text-white/70"}`}>
              <User size={16} /> Data Pengguna & Role
            </button>
          )}

          <button onClick={() => setActiveTab("wd")} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl ${activeTab === "wd" ? "bg-white/20 text-white font-bold" : "text-white/70"}`}>
            <Wallet size={16} /> {['admin', 'superadmin'].includes(currentUser.role) ? "Persetujuan WD" : "Tarik Saldo (WD)"}
          </button>
        </nav>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-5 md:p-8 max-w-4xl mx-auto w-full">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <button className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
          <div className="flex items-center gap-2">
            {getRoleBadge(currentUser.role)}
            <span className="font-semibold text-sm">{currentUser.nama}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-500">Saldo Akun</p>
            <p className="font-mono font-bold text-emerald-800">{rupiah(currentUser.saldo)}</p>
          </div>
        </div>

        {/* TAB 1: BERANDA */}
        {activeTab === "beranda" && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-500 uppercase font-semibold">Selamat Datang di Panel</p>
                  <p className="text-2xl font-bold text-stone-900 mt-0.5">{currentUser.nama}</p>
                </div>
                {getRoleBadge(currentUser.role)}
              </div>
              <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                {currentUser.role === 'superadmin' && "Anda memiliki wewenang tertinggi untuk mengatur role pengguna, otorisasi saldo, dan konfigurasi server."}
                {currentUser.role === 'admin' && "Anda memiliki wewenang untuk menambah katalog produk affiliate dan menyetujui pencairan komisi mitra."}
                {currentUser.role === 'cs' && "Anda memiliki akses pemantauan member dan kontak WhatsApp untuk bimbingan mitra pemula."}
                {currentUser.role === 'mitra' && "Pilih produk, sebar link referral/affiliate, dan dapatkan komisi yang siap dicairkan langsung ke rekening Anda."}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: KELOLA PENGGUNA & ROLE */}
        {activeTab === "users" && ['admin', 'superadmin', 'cs'].includes(currentUser.role) && (
          <KelolaUsersPanel
            currentUser={currentUser}
            usersList={usersList}
            setUsersList={setUsersList}
            getRoleBadge={getRoleBadge}
          />
        )}

        {/* TAB 3: PRODUK */}
        {activeTab === "produk" && (
          <KelolaProdukPanel
            currentUser={currentUser}
            products={products}
            setProducts={setProducts}
          />
        )}

        {/* TAB 4: WD & PERSETUJUAN */}
        {activeTab === "wd" && (
          <KelolaWdPanel
            currentUser={currentUser}
            withdrawals={withdrawals}
            setWithdrawals={setWithdrawals}
          />
        )}
      </main>
    </div>
  );
}

// ---------------- PANEL KELOLA USER (ROLE RBAC) ----------------
function KelolaUsersPanel({ currentUser, usersList, setUsersList, getRoleBadge }) {
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [role, setRole] = useState("mitra");
  const [saldo, setSaldo] = useState(0);

  const handleCreateUser = async () => {
    if (!nama || !noHp) return alert("Lengkapi data nama dan no WhatsApp.");
    const newUser = { nama, no_hp: noHp, role, saldo: Number(saldo) };
    try {
      const docRef = await addDoc(collection(db, "users"), newUser);
      setUsersList([{ id: docRef.id, ...newUser }, ...usersList]);
    } catch (e) {
      setUsersList([{ id: Date.now(), ...newUser }, ...usersList]);
    }
    setNama(""); setNoHp(""); setSaldo(0);
    alert("Akun pengguna baru berhasil ditambahkan!");
  };

  const handleUpdateRole = async (id, newRole) => {
    if (currentUser.role !== 'superadmin') {
      return alert("Hanya Superadmin (Owner) yang berhak mengganti role pengguna!");
    }
    try {
      await updateDoc(doc(db, "users", id), { role: newRole });
    } catch (e) {}
    setUsersList(usersList.map(u => u.id === id ? { ...u, role: newRole } : u));
    alert(`Role berhasil diperbarui menjadi ${newRole.toUpperCase()}`);
  };

  const handleDeleteUser = async (id) => {
    if (currentUser.role !== 'superadmin') {
      return alert("Hanya Superadmin yang memiliki izin menghapus pengguna!");
    }
    if (!confirm("Hapus pengguna ini?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (e) {}
    setUsersList(usersList.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-4">
      {currentUser.role === 'superadmin' && (
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
          <p className="text-xs font-bold uppercase text-purple-900">Tambah Akun Pengguna Baru</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Lengkap" className="p-2 border rounded-xl text-sm" />
            <input value={noHp} onChange={(e) => setNoHp(e.target.value)} placeholder="Nomor WhatsApp" className="p-2 border rounded-xl text-sm" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded-xl text-sm bg-white">
              <option value="mitra">Mitra Affiliate</option>
              <option value="cs">Customer Service (CS)</option>
              <option value="admin">Admin Operasional</option>
              <option value="superadmin">Superadmin (Owner)</option>
            </select>
            <input type="number" value={saldo} onChange={(e) => setSaldo(e.target.value)} placeholder="Saldo Awal (Rp)" className="p-2 border rounded-xl text-sm" />
          </div>
          <button onClick={handleCreateUser} className="w-full py-2 bg-purple-900 text-white rounded-xl text-xs font-bold">Simpan Akun</button>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-bold text-sm">Daftar Seluruh Pengguna ({usersList.length})</p>
          <span className="text-xs text-stone-500">Izin Anda: {currentUser.role.toUpperCase()}</span>
        </div>

        <div className="space-y-2">
          {usersList.map((u) => (
            <div key={u.id} className="p-3 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">{u.nama}</p>
                  {getRoleBadge(u.role)}
                </div>
                <p className="text-xs text-stone-500 font-mono mt-0.5">WA: {u.no_hp} · Saldo: {rupiah(u.saldo)}</p>
              </div>

              {currentUser.role === 'superadmin' ? (
                <div className="flex items-center gap-2">
                  <select
                    value={u.role || "mitra"}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                    className="text-xs p-1.5 border rounded-lg bg-stone-50"
                  >
                    <option value="mitra">Mitra</option>
                    <option value="cs">CS</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                  <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                </div>
              ) : (
                <a href={`https://wa.me/${u.no_hp}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-emerald-700 hover:underline">
                  Hubungi WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- PANEL PRODUK ----------------
function KelolaProdukPanel({ currentUser, products, setProducts }) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("fisik");
  const [komisi, setKomisi] = useState(10);
  const [potensi, setPotensi] = useState("");
  const isManager = ['admin', 'superadmin'].includes(currentUser.role);

  const handleAddProduct = async () => {
    if (!nama || !potensi) return alert("Lengkapi data produk!");
    const item = { nama_produk: nama, kategori, komisi_persen: Number(komisi), potensi_komisi: Number(potensi), link_affiliate: "https://shope.ee/contoh" };
    try {
      const docRef = await addDoc(collection(db, "products"), item);
      setProducts([{ id: docRef.id, ...item }, ...products]);
    } catch (e) {
      setProducts([{ id: Date.now(), ...item }, ...products]);
    }
    setNama(""); setPotensi("");
    alert("Produk berhasil ditambahkan!");
  };

  return (
    <div className="space-y-4">
      {isManager && (
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
          <p className="text-xs font-bold uppercase text-blue-900">Input Produk Baru (Khusus Admin/Superadmin)</p>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Produk" className="w-full p-2 border rounded-xl text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <select value={kategori} onChange={(e) => { setKategori(e.target.value); setKomisi(e.target.value === 'digital' ? 80 : 10); }} className="p-2 border rounded-xl text-sm bg-white">
              <option value="fisik">Produk Fisik (Komisi 10%)</option>
              <option value="digital">Produk Digital (Komisi 80%)</option>
            </select>
            <input type="number" value={potensi} onChange={(e) => setPotensi(e.target.value)} placeholder="Potensi Komisi (Rp)" className="p-2 border rounded-xl text-sm" />
          </div>
          <button onClick={handleAddProduct} className="w-full py-2 bg-blue-900 text-white rounded-xl text-xs font-bold">Simpan Produk</button>
        </div>
      )}

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex justify-between items-center">
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.kategori === 'digital' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'}`}>
                {p.kategori === 'digital' ? 'Digital 80%' : 'Fisik 10%'}
              </span>
              <p className="font-bold text-sm mt-1">{p.nama_produk}</p>
              <p className="font-mono text-xs font-bold text-emerald-700">Komisi: {rupiah(p.potensi_komisi)}</p>
            </div>
            <button className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Link2 size={13} /> Salin Link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- PANEL WD & APPROVAL ----------------
function KelolaWdPanel({ currentUser, withdrawals, setWithdrawals }) {
  const isManager = ['admin', 'superadmin'].includes(currentUser.role);

  const handleUpdateWd = async (id, status) => {
    try {
      await updateDoc(doc(db, "withdrawals", id), { status });
    } catch (e) {}
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status } : w));
  };

  const totalInfaq = withdrawals.reduce((acc, w) => acc + (w.jumlah_bruto * 0.1), 0);

  return (
    <div className="space-y-4">
      {isManager ? (
        <>
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-sm">
            <p className="text-xs text-white/70">Total Akumulasi Infaq Server (10% dari Penarikan)</p>
            <p className="font-mono text-2xl font-bold text-amber-400 mt-1">{rupiah(totalInfaq)}</p>
            <p className="text-[11px] text-white/60 mt-1">Alokasi otomatis untuk kelangsungan database Firebase, domain, & operasional bimbingan.</p>
          </div>

          <p className="font-bold text-sm">Antrean Verifikasi Penarikan Dana Mitra</p>
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <div key={w.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{w.nama || "Mitra Pengguna"}</p>
                    <p className="text-xs text-emerald-800 font-bold">Neto Cair: {rupiah(w.jumlah_neto)}</p>
                    <p className="text-[11px] text-red-600 font-mono">Infaq Server (10%): - {rupiah(w.jumlah_bruto * 0.1)}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${w.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {w.status}
                  </span>
                </div>
                {w.status === 'Diproses' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <button onClick={() => handleUpdateWd(w.id, "Selesai")} className="flex-1 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><CheckCircle2 size={14} /> Setujui & Cairkan</button>
                    <button onClick={() => handleUpdateWd(w.id, "Ditolak")} className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><XCircle size={14} /> Tolak</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
          <p className="font-bold text-base">Pengajuan Penarikan Komisi</p>
          <p className="text-xs text-stone-500">Saldo Anda saat ini: {rupiah(currentUser.saldo)}. Minimal penarikan Rp50.000 dengan infaq operasional server 10%.</p>
          <button
            onClick={async () => {
              if (currentUser.saldo < 50000) return alert("Saldo komisi minimal Rp50.000 untuk penarikan.");
              const infaq = currentUser.saldo * 0.1;
              const neto = currentUser.saldo - infaq;
              const newWd = { user_id: currentUser.id, nama: currentUser.nama, jumlah_bruto: currentUser.saldo, persen_infaq: 10, jumlah_neto: neto, status: "Diproses" };
              try {
                const docRef = await addDoc(collection(db, "withdrawals"), newWd);
                setWithdrawals([{ id: docRef.id, ...newWd }, ...withdrawals]);
              } catch (e) {
                setWithdrawals([{ id: Date.now(), ...newWd }, ...withdrawals]);
              }
              alert(`Pengajuan penarikan ${rupiah(neto)} berhasil diajukan ke admin!`);
            }}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold"
          >
            Tarik Saldo Sekarang
          </button>
        </div>
      )}
    </div>
  );
}

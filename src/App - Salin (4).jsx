import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy
} from "firebase/firestore";
import {
  User, ShoppingBag, Receipt, Wallet, Sparkles, PlusCircle,
  Link2, TrendingUp, ShieldCheck, HeartHandshake, Server,
  Edit, Trash2, ShieldAlert, CheckCircle2, XCircle, Menu, X
} from "lucide-react";

// ---------------- 1. KONFIGURASI FIREBASE ----------------
// Tempelkan konfigurasi dari Project Settings Firebase Anda di sini

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



// ---------------- STYLING & HELPER ----------------
const fonts = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  `}</style>
);

const COLORS = {
  bg: "#F8F9FA",
  surface: "#FFFFFF",
  primary: "#1E3A8A",
  accent: "#D97706",
  success: "#16A34A",
  danger: "#DC2626",
  border: "#E5E7EB",
  text: "#1F2937",
  textMuted: "#6B7280"
};

const rupiah = (n = 0) => "Rp" + Math.round(Number(n) || 0).toLocaleString("id-ID");

function Card({ children, className = "" }) {
  return (
    <div className={`p-4 rounded-2xl bg-white border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ---------------- MAIN COMPONENT ----------------
export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [activeTab, setActiveTab] = useState("beranda");
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Data State
  const [user, setUser] = useState({ id: "demo-user", nama: "Siti Aminah", no_hp: "081234567890", saldo: 250000 });
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil Data Firestore
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Ambil Produk
      const prodSnap = await getDocs(collection(db, "products"));
      const prodList = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(prodList);

      // 2. Ambil Members
      const userSnap = await getDocs(collection(db, "users"));
      const userList = userSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMembers(userList);

      // 3. Ambil Withdrawals
      const wdSnap = await getDocs(collection(db, "withdrawals"));
      const wdList = wdSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setWithdrawals(wdList);
    } catch (err) {
      console.log("Offline mode atau Firebase belum terhubung:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {fonts}
      <div className="min-h-screen flex bg-[#F8F9FA] text-gray-800 font-sans">
        {/* Sidebar Navigasi */}
        <aside className={`fixed md:static z-40 top-0 left-0 h-full w-64 p-4 transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${isAdminView ? "bg-slate-900 text-white" : "bg-[#1E3A8A] text-white"}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" />
              <span className="font-bold text-lg">{isAdminView ? "Admin Panel (Firebase)" : "Mitra Berkah"}</span>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileOpen(false)}><X size={18} /></button>
          </div>

          <button
            onClick={() => { setIsAdminView(!isAdminView); setActiveTab(isAdminView ? "beranda" : "admin-products"); }}
            className="w-full mb-4 py-2 px-3 rounded-xl text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition flex items-center justify-center gap-1.5"
          >
            <ShieldAlert size={14} /> {isAdminView ? "Kembali ke Mode Mitra" : "Masuk Mode Admin (CRUD)"}
          </button>

          <nav className="space-y-1">
            {isAdminView ? (
              <>
                <button onClick={() => setActiveTab("admin-members")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold ${activeTab === "admin-members" ? "bg-white/20" : "text-white/70"}`}><User size={16} /> Kelola Member</button>
                <button onClick={() => setActiveTab("admin-products")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold ${activeTab === "admin-products" ? "bg-white/20" : "text-white/70"}`}><ShoppingBag size={16} /> Kelola Produk</button>
                <button onClick={() => setActiveTab("admin-wd")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold ${activeTab === "admin-wd" ? "bg-white/20" : "text-white/70"}`}><Receipt size={16} /> Persetujuan WD</button>
              </>
            ) : (
              <>
                <button onClick={() => setActiveTab("beranda")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold ${activeTab === "beranda" ? "bg-white/20" : "text-white/70"}`}><Sparkles size={16} /> Beranda</button>
                <button onClick={() => setActiveTab("produk")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold ${activeTab === "produk" ? "bg-white/20" : "text-white/70"}`}><ShoppingBag size={16} /> Katalog Produk</button>
                <button onClick={() => setActiveTab("wd")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold ${activeTab === "wd" ? "bg-white/20" : "text-white/70"}`}><Wallet size={16} /> Tarik Saldo (WD)</button>
              </>
            )}
          </nav>
        </aside>

        {/* Konten Utama */}
        <main className="flex-1 p-5 md:p-8 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
            <span className="text-xs font-bold px-3 py-1 bg-gray-200 rounded-full">{isAdminView ? "Mode: Admin Firebase" : "Mode: Mitra"}</span>
            <div className="text-right">
              <p className="text-xs text-gray-500">Saldo Anda</p>
              <p className="font-mono font-bold text-blue-900">{rupiah(user.saldo)}</p>
            </div>
          </div>

          {/* VIEW ADMIN */}
          {isAdminView && activeTab === "admin-members" && <AdminMembers members={members} setMembers={setMembers} />}
          {isAdminView && activeTab === "admin-products" && <AdminProducts products={products} setProducts={setProducts} />}
          {isAdminView && activeTab === "admin-wd" && <AdminWD withdrawals={withdrawals} setWithdrawals={setWithdrawals} />}

          {/* VIEW MITRA */}
          {!isAdminView && activeTab === "beranda" && (
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                <p className="text-xs text-blue-200">Selamat Datang,</p>
                <p className="text-2xl font-bold">{user.nama}</p>
                <p className="text-xs text-blue-200 mt-3">Saldo Komisi Siap Cair</p>
                <p className="font-mono text-3xl font-bold text-amber-300">{rupiah(user.saldo)}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setActiveTab("wd")} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-full text-xs font-bold text-white transition">Tarik Saldo</button>
                  <button onClick={() => setActiveTab("produk")} className="px-4 py-2 bg-white/20 rounded-full text-xs font-bold text-white">Katalog Produk</button>
                </div>
              </Card>
            </div>
          )}

          {!isAdminView && activeTab === "produk" && (
            <div className="space-y-3">
              <p className="text-lg font-bold">Katalog Produk Affiliate</p>
              {products.map((p) => (
                <Card key={p.id} className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">{p.kategori}</span>
                    <p className="font-bold text-sm mt-1">{p.nama_produk}</p>
                    <p className="font-mono text-xs font-bold text-green-600">Komisi: {rupiah(p.potensi_komisi)}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newSaldo = user.saldo + Number(p.potensi_komisi);
                      setUser({ ...user, saldo: newSaldo });
                      alert(`Penjualan berhasil! Saldo bertambah ${rupiah(p.potensi_komisi)}`);
                    }}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-bold"
                  >
                    + Demo Jual
                  </button>
                </Card>
              ))}
            </div>
          )}

          {!isAdminView && activeTab === "wd" && (
            <Card className="space-y-4">
              <p className="text-lg font-bold">Penarikan Dana (WD)</p>
              <p className="text-xs text-gray-500">Infaq Operasional Server Minimal 10%</p>
              <button
                onClick={async () => {
                  if (user.saldo < 50000) return alert("Minimal penarikan Rp50.000");
                  const infaq = (user.saldo * 10) / 100;
                  const neto = user.saldo - infaq;
                  const newWd = { user_id: user.id, nama: user.nama, jumlah_bruto: user.saldo, persen_infaq: 10, jumlah_neto: neto, status: "Diproses", created_at: new Date().toISOString() };
                  try {
                    const docRef = await addDoc(collection(db, "withdrawals"), newWd);
                    setWithdrawals([{ id: docRef.id, ...newWd }, ...withdrawals]);
                  } catch (e) {
                    setWithdrawals([{ id: Date.now(), ...newWd }, ...withdrawals]);
                  }
                  setUser({ ...user, saldo: 0 });
                  alert("Pengajuan WD berhasil disimpan ke Firebase!");
                }}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-sm font-bold"
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

// ---------------- CRUD ADMIN (FIREBASE) ----------------
function AdminProducts({ products, setProducts }) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("Shopee Affiliate");
  const [potensi, setPotensi] = useState("");
  const [link, setLink] = useState("");

  const handleAdd = async () => {
    if (!nama || !potensi) return alert("Lengkapi data!");
    const item = { nama_produk: nama, kategori, potensi_komisi: Number(potensi), link_affiliate: link };
    try {
      const docRef = await addDoc(collection(db, "products"), item);
      setProducts([{ id: docRef.id, ...item }, ...products]);
      setNama(""); setPotensi(""); setLink("");
      alert("Produk berhasil ditambahkan ke Firebase Firestore!");
    } catch (e) {
      alert("Error simpan Firestore: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3 border-2 border-blue-900">
        <p className="text-xs font-bold uppercase text-blue-900">Tambah Produk Baru (Firestore)</p>
        <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Produk" className="w-full p-2 text-sm border rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full p-2 text-sm border rounded-xl bg-white">
            <option value="Shopee Affiliate">Shopee Affiliate</option>
            <option value="TikTok Shop">TikTok Shop</option>
            <option value="Produk Digital">Produk Digital</option>
          </select>
          <input type="number" value={potensi} onChange={(e) => setPotensi(e.target.value)} placeholder="Komisi (Rp)" className="w-full p-2 text-sm border rounded-xl" />
        </div>
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link Affiliate" className="w-full p-2 text-sm border rounded-xl" />
        <button onClick={handleAdd} className="w-full py-2 bg-blue-900 text-white rounded-xl text-xs font-bold">Simpan ke Firebase</button>
      </Card>

      <div className="space-y-2">
        {products.map(p => (
          <Card key={p.id} className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">{p.kategori}</span>
              <p className="font-bold text-sm mt-1">{p.nama_produk}</p>
              <p className="font-mono text-xs text-green-600 font-bold">Komisi: {rupiah(p.potensi_komisi)}</p>
            </div>
            <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={14} /></button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminMembers({ members, setMembers }) {
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [saldo, setSaldo] = useState(0);

  const handleAdd = async () => {
    if (!nama || !noHp) return alert("Lengkapi data!");
    const item = { nama, no_hp: noHp, saldo: Number(saldo) };
    try {
      const docRef = await addDoc(collection(db, "users"), item);
      setMembers([{ id: docRef.id, ...item }, ...members]);
      setNama(""); setNoHp(""); setSaldo(0);
      alert("Member berhasil ditambahkan ke Firebase!");
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus member?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      setMembers(members.filter(m => m.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3 border-2 border-blue-900">
        <p className="text-xs font-bold uppercase text-blue-900">Tambah Member Baru</p>
        <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Lengkap" className="w-full p-2 text-sm border rounded-xl" />
        <input value={noHp} onChange={(e) => setNoHp(e.target.value)} placeholder="Nomor WhatsApp" className="w-full p-2 text-sm border rounded-xl" />
        <input type="number" value={saldo} onChange={(e) => setSaldo(e.target.value)} placeholder="Saldo Awal" className="w-full p-2 text-sm border rounded-xl" />
        <button onClick={handleAdd} className="w-full py-2 bg-blue-900 text-white rounded-xl text-xs font-bold">Simpan Member</button>
      </Card>

      <div className="space-y-2">
        {members.map(m => (
          <Card key={m.id} className="flex justify-between items-center">
            <div>
              <p className="font-bold text-sm">{m.nama}</p>
              <p className="text-xs text-gray-500 font-mono">{m.no_hp}</p>
              <p className="font-mono text-xs text-green-600 font-bold">Saldo: {rupiah(m.saldo)}</p>
            </div>
            <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={14} /></button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminWD({ withdrawals, setWithdrawals }) {
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "withdrawals", id), { status });
      setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status } : w));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-lg font-bold">Antrean Penarikan Dana (WD)</p>
      {withdrawals.map(w => (
        <Card key={w.id} className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-sm">{w.nama || "Mitra"}</p>
              <p className="font-bold text-green-700 text-sm">Neto Cair: {rupiah(w.jumlah_neto)}</p>
              <p className="text-xs text-red-600 font-mono">Infaq Server (10%): - {rupiah((w.jumlah_bruto * 10) / 100)}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${w.status === "Selesai" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{w.status}</span>
          </div>
          {w.status === "Diproses" && (
            <div className="flex gap-2 pt-2 border-t">
              <button onClick={() => updateStatus(w.id, "Selesai")} className="flex-1 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"><CheckCircle2 size={14} /> Cairkan</button>
              <button onClick={() => updateStatus(w.id, "Ditolak")} className="flex-1 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"><XCircle size={14} /> Tolak</button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

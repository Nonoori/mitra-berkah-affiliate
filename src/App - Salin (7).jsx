import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where
} from "firebase/firestore";
import {
  User, ShoppingBag, Receipt, Wallet, Sparkles, PlusCircle,
  Link2, TrendingUp, ShieldCheck, HeartHandshake, Server,
  Edit, Trash2, ShieldAlert, CheckCircle2, XCircle, Menu, X,
  Shield, Headset, Crown, ArrowRight, Lock, Phone, HelpCircle,
  KeyRound, LogOut, Check, Copy, ExternalLink, AlertCircle
} from "lucide-react";

// ---------------- 1. KONFIGURASI FIREBASE ----------------
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
  // Status Auth & Tampilan
  const [currentUser, setCurrentUser] = useState(null);
  const [authPage, setAuthPage] = useState("login"); // 'login' | 'register' | 'forgot' | 'help'
  const [activeTab, setActiveTab] = useState("beranda");
  const [mobileOpen, setMobileOpen] = useState(false);

  // State Global Database
  const [usersList, setUsersList] = useState([]);
  const [products, setProducts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  // Muat Data dari Firestore
  const loadDatabase = async () => {
    try {
      const uSnap = await getDocs(collection(db, "users"));
      setUsersList(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const pSnap = await getDocs(collection(db, "products"));
      if (!pSnap.empty) {
        setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setProducts([
          { id: "p1", nama_produk: "Serum Pencerah Wajah", kategori: "fisik", komisi_persen: 10, potensi_komisi: 15000, link_affiliate: "https://shope.ee/demo1" },
          { id: "p2", nama_produk: "E-Course Bisnis AI", kategori: "digital", komisi_persen: 80, potensi_komisi: 120000, link_affiliate: "https://kelasaiberkah.com/demo" }
        ]);
      }

      const wSnap = await getDocs(collection(db, "withdrawals"));
      setWithdrawals(wSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("Offline mode atau Firebase belum terhubung");
    }
  };

  useEffect(() => {
    loadDatabase();
  }, [currentUser]);

  // JIKA BELUM LOGIN: TAMPILKAN AUTH SCREEN
  if (!currentUser) {
    return (
      <AuthContainer
        authPage={authPage}
        setAuthPage={setAuthPage}
        onLoginSuccess={(u) => { setCurrentUser(u); setActiveTab("beranda"); }}
        usersList={usersList}
        setUsersList={setUsersList}
      />
    );
  }

  // JIKA SUDAH LOGIN: TAMPILKAN DASHBOARD SESUAI ROLE
  const role = currentUser.role || "user";

  const getRoleBadge = (r) => {
    switch (r) {
      case "superadmin":
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-800 flex items-center gap-1"><Crown size={12} /> Superadmin</span>;
      case "admin":
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1"><Shield size={12} /> Admin</span>;
      case "cs":
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1"><Headset size={12} /> Customer Service</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1"><User size={12} /> Mitra Affiliate</span>;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-stone-800 font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed md:static z-40 top-0 left-0 h-full w-64 p-4 transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${role === 'superadmin' ? 'bg-slate-950 text-white' : role === 'admin' ? 'bg-slate-900 text-white' : role === 'cs' ? 'bg-teal-950 text-white' : 'bg-[#1E3A8A] text-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <span className="font-bold text-base">Mitra Berkah</span>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        {/* User Card Singkat di Sidebar */}
        <div className="p-3 rounded-xl bg-white/10 mb-4">
          <p className="text-xs font-semibold text-white/70">Masuk sebagai:</p>
          <p className="font-bold text-sm truncate text-white">{currentUser.nama}</p>
          <div className="mt-1.5">{getRoleBadge(role)}</div>
        </div>

        {/* MENU DINAMIS SESUAI ROLE */}
        <nav className="space-y-1 text-sm font-medium">
          <button onClick={() => { setActiveTab("beranda"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "beranda" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
            <Sparkles size={16} /> Beranda
          </button>

          {/* Menu Khusus Role User / Mitra */}
          {role === "user" && (
            <>
              <button onClick={() => { setActiveTab("katalog"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "katalog" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <ShoppingBag size={16} /> Katalog Affiliate
              </button>
              <button onClick={() => { setActiveTab("wd-user"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "wd-user" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <Wallet size={16} /> Tarik Saldo (WD)
              </button>
              <button onClick={() => { setActiveTab("riwayat"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "riwayat" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <Receipt size={16} /> Mutasi & Riwayat
              </button>
            </>
          )}

          {/* Menu Khusus CS */}
          {role === "cs" && (
            <>
              <button onClick={() => { setActiveTab("cs-bimbingan"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "cs-bimbingan" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <Headset size={16} /> Bimbingan & Kontak Mitra
              </button>
              <button onClick={() => { setActiveTab("cs-monitoring"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "cs-monitoring" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <Receipt size={16} /> Monitoring Transaksi
              </button>
            </>
          )}

          {/* Menu Khusus Admin */}
          {role === "admin" && (
            <>
              <button onClick={() => { setActiveTab("admin-produk"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "admin-produk" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <ShoppingBag size={16} /> Kelola Produk (CRUD)
              </button>
              <button onClick={() => { setActiveTab("admin-wd"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "admin-wd" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <CheckCircle2 size={16} /> Persetujuan WD & Infaq
              </button>
            </>
          )}

          {/* Menu Khusus Superadmin (Owner) */}
          {role === "superadmin" && (
            <>
              <button onClick={() => { setActiveTab("super-users"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "super-users" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <Crown size={16} /> Kontrol Role & User (Full)
              </button>
              <button onClick={() => { setActiveTab("admin-produk"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "admin-produk" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <ShoppingBag size={16} /> Kelola Produk
              </button>
              <button onClick={() => { setActiveTab("admin-wd"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "admin-wd" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
                <Wallet size={16} /> Otorisasi WD & Keuangan
              </button>
            </>
          )}

          {/* Menu Umum Semua Role */}
          <div className="pt-4 mt-4 border-t border-white/20">
            <button onClick={() => { setActiveTab("profil"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "profil" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
              <User size={16} /> Edit Profil & Sandi
            </button>
            <button onClick={() => { setActiveTab("bantuan"); setMobileOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "bantuan" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}>
              <HelpCircle size={16} /> Pusat Bantuan
            </button>
            <button onClick={() => setCurrentUser(null)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-300 hover:bg-red-500/20 transition mt-2">
              <LogOut size={16} /> Keluar Akun
            </button>
          </div>
        </nav>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <button className="md:hidden p-1.5 rounded-lg bg-gray-200" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Panel:</span>
            {getRoleBadge(role)}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Saldo Dompet</p>
            <p className="font-mono font-bold text-base text-blue-900">{rupiah(currentUser.saldo)}</p>
          </div>
        </div>

        {/* 1. VIEW BERANDA */}
        {activeTab === "beranda" && (
          <div className="space-y-4">
            <div className={`p-6 rounded-2xl text-white shadow-sm ${role === 'superadmin' ? 'bg-slate-950' : role === 'admin' ? 'bg-slate-900' : role === 'cs' ? 'bg-teal-900' : 'bg-gradient-to-r from-blue-900 to-indigo-900'}`}>
              <p className="text-xs opacity-80 uppercase font-semibold">Selamat Datang,</p>
              <p className="text-2xl font-bold mt-0.5">{currentUser.nama}</p>
              <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <p className="text-xs opacity-80">Saldo Aktif Tersedia</p>
                  <p className="font-mono text-3xl font-bold text-amber-300">{rupiah(currentUser.saldo)}</p>
                </div>
                {role === "user" && (
                  <div className="flex gap-2">
                    <button onClick={() => setActiveTab("wd-user")} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-full text-xs font-bold text-white transition">Tarik Saldo</button>
                    <button onClick={() => setActiveTab("katalog")} className="px-4 py-2 bg-white/20 rounded-full text-xs font-bold text-white">Lihat Katalog</button>
                  </div>
                )}
              </div>
            </div>

            {/* Statistik Cepat */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-xs text-gray-500">Total Produk Affiliate</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{products.length} Produk</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-xs text-gray-500">Total Mitra Terdaftar</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{usersList.length} User</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200 col-span-2 md:col-span-1">
                <p className="text-xs text-gray-500">Infaq Server Terkumpul</p>
                <p className="text-xl font-bold text-amber-700 mt-1 font-mono">
                  {rupiah(withdrawals.reduce((acc, w) => acc + (w.jumlah_bruto * 0.1), 0))}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. VIEW USER: KATALOG AFFILIATE */}
        {activeTab === "katalog" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-bold">Katalog Produk Affiliate</p>
                <p className="text-xs text-gray-500">Pilih produk, sebar link, dan dapatkan komisi penjualan.</p>
              </div>
            </div>
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.kategori === 'digital' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {p.kategori === 'digital' ? 'Digital (Komisi 80%)' : 'Fisik (Komisi 10%)'}
                    </span>
                    <p className="font-bold text-base text-gray-800 mt-1">{p.nama_produk}</p>
                    <p className="font-mono text-xs font-bold text-green-700 mt-0.5">Komisi: {rupiah(p.potensi_komisi)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(p.link_affiliate || "");
                        alert("Link affiliate berhasil disalin!");
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <Copy size={13} /> Salin Link
                    </button>
                    <button
                      onClick={async () => {
                        const newSaldo = (currentUser.saldo || 0) + Number(p.potensi_komisi);
                        setCurrentUser({ ...currentUser, saldo: newSaldo });
                        try {
                          await updateDoc(doc(db, "users", currentUser.id), { saldo: newSaldo });
                        } catch (e) {}
                        alert(`🎉 Simulasi berhasil! Komisi ${rupiah(p.potensi_komisi)} masuk ke saldo.`);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl"
                    >
                      + Demo Terjual
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. VIEW USER: PENARIKAN SALDO DENGAN INFAQ 10% */}
        {activeTab === "wd-user" && (
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <p className="text-lg font-bold">Formulir Penarikan Saldo (WD)</p>
            <p className="text-xs text-gray-500">Ketentuan: Saldo minimal Rp50.000, infaq operasional server minimal 10%.</p>
            
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Saldo Anda:</span>
                <span className="font-mono font-bold text-blue-900">{rupiah(currentUser.saldo)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Potongan Infaq Server (10%):</span>
                <span className="font-mono text-red-600">- {rupiah(currentUser.saldo * 0.1)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t pt-2 text-gray-800">
                <span>Estimasi Bersih Diterima:</span>
                <span className="font-mono text-green-700">{rupiah(currentUser.saldo - (currentUser.saldo * 0.1))}</span>
              </div>
            </div>

            <button
              onClick={async () => {
                if (currentUser.saldo < 50000) return alert("Saldo komisi minimal Rp50.000 untuk penarikan.");
                const infaq = currentUser.saldo * 0.1;
                const neto = currentUser.saldo - infaq;
                const newWd = {
                  user_id: currentUser.id,
                  nama: currentUser.nama,
                  no_hp: currentUser.no_hp,
                  rekening: currentUser.rekening || "BCA 12345678",
                  jumlah_bruto: currentUser.saldo,
                  persen_infaq: 10,
                  jumlah_neto: neto,
                  status: "Diproses",
                  created_at: new Date().toISOString()
                };
                try {
                  const docRef = await addDoc(collection(db, "withdrawals"), newWd);
                  setWithdrawals([{ id: docRef.id, ...newWd }, ...withdrawals]);
                  await updateDoc(doc(db, "users", currentUser.id), { saldo: 0 });
                } catch (e) {
                  setWithdrawals([{ id: Date.now(), ...newWd }, ...withdrawals]);
                }
                setCurrentUser({ ...currentUser, saldo: 0 });
                alert("Pengajuan penarikan dana berhasil dikirim ke Admin!");
              }}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold"
            >
              Ajukan Penarikan Sekarang
            </button>
          </div>
        )}

        {/* 4. VIEW USER: RIWAYAT MUTASI */}
        {activeTab === "riwayat" && (
          <div className="space-y-3">
            <p className="text-lg font-bold">Riwayat Penarikan Dana Pribadi</p>
            {withdrawals.filter(w => w.user_id === currentUser.id).length === 0 ? (
              <p className="text-xs text-gray-500 p-4 bg-white rounded-xl border text-center">Belum ada riwayat penarikan dana.</p>
            ) : (
              withdrawals.filter(w => w.user_id === currentUser.id).map(w => (
                <div key={w.id} className="p-4 rounded-xl bg-white border border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Neto: {rupiah(w.jumlah_neto)}</p>
                    <p className="text-xs text-red-600 font-mono">Infaq Server (10%): - {rupiah(w.jumlah_bruto * 0.1)}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${w.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{w.status}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* 5. VIEW CS: BIMBINGAN & KONTAK MITRA */}
        {activeTab === "cs-bimbingan" && (
          <div className="space-y-3">
            <p className="text-lg font-bold">Data Kontak Mitra untuk Bimbingan (CS Panel)</p>
            <div className="space-y-2">
              {usersList.map(u => (
                <div key={u.id} className="p-3.5 rounded-xl bg-white border border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{u.nama}</p>
                    <p className="text-xs text-gray-500 font-mono">WhatsApp: {u.no_hp}</p>
                  </div>
                  <a
                    href={`https://wa.me/${u.no_hp?.replace(/^0/, '62')}?text=Halo%20Kak%20${encodeURIComponent(u.nama)},%20ada%20yang%20bisa%20CS%20Mitra%20Berkah%20bantu?`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Phone size={13} /> Chat WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. VIEW ADMIN & SUPERADMIN: CRUD PRODUK */}
        {activeTab === "admin-produk" && (
          <AdminProdukCrud products={products} setProducts={setProducts} />
        )}

        {/* 7. VIEW ADMIN & SUPERADMIN: APPROVAL WD */}
        {activeTab === "admin-wd" && (
          <AdminWdApproval withdrawals={withdrawals} setWithdrawals={setWithdrawals} />
        )}

        {/* 8. VIEW SUPERADMIN: MANAJEMEN USER & ROLE LENGKAP */}
        {activeTab === "super-users" && (
          <SuperAdminUsers usersList={usersList} setUsersList={setUsersList} getRoleBadge={getRoleBadge} />
        )}

        {/* 9. VIEW UMUM: EDIT PROFIL & UPDATE PASSWORD */}
        {activeTab === "profil" && (
          <ProfilMandiri currentUser={currentUser} setCurrentUser={setCurrentUser} />
        )}

        {/* 10. VIEW UMUM: PUSAT BANTUAN */}
        {activeTab === "bantuan" && (
          <PusatBantuan />
        )}
      </main>
    </div>
  );
}

// ==========================================
// KOMPONEN-KOMPONEN OTENTIKASI & FORM
// ==========================================

function AuthContainer({ authPage, setAuthPage, onLoginSuccess, usersList, setUsersList }) {
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [rekening, setRekening] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handler Register
  const handleRegister = async () => {
    if (!nama || !noHp || !password) return setErrorMsg("Nama, Nomor WA, dan Password wajib diisi!");
    setLoading(true);
    setErrorMsg("");

    const newUser = {
      nama,
      no_hp: noHp,
      password: password,
      role: "user", // Default role
      saldo: 0,     // Default saldo
      rekening: rekening || "BCA - Belum diisi",
      created_at: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "users"), newUser);
      const created = { id: docRef.id, ...newUser };
      setUsersList([created, ...usersList]);
      alert("✅ Registrasi berhasil!");
      onLoginSuccess(created);
    } catch (e) {
      // Fallback lokal jika offline
      const fallback = { id: Date.now().toString(), ...newUser };
      onLoginSuccess(fallback);
    } finally {
      setLoading(false);
    }
  };

  // Handler Login
  // Gantikan fungsi handleLogin di App.jsx
const handleLogin = async () => {
  if (!noHp || !password) return setErrorMsg("Nomor WhatsApp dan Password wajib diisi!");
  setLoading(true);
  setErrorMsg("");

  try {
    // Cari dokumen spesifik yang cocok dengan nomor WA dan password
    const q = query(
      collection(db, "users"),
      where("no_hp", "==", noHp.trim()),
      where("password", "==", password)
    );
    
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = { id: userDoc.id, ...userDoc.data() };
      
      // Berhasil login dan role (cs/admin/superadmin) terbaca utuh
      onLoginSuccess(userData);
    } else {
      setErrorMsg("Nomor WhatsApp atau Password salah. Silakan periksa kembali.");
    }
  } catch (e) {
    console.error("Error login:", e);
    setErrorMsg("Terjadi kendala koneksi ke database: " + e.message);
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[#F8F9FA] font-sans">
      <div className="w-full max-w-sm p-6 bg-white rounded-3xl border border-gray-200 shadow-md">
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Mitra Berkah Affiliate</h2>
          <p className="text-xs text-gray-500">Platform Gotong Royong Komisi Affiliate</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        {/* 1. FORM LOGIN */}
        {authPage === "login" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600">Nomor WhatsApp</label>
              <input value={noHp} onChange={e => setNoHp(e.target.value)} placeholder="081234567890" className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
            </div>
            <div className="text-right">
              <button onClick={() => setAuthPage("forgot")} className="text-xs text-blue-900 font-semibold hover:underline">Lupa Password?</button>
            </div>
            <button onClick={handleLogin} disabled={loading} className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition">
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Belum punya akun? <button onClick={() => setAuthPage("register")} className="text-blue-900 font-bold hover:underline">Daftar Gratis</button>
            </p>
          </div>
        )}

        {/* 2. FORM REGISTER */}
        {authPage === "register" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600">Nama Lengkap</label>
              <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Contoh: Siti Aminah" className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Nomor WhatsApp Aktif</label>
              <input value={noHp} onChange={e => setNoHp(e.target.value)} placeholder="081234567890" className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Buat Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Nomor Rekening / E-Wallet (Untuk WD)</label>
              <input value={rekening} onChange={e => setRekening(e.target.value)} placeholder="BCA / DANA 08123xxx" className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
            </div>
            <button onClick={handleRegister} disabled={loading} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition">
              {loading ? "Mendaftarkan..." : "Daftar Akun Baru"}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Sudah punya akun? <button onClick={() => setAuthPage("login")} className="text-blue-900 font-bold hover:underline">Masuk</button>
            </p>
          </div>
        )}

        {/* 3. FORM LUPA PASSWORD */}
        {authPage === "forgot" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">Masukkan nomor WhatsApp Anda yang terdaftar untuk menerima bantuan reset password dari tim CS kami.</p>
            <div>
              <label className="text-xs font-bold text-gray-600">Nomor WhatsApp Terdaftar</label>
              <input value={noHp} onChange={e => setNoHp(e.target.value)} placeholder="081234567890" className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
            </div>
            <a
              href={`https://wa.me/628111111111?text=Halo%20CS%20Mitra%20Berkah,%20saya%20lupa%20password%20akun%20nomor%20WA:%20${noHp}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Phone size={14} /> Hubungi CS Reset Sandi
            </a>
            <button onClick={() => setAuthPage("login")} className="w-full py-2.5 text-xs text-gray-500 font-semibold hover:underline">
              ← Kembali ke Halaman Masuk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// KOMPONEN EDIT PROFIL MANDIRI & UPDATE SANDI
// ==========================================

function ProfilMandiri({ currentUser, setCurrentUser }) {
  const [nama, setNama] = useState(currentUser.nama || "");
  const [noHp, setNoHp] = useState(currentUser.no_hp || "");
  const [rekening, setRekening] = useState(currentUser.rekening || "");
  const [passBaru, setPassBaru] = useState("");
  const [saving, setSaving] = useState(false);

  const handleUpdateProfil = async () => {
    setSaving(true);
    const updated = {
      ...currentUser,
      nama,
      no_hp: noHp,
      rekening,
      ...(passBaru ? { password: passBaru } : {})
    };

    try {
      await updateDoc(doc(db, "users", currentUser.id), updated);
      setCurrentUser(updated);
      setPassBaru("");
      alert("✅ Data profil & password berhasil diperbarui!");
    } catch (e) {
      setCurrentUser(updated);
      alert("✅ Profil berhasil diperbarui secara lokal!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
      <p className="text-lg font-bold">Pengaturan Profil & Password Sendiri</p>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-gray-600">Nama Lengkap</label>
          <input value={nama} onChange={e => setNama(e.target.value)} className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600">Nomor WhatsApp</label>
          <input value={noHp} onChange={e => setNoHp(e.target.value)} className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600">Nomor Rekening / E-Wallet Pencairan</label>
          <input value={rekening} onChange={e => setRekening(e.target.value)} placeholder="BCA / DANA / OVO" className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
        </div>
        <div className="pt-2 border-t">
          <label className="text-xs font-bold text-gray-600">Ganti Password Baru (Kosongkan jika tidak diganti)</label>
          <input type="password" value={passBaru} onChange={e => setPassBaru(e.target.value)} placeholder="••••••••" className="w-full mt-1 p-2.5 text-sm border rounded-xl" />
        </div>
        <button onClick={handleUpdateProfil} disabled={saving} className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold">
          {saving ? "Menyimpan..." : "Simpan Perubahan Profil"}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// KOMPONEN CRUD PRODUK (ADMIN & SUPERADMIN)
// ==========================================

function AdminProdukCrud({ products, setProducts }) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("fisik");
  const [komisi, setKomisi] = useState(10);
  const [potensi, setPotensi] = useState("");
  const [link, setLink] = useState("");

  const handleAdd = async () => {
    if (!nama || !potensi) return alert("Lengkapi nama produk dan nominal potensi komisi.");
    const newP = {
      nama_produk: nama,
      kategori,
      komisi_persen: Number(komisi),
      potensi_komisi: Number(potensi),
      link_affiliate: link || "https://shope.ee/contoh"
    };

    try {
      const docRef = await addDoc(collection(db, "products"), newP);
      setProducts([{ id: docRef.id, ...newP }, ...products]);
    } catch (e) {
      setProducts([{ id: Date.now().toString(), ...newP }, ...products]);
    }
    setNama(""); setPotensi(""); setLink("");
    alert("Produk berhasil ditambahkan!");
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (e) {}
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border-2 border-blue-900 shadow-sm space-y-3">
        <p className="text-xs font-bold uppercase text-blue-900">Tambah Produk Affiliate Baru</p>
        <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama Produk" className="w-full p-2 border rounded-xl text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <select value={kategori} onChange={e => { setKategori(e.target.value); setKomisi(e.target.value === 'digital' ? 80 : 10); }} className="p-2 border rounded-xl text-sm bg-white">
            <option value="fisik">Produk Fisik (Komisi 10%)</option>
            <option value="digital">Produk Digital (Komisi 80%)</option>
          </select>
          <input type="number" value={potensi} onChange={e => setPotensi(e.target.value)} placeholder="Komisi (Rp)" className="p-2 border rounded-xl text-sm" />
        </div>
        <input value={link} onChange={e => setLink(e.target.value)} placeholder="Link Affiliate / Referral" className="w-full p-2 border rounded-xl text-sm" />
        <button onClick={handleAdd} className="w-full py-2 bg-blue-900 text-white rounded-xl text-xs font-bold">Simpan Produk</button>
      </div>

      <div className="space-y-2">
        {products.map(p => (
          <div key={p.id} className="p-3.5 rounded-xl bg-white border border-gray-200 flex justify-between items-center">
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.kategori === 'digital' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{p.kategori}</span>
              <p className="font-bold text-sm mt-0.5">{p.nama_produk}</p>
              <p className="font-mono text-xs text-green-700 font-bold">Komisi: {rupiah(p.potensi_komisi)}</p>
            </div>
            <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// KOMPONEN APPROVAL WD (ADMIN & SUPERADMIN)
// ==========================================

function AdminWdApproval({ withdrawals, setWithdrawals }) {
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "withdrawals", id), { status });
    } catch (e) {}
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status } : w));
  };

  const totalInfaq = withdrawals.reduce((acc, w) => acc + (w.jumlah_bruto * 0.1), 0);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-sm">
        <p className="text-xs text-white/70">Total Infaq Server 10% Terkumpul</p>
        <p className="font-mono text-2xl font-bold text-amber-400 mt-1">{rupiah(totalInfaq)}</p>
      </div>

      <p className="font-bold text-sm">Antrean Persetujuan Penarikan Dana ({withdrawals.length})</p>
      <div className="space-y-2">
        {withdrawals.map(w => (
          <div key={w.id} className="p-4 rounded-xl bg-white border border-gray-200 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-sm">{w.nama}</p>
                <p className="text-xs text-gray-500 font-mono">Tujuan: {w.rekening || "BCA"}</p>
                <p className="text-sm font-bold text-green-700 font-mono mt-1">Cair: {rupiah(w.jumlah_neto)}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${w.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{w.status}</span>
            </div>
            {w.status === "Diproses" && (
              <div className="flex gap-2 pt-2 border-t">
                <button onClick={() => handleUpdateStatus(w.id, "Selesai")} className="flex-1 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"><CheckCircle2 size={13} /> Setujui & Cairkan</button>
                <button onClick={() => handleUpdateStatus(w.id, "Ditolak")} className="flex-1 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"><XCircle size={13} /> Tolak</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// KOMPONEN KENDALI USER (SUPERADMIN MUTLAK)
// ==========================================

function SuperAdminUsers({ usersList, setUsersList, getRoleBadge }) {
  const [editSaldoId, setEditSaldoId] = useState(null);
  const [inputSaldo, setInputSaldo] = useState("");

  const handleChangeRole = async (id, newRole) => {
    try {
      await updateDoc(doc(db, "users", id), { role: newRole });
    } catch (e) {}
    setUsersList(usersList.map(u => u.id === id ? { ...u, role: newRole } : u));
    alert(`Role berhasil diubah menjadi: ${newRole.toUpperCase()}`);
  };

  const handleSaveSaldo = async (id) => {
    try {
      await updateDoc(doc(db, "users", id), { saldo: Number(inputSaldo) });
    } catch (e) {}
    setUsersList(usersList.map(u => u.id === id ? { ...u, saldo: Number(inputSaldo) } : u));
    setEditSaldoId(null);
    alert("Saldo member berhasil diperbarui!");
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus user ini secara permanen?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (e) {}
    setUsersList(usersList.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-3">
      <p className="text-lg font-bold">Kontrol Penuh Pengguna & Role (Superadmin)</p>
      <div className="space-y-2">
        {usersList.map(u => (
          <div key={u.id} className="p-4 rounded-xl bg-white border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm">{u.nama}</p>
                {getRoleBadge(u.role)}
              </div>
              <p className="text-xs text-gray-500 font-mono mt-0.5">WA: {u.no_hp} | Saldo: <span className="font-bold text-green-700">{rupiah(u.saldo)}</span></p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Ubah Role */}
              <select
                value={u.role || "user"}
                onChange={e => handleChangeRole(u.id, e.target.value)}
                className="text-xs p-1.5 border rounded-lg bg-gray-50 font-bold"
              >
                <option value="user">User (Mitra)</option>
                <option value="cs">CS</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>

              {/* Edit Saldo */}
              {editSaldoId === u.id ? (
                <div className="flex items-center gap-1">
                  <input type="number" value={inputSaldo} onChange={e => setInputSaldo(e.target.value)} placeholder="Nominal" className="w-20 p-1 text-xs border rounded" />
                  <button onClick={() => handleSaveSaldo(u.id)} className="px-2 py-1 bg-green-600 text-white text-xs rounded font-bold">Simpan</button>
                </div>
              ) : (
                <button onClick={() => { setEditSaldoId(u.id); setInputSaldo(u.saldo || 0); }} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-bold">Edit Saldo</button>
              )}

              <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// KOMPONEN PUSAT BANTUAN & FAQ
// ==========================================

function PusatBantuan() {
  return (
    <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
      <p className="text-lg font-bold">Pusat Bantuan & Panduan Affiliate</p>
      
      <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="font-bold text-gray-800 mb-1">1. Bagaimana cara mulai mendapatkan komisi?</p>
          <p>Buka menu <strong>Katalog Affiliate</strong>, pilih produk fisik atau digital yang ingin dipromosikan, klik tombol <strong>Salin Link</strong>, lalu sebarkan link referral Anda ke media sosial atau grup WhatsApp.</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="font-bold text-gray-800 mb-1">2. Mengapa ada potongan Infaq Server 10% saat WD?</p>
          <p>Untuk memastikan server, database Firebase, dan sistem operasional bimbingan tetap aktif dan gratis selamanya bagi seluruh mitra tanpa dipungut biaya pendaftaran awal.</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="font-bold text-gray-800 mb-1">3. Butuh bantuan bimbingan langsung?</p>
          <a
            href="https://wa.me/628111111111?text=Halo%20CS%20Mitra%20Berkah,%20saya%20ingin%20konsultasi%20bimbingan%20affiliate"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-bold text-green-700 hover:underline mt-1"
          >
            <Phone size={13} /> Hubungi CS Bimbingan Resmi WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

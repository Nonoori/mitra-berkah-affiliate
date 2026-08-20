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
  Copy, AlertCircle, ShoppingCart, Tag, Filter, Search, Calendar,
  ArrowDownLeft, ArrowUpRight, StickyNote, Send, Mail, KeyRound,
  FileText, HelpCircle as FaqIcon, Check, ExternalLink, Info, Bell
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
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("beranda");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubKategori, setSelectedSubKategori] = useState(null);

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Load Data Database
  const loadAppData = async () => {
    try {
      const pSnap = await getDocs(collection(db, "products"));
      if (!pSnap.empty) {
        setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setProducts([
          { id: "p1", nama_produk: "Serum Vitamin C Booster", kategori: "fisik", komisi_persen: 10, potensi_komisi: 15000, harga: 150000, link_affiliate: "https://shopee.co.id/product/demo1" },
          { id: "p2", nama_produk: "Masterclass Video AI Creator", kategori: "digital", komisi_persen: 80, potensi_komisi: 120000, harga: 150000, link_affiliate: "https://kelasaiberkah.com/ecourse" }
        ]);
      }

      const tSnap = await getDocs(collection(db, "transactions"));
      setTransactions(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const uSnap = await getDocs(collection(db, "users"));
      setUsersList(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("Mode offline / database error:", e);
    }
  };

  useEffect(() => {
    loadAppData();
  }, [currentUser]);

  // Fungsi Pencatat Mutasi & Log Notifikasi Laporan ke CS/Admin/Superadmin
  const catatTransaksi = async (jenis, nominal, keterangan, userId, saldoSetelahnya) => {
    const newTrx = {
      user_id: userId,
      user_nama: currentUser.nama,
      user_wa: currentUser.no_hp,
      jenis: jenis, // 'JUAL', 'BELI_SENDIRI', 'WD'
      nominal: Number(nominal),
      keterangan: keterangan,
      saldo_akhir: Number(saldoSetelahnya),
      created_at: new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
      timestamp: Date.now()
    };

    try {
      const docRef = await addDoc(collection(db, "transactions"), newTrx);
      setTransactions([{ id: docRef.id, ...newTrx }, ...transactions]);

      // Catat Notifikasi Laporan Kegiatan untuk Staff
      await addDoc(collection(db, "activity_logs"), {
        tipe: jenis,
        pesan: `Mitra ${currentUser.nama} (${currentUser.no_hp}) melakukan ${jenis}: ${keterangan}`,
        nominal: Number(nominal),
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      setTransactions([{ id: Date.now().toString(), ...newTrx }, ...transactions]);
    }
  };

  // Mesin Pembuat Link Referral Unik Pengguna
  const generateUniqueLink = (baseLink, product) => {
    const cleanUrl = baseLink.includes("?") ? baseLink : `${baseLink}?`;
    return `${cleanUrl}&ref=${currentUser.id}&ktp=${currentUser.no_ktp || "aff"}&aff=${encodeURIComponent(currentUser.nama)}`;
  };

  if (!currentUser) {
    return <AuthView onLoginSuccess={(u) => { setCurrentUser(u); setActiveTab("beranda"); }} />;
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
      
      {/* 1. STICKY NOTE TOP BAR */}
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
                <button onClick={() => setActiveTab("profil")} className="font-bold text-sm text-stone-900 hover:underline flex items-center gap-1">
                  {currentUser.nama}
                </button>
                {getRoleBadge(role)}
              </div>
              <p className="text-[11px] text-stone-500 font-mono">WA: {currentUser.no_hp} | Kota: {currentUser.kota || "-"}</p>
            </div>
          </div>

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
        {/* 2. SIDEBAR NAVIGATION (AUTO-HIDE) */}
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

            {/* Menu Mitra */}
            {role === "user" && (
              <>
                <button
                  onClick={() => { setActiveTab("produk-jual"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "produk-jual" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <Tag size={16} /> Mesin Link Produk Jual
                </button>

                <button
                  onClick={() => { setActiveTab("produk-beli"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "produk-beli" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <ShoppingCart size={16} /> Beli Sendiri (Normal)
                </button>

                <button
                  onClick={() => { setActiveTab("transaksi"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "transaksi" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <Receipt size={16} /> History & Mutasi Lengkap
                </button>

                <button
                  onClick={() => { setActiveTab("wd"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "wd" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
                >
                  <Wallet size={16} /> Tarik Saldo (WD 10%)
                </button>
              </>
            )}

            {/* Menu Khusus Staff */}
            {['admin', 'superadmin', 'cs'].includes(role) && (
              <button
                onClick={() => { setActiveTab("data-users"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "data-users" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
              >
                <User size={16} /> Data Member & Index
              </button>
            )}

            {['admin', 'superadmin'].includes(role) && (
              <button
                onClick={() => { setActiveTab("kelola-produk"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${activeTab === "kelola-produk" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
              >
                <ShoppingBag size={16} /> Kelola Produk (CRUD)
              </button>
            )}

            {/* Menu Edukasi & Legalitas */}
            <div className="pt-3 border-t border-white/20 space-y-1">
              <button
                onClick={() => { setActiveTab("profil"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "profil" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
              >
                <User size={15} /> Edit Profil & Sandi
              </button>

              <button
                onClick={() => { setActiveTab("panduan-kategori"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "panduan-kategori" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
              >
                <Info size={15} /> Panduan Sub-Kategori
              </button>

              <button
                onClick={() => { setActiveTab("bantuan"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "bantuan" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
              >
                <HelpCircle size={15} /> Pusat Bantuan & CS
              </button>

              <button
                onClick={() => { setActiveTab("faq"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "faq" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
              >
                <FaqIcon size={15} /> Tanya Jawab (FAQ)
              </button>

              <button
                onClick={() => { setActiveTab("syarat"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${activeTab === "syarat" ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10"}`}
              >
                <FileText size={15} /> Syarat & Ketentuan
              </button>
            </div>

            <div className="pt-3 border-t border-white/20">
              <button
                onClick={() => { setCurrentUser(null); setSidebarOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl"
              >
                Keluar Akun
              </button>
            </div>
          </nav>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 p-4 md:p-6 w-full space-y-5">
          
          {/* VIEW: BERANDA */}
          {activeTab === "beranda" && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-sm">
                <p className="text-xs uppercase font-semibold text-blue-200">Dashboard Affiliate Engine</p>
                <p className="text-2xl font-bold mt-1">Halo, {currentUser.nama}!</p>
                <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <p className="text-xs text-blue-200">Saldo Dompet Anda</p>
                    <p className="font-mono text-3xl font-bold text-amber-300">{rupiah(currentUser.saldo)}</p>
                  </div>
                  {role === "user" && (
                    <div className="flex gap-2">
                      <button onClick={() => setActiveTab("produk-jual")} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-white transition">Mesin Link Jual</button>
                      <button onClick={() => setActiveTab("produk-beli")} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold text-white transition">Beli Sendiri</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Alur Kerja Cepat Afiliasi */}
              <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
                <p className="text-sm font-bold text-stone-900 flex items-center gap-1.5"><Sparkles size={16} className="text-amber-500" /> Alur Kerja Afiliasi Mitra</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="font-bold text-blue-900">1. Salin Link Unik</span>
                    <p className="text-stone-500 mt-1">Sistem otomatis menyisipkan kode referral akun Anda ke dalam tautan produk.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="font-bold text-emerald-900">2. Sebar & Jual</span>
                    <p className="text-stone-500 mt-1">Promosikan ke WhatsApp, TikTok, FB, atau Telegram bimbingan kami.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="font-bold text-amber-900">3. Komisi & WD</span>
                    <p className="text-stone-500 mt-1">Komisi otomatis masuk ke saldo dan siap ditarik ke rekening/E-Wallet Anda.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MESIN LINK PRODUK YANG DIJUAL */}
          {activeTab === "produk-jual" && (
            <div className="space-y-3">
              <div>
                <p className="text-lg font-bold text-stone-900">Mesin Link Affiliate & Penjualan</p>
                <p className="text-xs text-stone-500">Klik "Salin Link Unik" untuk menyalin tautan khusus berindeks KTP & ID Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map(p => {
                  const uniqueLink = generateUniqueLink(p.link_affiliate || "https://mitraberkah.com/item", p);
                  return (
                    <div key={p.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.kategori === 'digital' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {p.kategori === 'digital' ? 'Digital 80%' : 'Fisik 10%'}
                          </span>
                          <button onClick={() => { setSelectedSubKategori(p.kategori); setActiveTab("panduan-kategori"); }} className="text-[11px] text-blue-900 font-semibold hover:underline">
                            Detail Kategori →
                          </button>
                        </div>
                        <p className="font-bold text-sm text-stone-900 mt-1">{p.nama_produk}</p>
                        <p className="text-xs text-stone-500">Harga Jual: {rupiah(p.harga || 100000)}</p>
                        <p className="font-mono text-xs font-bold text-emerald-700 mt-1">Potensi Komisi: {rupiah(p.potensi_komisi)}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        <div className="p-2 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-[11px] text-stone-600 font-mono truncate">
                          <span className="truncate">{uniqueLink}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(uniqueLink);
                              alert(`✅ Link unik produk "${p.nama_produk}" berhasil disalin ke clipboard!\n\nLink: ${uniqueLink}`);
                            }}
                            className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                          >
                            <Copy size={13} /> Salin Link Unik
                          </button>

                          <button
                            onClick={async () => {
                              const saldoBaru = (currentUser.saldo || 0) + Number(p.potensi_komisi);
                              setCurrentUser({ ...currentUser, saldo: saldoBaru });
                              try {
                                await updateDoc(doc(db, "users", currentUser.id), { saldo: saldoBaru });
                              } catch (e) {}
                              await catatTransaksi("JUAL", p.potensi_komisi, `Komisi Jual: ${p.nama_produk}`, currentUser.id, saldoBaru);
                              alert(`🎉 Penjualan berhasil diverifikasi! Saldo bertambah ${rupiah(p.potensi_komisi)}`);
                            }}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                          >
                            + Demo Jual Sukses
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: BELI SENDIRI (NORMAL NON-KOMISI) */}
          {activeTab === "produk-beli" && (
            <div className="space-y-3">
              <div>
                <p className="text-lg font-bold text-stone-900">Beli Produk untuk Konsumsi Pribadi</p>
                <p className="text-xs text-stone-500">Pembelian langsung tanpa komisi affiliate dan tanpa cashback.</p>
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
                        Harga Bayar: {rupiah(p.harga || 100000)}
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        const hargaBayar = Number(p.harga || 100000);
                        await catatTransaksi(
                          "BELI_SENDIRI", 
                          0, 
                          `Beli Sendiri (Normal): ${p.nama_produk} (${rupiah(hargaBayar)})`, 
                          currentUser.id, 
                          currentUser.saldo
                        );
                        if (p.link_affiliate) {
                          window.open(p.link_affiliate, "_blank");
                        } else {
                          alert(`Pesanan "${p.nama_produk}" tercatat. Total bayar: ${rupiah(hargaBayar)}`);
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

          {/* VIEW: MUTASI & RIWAYAT TRANSAKSI */}
          {activeTab === "transaksi" && (
            <MutasiView transactions={transactions.filter(t => t.user_id === currentUser.id)} />
          )}

          {/* VIEW: PENARIKAN SALDO WD DENGAN INFAQ SERVER 10% */}
          {activeTab === "wd" && (
            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <p className="text-lg font-bold">Penarikan Saldo Komisi (WD) & Infaq 10%</p>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Saldo Dompet:</span>
                  <span className="font-mono font-bold text-stone-900">{rupiah(currentUser.saldo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Infaq Operasional Server (10%):</span>
                  <span className="font-mono text-red-600">- {rupiah(currentUser.saldo * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t pt-2 text-emerald-800">
                  <span>Neto Diterima Rekening:</span>
                  <span className="font-mono">{rupiah(currentUser.saldo - (currentUser.saldo * 0.1))}</span>
                </div>
                <p className="text-[11px] text-stone-500 pt-1">Rekening Tujuan: <strong>{currentUser.nama_bank || "BCA"} - {currentUser.no_rekening || "-"}</strong></p>
              </div>

              <button
                onClick={async () => {
                  if (currentUser.saldo < 50000) return alert("Minimal saldo penarikan adalah Rp50.000");
                  const bruto = currentUser.saldo;
                  const infaq = bruto * 0.1;
                  const neto = bruto - infaq;

                  setCurrentUser({ ...currentUser, saldo: 0 });
                  try {
                    await updateDoc(doc(db, "users", currentUser.id), { saldo: 0 });
                  } catch (e) {}

                  await catatTransaksi("WD", neto, `Penarikan Saldo (Infaq 10%: ${rupiah(infaq)})`, currentUser.id, 0);
                  alert("Pengajuan penarikan dana berhasil dikirim ke Admin!");
                }}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition"
              >
                Tarik Semua Saldo
              </button>
            </div>
          )}

          {/* VIEW: EDIT PROFIL LENGKAP & GANTI PASSWORD */}
          {activeTab === "profil" && (
            <ProfilView currentUser={currentUser} setCurrentUser={setCurrentUser} />
          )}

          {/* VIEW: PENJELASAN SUB-KATEGORI */}
          {activeTab === "panduan-kategori" && (
            <PanduanSubKategori selectedSubKategori={selectedSubKategori} setSelectedSubKategori={setSelectedSubKategori} />
          )}

          {/* VIEW: PUSAT BANTUAN & CS */}
          {activeTab === "bantuan" && (
            <BantuanView />
          )}

          {/* VIEW: FAQ */}
          {activeTab === "faq" && (
            <FaqView />
          )}

          {/* VIEW: SYARAT & KETENTUAN */}
          {activeTab === "syarat" && (
            <SyaratKetentuanView />
          )}

          {/* VIEW: DATA USER (STAFF PANEL) */}
          {activeTab === "data-users" && (
            <DataUsersFilterPanel usersList={usersList} getRoleBadge={getRoleBadge} />
          )}

          {/* VIEW: CRUD PRODUK (ADMIN) */}
          {activeTab === "kelola-produk" && (
            <KelolaProdukAdmin products={products} setProducts={setProducts} />
          )}
        </main>
      </div>

      {/* FOOTER HAK CIPTA & LEGALITAS */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 px-5 text-center text-xs text-stone-500">
        <p className="font-semibold text-stone-700">© 2026 Mitra Berkah Affiliate. Seluruh Hak Cipta Dilindungi Undang-Undang.</p>
        <p className="text-[11px] text-stone-400 mt-1">Platform Gotong Royong Komisi Afiliasi Terintegrasi Firebase & Vercel Engine.</p>
      </footer>
    </div>
  );
}

// ---------------- 4. KOMPONEN MUTASI TRANSAKSI ----------------
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
          <p className="text-xs text-stone-500">Mencatat tanggal, sumber transaksi, dan saldo akhir secara akurat.</p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
          {["ALL", "JUAL", "BELI_SENDIRI", "WD"].map(f => (
            <button
              key={f}
              onClick={() => setFilterJenis(f)}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${filterJenis === f ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"}`}
            >
              {f === "ALL" ? "Semua" : f === "JUAL" ? "Jual" : f === "BELI_SENDIRI" ? "Beli Sendiri" : "WD"}
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
                <p className={`font-mono text-sm font-bold ${
                  t.jenis === 'WD' ? 'text-red-600' : t.jenis === 'JUAL' ? 'text-emerald-700' : 'text-stone-700'
                }`}>
                  {t.jenis === 'WD' ? `-${rupiah(t.nominal)}` : t.jenis === 'JUAL' ? `+${rupiah(t.nominal)}` : 'Rp0'}
                </p>
                <p className="text-[10px] text-stone-400 font-mono">Saldo: {rupiah(t.saldo_akhir)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------- 5. KOMPONEN PROFIL LENGKAP & UPDATE SANDI ----------------
function ProfilView({ currentUser, setCurrentUser }) {
  const [nama, setNama] = useState(currentUser.nama || "");
  const [noHp, setNoHp] = useState(currentUser.no_hp || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [kota, setKota] = useState(currentUser.kota || "");
  const [provinsi, setProvinsi] = useState(currentUser.provinsi || "");
  const [telegram, setTelegram] = useState(currentUser.telegram || "");
  const [namaBank, setNamaBank] = useState(currentUser.nama_bank || "");
  const [noRekening, setNoRekening] = useState(currentUser.no_rekening || "");
  const [passBaru, setPassBaru] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const updateData = {
      ...currentUser,
      nama: nama.trim(),
      no_hp: noHp.trim(),
      email: email.trim(),
      kota: kota.trim(),
      provinsi: provinsi.trim(),
      telegram: telegram.trim().replace(/^@/, ""),
      nama_bank: namaBank.trim(),
      no_rekening: noRekening.trim(),
      ...(passBaru.length >= 6 ? { password: passBaru } : {})
    };

    try {
      await updateDoc(doc(db, "users", currentUser.id), updateData);
      setCurrentUser(updateData);
      setPassBaru("");
      alert("✅ Data profil dan password berhasil disimpan!");
    } catch (e) {
      setCurrentUser(updateData);
      alert("✅ Profil berhasil diperbarui!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
      <div>
        <p className="text-lg font-bold text-stone-900">Pengaturan Profil & Keamanan</p>
        <p className="text-xs text-stone-500">Perbarui identitas akun, data bank penerima komisi, atau kata sandi Anda.</p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-stone-700">Nomor KTP (Permanen)</label>
            <input value={currentUser.no_ktp || "-"} disabled className="w-full mt-1 p-2.5 text-xs bg-stone-100 border border-stone-200 rounded-xl font-mono text-stone-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700">Nama Lengkap</label>
            <input value={nama} onChange={e => setNama(e.target.value)} className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700">Nomor WhatsApp</label>
            <input value={noHp} onChange={e => setNoHp(e.target.value)} className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700">Alamat Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700">Kota Domisili</label>
            <input value={kota} onChange={e => setKota(e.target.value)} className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700">Provinsi</label>
            <input value={provinsi} onChange={e => setProvinsi(e.target.value)} className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700">Username Telegram (Bimbingan)</label>
            <input value={telegram} onChange={e => setTelegram(e.target.value)} className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700">Nama Bank / E-Wallet</label>
            <input value={namaBank} onChange={e => setNamaBank(e.target.value)} className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700">Nomor Rekening / No E-Wallet</label>
          <input value={noRekening} onChange={e => setNoRekening(e.target.value)} className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl" />
        </div>

        <div className="pt-3 border-t border-stone-200">
          <label className="text-xs font-bold text-stone-700">Update Password Baru (Kosongkan jika tidak ingin ganti)</label>
          <input type="password" value={passBaru} onChange={e => setPassBaru(e.target.value)} placeholder="••••••••" className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl" />
        </div>

        <button onClick={handleUpdate} disabled={loading} className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition">
          {loading ? "Menyimpan Perubahan..." : "Simpan Pembaruan Profil"}
        </button>
      </div>
    </div>
  );
}

// ---------------- 6. KOMPONEN PENJELASAN SUB-KATEGORI ----------------
function PanduanSubKategori({ selectedSubKategori, setSelectedSubKategori }) {
  return (
    <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
      <div>
        <p className="text-lg font-bold text-stone-900">Penjelasan Sub-Kategori Produk & Komisi</p>
        <p className="text-xs text-stone-500">Struktur bagi hasil, masa tahan saldo (holding period), dan ketentuan affiliate.</p>
      </div>

      <div className="space-y-3">
        {/* Kategori Fisik */}
        <div className={`p-4 rounded-2xl border ${selectedSubKategori === 'fisik' ? 'border-blue-900 bg-blue-50/50' : 'border-stone-200 bg-stone-50'}`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Produk Fisik / Riil</span>
            <span className="text-xs font-bold text-blue-900 font-mono">Komisi: 10%</span>
          </div>
          <p className="text-xs text-stone-700 mt-2 leading-relaxed">
            • <strong>Contoh Produk:</strong> Skincare, herbal, pakaian, perabot rumah tangga.<br />
            • <strong>Alur Pencairan:</strong> Komisi berstatus <em>Tersedia</em> setelah status pesanan di kurir/marketplace berstatus <em>Selesai</em> (Holding period 3 hari untuk mencegah retur barang).<br />
            • <strong>Potongan Server:</strong> Infaq 10% otomatis dipotong saat mitra melakukan penarikan saldo (WD).
          </p>
        </div>

        {/* Kategori Digital */}
        <div className={`p-4 rounded-2xl border ${selectedSubKategori === 'digital' ? 'border-purple-900 bg-purple-50/50' : 'border-stone-200 bg-stone-50'}`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">Produk Digital & E-Course</span>
            <span className="text-xs font-bold text-purple-900 font-mono">Komisi: 80%</span>
          </div>
          <p className="text-xs text-stone-700 mt-2 leading-relaxed">
            • <strong>Contoh Produk:</strong> Kursus online Video AI, ebook bisnis, template desain, software tools.<br />
            • <strong>Alur Pencairan:</strong> Komisi langsung dihitung dari nilai bersih pembayaran. Saldo dapat ditarik setelah masa garansi refund 7 hari selesai.<br />
            • <strong>Margin Perusahaan:</strong> 20% sisa omset + 10% infaq server digunakan untuk membiayai infrastruktur database dan mentor bimbingan senior.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------- 7. KOMPONEN PUSAT BANTUAN & CS ----------------
function BantuanView() {
  return (
    <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
      <div>
        <p className="text-lg font-bold text-stone-900">Pusat Bantuan & Bimbingan</p>
        <p className="text-xs text-stone-500">Layanan konsultasi dan bantuan operasional untuk seluruh mitra.</p>
      </div>

      <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
          <p className="font-bold text-stone-900">1. Kontak Customer Service (CS)</p>
          <p>Jika mengalami kendala penarikan saldo, verifikasi produk, atau reset password, silakan hubungi tim CS resmi kami:</p>
          <a href="https://wa.me/628111111111?text=Halo%20CS%20Mitra%20Berkah,%20saya%20membutuhkan%20bantuan" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold">
            <Phone size={12} /> Hubungi CS via WhatsApp
          </a>
        </div>

        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
          <p className="font-bold text-stone-900">2. Komunitas Bimbingan Senior di Telegram</p>
          <p>Dapatkan materi promosi harian, video viral siap sebar, dan mentoring bersama senior affiliate di channel Telegram:</p>
          <a href="https://t.me/mitraberkah_official" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-500 text-white rounded-lg font-bold">
            <Send size={12} /> Gabung Grup Telegram Bimbingan
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------------- 8. KOMPONEN FAQ (TANYA JAWAB) ----------------
function FaqView() {
  return (
    <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
      <div>
        <p className="text-lg font-bold text-stone-900">Pertanyaan yang Sering Diajukan (FAQ)</p>
        <p className="text-xs text-stone-500">Jawaban lengkap seputar sistem affiliate Mitra Berkah.</p>
      </div>

      <div className="space-y-2.5 text-xs text-stone-700">
        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
          <p className="font-bold text-stone-900">Q: Apakah ada biaya pendaftaran menjadi mitra?</p>
          <p className="text-stone-600 mt-1">A: Tidak ada. Pendaftaran 100% Gratis dengan saldo awal Rp0.</p>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
          <p className="font-bold text-stone-900">Q: Bagaimana cara kerja mesin link penjualan unik?</p>
          <p className="text-stone-600 mt-1">A: Setiap kali Anda menekan tombol "Salin Link Unik", sistem secara otomatis menyematkan ID akun dan nomor KTP Anda ke dalam tautan. Pembeli yang bertransaksi melalui link tersebut akan otomatis menghasilkan komisi ke saldo dompet Anda.</p>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
          <p className="font-bold text-stone-900">Q: Kapan saya bisa menarik saldo (WD)?</p>
          <p className="text-stone-600 mt-1">A: Penarikan saldo dapat diajukan kapan saja dengan batas minimal Rp50.000. Infaq server 10% dipotong otomatis dari total penarikan.</p>
        </div>
      </div>
    </div>
  );
}

// ---------------- 9. KOMPONEN SYARAT & KETENTUAN (TERMS & CONDITIONS) ----------------
function SyaratKetentuanView() {
  return (
    <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
      <div>
        <p className="text-lg font-bold text-stone-900">Syarat & Ketentuan Layanan (Terms & Conditions)</p>
        <p className="text-xs text-stone-500">Ketentuan penggunaan platform affiliate Mitra Berkah.</p>
      </div>

      <div className="space-y-3 text-xs text-stone-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
        <p><strong>1. Ketentuan Akun:</strong> Setiap mitra hanya diperbolehkan mendaftarkan 1 akun menggunakan nomor KTP dan nomor WhatsApp aktif yang valid.</p>
        <p><strong>2. Larangan Spam:</strong> Mitra dilarang menyebarkan tautan affiliate menggunakan teknik spamming, pesan massal yang mengganggu, atau iklan yang menyesatkan calon pembeli.</p>
        <p><strong>3. Kebijakan Infaq Operasional Server (10%):</strong> Mitra menyetujui bahwa setiap penarikan saldo (WD) dikenakan potongan infaq sebesar 10% untuk pemeliharaan server database, sistem otomatisasi, dan operasional bimbingan.</p>
        <p><strong>4. Pembatalan Komisi:</strong> Perusahaan berhak membatalkan komisi jika ditemukan indikasi kecurangan transaksi fiktif atau pembatalan sepihak (chargeback/refund) oleh pembeli.</p>
      </div>
    </div>
  );
}

// ---------------- 10. KOMPONEN DATA USERS FILTER PANEL (STAFF) ----------------
function DataUsersFilterPanel({ usersList, getRoleBadge }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredUsers = usersList.filter(u => {
    const matchSearch = u.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || u.no_hp?.includes(searchTerm) || u.no_ktp?.includes(searchTerm) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "ALL" ? true : (u.role || "user") === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-3">
      <div>
        <p className="text-lg font-bold text-stone-900">Index & Data Member ({filteredUsers.length})</p>
        <p className="text-xs text-stone-500">Pencarian berdasarkan KTP, Nama, Email, atau No WA.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-3 text-stone-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari KTP, Nama, Email, No WA..."
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

      <div className="space-y-2">
        {filteredUsers.map(u => (
          <div key={u.id} className="p-3.5 rounded-xl bg-white border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{u.nama}</span>
                {getRoleBadge(u.role || "user")}
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                KTP: {u.no_ktp || "-"} | WA: {u.no_hp} | Email: {u.email || "-"}
              </p>
              <p className="text-xs text-stone-500 font-mono">
                Domisili: {u.kota || "-"}, {u.provinsi || "-"} | Telegram: @{u.telegram || "-"}
              </p>
              <p className="text-xs text-emerald-700 font-bold font-mono mt-0.5">Saldo: {rupiah(u.saldo)}</p>
            </div>

            <div className="flex items-center gap-2 mt-2 md:mt-0">
              {u.telegram && (
                <a
                  href={`https://t.me/${u.telegram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Send size={12} /> Telegram
                </a>
              )}
              <a
                href={`https://wa.me/${u.no_hp?.replace(/^0/, '62')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Phone size={12} /> WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- 11. SMART AUTH: LOGIN, REGISTRASI LENGKAP & FORGOT PASSWORD OTP ----------------
function AuthView({ onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [noKtp, setNoKtp] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  
  // Data Form Registrasi
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [alamatKota, setAlamatKota] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [telegram, setTelegram] = useState("");
  const [namaBank, setNamaBank] = useState("");
  const [noRekening, setNoRekening] = useState("");

  // State Lupa Password OTP
  const [inputOtp, setInputOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [targetUser, setTargetUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userDataFound, setUserDataFound] = useState(null);

  // Cek Nomor KTP & WA
  const handleCekKtpDanWA = async () => {
    const cleanKtp = noKtp.trim();
    const cleanWa = noHp.trim();

    if (!cleanKtp || cleanKtp.length < 16) {
      return setErrorMsg("Masukkan nomor KTP yang valid!");
    }
    if (!cleanWa || cleanWa.length < 9) {
      return setErrorMsg("Masukkan nomor WhatsApp yang valid!");
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const qKtp = query(collection(db, "users"), where("no_ktp", "==", cleanKtp));
      const snapKtp = await getDocs(qKtp);

      if (!snapKtp.empty) {
        const docUser = snapKtp.docs[0];
        setUserDataFound({ id: docUser.id, ...docUser.data() });
        setStep(2);
      } else {
        const qWa = query(collection(db, "users"), where("no_hp", "==", cleanWa));
        const snapWa = await getDocs(qWa);

        if (!snapWa.empty) {
          const docUser = snapWa.docs[0];
          setUserDataFound({ id: docUser.id, ...docUser.data() });
          setStep(2);
        } else {
          setStep(3);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi database bermasalah: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = () => {
    if (!password) return setErrorMsg("Masukkan password Anda.");
    
    if (userDataFound.password === password) {
      onLoginSuccess(userDataFound);
    } else {
      setErrorMsg("Password salah! Silakan periksa kembali atau gunakan link Lupa Password.");
    }
  };

  const handleRegisterSubmit = async () => {
    if (!nama || !email || !alamatKota || !provinsi || !telegram || !namaBank || !noRekening || !password) {
      return setErrorMsg("Mohon lengkapi seluruh data pendaftaran termasuk email!");
    }
    if (password.length < 6) {
      return setErrorMsg("Password minimal 6 karakter!");
    }

    setLoading(true);
    setErrorMsg("");

    const newUser = {
      no_ktp: noKtp.trim(),
      no_hp: noHp.trim(),
      email: email.trim().toLowerCase(),
      nama: nama.trim(),
      kota: alamatKota.trim(),
      provinsi: provinsi.trim(),
      telegram: telegram.trim().replace(/^@/, ""),
      nama_bank: namaBank.trim(),
      no_rekening: noRekening.trim(),
      password: password,
      role: "user",
      saldo: 0,
      created_at: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "users"), newUser);
      alert("✅ Pendaftaran berhasil! Selamat datang di Mitra Berkah.");
      onLoginSuccess({ id: docRef.id, ...newUser });
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal menyimpan data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!email) return setErrorMsg("Ketikkan alamat email akun Anda!");
    setLoading(true);
    setErrorMsg("");

    try {
      const q = query(collection(db, "users"), where("email", "==", email.trim().toLowerCase()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setLoading(false);
        return setErrorMsg("Email tersebut tidak terdaftar di sistem.");
      }

      const docU = snap.docs[0];
      const uData = { id: docU.id, ...docU.data() };
      setTargetUser(uData);

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);

      await addDoc(collection(db, "password_resets"), {
        user_id: uData.id,
        email: uData.email,
        nama: uData.nama,
        otp: otpCode,
        status: "PENDING",
        created_at: new Date().toISOString()
      });

      alert(`✅ Kode OTP Permintaan Reset: ${otpCode}\n\nPermintaan telah diteruskan ke Email & CS Admin.`);
      setStep(5);
    } catch (err) {
      setErrorMsg("Gagal meminta OTP: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (!inputOtp || !passwordBaru) return setErrorMsg("Lengkapi Kode OTP dan Password Baru!");
    if (inputOtp.trim() !== generatedOtp.trim()) return setErrorMsg("Kode OTP salah atau tidak sesuai!");
    if (passwordBaru.length < 6) return setErrorMsg("Password baru minimal 6 karakter!");

    setLoading(true);
    setErrorMsg("");

    try {
      await updateDoc(doc(db, "users", targetUser.id), { password: passwordBaru });
      alert("🎉 Kata sandi Anda berhasil diperbarui! Silakan masuk kembali.");
      setStep(1);
      setPassword("");
      setPasswordBaru("");
      setInputOtp("");
    } catch (err) {
      setErrorMsg("Gagal memperbarui password: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FA] font-sans">
      <div className="w-full max-w-sm p-6 bg-white rounded-3xl border border-stone-200 shadow-md">
        
        <div className="text-center mb-5">
          <div className="w-10 h-10 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Mitra Berkah Affiliate</h2>
          <p className="text-xs text-stone-500">Platform Gotong Royong Komisi & Bimbingan</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
            <AlertCircle size={14} className="shrink-0" /> 
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: PERIKSA NO KTP & WHATSAPP */}
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700">Nomor KTP</label>
              <input
                type="text"
                value={noKtp}
                onChange={e => setNoKtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Masukkan nomor KTP"
                className="w-full mt-1 p-2.5 text-xs font-mono border border-stone-200 rounded-xl outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Nomor WhatsApp</label>
              <input
                type="tel"
                value={noHp}
                onChange={e => setNoHp(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl outline-none focus:border-blue-900"
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] text-stone-400">*Deteksi otomatis KTP / WA.</span>
              <button onClick={() => { setStep(4); setErrorMsg(""); }} className="text-blue-900 font-bold hover:underline">
                Lupa Password?
              </button>
            </div>

            <button
              onClick={handleCekKtpDanWA}
              disabled={loading}
              className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? "Memeriksa Akun..." : "Lanjutkan"} <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* STEP 2: AKUN DITEMUKAN -> LOGIN PASSWORD */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs text-blue-900 font-bold">Akun Terdaftar Ditemukan!</p>
              <p className="text-xs text-stone-700 mt-0.5">Nama: <strong>{userDataFound?.nama}</strong></p>
              <p className="text-[11px] text-stone-500 font-mono">Role: {userDataFound?.role?.toUpperCase()}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Masukkan Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl outline-none"
              />
            </div>

            <div className="text-right">
              <button onClick={() => { setEmail(userDataFound?.email || ""); setStep(4); setErrorMsg(""); }} className="text-xs text-blue-900 font-bold hover:underline">
                Lupa Password Akun Ini?
              </button>
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
              ← Kembali
            </button>
          </div>
        )}

        {/* STEP 3: AKUN BARU -> FORMULIR PENDAFTARAN LENGKAP */}
        {step === 3 && (
          <div className="space-y-2.5 max-h-[72vh] overflow-y-auto pr-1">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-900 font-bold">Pendaftaran Akun Baru</p>
              <p className="text-[11px] text-stone-600">Lengkapi identitas untuk penerimaan komisi & bimbingan.</p>
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
              <label className="text-[11px] font-bold text-stone-700">Alamat Email Aktif</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700">Kota / Kab</label>
                <input
                  value={alamatKota}
                  onChange={e => setAlamatKota(e.target.value)}
                  placeholder="Bandung"
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700">Provinsi</label>
                <input
                  value={provinsi}
                  onChange={e => setProvinsi(e.target.value)}
                  placeholder="Jawa Barat"
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Username Telegram (Pusat Bimbingan)</label>
              <input
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
                placeholder="username_tele (tanpa @)"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700">Ketik Nama Bank / E-Wallet</label>
                <input
                  value={namaBank}
                  onChange={e => setNamaBank(e.target.value)}
                  placeholder="BCA / BRI / DANA / OVO"
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700">Nomor Rekening</label>
                <input
                  value={noRekening}
                  onChange={e => setNoRekening(e.target.value)}
                  placeholder="1234567890"
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Buat Password Akun</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl outline-none"
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

        {/* STEP 4: PERMINTAAN KODE OTP LUPA PASSWORD */}
        {step === 4 && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-900 font-bold flex items-center gap-1"><KeyRound size={14} /> Reset Sandi Akun</p>
              <p className="text-[11px] text-stone-600 mt-1">Masukkan alamat email Anda untuk menerima permintaan verifikasi OTP reset sandi.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Alamat Email Terdaftar</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl outline-none focus:border-blue-900"
              />
            </div>

            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {loading ? "Mengirim OTP..." : "Kirim Permintaan OTP"} <Mail size={14} />
            </button>

            <div className="p-2.5 bg-stone-50 border rounded-xl text-center">
              <p className="text-[11px] text-stone-500">Butuh bantuan manual dari Staff?</p>
              <a
                href={`https://wa.me/628111111111?text=Halo%20Admin%20/%20CS,%20saya%20minta%20bantuan%20reset%20password%20akun%20email:%20${email}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 mt-1"
              >
                <Phone size={12} /> Hubungi CS / Admin di WhatsApp
              </a>
            </div>

            <button
              onClick={() => { setStep(1); setErrorMsg(""); }}
              className="w-full py-1 text-xs text-stone-500 font-semibold hover:underline"
            >
              ← Kembali ke Menu Masuk
            </button>
          </div>
        )}

        {/* STEP 5: KONFIRMASI KODE OTP & BUAT PASSWORD BARU */}
        {step === 5 && (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs text-emerald-900 font-bold">Verifikasi OTP & Sandi Baru</p>
              <p className="text-[11px] text-stone-600 mt-0.5">Masukkan kode 6 digit OTP yang telah dibuat serta tentukan kata sandi baru.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Kode OTP (6 Digit)</label>
              <input
                type="text"
                maxLength={6}
                value={inputOtp}
                onChange={e => setInputOtp(e.target.value)}
                placeholder="123456"
                className="w-full mt-1 p-2.5 text-xs font-mono text-center tracking-widest border border-stone-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Password Baru</label>
              <input
                type="password"
                value={passwordBaru}
                onChange={e => setPasswordBaru(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl outline-none"
              />
            </div>

            <button
              onClick={handleConfirmResetPassword}
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {loading ? "Memproses..." : "Konfirmasi & Simpan Sandi Baru"}
            </button>

            <button
              onClick={() => { setStep(4); setErrorMsg(""); }}
              className="w-full py-1 text-xs text-stone-500 font-semibold hover:underline"
            >
              ← Kirim Ulang OTP
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ---------------- 12. CRUD PRODUK ADMIN ----------------
function KelolaProdukAdmin({ products, setProducts }) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("fisik");
  const [komisi, setKomisi] = useState(10);
  const [potensi, setPotensi] = useState("");
  const [harga, setHarga] = useState("");
  const [link, setLink] = useState("");

  const handleAdd = async () => {
    if (!nama || !potensi) return alert("Lengkapi data produk");
    const item = {
      nama_produk: nama,
      kategori,
      komisi_persen: Number(komisi),
      potensi_komisi: Number(potensi),
      harga: Number(harga) || 100000,
      link_affiliate: link || "https://shopee.co.id"
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
        <input value={link} onChange={e => setLink(e.target.value)} placeholder="Link Affiliate / Toko" className="w-full p-2 text-xs border rounded-xl" />
        <button onClick={handleAdd} className="w-full py-2 bg-blue-900 text-white rounded-xl text-xs font-bold">Simpan Produk</button>
      </div>
    </div>
  );
}

      alert("✅ Pendaftaran berhasil! Selamat datang di Mitra Berkah.");
      onLoginSuccess({ id: docRef.id, ...newUser });
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal menyimpan data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!email) return setErrorMsg("Ketikkan alamat email akun Anda!");
    setLoading(true);
    setErrorMsg("");

    try {
      const q = query(collection(db, "users"), where("email", "==", email.trim().toLowerCase()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setLoading(false);
        return setErrorMsg("Email tersebut tidak terdaftar di sistem.");
      }

      const docU = snap.docs[0];
      const uData = { id: docU.id, ...docU.data() };
      setTargetUser(uData);

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);

      await addDoc(collection(db, "password_resets"), {
        user_id: uData.id,
        email: uData.email,
        nama: uData.nama,
        otp: otpCode,
        status: "PENDING",
        created_at: new Date().toISOString()
      });

      alert(`✅ Kode OTP Permintaan Reset: ${otpCode}\n\nPermintaan telah diteruskan ke Email & CS Admin.`);
      setStep(5);
    } catch (err) {
      setErrorMsg("Gagal meminta OTP: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (!inputOtp || !passwordBaru) return setErrorMsg("Lengkapi Kode OTP dan Password Baru!");
    if (inputOtp.trim() !== generatedOtp.trim()) return setErrorMsg("Kode OTP salah atau tidak sesuai!");
    if (passwordBaru.length < 6) return setErrorMsg("Password baru minimal 6 karakter!");

    setLoading(true);
    setErrorMsg("");

    try {
      await updateDoc(doc(db, "users", targetUser.id), { password: passwordBaru });
      alert("🎉 Kata sandi Anda berhasil diperbarui! Silakan masuk kembali.");
      setStep(1);
      setPassword("");
      setPasswordBaru("");
      setInputOtp("");
    } catch (err) {
      setErrorMsg("Gagal memperbarui password: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FA] font-sans">
      <div className="w-full max-w-sm p-6 bg-white rounded-3xl border border-stone-200 shadow-md">
        
        <div className="text-center mb-5">
          <div className="w-10 h-10 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Mitra Berkah Affiliate</h2>
          <p className="text-xs text-stone-500">Platform Gotong Royong Komisi & Bimbingan</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
            <AlertCircle size={14} className="shrink-0" /> 
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: PERIKSA NO KTP & WHATSAPP */}
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700">Nomor KTP</label>
              <input
                type="text"
                value={noKtp}
                onChange={e => setNoKtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Masukkan nomor KTP"
                className="w-full mt-1 p-2.5 text-xs font-mono border border-stone-200 rounded-xl outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Nomor WhatsApp</label>
              <input
                type="tel"
                value={noHp}
                onChange={e => setNoHp(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl outline-none focus:border-blue-900"
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] text-stone-400">*Deteksi otomatis KTP / WA.</span>
              <button onClick={() => { setStep(4); setErrorMsg(""); }} className="text-blue-900 font-bold hover:underline">
                Lupa Password?
              </button>
            </div>

            <button
              onClick={handleCekKtpDanWA}
              disabled={loading}
              className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? "Memeriksa Akun..." : "Lanjutkan"} <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* STEP 2: AKUN DITEMUKAN -> LOGIN PASSWORD */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs text-blue-900 font-bold">Akun Terdaftar Ditemukan!</p>
              <p className="text-xs text-stone-700 mt-0.5">Nama: <strong>{userDataFound?.nama}</strong></p>
              <p className="text-[11px] text-stone-500 font-mono">Role: {userDataFound?.role?.toUpperCase()}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Masukkan Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl outline-none"
              />
            </div>

            <div className="text-right">
              <button onClick={() => { setEmail(userDataFound?.email || ""); setStep(4); setErrorMsg(""); }} className="text-xs text-blue-900 font-bold hover:underline">
                Lupa Password Akun Ini?
              </button>
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
              ← Kembali
            </button>
          </div>
        )}

        {/* STEP 3: AKUN BARU -> FORMULIR PENDAFTARAN LENGKAP */}
        {step === 3 && (
          <div className="space-y-2.5 max-h-[72vh] overflow-y-auto pr-1">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-900 font-bold">Pendaftaran Akun Baru</p>
              <p className="text-[11px] text-stone-600">Lengkapi identitas untuk penerimaan komisi & bimbingan.</p>
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
              <label className="text-[11px] font-bold text-stone-700">Alamat Email Aktif</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700">Kota / Kab</label>
                <input
                  value={alamatKota}
                  onChange={e => setAlamatKota(e.target.value)}
                  placeholder="Bandung"
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700">Provinsi</label>
                <input
                  value={provinsi}
                  onChange={e => setProvinsi(e.target.value)}
                  placeholder="Jawa Barat"
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Username Telegram (Pusat Bimbingan)</label>
              <input
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
                placeholder="username_tele (tanpa @)"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700">Ketik Nama Bank / E-Wallet</label>
                <input
                  value={namaBank}
                  onChange={e => setNamaBank(e.target.value)}
                  placeholder="BCA / BRI / DANA / OVO"
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700">Nomor Rekening</label>
                <input
                  value={noRekening}
                  onChange={e => setNoRekening(e.target.value)}
                  placeholder="1234567890"
                  className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700">Buat Password Akun</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full mt-0.5 p-2 text-xs border border-stone-200 rounded-xl outline-none"
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

        {/* STEP 4: PERMINTAAN KODE OTP LUPA PASSWORD */}
        {step === 4 && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-900 font-bold flex items-center gap-1"><KeyRound size={14} /> Reset Sandi Akun</p>
              <p className="text-[11px] text-stone-600 mt-1">Masukkan alamat email Anda untuk menerima permintaan verifikasi OTP reset sandi.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Alamat Email Terdaftar</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl outline-none focus:border-blue-900"
              />
            </div>

            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {loading ? "Mengirim OTP..." : "Kirim Permintaan OTP"} <Mail size={14} />
            </button>

            <div className="p-2.5 bg-stone-50 border rounded-xl text-center">
              <p className="text-[11px] text-stone-500">Butuh bantuan manual dari Staff?</p>
              <a
                href={`https://wa.me/628111111111?text=Halo%20Admin%20/%20CS,%20saya%20minta%20bantuan%20reset%20password%20akun%20email:%20${email}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 mt-1"
              >
                <Phone size={12} /> Hubungi CS / Admin di WhatsApp
              </a>
            </div>

            <button
              onClick={() => { setStep(1); setErrorMsg(""); }}
              className="w-full py-1 text-xs text-stone-500 font-semibold hover:underline"
            >
              ← Kembali ke Menu Masuk
            </button>
          </div>
        )}

        {/* STEP 5: KONFIRMASI KODE OTP & BUAT PASSWORD BARU */}
        {step === 5 && (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs text-emerald-900 font-bold">Verifikasi OTP & Sandi Baru</p>
              <p className="text-[11px] text-stone-600 mt-0.5">Masukkan kode 6 digit OTP yang telah dibuat serta tentukan kata sandi baru.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Kode OTP (6 Digit)</label>
              <input
                type="text"
                maxLength={6}
                value={inputOtp}
                onChange={e => setInputOtp(e.target.value)}
                placeholder="123456"
                className="w-full mt-1 p-2.5 text-xs font-mono text-center tracking-widest border border-stone-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700">Password Baru</label>
              <input
                type="password"
                value={passwordBaru}
                onChange={e => setPasswordBaru(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full mt-1 p-2.5 text-xs border border-stone-200 rounded-xl outline-none"
              />
            </div>

            <button
              onClick={handleConfirmResetPassword}
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {loading ? "Memproses..." : "Konfirmasi & Simpan Sandi Baru"}
            </button>

            <button
              onClick={() => { setStep(4); setErrorMsg(""); }}
              className="w-full py-1 text-xs text-stone-500 font-semibold hover:underline"
            >
              ← Kirim Ulang OTP
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ---------------- 12. CRUD PRODUK ADMIN ----------------
function KelolaProdukAdmin({ products, setProducts }) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("fisik");
  const [komisi, setKomisi] = useState(10);
  const [potensi, setPotensi] = useState("");
  const [harga, setHarga] = useState("");
  const [link, setLink] = useState("");

  const handleAdd = async () => {
    if (!nama || !potensi) return alert("Lengkapi data produk");
    const item = {
      nama_produk: nama,
      kategori,
      komisi_persen: Number(komisi),
      potensi_komisi: Number(potensi),
      harga: Number(harga) || 100000,
      link_affiliate: link || "https://shopee.co.id"
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
        <input value={link} onChange={e => setLink(e.target.value)} placeholder="Link Affiliate / Toko" className="w-full p-2 text-xs border rounded-xl" />
        <button onClick={handleAdd} className="w-full py-2 bg-blue-900 text-white rounded-xl text-xs font-bold">Simpan Produk</button>
      </div>
    </div>
  );
}

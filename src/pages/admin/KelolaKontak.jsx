import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
// ── FIX LOGO: Import resmi foto logo perusahaan
import logoPerusahaan from '../../assets/download.jpg';

const defaultContact = {
  waNumber: "6281234567890",
  contactDesc: "Ada pertanyaan? Ingin memesan? Tim Sinergy siap membantu Anda. Cara termudah adalah langsung via WhatsApp.",
  faqs: [
    {
      q: 'Apakah bisa pembelian dalam jumlah besar / grosir?',
      a: 'Ya! Kami melayani pembelian eceran maupun grosir. Hubungi admin kami via WhatsApp untuk mendapatkan harga khusus dan syarat pembelian grosir.',
    },
    {
      q: 'Apakah tersedia layanan pengiriman?',
      a: 'Kami menyediakan layanan pengiriman ke area tertentu. Konfirmasi ketersediaan area pengiriman Anda langsung kepada admin via WhatsApp.',
    },
    {
      q: 'Bagaimana cara memastikan kesegaran telur?',
      a: 'Seluruh telur kami dikemas dan dikirim maksimal H+2 dari tanggal produksi. Kami menjamin kesegaran dengan sistem rotasi stok yang ketat.',
    },
  ],
  operationalHours: [
    { day: 'Senin – Jumat', hours: '08.00 – 17.00 WIB' },
    { day: 'Sabtu', hours: '08.00 – 14.00 WIB' },
    { day: 'Minggu & Hari Libur', hours: 'Tutup' },
  ]
};

export default function KelolaKontak() {
  const [contactData, setContactData] = useState(defaultContact);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const docRef = doc(db, "settings", "website-data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContactData({
            waNumber: data.waNumber || defaultContact.waNumber,
            contactDesc: data.contactDesc || defaultContact.contactDesc,
            faqs: data.faqs || defaultContact.faqs,
            operationalHours: data.operationalHours || defaultContact.operationalHours,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data kontak dari Cloud:", error);
      }
    };
    fetchContact();
  }, []);

  const handleChange = (key, value) => {
    setContactData(prev => ({ ...prev, [key]: value }));
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = contactData.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq);
    handleChange('faqs', updatedFaqs);
  };

  const addFaqItem = () => {
    handleChange('faqs', [...contactData.faqs, { q: '', a: '' }]);
  };

  const removeFaqItem = (index) => {
    const updatedFaqs = contactData.faqs.filter((_, i) => i !== index);
    handleChange('faqs', updatedFaqs);
  };

  const handleHoursChange = (index, field, value) => {
    const updatedHours = contactData.operationalHours.map((item, i) => i === index ? { ...item, [field]: value } : item);
    handleChange('operationalHours', updatedHours);
  };

  const addHoursItem = () => {
    handleChange('operationalHours', [...contactData.operationalHours, { day: '', hours: '' }]);
  };

  const removeHoursItem = (index) => {
    const updatedHours = contactData.operationalHours.filter((_, i) => i !== index);
    handleChange('operationalHours', updatedHours);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "settings", "website-data"), contactData, { merge: true });
      alert('Data Kontak, FAQ, dan Jam Operasional berhasil diperbarui di Cloud!');
    } catch (error) {
      alert('Gagal menyimpan ke Cloud: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      {/* ── SIDEBAR MENU UTUH YANG SUDAH SINKRON ── */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col shrink-0 shadow-xl">
        <div className="p-5 border-b border-stone-800 flex items-center gap-2">
          {/* ── FIX LOGO: Mengganti teks SAS menjadi Foto Bulat Sempurna ── */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white shrink-0 shadow-sm border border-stone-700">
            <img src={logoPerusahaan} alt="Logo CV Semesta" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm leading-tight">CV Semesta</h1>
            <p className="text-amber-500 text-[10px] font-semibold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖥️ Beranda Dashboard</Link>
          <Link to="/admin/produk" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🥚 Kelola Grade Produk</Link>
          <Link to="/admin/edukasi" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">📚 Kelola Artikel Edukasi</Link>
          <Link to="/admin/galeri" className="block px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-sm font-semibold">🖼️ Kelola Galeri Link</Link>
          <Link to="/admin/website" className="block px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm shadow-md">✍️ Kelola Kata Website</Link>
          <div className="pt-10 border-t border-stone-800 mt-6">
            <Link to="/" className="block px-4 py-2.5 rounded-xl text-stone-400 hover:text-red-400 text-sm font-semibold">⬅️ Keluar</Link>
          </div>
        </nav>
      </aside>

      {/* Area Utama Konten Form */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <header className="mb-6 border-b border-stone-200 pb-4">
          <h2 className="text-2xl font-extrabold text-stone-800 tracking-tight">Manajemen Kontak & FAQ Website</h2>
          <p className="text-stone-500 text-sm mt-1">Ubah nomor WhatsApp, teks pengantar, FAQ, dan jam operasional secara dinamis.</p>
        </header>

        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6 max-w-3xl mb-12">
          {/* Bagian 1: Kontak Utama */}
          <div className="space-y-4">
            <h3 className="text-stone-800 font-extrabold text-base border-b pb-1 text-amber-600">📞 Integrasi WhatsApp & Teks Kontak</h3>
            
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Nomor WhatsApp Admin</label>
              <input type="text" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5 text-stone-800 focus:outline-amber-500 font-mono font-bold" value={contactData.waNumber} onChange={(e) => handleChange('waNumber', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Teks Pengantar Halaman Kontak</label>
              <textarea rows="3" className="w-full text-sm bg-stone-50 border rounded-lg p-2.5 text-stone-600 leading-relaxed focus:outline-amber-500" value={contactData.contactDesc} onChange={(e) => handleChange('contactDesc', e.target.value)} />
            </div>
          </div>

          {/* Bagian 2: Jam Operasional */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center border-b pb-1">
              <h3 className="text-stone-800 font-extrabold text-base text-amber-600">⏰ Pengaturan Jam Operasional</h3>
              <button type="button" onClick={addHoursItem} className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">➕ Tambah Hari Kerja</button>
            </div>

            <div className="space-y-3">
              {contactData.operationalHours.map((item, index) => (
                <div key={index} className="flex gap-4 items-center bg-stone-50 p-3 border border-stone-200 rounded-xl">
                  <div className="w-1/3">
                    <input type="text" className="w-full text-xs bg-white border rounded-lg p-2 font-bold text-stone-800 focus:outline-amber-500" placeholder="Hari" value={item.day} onChange={(e) => handleHoursChange(index, 'day', e.target.value)} />
                  </div>
                  <div className="w-2/3 flex gap-3 items-center">
                    <input type="text" className="w-full text-xs bg-white border rounded-lg p-2 text-stone-600 focus:outline-amber-500" placeholder="Jam Kerja" value={item.hours} onChange={(e) => handleHoursChange(index, 'hours', e.target.value)} />
                    <button type="button" onClick={() => removeHoursItem(index)} className="text-xs text-red-500 hover:text-red-700 font-bold px-2">❌</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian 3: FAQ */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center border-b pb-1">
              <h3 className="text-stone-800 font-extrabold text-base text-amber-600">❓ Daftar Pertanyaan FAQ</h3>
              <button type="button" onClick={addFaqItem} className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">➕ Tambah FAQ Baru</button>
            </div>

            <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2">
              {contactData.faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-400 uppercase">Pertanyaan #{index + 1}</span>
                    <button type="button" onClick={() => removeFaqItem(index)} className="text-xs text-red-500 hover:text-red-700 font-bold">❌ Hapus</button>
                  </div>
                  <input type="text" className="w-full text-xs bg-white border rounded-lg p-2 font-bold text-stone-800 focus:outline-amber-500" placeholder="Masukkan pertanyaan..." value={faq.q} onChange={(e) => handleFaqChange(index, 'q', e.target.value)} />
                  <textarea rows="2" className="w-full text-xs bg-white border rounded-lg p-2 text-stone-600 focus:outline-amber-500" placeholder="Masukkan jawaban..." value={faq.a} onChange={(e) => handleFaqChange(index, 'a', e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-stone-900 text-sm font-extrabold px-8 py-3 rounded-xl transition-all duration-200 shadow-sm">
              💾 Simpan Perubahan Kontak & FAQ
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
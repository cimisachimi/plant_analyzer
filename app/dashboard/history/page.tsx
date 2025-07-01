'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type HistoryItem = {
  id: number;
  created_at: string;
  image_url: string;
  disease_name: string;
  score: number;
  care_instructions: string;
};

export default function HistoryPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin');
    },
  });

  const [originalHistory, setOriginalHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('created_at_desc');
  const [filterByDisease, setFilterByDisease] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // State baru untuk modal konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (status === 'authenticated') {
        setIsLoading(true);
        try {
          const response = await fetch('/api/history');
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal memuat riwayat.');
          }
          const data = await response.json();
          setOriginalHistory(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Terjadi Kesalahan yang Tak Terduga');
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchHistory();
  }, [status]);

  const displayHistory = useMemo(() => {
    let processedHistory = [...originalHistory];
    if (filterByDisease !== 'all') {
      processedHistory = processedHistory.filter(
        (item) => item.disease_name === filterByDisease
      );
    }
    processedHistory.sort((a, b) => {
      switch (sortBy) {
        case 'created_at_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'score_desc':
          return b.score - a.score;
        case 'score_asc':
          return a.score - b.score;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return processedHistory;
  }, [originalHistory, sortBy, filterByDisease]);

  const uniqueDiseases = useMemo(
    () => Array.from(new Set(originalHistory.map((item) => item.disease_name))),
    [originalHistory]
  );
    
  // Fungsi untuk membuka modal dan menyimpan ID item
  const handleOpenDeleteModal = (id: number) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  // Fungsi untuk mengkonfirmasi dan menjalankan penghapusan
  const handleConfirmDelete = async () => {
    if (itemToDelete === null) return;

    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemToDelete }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menghapus.');
      }
      setOriginalHistory((prev) =>
        prev.filter((h) => h.id !== itemToDelete)
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menghapus.'
      );
    } finally {
      // Tutup modal setelah selesai
      handleCloseModal();
    }
  };


  if (status === 'loading' || isLoading) return <div className="text-center p-8 text-gray-700">Memuat...</div>;
  if (error) return <div className="container mx-auto p-8 text-center text-red-600">{error}</div>;

  return (
    <>
      <div className="bg-w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-green-900">Riwayat Analisis</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              aria-label="Filter berdasarkan penyakit"
              value={filterByDisease}
              onChange={(e) => setFilterByDisease(e.target.value)}
              className="w-full flex-1 sm:w-auto text-sm border border-gray-300 rounded-lg p-2 bg-white text-black focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Semua Penyakit</option>
              {uniqueDiseases.map((disease) => (
                <option key={disease} value={disease}>
                  {disease}
                </option>
              ))}
            </select>
            <select
              aria-label="Urutkan berdasarkan"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full flex-1 sm:w-auto text-sm border border-gray-300 rounded-lg p-2 bg-white text-black focus:ring-2 focus:ring-green-500"
            >
              <option value="created_at_desc">Terbaru</option>
              <option value="created_at_asc">Terlama</option>
              <option value="score_desc">Keyakinan Tertinggi</option>
              <option value="score_asc">Keyakinan Terendah</option>
            </select>
          </div>
        </div>

        {displayHistory.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <h3 className="text-lg font-semibold text-black">Riwayat Kosong</h3>
            <p className="text-gray-600 mt-2 text-sm">
              {filterByDisease === 'all'
                ? 'Anda belum memiliki riwayat analisis.'
                : 'Tidak ada riwayat yang cocok dengan filter ini.'}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center justify-center rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 px-4 py-2 transition"
            >
              + Lakukan Analisis Baru
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {displayHistory.map((item) => (
              <div
                key={item.id}
                className="border border-gray-300 rounded-lg bg-white shadow-sm transition-all overflow-hidden"
              >
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-green-50"
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                >
                  <Image
                    src={item.image_url}
                    alt={item.disease_name}
                    width={56}
                    height={56}
                    className="rounded-md object-cover bg-gray-200 flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <h2 className="font-semibold text-black">{item.disease_name}</h2>
                    <p className="text-sm text-gray-600">
                      Keyakinan:{' '}
                      <span className="font-bold text-green-700">
                        {(item.score * 100).toFixed(1)}%
                      </span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:flex flex-col items-end gap-2">
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {/* Tombol Hapus yang Diperbarui */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Mencegah expand/collapse
                            handleOpenDeleteModal(item.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold hover:bg-red-200 transition-colors"
                        aria-label={`Hapus riwayat ${item.disease_name}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        Hapus
                    </button>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                      expandedId === item.id ? 'rotate-180' : ''
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {expandedId === item.id && (
                  <div className="px-4 pb-4">
                    <div className="p-4 border-t border-gray-200 bg-gray-100 rounded-md">
                      <h4 className="font-semibold text-green-800 mb-2">Rekomendasi Perawatan</h4>
                      <p className="text-sm text-gray-700">{item.care_instructions}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Penghapusan */}
      {isModalOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-sm w-full">
            <h3 id="modal-title" className="text-lg font-bold text-gray-900">
                Konfirmasi Penghapusan
            </h3>
            <p className="mt-2 text-sm text-gray-600">
                Apakah Anda yakin ingin menghapus riwayat ini secara permanen? Tindakan ini tidak dapat diurungkan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
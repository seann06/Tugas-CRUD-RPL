import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Edit, Trash2, Plus, X } from 'lucide-react' // Menggunakan lucide-react untuk ikon

// Konstanta
const API_URL = 'http://localhost:3333/coordinate'
const FAKE_API_KEY = '' // Placeholder for potential future API key

// Komponen Modal
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// Komponen Utama Aplikasi
export default function App() {
  const [coordinates, setCoordinates] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    idKoordinat: null,
    nama: '',
    latitude: '',
    longitude: '',
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- API Calls ---

  // Fetch all coordinates
  const fetchCoordinates = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(API_URL)
      setCoordinates(res.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching coordinates:', err)
      setError('Gagal mengambil data koordinat dari server.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCoordinates()
  }, [])

  // Handler untuk Tambah/Update data
  const handleSubmit = async () => {
    if (!formData.nama || !formData.latitude || !formData.longitude) {
      setError('Harap isi semua kolom wajib.')
      return
    }

    setIsLoading(true)
    setError(null)

    const dataToSend = {
      nama: formData.nama,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    }

    try {
      let res
      if (isEditMode) {
        // Update
        res = await axios.put(`${API_URL}/${formData.idKoordinat}`, dataToSend)
        setCoordinates(
          coordinates.map((c) => (c.idKoordinat === formData.idKoordinat ? res.data : c))
        )
      } else {
        // Add
        res = await axios.post(API_URL, dataToSend)
        setCoordinates([...coordinates, res.data])
      }
      handleCloseModal()
      fetchCoordinates() // Refresh data untuk memastikan konsistensi
    } catch (err) {
      console.error('Error submitting data:', err)
      setError(`Gagal ${isEditMode ? 'mengubah' : 'menambah'} data. Periksa koneksi server.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Delete coordinate
  const deleteCoordinate = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return
    setIsLoading(true)
    setError(null)
    try {
      await axios.delete(`${API_URL}/${id}`)
      setCoordinates(coordinates.filter((c) => c.idKoordinat !== id))
      setError('Data berhasil dihapus!')
    } catch (err) {
      console.error('Error deleting coordinate:', err)
      setError('Gagal menghapus data. Periksa koneksi server.')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Modal Handlers ---

  const handleOpenModal = (coordinate = null) => {
    if (coordinate) {
      // Mode Edit
      setIsEditMode(true)
      setFormData({
        idKoordinat: coordinate.idKoordinat,
        nama: coordinate.nama,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      })
    } else {
      // Mode Add
      setIsEditMode(false)
      setFormData({ idKoordinat: null, nama: '', latitude: '', longitude: '' })
    }
    setError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({ idKoordinat: null, nama: '', latitude: '', longitude: '' })
    setError(null)
  }

  // --- Render UI ---

  const title = isEditMode ? 'Ubah Koordinat' : 'Tambah Koordinat Baru'

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans p-4 sm:p-8">
      {/* Container Utama - Meniru Layout Gambar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-7xl mx-auto">
        {/* Header dan Tombol Tambah */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Daftar Koordinat Lokasi Jasa Servis Elektronik
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            <Plus size={20} />
            <span>Tambah Item</span>
          </button>
        </div>

        {/* Loading / Error State */}
        {isLoading && <div className="text-center text-indigo-500 py-4">Memuat data...</div>}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 dark:bg-red-900 dark:text-red-300"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nama Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Latitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Longitude
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {coordinates.length === 0 && !isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Belum ada data koordinat.
                  </td>
                </tr>
              ) : (
                coordinates.map((c) => (
                  <tr
                    key={c.idKoordinat}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {c.idKoordinat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {c.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {c.latitude}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {c.longitude}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenModal(c)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                          title="Ubah Data"
                        >
                          <Edit size={18} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => deleteCoordinate(c.idKoordinat)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                          title="Hapus Data"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Ubah Data */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={title}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Lokasi
            </label>
            <input
              type="text"
              id="nama"
              placeholder="Masukkan Nama Lokasi"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              placeholder="Contoh: -6.2000"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              placeholder="Contoh: 106.8167"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleCloseModal}
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`py-2 px-4 rounded-lg text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Memproses...' : isEditMode ? 'Simpan Perubahan' : 'Tambah Data'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

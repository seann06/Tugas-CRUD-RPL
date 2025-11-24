document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form')
  const tableBody = document.getElementById('table-body')
  const baseURL = 'localhost:3333/coordinate'

  // Inisialisasi peta Leaflet
  const map = L.map('map').setView([0, 0], 2)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  let markers = []

  // Fungsi load semua koordinat
  async function fetchKoordinats() {
    try {
      const res = await fetch(baseURL)
      const data = await res.json()
      tableBody.innerHTML = ''

      // Hapus marker lama
      markers.forEach((m) => map.removeLayer(m))
      markers = []

      data.forEach((k) => {
        // Tambah ke tabel
        const tr = document.createElement('tr')
        tr.innerHTML = `
          <td>${k.id_koordinat}</td>
          <td>${k.nama}</td>
          <td>${k.latitude}</td>
          <td>${k.longitude}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editKoordinat(${k.id_koordinat})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteKoordinat(${k.id_koordinat})">Hapus</button>
          </td>
        `
        tableBody.appendChild(tr)

        // Tambah marker ke peta
        const marker = L.marker([k.latitude, k.longitude]).addTo(map)
        marker.bindPopup(`<b>${k.nama}</b><br>${k.latitude}, ${k.longitude}`)
        markers.push(marker)
      })

      // Fokus peta ke marker pertama jika ada
      if (data.length > 0) {
        map.setView([data[0].latitude, data[0].longitude], 5)
      }
    } catch (err) {
      console.error('Gagal fetch koordinat:', err)
    }
  }

  // Tambah koordinat via AJAX
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const nama = document.getElementById('nama').value
    const latitude = parseFloat(document.getElementById('latitude').value)
    const longitude = parseFloat(document.getElementById('longitude').value)

    try {
      await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, latitude, longitude }),
      })
      form.reset()
      fetchKoordinats()
    } catch (err) {
      console.error('Gagal tambah koordinat:', err)
    }
  })

  // Hapus koordinat
  window.deleteKoordinat = async (id) => {
    if (confirm('Yakin ingin menghapus?')) {
      await fetch(`${baseURL}/${id}`, { method: 'DELETE' })
      fetchKoordinats()
    }
  }

  // Edit koordinat
  window.editKoordinat = async (id) => {
    const res = await fetch(`${baseURL}/${id}`)
    const k = await res.json()

    const newNama = prompt('Nama:', k.nama)
    const newLat = parseFloat(prompt('Latitude:', k.latitude))
    const newLng = parseFloat(prompt('Longitude:', k.longitude))

    if (newNama && !isNaN(newLat) && !isNaN(newLng)) {
      await fetch(`${baseURL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: newNama, latitude: newLat, longitude: newLng }),
      })
      fetchKoordinats()
    }
  }

  // Load data awal
  fetchKoordinats()
})

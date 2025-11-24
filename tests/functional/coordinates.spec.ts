import { test } from '@japa/runner'
import Koordinat from '#models/coordinate'

test.group('Coordinate CRUD', (group) => {
  // Bersihkan tabel sebelum setiap test
  group.each.setup(async () => {
    await Koordinat.query().delete()
  })

  test('GET /coordinate harus mengembalikan daftar koordinat', async ({ client }) => {
    await Koordinat.create({
      nama: 'Test A',
      latitude: -6.2,
      longitude: 106.8,
    })

    const response = await client.get('/coordinate')

    response.assertStatus(200)
    response.assertBodyContains([
      {
        nama: 'Test A',
      },
    ])
  })

  test('POST /coordinate harus membuat data koordinat baru', async ({ client }) => {
    const payload = {
      nama: 'Lokasi Baru',
      latitude: -1.234,
      longitude: 120.456,
    }

    const response = await client.post('/coordinate').json(payload)

    response.assertStatus(201)
    response.assertBodyContains(payload)
  })

  test('GET /coordinate/:id harus tampilkan koordinat berdasarkan ID', async ({ client }) => {
    const koordinat = await Koordinat.create({
      nama: 'Lokasi X',
      latitude: -3.1,
      longitude: 118.6,
    })

    const response = await client.get(`/coordinate/${koordinat.id_koordinat}`)

    response.assertStatus(200)
    response.assertBodyContains({
      nama: 'Lokasi X',
    })
  })

  test('PUT /coordinate/:id harus update data koordinat', async ({ client }) => {
    const koordinat = await Koordinat.create({
      nama: 'Before',
      latitude: 10,
      longitude: 20,
    })

    const response = await client.put(`/coordinate/${koordinat.id_koordinat}`).json({
      nama: 'After',
      latitude: 30,
      longitude: 40,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      nama: 'After',
      latitude: 30,
      longitude: 40,
    })
  })

  test('DELETE /coordinate/:id harus hapus koordinat', async ({ client }) => {
    const koordinat = await Koordinat.create({
      nama: 'To Delete',
      latitude: 1.23,
      longitude: 2.34,
    })

    const response = await client.delete(`/coordinate/${koordinat.id_koordinat}`)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Koordinat deleted' })
  })

  test('GET /coordinate/:id harus 404 jika ID tidak ditemukan', async ({ client }) => {
    const response = await client.get('/coordinate/999')

    response.assertStatus(404)
    response.assertBodyContains({ message: 'Koordinat not found' })
  })
})

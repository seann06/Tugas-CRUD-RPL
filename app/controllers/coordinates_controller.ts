import type { HttpContext } from '@adonisjs/core/http'
import Koordinat from '#models/coordinate'

export default class CoordinatesController {
  // Read all
  public async index({ response }: HttpContext) {
    const koordinats = await Koordinat.all()
    return response.json(koordinats)
  }

  // Read one by id
  public async show({ params, response }: HttpContext) {
    const koordinat = await Koordinat.find(params.id)
    if (!koordinat) {
      return response.status(404).json({ message: 'Koordinat not found' })
    }
    return response.json(koordinat)
  }

  // Create new koordinat
  public async store({ request, response }: HttpContext) {
    const data = request.only(['nama', 'latitude', 'longitude'])
    const koordinat = await Koordinat.create(data)
    return response.status(201).json(koordinat)
  }

  // Update koordinat by id
  public async update({ params, request, response }: HttpContext) {
    const koordinat = await Koordinat.find(params.id)
    if (!koordinat) {
      return response.status(404).json({ message: 'Koordinat not found' })
    }
    koordinat.merge(request.only(['nama', 'latitude', 'longitude']))
    await koordinat.save()
    return response.json(koordinat)
  }

  // Delete koordinat by id
  public async destroy({ params, response }: HttpContext) {
    const koordinat = await Koordinat.find(params.id)
    if (!koordinat) {
      return response.status(404).json({ message: 'Koordinat not found' })
    }
    await koordinat.delete()
    return response.json({ message: 'Koordinat deleted' })
  }
}

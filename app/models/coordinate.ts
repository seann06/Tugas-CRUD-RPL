import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Koordinat extends BaseModel {
  public static table = 'koordinats'

  @column({ isPrimary: true })
  declare id_koordinat: number

  @column()
  declare nama: string

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

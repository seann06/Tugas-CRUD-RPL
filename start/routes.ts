import router from '@adonisjs/core/services/router'
import CoordinatesController from '#controllers/coordinates_controller'

router
  .group(() => {
    router.get('/', [CoordinatesController, 'index'])
    router.get('/:id', [CoordinatesController, 'show'])
    router.post('/', [CoordinatesController, 'store'])
    router.put('/:id', [CoordinatesController, 'update'])
    router.delete('/:id', [CoordinatesController, 'destroy'])
  })
  .prefix('/coordinate')
router.on('/').renderInertia('bismillahimmo')

import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.resource('coordinates', () => import('#controllers/coordinates_controller')).apiOnly()
  })
  .prefix('/coordinate')
router.on('/').renderInertia('bismillahimmo')

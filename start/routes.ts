import router from '@adonisjs/core/services/router'

router.resource('/coordinate', () => import('#controllers/coordinates_controller')).apiOnly()
router.on('/').renderInertia('bismillahimmo')

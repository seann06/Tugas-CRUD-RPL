import CoordinatesController from '#controllers/coordinates_controller'
import router from '@adonisjs/core/services/router'

router.resource('/coordinate', CoordinatesController).apiOnly()
router.on('/').renderInertia('bismillahimmo')

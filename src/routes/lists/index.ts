import { FastifyInstance } from 'fastify'
import * as listsController from '../../controllers/lists.controller'

async function lists(fastify: FastifyInstance) {

  fastify.get('/', listsController.listLists)

  fastify.post('/', listsController.addList)

  fastify.delete('/:id', listsController.deleteList)

  fastify.put('/:id', listsController.updateListDescription)

  fastify.post('/:id/items', listsController.addItem)

  fastify.delete('/:id/items/:item_id', listsController.deleteItem)

  fastify.put('/:id/items/:item_id', listsController.updateItem)

}

export default lists
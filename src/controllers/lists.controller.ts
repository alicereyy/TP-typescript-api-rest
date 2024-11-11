import { FastifyReply, FastifyRequest } from "fastify"
import { ITodoList, Status } from "../interfaces"


/* export const listLists = async (
    request: FastifyRequest, 
    reply: FastifyReply) => {

        Promise.resolve(staticLists)
        .then((item) => {
	        reply.send({ data: item })
        })
    } */


// GET: get all lists
export async function listLists(
    request: FastifyRequest, 
    reply: FastifyReply
    ) {
    console.log('DB status', this.level.db.status)
    const listsIter = this.level.db.iterator()
    
    const result: ITodoList[] = []
    for await (const [key, value] of listsIter) {
        result.push(JSON.parse(value))
    }
    reply.send({ data: result })
    }
          

// POST : add a list
export async function addList(
    request: FastifyRequest<{ Body: { id: string; description: string; tasks?: { name: string }[] } }>,
    reply: FastifyReply
    ) {

        // Extraction des données de la requête
        const { id, description, tasks = [] } = request.body;

        // Fonction pour générer un ID unique pour chaque tâche
        let taskCounter = 1;
        const generateTaskId = () => ''+taskCounter++;

        // Création de la nouvelle liste avec un ID unique
        const newList: ITodoList = {
            id,
            description,
            tasks: tasks.map(task => ({
                id: generateTaskId(),
                name: task.name,
                completed: "PENDING"
            }))
        };

        // Ajout de la nouvelle liste aux `staticLists`
        //staticLists.push(newList);
        const result = await this.level.db.put(
            newList.id.toString(), JSON.stringify(newList)
        )

        // Envoi de la réponse avec la liste ajoutée
        //reply.send({ data: newList });
        reply.send({ data: result });  
    }


// DELETE: delete a list
export async function deleteList(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
    ) {
        const { id } = request.params; // Récupération de l'ID de la liste depuis les paramètres de l'URL
      
        try {
          // Vérifier si la liste existe dans la base de données
          const listData = await this.level.db.get(id);
      
          if (!listData) {
            // Si la liste n'existe pas, renvoyer une erreur 404
            return reply.status(404).send({ message: 'List not found' });
          }
      
          // Supprimer la liste de la base de données
          await this.level.db.del(id);
      
          // Retourner une réponse avec un message de succès
          reply.status(200).send({
            message: 'List deleted successfully'
          });
          
        } catch (error) {
          // Gestion des erreurs
          console.error('Error deleting list:', error);
          reply.status(500).send({ message: 'Internal Server Error' });
        }
    }
    

// PUT: update a list description
export async function updateListDescription(
  request: FastifyRequest<{ Params: { id: string }; Body: { description: string } }>,
  reply: FastifyReply
) {
    // Récupération de l'ID à partir des paramètres de la requête et de la nouvelle description dans le corps de la requête
    const { id } = request.params;
    const { description } = request.body;

    try {
        // Vérifie si la liste existe dans la base de données
        const listData = await this.level.db.get(id);

        // Mettre à jour la description de la liste
        const list = JSON.parse(listData);
        list.description = description;

        // Enregistre la liste mise à jour dans la base de données
        await this.level.db.put(id, JSON.stringify(list));

        // Retourne la liste mise à jour
        reply.send({ data: list });
    } catch (error) {
        reply.status(400).send({ error: 'Liste non trouvée' });
    }
}


// POST: add an item to a list
export async function addItem(
  request: FastifyRequest<{ Params: { id: string }; 
                            Body: { item_id: string; item_description: string; completed: Status } }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const { item_id, item_description, completed } = request.body;

  try {
    // Vérifier si la liste existe dans la base de données
    const todoListData = await this.level.db.get(id);

    // Parse des données de la liste pour travailler avec
    const todoList: ITodoList = JSON.parse(todoListData);

    // Ajout de la tâche à la liste des tâches de la liste
    todoList.tasks.push({
      id: item_id,
      name: item_description,
      completed: completed
    });

    // Sauvegarde de la liste mise à jour dans la base de données
    await this.level.db.put(id, JSON.stringify(todoList));

    // Réponse avec la liste mise à jour
    reply.status(201).send({
      message: 'Item added successfully',
      task: {
        id: item_id,
        name: item_description,
        completed: completed
      }
    });

  } catch (error) {
    reply.status(400).send({ message: 'List not found' });
  }
}


// DELETE: delete an item from a list
export async function deleteItem(
  request: FastifyRequest<{ Params: { id: string; item_id: string } }>,
  reply: FastifyReply
) {
  const { id, item_id } = request.params;  // Récupération des IDs depuis les paramètres de l'URL

  try {
    // Vérifier si la liste existe dans la base de données
    const todoListData = await this.level.db.get(id);

    if (!todoListData) {
      // Si la liste n'existe pas, on renvoie une erreur 404
      return reply.status(404).send({ message: 'List not found' });
    }

    // Parse des données de la liste pour travailler avec
    const todoList: ITodoList = JSON.parse(todoListData);

    // Recherche et suppression de la tâche avec l'ID item_id
    const taskIndex = todoList.tasks.findIndex(task => task.id === item_id);

    if (taskIndex === -1) {
      // Si la tâche n'est pas trouvée, on renvoie une erreur 404
      return reply.status(404).send({ message: 'Task not found' });
    }

    // Suppression de la tâche du tableau des tâches
    todoList.tasks.splice(taskIndex, 1);

    // Sauvegarde de la liste mise à jour dans la base de données
    await this.level.db.put(id, JSON.stringify(todoList));

    // Réponse indiquant que la tâche a été supprimée avec succès
    reply.status(200).send({
      message: 'Task deleted successfully',
      item_id: item_id  // Retourne l'ID de l'élément supprimé pour confirmation
    });

  } catch (error) {
    console.error('Error deleting item from list:', error);
    reply.status(500).send({ message: 'List not found' });
  }
}


// PUT: update an item of a list
export async function updateItem(
  request: FastifyRequest<{ Params: { id: string; item_id: string };
                            Body: { completed: Status } }>,
  reply: FastifyReply
) {
  const { id, item_id } = request.params;
  const { completed } = request.body;

  try {
    // Vérifier si la liste existe dans la base de données
    const todoListData = await this.level.db.get(id);

    if (!todoListData) {
      // Si la liste n'existe pas, on renvoie une erreur 404
      return reply.status(404).send({ message: 'List not found' });
    }

    // Parse des données de la liste pour travailler avec
    const todoList: ITodoList = JSON.parse(todoListData);

    // Trouver la tâche avec l'ID de l'élément (item_id)
    const task = todoList.tasks.find(task => task.id === item_id);

    if (!task) {
      // Si la tâche n'est pas trouvée, on renvoie une erreur 404
      return reply.status(404).send({ message: 'Task not found' });
    }

    task.completed = completed

    // Enregistre la liste mise à jour dans la base de données
    await this.level.db.put(id, JSON.stringify(todoList));

    // Retourne la tâche mise à jour
    reply.status(200).send({
      message: 'Task completion status updated successfully',
      task: {
        id: task.id,
        name: task.name,
        completed: task.completed
      }
    });

  } catch (error) {
    console.error('Error updating item from list:', error);
    reply.status(500).send({ message: 'List not found' });
  }
}

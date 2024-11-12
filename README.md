# Todo List API
Cette API permet de gérer des listes de tâches (Todo Lists) avec des fonctionnalités permettant de manipuler les listes et les éléments qu'elles contiennent. Elle permet de créer, récupérer, modifier, et supprimer des listes ainsi que des tâches à l'intérieur de ces listes.

Pour lancer le projet, run 'npm run dev' à la racine du projet.

## Fonctionnalités
### Récupérer toutes les listes
GET /lists
Permet de récupérer toutes les listes de tâches existantes. La réponse renvoie un tableau contenant les informations de chaque liste, y compris ses tâches.

### Ajouter une nouvelle liste
POST /lists
Permet de créer une nouvelle liste de tâches. Vous pouvez inclure une description et des tâches initiales pour cette liste.

### Supprimer une liste
DELETE /lists/:id
Permet de supprimer une liste de tâches en utilisant son identifiant (id). Si la liste n'existe pas, une erreur 404 est retournée.

### Mettre à jour la description d'une liste
PUT /lists/:id
Permet de modifier la description d'une liste existante. La mise à jour est effectuée en fonction de l'identifiant (id) de la liste.

### Ajouter une tâche à une liste
POST /lists/:id/items
Permet d'ajouter une tâche à une liste existante. Vous devez spécifier l'ID de la liste et les détails de la tâche (nom, statut de complétion).

### Supprimer une tâche d'une liste
DELETE /lists/:id/items/:item_id
Permet de supprimer une tâche spécifique d'une liste en utilisant les identifiants de la liste (id) et de la tâche (item_id).

### Mettre à jour le statut de complétion d'une tâche
PUT /lists/:id/items/:item_id
Permet de mettre à jour le statut de complétion d'une tâche d'une liste (par exemple, passer de "PENDING" à "IN-PROGRESS" ou "DONE").

## Statut des tâches
Les tâches peuvent avoir l'un des statuts suivants :

PENDING : La tâche n'est pas encore commencée.
IN-PROGRESS : La tâche est en cours d'exécution.
DONE : La tâche est terminée.

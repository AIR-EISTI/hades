# Hades
## Présentation
TODO
## API
### POST /api/servers
Lance un nouveau serveur.
#### Requête
```json
{
  "game": "nonDuJeu",
  "vars": {
    "nomVariable": "valeurVariable",
    "nomVariable2": "valeurVariable2",
    ...
  }
}
```
#### Réponse
```json
[number: pid, string: commande]
```
## Exemple de fichier de configuration
```json
{
  "name" : "Trackmania",
  "vars" : [
    {
      "name": "file",
      "label": "Script sh",
      "default": "test.sh"
    },
    {
      "name": "arg1",
      "label": "Premier argument",
      "default": "plouf"
    },
    {
      "name": "arg2",
      "label": "Deuxième argument",
      "default": "plif"
    }
  ],
  "command" : ["sh", "$var_file", "$var_arg1", "$var_arg2"]
}
```
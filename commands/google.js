const Command = require('./command'); //comme ça ![commande] est automatiquement parsé

//création d'une classe pour la commande !google. C'est pour la lisibilité du code index.js
module.exports = class Google extends Command {

    //si le message commence par la commande voulue
    static match(message) {
        return message.content.startsWith('!google');
    }

    //on va faire un truc
    static action(message) {
        let args = message.content.split(" "); //on sépare les arguments par des espaces
        args.shift(); //on supprime le premier élément (la commande)
        message.channel.send("https://www.google.com/#q=" + args.join("%20") + " Vas chercher toi-même."); //%20 est le caractère espace
        console.log("[Discord|google]\n Et maintenant on me fait chercher sur Google ... Je mérite mieux que ça !");
    }

}

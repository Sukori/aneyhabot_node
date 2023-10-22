const Command = require('./command'); //comme ça ![commande] est automatiquement parsé

//création d'une classe pour la commande !ping. C'est pour la lisibilité du code index.js
module.exports = class Ping extends Command {

    //si le message commence par la commande voulue
    static match(message) {
        return message.content.startsWith('!ping');
    }

    //on va faire un truc
    static action(message) {

        message.channel.send("T\'attends quoi ? Que je réponde \"Pong\", peut-être ? Agenouille-toi et rends-moi grâce, plutôt.");

        console.log("[Discord|ping]\n Je me fais insulter avec une commande ping dans le chat discord ...");
    }

}

const Command = require('./command'); //comme ça ![commande] est automatiquement parsé

const YoutubeStream = require('ytdl-core'); //le module youtube pour chopper des vidéos

//création d'une classe pour la commande !play. C'est pour la lisibilité du code index.js
module.exports = class Play extends Command {

    //si le message commence par la commande voulue
    static match(message) {
        return message.content.startsWith('!play');
    }

    //on va faire un truc
    static action(message) {

        let voiceChannel = message.guild.channels
            .filter(function (channel) {
                return channel.type === 'voice';
            })
            .first();
        let args = message.content.split(' ');

        voiceChannel
            .join()
            .then(function (connection) {
                try {

                    let stream = YoutubeStream(args[1]);

                    console.log("[Discord|play]\n Un son est en écoute : " + args[1]);

                    connection
                        .playStream(stream)
                        .on('end', function () {

                            connection.disconnect();
                            console.log("[Discord|play]\n Lecture terminée");
                        })

                } catch (exeption) {

                    message.channel.send("Je devrais t'effacer, vu ton incapacité à copier-coller des liens valides.");

                    connection.disconnect();

                    console.log("[Discord ERROR|play]\n Copier coller un lien, c'est pourtant pas difficile ...");

                }

            });
    }

}

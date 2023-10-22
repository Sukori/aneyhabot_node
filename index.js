/******************************
        Appel des modules
*******************************/

const Discord = require('discord.js'); //librairie discord
var twit = require('twit'); //librairie twitter
var config = require('./config.js'); //config avec les keys pour twitter
var Twitter = new twit(config); //donne l'accès au compte par le bot
const bot = new Discord.Client(); //construction du client Discord
const Google = require('./commands/google'); //appel de la classe faite dans google.js
const Ping = require('./commands/ping'); //appel de la classe faite dans ping.js
const Play = require('./commands/play'); //appel de la classe faite dans play.js

/*****************************
            Discord
******************************/

bot.login('BOT_CLIENT_ID'); //l'ID client du bot

/*Une fois que le bot a démarré*/
bot.on('ready', function () {
    console.log("[Invoke|Ahneyha]\n Entre la vie et la mort, il y a l'éternité. Je suis au delà de l'éternité.");
    bot.user.setGame("Best Game Ever").catch(console.error);

})

/*Lorsqu'un nouvel utilisateur rejoint le serveur*/
bot.on('guildMemberAdd', function (member) {

    member.createDM().then(function (channel) {

        console.log("[Discord|new guild member]\n Un nouvel utilisateur a rejoint le serveur");
        //return, au cas où il y a une erreur, c'est affiché par le catch après aussi
        return channel.send("Oh, tu es dans cette partie-là de l'univers, toi aussi, " + member.displayName);

    }).catch(console.error);

});

/*L'orsque l'on entre un message dans un channel*/
bot.on('message', function (message) {

    //si on entre une commande ![commande] valide, on va check laquelle
    let commandUsed = Ping.parse(message) || Google.parse(message) || Play.parse(message);
});

/****************************
            Twitter
*****************************/

/****************fonction qui retweet selon un hashtag particulier****************/

var retweet = function () {
    //paramètres de recherche des tweets
    var params = {
        //queries. objets de recherche et date des tweets, récents, et la langue, au pire
        q: '#indiedev',
        result_type: 'recent' //,
        //lang: 'en'
        //https://developer.twitter.com/en/docs pour plus de paramètres
    }
    //on utilise les paramètres spécifiés ci-dessus pour lancer la recherche
    Twitter.get('search/tweets', params, function (err, data) {
        //si pas d'erreur
        if (!err) {
            //choppe l'ID du tweet
            var retweetId = data.statuses[0].id_str;
            //On retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function (err, response) {
                if (response) {
                    console.log("[Twitter|retweet]\n J\'ai retweet un truc !");
                }
                //si un erreur
                if (err) {
                    console.log("[Twitter ERROR|retweet]\n Y a un fail dans le retweet. Un doublon ?");
                }
            });
        }
        //si pas pu chercher
        else {
            console.log("[Twitter ERROR|search]\n J\'ai pas pu rechercher");
        }
    });
}

/*******************fonction qui fav au hasard, parce que !*********************/
//similaire à la fonction retweet
var favoriteTweet = function () {
    var params = {
        q: '#SwissEsport',
        result_type: 'recent' //,
        //lang: 'en'
    }

    Twitter.get('search/tweets', params, function (err, data) {

        var tweet = data.statuses;
        var randomTweet = ranDom(tweet); //fonction ranDom définie ci-dessous

        if (typeof randomTweet != 'undefined') {
            Twitter.post('favorites/create', {
                id: randomTweet.id_str
            }, function (err, response) {
                if (err) {
                    console.log("[Twitter ERROR|fav]\n J\'ai pas pu fav. Y a un truc qui cloche...");
                } else {
                    console.log("[Twitter|fav]\n Yay ! J\'ai trouvé un truc sympa a fav !");
                }
            });
        }
    });
}

/******************fonction ranDom******************/

function ranDom(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

/*****************fonction répondre à un follower*****************/

//stream c'est pour chopper les actions avec le bot, venant d'un user en l'occurence
var stream = Twitter.stream('user');

//quand quelqu'un follow, ça va trigger une fonction
stream.on('follow', followed);

/******fonction followed******/

function followed(event) {
    console.log("[Twitter|followed]\n Je surveille les nouveaux followers. J\'ai rien de mieux à faire de toute façon...");

    //on choppe le nom du follower
    var name = event.source.name,
        screenName = event.source.screen_name;

    //et on lui tweete un message
    tweetNow("@" + screenName + " me vénère à ma juste valeur. Pas comme cet impudent de @Sukori_TechMage");
    console.log("[Twitter|followed]\n" + screenName);
}

/******fonction tweetNow******/

function tweetNow(tweetTxt) {
    var tweet = {
        status: tweetTxt
    }
    Twitter.post('statuses/update', tweet, function (err, data, response) {

        if (err) {
            console.log(err + "\n[Twitter ERROR|follower]\n Y a eu une erreur pour saluer le follower...");
        } else {
            console.log("[Twitter|new follower]\n Un nouveau minion me vénère.");
        }
    });
}

//On démarre la fonction retweet aussitôt qu'on démarre le bot
retweet();
//fav aussi
favoriteTweet();

//on recommence chaque 50 minutes (en millisecondes)
setInterval(retweet, 3000000);
//fav aussi
setInterval(favoriteTweet, 3000000);

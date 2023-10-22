/*C'est un parseur de commandes*/
module.exports = class command {

    static parse(message) {
        if (this.match(message)) {

            this.action(message);

            return true;
        }

        return false;
    }

    //si le message commence par la commande voulue
    static match(message) {
        return false;
    }

    //on va faire un truc
    static action(message) {

    }
}

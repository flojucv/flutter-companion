const chalk = require("chalk");

module.exports.error = (message) => {
    if(typeof message == "string")
        console.error(chalk.red(`[Erreur] ${message}`));
    else {
        console.error(chalk.red(`[Erreur] ${message[0]}`));
        message.slice(1).forEach(element => {
            console.error(chalk.yellow(element));
        });
    }
    process.exit(1);
}

module.exports.success = (message) => {
    if(typeof message == "string")
        console.log(chalk.green(`[Success] ${message}`));
    else {
        console.log(chalk.green(`[Success] ${message[0]}`));
        message.slice(1).forEach(element => {
            console.log(chalk.yellow(element));
        });
    }
}

module.exports.info = (message) => {
    if(typeof message == "string")
        console.log(chalk.blue(`[flutter-companion] ${message}`));
    else {
        console.log(chalk.blue(`[flutter-companion] ${message[0]}`));
        message.slice(1).forEach(element => {
            console.log(chalk.yellow(element));
        });
    }
}
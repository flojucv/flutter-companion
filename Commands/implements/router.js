const { Command } = require("commander");
const chalk = require("chalk");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = () => {
    const command = new Command('router');
    command
        .description('Implementer le router dans l\'application flutter')
        .action(() => {
            try {
                execSync('flutter pub add go_router', { stdio: 'inherit' });
            } catch (error) {
                console.error(chalk.red('[Erreur] Erreur lors de l\'exécution de la commande Flutter :'), error);
            }

            let routerFile = 'lib/router.dart';
            let mainFile = 'lib/main.dart';

            const templateRouterPath = path.join(__dirname, '../..', 'template', 'router.template.dart');
            const templateMainPath = path.join(__dirname, '../..', 'template', 'routerMain.template.dart');
            let contentRouter = fs.readFileSync(templateRouterPath, 'utf8');
            let contentMain = fs.readFileSync(templateMainPath, 'utf8');

            // Vérifier si le fichier existe déjà
            if (fs.existsSync(routerFile)) {
                console.error(chalk.red('[Erreur] Le fichier existe déjà.'));
                process.exit(1);
            }

            // Écrire le fichier
            fs.writeFileSync(mainFile, contentMain);
            fs.writeFileSync(routerFile, contentRouter);

            console.log(chalk.green(`Router initialisé est crée`));
        });
    return command;
};
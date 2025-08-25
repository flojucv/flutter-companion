#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const { error } = require('./utils/log');

const program = new Command();

program.hook('preAction', (thisCommand) => {
    const pubspec = path.join(process.cwd(), "pubspec.yaml");
    const libDir = path.join(process.cwd(), "lib");
    if (!fs.existsSync(pubspec) || !fs.existsSync(libDir)) {
        error(`Ce n'est pas un projet Flutter valide. Assurez-vous d'être dans le bon répertoire.`);
    }
});

const pkgPath = path.join(__dirname, "package.json");
if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    program
        .version(pkg.version, '-v, --version', 'Show flutter-companion version');
}

const commandsDir = path.join(__dirname, 'commands');
fs.readdirSync(commandsDir).forEach((mainCmd) => {
    const mainCmdPath = path.join(commandsDir, mainCmd);
    if (fs.statSync(mainCmdPath).isDirectory()) {
        // Crée la commande principale avec alias (première lettre)
        const mainCommand = new Command(mainCmd)
            .alias(mainCmd[0])
            .description(`Commande ${mainCmd}`);

        // Ajoute chaque fichier comme sous-commande
        fs.readdirSync(mainCmdPath).forEach((subCmdFile) => {
            if (subCmdFile.endsWith('.js')) {
                const subCmd = require(path.join(mainCmdPath, subCmdFile));
                mainCommand.addCommand(subCmd());
            }
        });

        program.addCommand(mainCommand);
    }
});

program.parse(process.argv);
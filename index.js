#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

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
const { Command } = require("commander");
const { toPascalCase, toTitleCase } = require("../../utils/helper");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

module.exports = () => {
  const command = new Command('page');
  command
    .description('Créer une page Flutter')
    .argument('<pathArg>', 'le chemin de la page')
    .option('-f, --force', 'forcer la création de la page')
    .action((pathArg) => {
      // Déterminer le chemin du fichier
      let pageFile = pathArg.endsWith('.dart') ? pathArg : `${pathArg}.dart`;
      if (!pageFile.startsWith('lib/')) pageFile = `lib/${pageFile}`;

      // Créer le dossier si besoin
      const dir = path.dirname(pageFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      // Générer noms
      const fileName = path.basename(pageFile, '.dart');
      const className = toPascalCase(fileName);
      const titleName = toTitleCase(fileName);

      // Lire le template externe depuis le dossier template
      const templatePath = path.join(__dirname, '../..', 'template', 'page.template.dart');
      let content = fs.readFileSync(templatePath, 'utf8');
      content = content
        .replace(/{{className}}/g, className)
        .replace(/{{titleName}}/g, titleName);

      const forceMode = command.opts().force;

      // Vérifier si le fichier existe déjà
      if (fs.existsSync(pageFile) && !forceMode) {
        console.error(chalk.red('[Erreur] Le fichier existe déjà.'));
        console.error(chalk.yellow('Utiliser l\'option -f ou --force pour forcer la création.'));
        console.error(chalk.yellow('Ou supprimer le fichier existant.'));
        process.exit(1);
      }

      // Écrire le fichier
      fs.writeFileSync(pageFile, content);
      console.log(chalk.green(`Page crée : ${pageFile}`));
    });
  return command;
};
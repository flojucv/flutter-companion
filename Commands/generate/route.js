const { Command } = require("commander");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

module.exports = () => {
    const command = new Command('route');
    command
        .description('Créer une route Flutter')
        .argument('<routeName>', 'le nom de la route')
        .argument('<componentName>', 'le nom du composant')
        .option('-f, --force', 'forcer la création de la page')
        .action((routeName, componentName) => {
            const routerFile = 'lib/router.dart';
            const componentFile = `lib/${componentName}.dart`;

            const forceMode = command.opts().force;

            // 1. Vérifier si le module de route est implémenté
            if (!fs.existsSync(routerFile) && !forceMode) {
                console.error(chalk.red('[Erreur] Le module de route (lib/router.dart) n\'est pas implémenté.'));
                console.error(chalk.yellow('Utiliser la commande `flutter-utils implements router` pour l\'implémenter.'));
                console.error(chalk.yellow('Ou utiliser l\'option -f ou --force pour forcer la création.'));
                process.exit(1);
            }

            // 2. Vérifier si le composant existe
            if (!fs.existsSync(componentFile) && !forceMode) {
                console.error(chalk.red(`[Erreur] Le composant ${componentName} n'existe pas dans lib/.`));
                console.error(chalk.yellow('Utiliser la commande `flutter-utils generate page` pour le créer.'));
                console.error(chalk.yellow('Ou utiliser l\'option -f ou --force pour forcer la création.'));
                process.exit(1);
            }

            // 3. Lire le contenu du router
            let routerContent = fs.readFileSync(routerFile, 'utf8');

            // 4. Ajouter l'import si non présent (import relatif sans 'lib/')
            const importLine = `import '${componentName}.dart';`;
            if (!routerContent.includes(importLine)) {
                routerContent = routerContent.replace(/(import .+;\n)+/, match => match + importLine + '\n');
            }

            // 5. Ajouter la route GoRoute
            // Extraire le nom du fichier sans dossier ni extension
            const fileBaseName = path.basename(componentName, '.dart');
            // Mettre la première lettre en majuscule
            const fileNameWithUpper = fileBaseName.charAt(0).toUpperCase() + fileBaseName.slice(1);
            // Ajouter .dart si besoin
            const builderContent = `${fileNameWithUpper}()`;

            if (routeName.startsWith('/'))
                routeName = routeName.substring(1);

            const routeCode = `    GoRoute(
      path: '/${routeName}',
      builder: (context, state) => const ${builderContent},
    ),`;

            // Insérer avant la fermeture du tableau de routes
            routerContent = routerContent.replace(
                /(routes:\s*<RouteBase>\s*\[)([\s\S]*?)(\])/m,
                (match, p1, p2, p3) => {
                    const routes = p2.trim();
                    const newRoutes = routes
                        ? `${routes}\n${routeCode}\n`
                        : `\n${routeCode}\n`;
                    return `${p1}${newRoutes}${p3}`;
                }
            );

            // 6. Écrire le fichier modifié
            fs.writeFileSync(routerFile, routerContent);
            console.log(chalk.green('Route ajoutée avec succès !'));
        });
    return command;
};
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { error, success } = require("../../utils/log");

module.exports = () => {
    const command = new Command('route');
    command
        .description('Create a Flutter route')
        .argument('<routeName>', 'The name of the route')
        .argument('<componentName>', 'The name of the component')
        .option('-f, --force', 'Force the creation of the page')
        .action((routeName, componentName) => {
            const routerFile = 'lib/router.dart';
            const componentFile = `lib/${componentName}.dart`;

            const forceMode = command.opts().force;

            // 1. Check if the router module is implemented
            if (!fs.existsSync(routerFile) && !forceMode) {
                error([
                    "The router module (lib/router.dart) is not implemented.",
                    "Use the command `flutter-companion implements router` to implement it.",
                    "Or use the -f or --force option to force creation."
                ]);
            }

            // 2. Check if the component exists
            if (!fs.existsSync(componentFile) && !forceMode) {
                error([
                    `The component ${componentName} does not exist in lib/.`,
                    "Use the command `flutter-companion generate page` to create it.",
                    "Or use the -f or --force option to force creation."
                ]);
            }

            // 3. Read the router content
            let routerContent = fs.readFileSync(routerFile, 'utf8');

            // 4. Add the import if not present (relative import without 'lib/')
            const importLine = `import '${componentName}.dart';`;
            if (!routerContent.includes(importLine)) {
                routerContent = routerContent.replace(/(import .+;\n)+/, match => match + importLine + '\n');
            }

            // 5. Add the GoRoute
            // Extract the file name without folder or extension
            const fileBaseName = path.basename(componentName, '.dart');
            // Capitalize the first letter
            const fileNameWithUpper = fileBaseName.charAt(0).toUpperCase() + fileBaseName.slice(1);
            // Add .dart if needed
            const builderContent = `${fileNameWithUpper}()`;

            if (routeName.startsWith('/'))
                routeName = routeName.substring(1);

            const routeCode = `    GoRoute(
      path: '/${routeName}',
      builder: (context, state) => const ${builderContent},
    ),`;

            // Insert before the closing of the routes array
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

            // 6. Write the modified file
            fs.writeFileSync(routerFile, routerContent);
            success('Route successfully added!');
        });
    return command;
};
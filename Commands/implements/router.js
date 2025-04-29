const { Command } = require("commander");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { error, success } = require("../../utils/log");

module.exports = () => {
    const command = new Command('router');
    command
        .description('Implements the router in the Flutter application')
        .action(() => {
            try {
                execSync('flutter pub add go_router', { stdio: 'inherit' });
            } catch (err) {
                error('Error while running the Flutter command: ' + err.message);
            }

            let routerFile = 'lib/router.dart';
            let mainFile = 'lib/main.dart';

            const templateRouterPath = path.join(__dirname, '../..', 'template', 'router.template.dart');
            const templateMainPath = path.join(__dirname, '../..', 'template', 'routerMain.template.dart');
            let contentRouter = fs.readFileSync(templateRouterPath, 'utf8');
            let contentMain = fs.readFileSync(templateMainPath, 'utf8');

            // Check if the file already exists
            if (fs.existsSync(routerFile)) {
                error('The file already exists.');
            }

            // Write the files
            fs.writeFileSync(mainFile, contentMain);
            fs.writeFileSync(routerFile, contentRouter);

            success('Router has been initialized and created.');
        });
    return command;
};
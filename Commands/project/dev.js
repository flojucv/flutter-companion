const { Command } = require("commander");
const { error, info } = require("../../utils/log");
const { spawn } = require('child_process');
const chokidar = require('chokidar');

module.exports = () => {
    const command = new Command('dev');

    command
        .description('Command for Flutter development with hot reload')
        .action(() => {
            info('Starting Flutter development with hot reload...')

            // Lancer flutter run avec pipe pour stdin
            const flutterProcess = spawn('flutter', ['run'], {
                stdio: ['pipe', 'inherit', 'inherit'],
                shell: true
            });

            // Observer les changements dans le répertoire lib
            const watcher = chokidar.watch('./lib', {
                ignored: /(^|[\/\\])\../,  // ignorer les fichiers cachés
                persistent: true
            });

            info('Watching for changes in lib directory...')

            // Lorsqu'un fichier change, envoyer 'r' au processus flutter pour hot reload
            watcher.on('change', filePath => {
                info(`File ${filePath} has been changed, triggering hot reload...`);
                try {
                    flutterProcess.stdin.write('r\n');
                } catch (err) {
                    error(`Failed to trigger hot reload: ${err.message}`);
                }
            });

            // Gérer la sortie du processus
            flutterProcess.on('exit', (code) => {
                info(`Flutter process exited with code ${code}`);
                watcher.close();
                process.exit(code);
            });

            // Gérer les erreurs du processus
            flutterProcess.on('error', (err) => {
                error(`Flutter process error: ${err.message}`);
                watcher.close();
                process.exit(1);
            });

            // Gérer Ctrl+C pour fermer les deux processus proprement
            process.on('SIGINT', () => {
                info('Stopping Flutter development...');
                flutterProcess.kill('SIGINT');
                watcher.close();
            });
        });
    return command;
};
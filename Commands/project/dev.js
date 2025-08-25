const { Command } = require("commander");
const { error, info } = require("../../utils/log");
const { spawn, execSync } = require('child_process');
const chokidar = require('chokidar');

module.exports = () => {
    const command = new Command('dev');

    command
        .description('Command for Flutter development with hot reload')
        .action(() => {
            info('Starting Flutter development with hot reload...');

            let launchArgs = ['run'];
            try {
                const devices = execSync('flutter devices --machine', { encoding: 'utf8' });
                const parsed = JSON.parse(devices);

                // Vérifie s'il y a au moins un device mobile (android ou ios)
                const hasMobile = parsed.some(device =>
                    device.platformType === 'ios' || device.platformType === 'android'
                );

                if (!hasMobile) {
                    info('No mobile device detected, launching in web mode...');
                    launchArgs = ['run', '-d', 'chrome'];
                }
            } catch (err) {
                info('Could not detect devices, launching in web mode...');
                launchArgs = ['run', '-d', 'chrome'];
            }

            const flutterProcess = spawn('flutter', launchArgs, {
                stdio: ['pipe', 'inherit', 'inherit'],
                shell: true
            });

            const watcher = chokidar.watch('./lib', {
                ignored: /(^|[\/\\])\../,
                persistent: true
            });

            info('Watching for changes in lib directory...');

            watcher.on('change', filePath => {
                info(`File ${filePath} has been changed, triggering hot reload...`);
                try {
                    flutterProcess.stdin.write('r\n');
                } catch (err) {
                    error(`Failed to trigger hot reload: ${err.message}`);
                }
            });

            flutterProcess.on('exit', (code) => {
                info(`Flutter process exited with code ${code}`);
                watcher.close();
                process.exit(code);
            });

            flutterProcess.on('error', (err) => {
                error(`Flutter process error: ${err.message}`);
                watcher.close();
                process.exit(1);
            });

            process.on('SIGINT', () => {
                info('Stopping Flutter development...');
                flutterProcess.kill('SIGINT');
                watcher.close();
            });
        });
    return command;
};
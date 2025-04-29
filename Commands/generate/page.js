const { Command } = require("commander");
const { toPascalCase, toTitleCase } = require("../../utils/helper");
const fs = require("fs");
const path = require("path");
const { error, success } = require("../../utils/log");

module.exports = () => {
  const command = new Command('page');
  command
    .description('Create a new page with a default template for Flutter')
    .argument('<pathArg>', 'Path and name of the page file')
    .option('-f, --force', 'Force creation of the file')
    .action((pathArg) => {
      // Determine the file path
      let pageFile = pathArg.endsWith('.dart') ? pathArg : `${pathArg}.dart`;
      if (!pageFile.startsWith('lib/')) pageFile = `lib/${pageFile}`;

      // Create the directory if needed
      const dir = path.dirname(pageFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      // Generate names
      const fileName = path.basename(pageFile, '.dart');
      const className = toPascalCase(fileName);
      const titleName = toTitleCase(fileName);

      // Read the external template from the template folder
      const templatePath = path.join(__dirname, '../..', 'template', 'page.template.dart');
      let content = fs.readFileSync(templatePath, 'utf8');
      content = content
        .replace(/{{className}}/g, className)
        .replace(/{{titleName}}/g, titleName);

      const forceMode = command.opts().force;

      // Check if the file already exists
      if (fs.existsSync(pageFile) && !forceMode) {
        error(["File already exists.","Use the -f or --force option to force creation.", "Or delete the existing file."]);
      }

      // Write the file
      fs.writeFileSync(pageFile, content);
      success([`Page created: ${pageFile}`,"Don't forget to add the route using the `flutter-companion generate route` command"]);
    });
  return command;
};
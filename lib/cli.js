const cssCleaner = require('./cleaner')

const cli = () => {
  var argv = require('yargs')
  .example('$0 -s=style.css -t=index.html', 'Print unused styles from given templates')
  .option("s", {
    alias: "styles",
    describe: "The path to your styles.",
    demandOption: "The styles path is required.",
    nargs: 1,
  })
  .option("t", {
    alias: "templates",
    describe: "The path to your templates",
    demandOption: "The templates path is required.",
    nargs: 1,
  })
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .argv;

  cssCleaner.clean(argv.s, argv.t).then(function () {
    console.log("Finished");
    process.exit(0);
  })
  .catch(function (err) {
    console.log("Error: " + err);
    process.exit(1);
  });
}

module.exports = {
  cli
}
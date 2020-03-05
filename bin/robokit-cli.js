#!/usr/bin/env node

const meow = require('meow');
// const chalk = require('chalk');
const inquirer = require('inquirer');
inquirer.registerPrompt(
  'command',
  require('inquirer-command-prompt'),
);

const {
  Model,
  CommandParser,
  help,
  CommandResponse,
  CommandState,
  JobWatcher,
} = require('../lib'); //require('../dist');

let commandParser;
let jobWatcher;

const model = new Model();

const helpCommands = Object.keys(help).sort();
helpCommands.unshift({ filter: (str) => str.split(' <')[0] }); // for command autoCompletion

function mainPrompt(input) {
  let result = input;
  if (typeof input === 'string') {
    result = {
      type: 'command',
      name: 'mainInput',
      message: `${input || `[${model.profiles.activeProfileId} : ${model.robotConfigs.activeRobotConfigID}]`}`,
      autoCompletion: helpCommands,
    };
  }
  return result;
}

function mainPromptLoop(msg) {
  inquirer.prompt(mainPrompt(msg)).then((answers) => {
    const input = answers.mainInput;
    if (input === 'quit' || input === 'bye' || input === 'exit' || input === 'x' || input === 'q') {
      console.log('bye');
      if (jobWatcher) {
        jobWatcher.dispose();
        jobWatcher = undefined;
      }
      process.exit(0);
    } else {
      commandParser.parseCommand(input)
        .then((pResult) => {
          if (pResult instanceof CommandResponse) {
            if (pResult.state === CommandState.OK || pResult.state === CommandState.NOK) {
              console.log(pResult.output);
              mainPromptLoop('');
            } else {
              mainPromptLoop(pResult.inquirerPrompt);
            }
          } else if (pResult instanceof Object && pResult.name) {
            mainPromptLoop(pResult);
          } else {
            console.log(pResult);
            mainPromptLoop('');
          }
        })
        .catch((error) => {
          console.log(error);
          mainPromptLoop('ERROR');
        });
    }
  });
}

model.on('ready', () => {
  commandParser = new CommandParser(model);

  const cli = meow(`
Usage
    $ node-cli --repl -r

Commands
    --repl turn on REPL mode (read eval print loop)
    --debug 
    --verbose outputs verbose results (json) in cli mode

Examples
  $ node-cli --repl
  $ node-cli --command help
`, {
    booleanDefault: undefined,
    flags: {
      repl: {
        type: 'boolean',
        default: false,
        alias: 'r',
      },
      debug: {
        type: 'boolean',
        default: false,
        alias: 'd',
      },
      verbose: {
        type: 'boolean',
        default: false,
        alias: 'v',
      },
    },
  });

  let mode;
  let command;
  let verbose = false;

  if (cli.flags.repl) {
    mode = 'repl';
  }
  if (cli.flags.verbose) {
    verbose = true;
  }
  if (cli.flags.command) {
    mode = 'command';
    command = cli.flags.command;
  }

  if (mode != 'command') {
    mainPromptLoop('');
  } else if (command) {
    const parserInput = `${command} ${cli.input.join(' ')}`.trim();
    commandParser.parseCommand(parserInput)
      .then((result) => {
        if (result instanceof CommandResponse) {
          let output = `${result.input}:${result.state}\n${result.output}`;
          if (verbose) {
            output = JSON.stringify(result.json, null, 2);
          }
          console.log(output);
        } else {
          console.log(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    cli.showHelp(0);
  }
});

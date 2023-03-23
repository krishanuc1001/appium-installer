#!/usr/bin/env node
import inquirer from 'inquirer';
import {
  installAppiumServer,
  getDriver,
  installDrivers,
  installPlugin,
  runAppiumDoctor,
} from './serverInstall.js';

const ui = new inquirer.ui.BottomBar();

type MenuOption = {
  name: string;
  fn: () => Promise<void>;
  value: string;
};

const options: MenuOption[] = [
  {
    name: 'Install Appium Server',
    fn: installAppiumServer,
    value: 'install-server',
  },
  {
    name: 'Install Appium Drivers',
    fn: installRequiredDrivers,
    value: 'install-drivers',
  },
  {
    name: 'Install Appium Plugin',
    fn: installPlugin,
    value: 'install-plugin',
  },
  {
    name: 'Run Appium Doctor',
    fn: runAppiumDoctor,
    value: 'run-doctor',
  },
  {
    name: 'Exit',
    fn: async () => {
      ui.log.write('Exiting Appium Installer...\n');
      process.exit(0);
    },
    value: 'exit',
  },
];

async function main() {
  ui.log.write(`\n👋 Hello, Appium user ✨\n\n`);
  ui.log.write(`\n‼️  BEFORE YOU START:\n\n`);
  ui.log.write(`🌐 Make sure you have node 16 and above\n\n`);

  while (true) {
    const { selectedOption } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedOption',
        message: 'Select an option',
        choices: options.map((option) => option.name),
      },
    ]);

    const currentOption = options.find((option) => option.name === selectedOption);
    if (!currentOption) {
      throw new Error(`Invalid menu option selected: ${selectedOption}`);
    }

    await currentOption.fn();
    ui.log.write(`${currentOption.name} completed\n`);
  }
}

async function installRequiredDrivers() {
  const driverChoices = await getDriver();
  const requiredDriverToInstall = await inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Select Drivers to install',
      name: 'drivers',
      choices: driverChoices,
    },
  ]);
  await installDrivers(requiredDriverToInstall.drivers);
  ui.log.write('\n');
}

main();

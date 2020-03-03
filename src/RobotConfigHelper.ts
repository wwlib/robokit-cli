import Model from './model/Model';

const inquirer = require('inquirer');

/*
  configId = 'configId',
  type = 'type',
  ip = 'ip',
  serialName = 'serialName',
  email = 'email',
  password = 'password',
*/

export default class RobotConfigHelper {

  private _appModel: Model;

  constructor(appModel: Model) {
    this._appModel = appModel;
  }

  create(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const questions: any[] = [
        {
          type: 'list',
          name: 'type',
          choices: ['jibo', 'robokit'],
          message: `What is the robot type?:\n`,
        },
        {
          type: 'input',
          name: 'serialName',
          message: `What is robot serial name?:\n`,
        },
        {
          type: 'input',
          name: 'email',
          message: `What is robot owner's email?:\n`,
        },
        {
          type: 'input',
          name: 'password',
          message: `What is robot owner's password?:\n`,
        },
        {
          type: 'input',
          name: 'configId',
          message: `Provide a name (id) for the new robot config:\n`,
        },
        {
          type: 'list',
          name: 'confirm',
          choices: ['yes', 'no'],
          message: `Confirm: Create this new robot config?:\n`,
        }
      ]
      inquirer.prompt(questions).then((result: any) => {
        // console.log(result);
        if (result.confirm === 'yes') {
          const newConfig = this._appModel.robotConfigs.newRobotConfig(result.configId);
          if (newConfig) {
            newConfig.data.type = result.type;
            newConfig.data.serialName = result.serialName;
            newConfig.data.email = result.email;
            newConfig.data.password = result.password;
          }
          resolve(newConfig);
        } else {
          resolve('new robot config canceled.')
        }
      });
    });
  }

  dispose() {
  }
}
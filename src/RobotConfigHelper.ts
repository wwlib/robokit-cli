import Model from './model/Model';
import RobotManager from './robot/RobotManager';
import RobotConfig from './model/RobotConfig';

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

  private _config: RobotConfig;
  private _editMode: boolean = false;

  constructor(config?: RobotConfig | undefined) {
    if (!config) {
      this._config = new RobotConfig();
    } else {
      this._config = config;
      this._editMode = true;
    }
  }

  create(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const questions: any[] = [
        {
          type: 'list',
          name: 'type',
          choices: ['jibo', 'robokit'],
          message: `What is the robot type?:\n`,
          default: this._config.type,
        },
        {
          type: 'input',
          name: 'serialName',
          message: `What is robot serial name?:\n`,
          default: this._config.serialName,
        },
        {
          type: 'input',
          name: 'email',
          message: `What is robot owner's email?:\n`,
          default: this._config.email,
        },
        {
          type: 'input',
          name: 'password',
          message: `What is robot owner's password?:\n`,
          default: this._config.password,
        },
        {
          type: 'list',
          name: 'confirm',
          choices: ['yes', 'no'],
          message: `Confirm: Create this new robot config?:\n`,
        }
      ]
      if (!this._editMode) {
        questions.unshift({
          type: 'input',
          name: 'configId',
          message: `Provide a name (id) for the new robot config:\n`,
        });
      }
      inquirer.prompt(questions).then((result: any) => {
        // console.log(result);
        if (result.confirm === 'yes') {
          this._config.data.type = result.type;
          this._config.data.serialName = result.serialName;
          this._config.data.email = result.email;
          this._config.data.password = result.password;
          if (!this._editMode) {
            this._config.id = result.configId;
            RobotManager.Instance.robotConfigs.addRobotConfig(this._config);
          }
          resolve(this._config);
        } else {
          resolve('new/edit robot config canceled.')
        }
      });
    });
  }

  dispose() {
  }
}
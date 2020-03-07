import RobotManager from './robot/RobotManager';

const inquirer = require('inquirer');

export default class SayHelper {

  constructor() {
  }

  sayPrompt() {
    const result = {
      type: 'input',
      name: 'sayInput',
      message: 'say: ',
    };
    return result;
  }

  loop(): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      inquirer.prompt(this.sayPrompt()).then((result: any) => {
        // console.log(result);
        if (result.sayInput === '') {
          resolve('okOK');
        } else {
          RobotManager.Instance.say(result.sayInput);
          this.loop()
            .then((loopResult: string) => {
              resolve(loopResult);
            });
        }
      });
    });
  }

  dispose() {
  }
}
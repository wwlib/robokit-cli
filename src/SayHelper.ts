import Model from './model/Model';

const inquirer = require('inquirer');

export default class SayHelper {

  private _appModel: Model;

  constructor(appModel: Model) {
    this._appModel = appModel;
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
          this._appModel.say(result.sayInput);
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
import RobotManager from './robot/RobotManager';
const inquirer = require('inquirer');

/*
  profileId = 'profileId',
  romPort = 'romPort',
  clientId = 'clientId',
  clientSecret = 'clientSecret',
  nluDefault = 'nluDefault',
  nluLUISEndpoint = 'nluLUISEndpoint',
  nluLUISAppId = 'nluLUISAppId',
  nluLUISSubscriptionKey = 'nluLUISSubscriptionKey',
  nluDialogflowClientToken = 'nluDialogflowClientToken',
  nluDialogflowProjectId = 'nluDialogflowProjectId',
  nluDialogflowPrivateKey = 'nluDialogflowPrivateKey',
  nluDialogflowClientEmail = 'nluDialogflowClientEmail',
  neo4jUrl = 'neo4jUrl',
  neo4jUser = 'neo4jUser',
  neo4jPassword = 'neo4jPassword',
*/

export default class ProfileHelper {


  constructor() {
  }

  create(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const questions: any[] = [
        // {
        //   type: 'input',
        //   name: 'romPort',
        //   message: `What is the rom port?:\n`
        // },
        {
          type: 'input',
          name: 'clientId',
          message: `What is user client id?:\n`,
        },
        {
          type: 'input',
          name: 'clientSecret',
          message: `What is user client secret?:\n`,
        },
        {
          type: 'input',
          name: 'profileId',
          message: `Provide a name (id) for the new profile:\n`,
        },
        {
          type: 'list',
          name: 'confirm',
          choices: ['yes', 'no'],
          message: `Confirm: Create this new profile?:\n`,
        }
      ]
      inquirer.prompt(questions).then((result: any) => {
        // console.log(result);
        if (result.confirm === 'yes') {
          const newProfile = RobotManager.Instance.profiles.newProfile(result.profileId);
          if (newProfile) {
            newProfile.data.romPort = 7160;
            newProfile.data.clientId = result.clientId;
            newProfile.data.clientSecret = result.clientSecret;
            newProfile.data.nluDefault = 'simple';
          }
          resolve(newProfile);
        } else {
          resolve('new profile canceled.')
        }
      });
    });
  }

  dispose() {
  }
}
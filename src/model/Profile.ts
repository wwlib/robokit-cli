export enum ProfileProperties {
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
}

export default class Profile {

    static ID_KEY: string = ProfileProperties.profileId;
    
    public data: any;

    constructor(data?: any) {
        if (data) {
            this.data = data;
        } else {
            this.data = {};
            Profile.propertyKeys.forEach(propertyKey => {
                this.data[propertyKey] = '';
            });
        }
    }

    static get propertyKeys(): string[] {
        return Object.keys(ProfileProperties);
    }

    get id(): string {
        return this.data.profileId;
    }

    set id(profileId: string) {
        if (profileId) {
            this.data.profileId = profileId;
        }
    }

    get port(): number {
        return this.data.port;
    }

    get nluDefault(): string {
        return this.data.nluDefault;
    }

    get clientId(): string {
        return this.data.clientId;
    }

    get clientSecret(): string {
        return this.data.clientSecret;
    }

    // getProperty(key: string): string {
    //     return this.data[key];
    // }

    setProperty(key: string, value: string) {
        let isValidProperty: boolean = Profile.propertyKeys.indexOf(key) != -1;
        if (key && value && isValidProperty) {
            this.data[key] = value;
        }
    }

    get json(): any {
        return this.data;
    }
}
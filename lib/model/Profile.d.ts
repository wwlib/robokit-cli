export declare enum ProfileProperties {
    profileId = "profileId",
    romPort = "romPort",
    clientId = "clientId",
    clientSecret = "clientSecret",
    nluDefault = "nluDefault",
    nluLUISEndpoint = "nluLUISEndpoint",
    nluLUISAppId = "nluLUISAppId",
    nluLUISSubscriptionKey = "nluLUISSubscriptionKey",
    nluDialogflowClientToken = "nluDialogflowClientToken",
    nluDialogflowProjectId = "nluDialogflowProjectId",
    nluDialogflowPrivateKey = "nluDialogflowPrivateKey",
    nluDialogflowClientEmail = "nluDialogflowClientEmail",
    neo4jUrl = "neo4jUrl",
    neo4jUser = "neo4jUser",
    neo4jPassword = "neo4jPassword"
}
export default class Profile {
    static ID_KEY: string;
    data: any;
    constructor(data?: any);
    static get propertyKeys(): string[];
    get id(): string;
    set id(profileId: string);
    get port(): number;
    get nluDefault(): string;
    get clientId(): string;
    get clientSecret(): string;
    setProperty(key: string, value: string): void;
    get json(): any;
}

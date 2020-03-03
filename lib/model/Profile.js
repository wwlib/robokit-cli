"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProfileProperties;
(function (ProfileProperties) {
    ProfileProperties["profileId"] = "profileId";
    ProfileProperties["romPort"] = "romPort";
    ProfileProperties["clientId"] = "clientId";
    ProfileProperties["clientSecret"] = "clientSecret";
    ProfileProperties["nluDefault"] = "nluDefault";
    ProfileProperties["nluLUISEndpoint"] = "nluLUISEndpoint";
    ProfileProperties["nluLUISAppId"] = "nluLUISAppId";
    ProfileProperties["nluLUISSubscriptionKey"] = "nluLUISSubscriptionKey";
    ProfileProperties["nluDialogflowClientToken"] = "nluDialogflowClientToken";
    ProfileProperties["nluDialogflowProjectId"] = "nluDialogflowProjectId";
    ProfileProperties["nluDialogflowPrivateKey"] = "nluDialogflowPrivateKey";
    ProfileProperties["nluDialogflowClientEmail"] = "nluDialogflowClientEmail";
    ProfileProperties["neo4jUrl"] = "neo4jUrl";
    ProfileProperties["neo4jUser"] = "neo4jUser";
    ProfileProperties["neo4jPassword"] = "neo4jPassword";
})(ProfileProperties = exports.ProfileProperties || (exports.ProfileProperties = {}));
class Profile {
    constructor(data) {
        if (data) {
            this.data = data;
        }
        else {
            this.data = {};
            Profile.propertyKeys.forEach(propertyKey => {
                this.data[propertyKey] = '';
            });
        }
    }
    static get propertyKeys() {
        return Object.keys(ProfileProperties);
    }
    get id() {
        return this.data.profileId;
    }
    set id(profileId) {
        if (profileId) {
            this.data.profileId = profileId;
        }
    }
    // getProperty(key: string): string {
    //     return this.data[key];
    // }
    setProperty(key, value) {
        let isValidProperty = Profile.propertyKeys.indexOf(key) != -1;
        if (key && value && isValidProperty) {
            this.data[key] = value;
        }
    }
    get json() {
        return this.data;
    }
}
exports.default = Profile;
Profile.ID_KEY = ProfileProperties.profileId;
//# sourceMappingURL=Profile.js.map
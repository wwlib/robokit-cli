"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Profile_1 = require("./Profile");
class Profiles {
    constructor() {
        this.activeProfileId = '';
        this._profileMap = new Map();
    }
    initWithData(data) {
        if (data) {
            this.activeProfileId = data.activeProfileId;
            data.profiles.forEach((profileData) => {
                const profile = new Profile_1.default(profileData);
                this._profileMap.set(profileData.profileId, profile);
            });
        }
        else {
            console.log('Profiles: initWithData: invalid data.');
        }
    }
    getProfileWithId(id) {
        return this._profileMap.get(id);
    }
    getActiveProfile() {
        return this._profileMap.get(this.activeProfileId);
    }
    getDefaultProfile() {
        this.activeProfileId = Profiles.DEFAULT_ID;
        return this._profileMap.get(Profiles.DEFAULT_ID);
    }
    getProfileIds() {
        const profileKeys = Array.from(this._profileMap.keys()).sort();
        return profileKeys;
    }
    setActiveProfile(id) {
        if (this._profileMap.get(id)) {
            this.activeProfileId = id;
        }
        return this.getActiveProfile();
    }
    setProfileProperty(key, value) {
        let profile = this.getActiveProfile();
        if (profile) {
            if (key === Profile_1.default.ID_KEY && !this._profileMap.get(value)) {
                let oldId = profile.id;
                let newId = value;
                this._profileMap.delete(oldId);
                profile.setProperty(key, newId);
                this._profileMap.set(newId, profile);
                this.activeProfileId = newId;
            }
            else {
                profile.setProperty(key, value);
            }
        }
    }
    addProfile(data) {
        let result = this.getActiveProfile();
        let profile = new Profile_1.default(data);
        if (profile.id) {
            this._profileMap.set(profile.id, profile);
            result = this.setActiveProfile(profile.id);
        }
        return result;
    }
    newProfile(profileId, makeActiveProfile = true) {
        let result = undefined;
        let profile = new Profile_1.default();
        if (profileId && !this._profileMap.get(profileId)) {
            profile.id = profileId;
            this._profileMap.set(profile.id, profile);
            result = profile;
            if (makeActiveProfile) {
                this.setActiveProfile(profile.id);
            }
        }
        return result;
    }
    deleteProfile(id) {
        let result = this.getActiveProfile();
        if (id == Profiles.DEFAULT_ID || !this.getProfileWithId(id)) {
            // noop
        }
        else {
            this._profileMap.delete(id);
            if (id === this.activeProfileId) {
                this.activeProfileId = '';
                const profileKeys = Array.from(this._profileMap.keys()).sort();
                profileKeys.forEach(key => {
                    if (this._profileMap.get(key) && !this.activeProfileId) {
                        this.activeProfileId = key;
                        result = this.setActiveProfile(this.activeProfileId);
                    }
                });
                if (!result) {
                    result = this.getDefaultProfile();
                }
            }
        }
        return result;
    }
    get json() {
        let result = {};
        result.activeProfileId = this.activeProfileId;
        result.profiles = [];
        const profileKeys = Array.from(this._profileMap.keys()).sort();
        profileKeys.forEach(key => {
            const profile = this._profileMap.get(key);
            if (profile) {
                result.profiles.push(profile.json);
            }
        });
        return result;
    }
}
exports.default = Profiles;
Profiles.DEFAULT_ID = 'Default';
//# sourceMappingURL=Profiles.js.map
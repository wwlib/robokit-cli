import Profile from './Profile';

export default class Profiles {

    static DEFAULT_ID = 'Default';

    private _profileMap: Map<string, Profile>;
    public activeProfileId: string

    constructor() {
        this.activeProfileId = '';
        this._profileMap = new Map<string, Profile>();
    }

    initWithData(data: any) {
        if (data) {
            this.activeProfileId = data.activeProfileId;
            data.profiles.forEach((profileData: any) => {
                const profile: Profile = new Profile(profileData);
                this._profileMap.set(profileData.profileId, profile);
            });
        } else {
            console.log('Profiles: initWithData: invalid data.');
        }
    }

    getProfileWithId(id: string): Profile | undefined {
        return this._profileMap.get(id);
    }

    getActiveProfile(): Profile | undefined {
        return this._profileMap.get(this.activeProfileId);
    }

    getDefaultProfile(): Profile | undefined {
        this.activeProfileId = Profiles.DEFAULT_ID;
        return this._profileMap.get(Profiles.DEFAULT_ID);
    }

    getProfileIds(): string[] {
        const profileKeys: string[] = Array.from(this._profileMap.keys()).sort();
        return profileKeys;
    }

    setActiveProfile(id: string): Profile | undefined {
        if (this._profileMap.get(id)) {
            this.activeProfileId = id;
        }
        return this.getActiveProfile();
    }

    setProfileProperty(key: string, value: string) {
        let profile: Profile | undefined = this.getActiveProfile();
        if (profile) {
            if (key === Profile.ID_KEY && !this._profileMap.get(value)) {
                let oldId: string = profile.id;
                let newId: string = value;
                this._profileMap.delete(oldId);
                profile.setProperty(key, newId);
                this._profileMap.set(newId, profile);
                this.activeProfileId = newId;
            } else {
                profile.setProperty(key, value);
            }
        }
    }

    addProfile(data: any): Profile | undefined {
        let result: Profile | undefined = this.getActiveProfile();
        let profile: Profile = new Profile(data);
        if (profile.id) {
            this._profileMap.set(profile.id, profile);
            result = this.setActiveProfile(profile.id)
        }
        return result;
    }

    newProfile(profileId: string, makeActiveProfile: boolean = true): Profile | undefined {
        let result: Profile | undefined = undefined;
        let profile: Profile = new Profile();
        if (profileId && !this._profileMap.get(profileId)) {
            profile.id = profileId
            this._profileMap.set(profile.id, profile);
            result = profile;
            if (makeActiveProfile) {
              this.setActiveProfile(profile.id);
            }
        }
        return result;
    }

    deleteProfile(id: string): Profile | undefined {
        let result: Profile | undefined = this.getActiveProfile();
        if (id == Profiles.DEFAULT_ID || !this.getProfileWithId(id)) {
            // noop
        } else {
            this._profileMap.delete(id);
            if (id === this.activeProfileId) {
                this.activeProfileId = '';
                const profileKeys: string[] = Array.from(this._profileMap.keys()).sort();
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

    get json(): any {
        let result: any = {}
        result.activeProfileId = this.activeProfileId;
        result.profiles = [];
        const profileKeys: string[] = Array.from(this._profileMap.keys()).sort();
        profileKeys.forEach(key => {
            const profile: Profile | undefined = this._profileMap.get(key);
            if (profile) {
                result.profiles.push(profile.json);
            }
        });
        return result;
    }

}
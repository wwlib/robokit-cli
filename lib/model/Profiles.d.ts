import Profile from './Profile';
export default class Profiles {
    static DEFAULT_ID: string;
    profileMap: any;
    activeProfileId: string;
    constructor(data: any);
    getProfileWithId(id: string): Profile | undefined;
    getActiveProfile(): Profile;
    getDefaultProfile(): Profile;
    getProfileIds(): string[];
    setActiveProfile(id: string): Profile;
    setProfileProperty(key: string, value: string): void;
    addProfile(data: any): Profile;
    newProfile(profileId: string, makeActiveProfile?: boolean): Profile | undefined;
    deleteProfile(id: string): Profile;
    get json(): any;
}

import Profile from './Profile';
export default class Profiles {
    static DEFAULT_ID: string;
    private _profileMap;
    activeProfileId: string;
    constructor();
    initWithData(data: any): void;
    getProfileWithId(id: string): Profile | undefined;
    getActiveProfile(): Profile | undefined;
    getDefaultProfile(): Profile | undefined;
    getProfileIds(): string[];
    setActiveProfile(id: string): Profile | undefined;
    setProfileProperty(key: string, value: string): void;
    addProfile(data: any): Profile | undefined;
    newProfile(profileId: string, makeActiveProfile?: boolean): Profile | undefined;
    deleteProfile(id: string): Profile | undefined;
    get json(): any;
}

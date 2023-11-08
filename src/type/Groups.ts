export interface IMember {
    name: string,
    sectionName: string
}

export interface ISection {
    name: string,
    members: IMember[]
}

export interface IGroup {
    id: string,
    name: string,
    sections: ISection[]
};
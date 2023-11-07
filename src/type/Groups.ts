export interface ISection {
    name: string
}

export interface IGroup {
    id: string,
    name: string,
    sections: ISection[]
};
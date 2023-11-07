export interface ISection {
    name: string
}

export interface IGroup {
    name: string,
    sections: ISection[]
};
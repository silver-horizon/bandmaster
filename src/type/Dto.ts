export interface IEmergencyContactDto {
    firstName: string,
    lastName: string,
    email: string,
    phone: string
};

export interface ICreateMemberDto {
    firstName: string,
    lastName: string,
    email: string,
    dob: Date,
    contact?: IEmergencyContactDto | null | undefined
};

export interface ICreateGroupDto {
    name: string,
    sections: string
};

export interface IMoveSectionDto {
    id: string
};
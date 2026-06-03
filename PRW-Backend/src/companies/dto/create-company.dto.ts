import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty({message: "Email không được để trống"})
    name: string;

    @IsNotEmpty({message: "Address không được để trống"})
    address: string;

    @IsNotEmpty({message: "Description không được để trống"})
    description: string;

    @IsNotEmpty({message: "Log không được để trống"})
    logo: string;
}

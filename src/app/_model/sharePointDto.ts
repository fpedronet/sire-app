import { Byte } from "@angular/compiler/src/util";

export class SharePointDto {
    siteUrl?: string;
    documentLibrary?: string;
    customerFolder?: string;
    fileName?: string;
    adjunto?: string;
    fileContent?: Byte
    userName?: string;
    password?:string;
}
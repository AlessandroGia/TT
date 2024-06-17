export interface NuovoAllegatoTesiPOSTRequest {
    idTesi: number;
    nome: string;
    idTipologia: number;
    nota: string;
    file: File;
}

export interface NuovoAllegatoTirocinioPOSTRequest {
    idTirocinio: number;
    nome: string;
    idTipologia: number;
    nota: string;
    file: File;
}

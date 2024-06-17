export interface NuovoTirocinioPOSTRequest {
    idLaboratorio: number;
    idTutor: number;
    nomeCDS: string;
    cfu: number;
    durata: number;
    idCollaboratori: number[];
}
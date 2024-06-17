export interface NuovaTesiPOSTRequest {
    titolo: string;
    insegnamento: string;
    nomeCDS: string;
    idRelatore: number;
    idCorrelatori: number[];
}
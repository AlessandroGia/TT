import { Utente } from "./utente-interface";

export interface Tesi {
    id: number;
    titolo: string;
    insegnamento: string;
    nomeCDS: string;
    dataDiscussione: string;
    relatore: string;
    studente: string;
    statoTesi: string;
    correlatori: Utente[];
}
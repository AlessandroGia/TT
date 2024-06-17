import { Utente } from "./utente-interface";

export interface Tirocinio {
    id: number;
    laboratorio: string;
    nomeCDS: string;
    tutor: string;
    studente: string;
    oreSvolte: number,
    minutiSvolti: number,
    durata: number;
    cfu: number;
    statoTirocinio: string;
    collaboratori: Utente[];
}
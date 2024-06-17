import { Attivita } from "../../primitive/attivita-interface";

export interface ElencoAttivitaResponse {
    oreSvolte: number;
    minutiSvolti: number;
    durata: number;
    elencoAttivita: Attivita[];
}

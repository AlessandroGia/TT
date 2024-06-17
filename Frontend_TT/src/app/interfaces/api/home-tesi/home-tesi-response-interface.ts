import { Tesi } from "../../primitive/tesi-interface";

export interface HomeTesiResponse {
    tesi: Tesi;
    ruoloUtente: string;// STUDENTE RELATORE CORRELATORE
} 
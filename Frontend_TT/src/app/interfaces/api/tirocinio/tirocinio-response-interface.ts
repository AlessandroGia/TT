import { Tirocinio } from "../../primitive/tirocinio-interface";

export interface TirocinioCompletamentoResponse {
    oreSvolte: number;
    minutiSvolti: number;
}

export interface TirocinioResponse {
    tirocinio: Tirocinio;
    ruoloUtente: string
}
/*
export interface tirocinioInterniResponse {

}

export interface tirocinioRicerca {

}
*/
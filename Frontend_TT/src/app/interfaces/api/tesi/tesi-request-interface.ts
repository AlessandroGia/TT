export interface TesiTitoloPUTRequest {
    id: number;
    titolo: string;
}

export interface TesiCorrelatoriPUTRequest {
    id: number;
    idCorrelatori: number[];
}

export interface TesiDataDiscussionePUTRequest {
    id: number;
    dataDiscussione: string;
}

export interface TesiStatoPUTRequest {
    id: number;
    statoTesi: string;
}
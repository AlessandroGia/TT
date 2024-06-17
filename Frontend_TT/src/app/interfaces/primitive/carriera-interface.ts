import { Insegnamento } from "./insegnamento-interface";

export interface Carriera {
    nomeCDS: string;
    insegnamenti: Insegnamento[]
}
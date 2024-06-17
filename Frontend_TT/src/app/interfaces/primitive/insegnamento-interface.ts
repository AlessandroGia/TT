import { Utente } from "./utente-interface"

export interface Insegnamento {
    nome: string
    docenti: Utente[];
}
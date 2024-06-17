import { Utente } from "../../primitive/utente-interface"
import { Carriera } from "../../primitive/carriera-interface";

export interface LoginResponse {
    jwt: string;
    utente: Utente;
    carriere: Carriera[];
}
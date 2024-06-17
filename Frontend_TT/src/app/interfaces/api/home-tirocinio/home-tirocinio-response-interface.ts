import { Tirocinio } from "../../primitive/tirocinio-interface";

export interface HomeTirocinioResponse {
    tirocinio: Tirocinio;
    ruoloUtente: string; // STUDENTE TUTOR COLLABORATORE
}
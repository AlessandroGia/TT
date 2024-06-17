export interface NuovaAttivitaPOSTRequest {
    idTirocinio: number;
    data: string;
    orarioEntrata: string;
    orarioUscita: string;
    ore: number;
    minuti: number;
    attivitaSvolta: string;
}
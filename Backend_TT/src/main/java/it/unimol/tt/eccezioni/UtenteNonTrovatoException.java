package it.unimol.tt.eccezioni;

public class UtenteNonTrovatoException extends RuntimeException {
    public UtenteNonTrovatoException(String message) {
        super(message);
    }
}

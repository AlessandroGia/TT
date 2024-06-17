package it.unimol.tt.eccezioni;

public class NomeUtenteDuplicatoException extends RuntimeException {
    public NomeUtenteDuplicatoException(String message) {
        super(message);
    }
}

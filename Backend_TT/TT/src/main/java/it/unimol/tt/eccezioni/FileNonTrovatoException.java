package it.unimol.tt.eccezioni;

public class FileNonTrovatoException extends RuntimeException {
    public FileNonTrovatoException(String message) {
        super(message);
    }
}

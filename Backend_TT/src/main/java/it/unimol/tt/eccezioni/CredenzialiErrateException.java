package it.unimol.tt.eccezioni;

public class CredenzialiErrateException extends RuntimeException {
    public CredenzialiErrateException(String message) {
        super(message);
    }
}

package it.unimol.tt.eccezioni;

public class PermessoNegatoException extends RuntimeException{
    public PermessoNegatoException(String message){
        super(message);
    }
}

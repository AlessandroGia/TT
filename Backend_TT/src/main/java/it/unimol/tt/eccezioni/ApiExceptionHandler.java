package it.unimol.tt.eccezioni;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.UnexpectedTypeException;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZonedDateTime;

@ControllerAdvice
public class ApiExceptionHandler {

    protected final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    @ExceptionHandler(value = {SessioneScadutaException.class})
    protected ResponseEntity<Object> handleApiRequestException(SessioneScadutaException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.FORBIDDEN,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {UtenteNonTrovatoException.class})
    protected ResponseEntity<Object> handleApiRequestException(UtenteNonTrovatoException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.NOT_FOUND,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {CredenzialiErrateException.class})
    protected ResponseEntity<Object> handleApiRequestException(CredenzialiErrateException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.UNAUTHORIZED,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = {ConnessioneException.class})
    protected ResponseEntity<Object> handleApiRequestException(ConnessioneException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.SERVICE_UNAVAILABLE,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(value = {FileGiaPresenteException.class})
    protected ResponseEntity<Object> handleApiRequestException(FileGiaPresenteException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {AttivitaGiaCompletateException.class})
    protected ResponseEntity<Object> handleApiRequestException(AttivitaGiaCompletateException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {FileNonTrovatoException.class})
    protected ResponseEntity<Object> handleApiRequestException(FileNonTrovatoException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.NOT_FOUND,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {UsernameNotFoundException.class})
    protected ResponseEntity<Object> handleApiRequestException(UsernameNotFoundException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.NOT_FOUND,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {PermessoNegatoException.class})
    protected ResponseEntity<Object> handleApiRequestException(PermessoNegatoException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.FORBIDDEN,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {NomeUtenteDuplicatoException.class})
    protected ResponseEntity<Object> handleApiRequestException(NomeUtenteDuplicatoException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {HttpMessageNotReadableException.class})
    protected ResponseEntity<Object> handleApiRequestException(HttpMessageNotReadableException e) {
        ApiException apiException = new ApiException(
                e.getLocalizedMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public ResponseEntity<Object> handleApiRequestException(MethodArgumentNotValidException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {UnexpectedTypeException.class})
    public ResponseEntity<Object> handleApiRequestException(UnexpectedTypeException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {ConstraintViolationException.class})
    public ResponseEntity<Object> handleApiRequestException(ConstraintViolationException e) {
        ApiException apiException = new ApiException(
                e.getMessage(),
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now()
        );
        LOGGER.error(ExceptionUtils.getStackTrace(e));
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }
}

package it.unimol.tt.strumenti;

import org.slf4j.LoggerFactory;

public class Logger {

    private static final org.slf4j.Logger LOG = LoggerFactory.getLogger(Logger.class);

    public static org.slf4j.Logger getLogger() {
        return LOG;
    }
}

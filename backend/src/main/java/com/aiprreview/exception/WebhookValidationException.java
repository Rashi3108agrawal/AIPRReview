package com.aiprreview.exception;

/**
 * Exception thrown when webhook validation fails.
 */
public class WebhookValidationException extends ReviewApplicationException {

    public WebhookValidationException(String message) {
        super(message);
    }

    public WebhookValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}

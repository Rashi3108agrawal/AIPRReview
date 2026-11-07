package com.aiprreview.exception;

/**
 * Base exception for review service failures.
 */
public class ReviewApplicationException extends RuntimeException {

    public ReviewApplicationException(String message) {
        super(message);
    }

    public ReviewApplicationException(String message, Throwable cause) {
        super(message, cause);
    }
}

package org.mym.ksuite.spring.support.handler;

import org.mym.ksuite.controller.response.RestResponse;
import org.mym.ksuite.em.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


/**
 * exception advice
 *
 * @author zhangchao
 */
@RestControllerAdvice
@Slf4j
public class ExceptionHandlerAdvice {


    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<RestResponse> exception(IllegalArgumentException e) {
        log.error(e.getMessage(), e);
        RestResponse resp = new RestResponse(ResultCode.BUSINESS_ERROR.getCode(), e.getMessage());
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(resp);
    }

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<RestResponse> exception(AccessDeniedException e) {
        log.error(e.getMessage(), e);
        RestResponse resp = new RestResponse(ResultCode.BUSINESS_ERROR.getCode(), "Sorry,you are not authorized to perform this operation.");
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(resp);
    }

    @ExceptionHandler({IllegalStateException.class})
    public ResponseEntity<RestResponse> exception(IllegalStateException e) {
        RestResponse resp = new RestResponse(ResultCode.BUSINESS_ERROR.getCode(), e.getMessage());
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(resp);
    }

    @ExceptionHandler({RuntimeException.class})
    public ResponseEntity<RestResponse> exception(RuntimeException e) {
        RestResponse resp = new RestResponse(ResultCode.INTERNAL_SERVER_ERROR.getCode(), e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.APPLICATION_JSON).body(resp);
    }

    @ExceptionHandler({Exception.class})
    public ResponseEntity<RestResponse> exception(Exception e) {
        log.error(e.getMessage(), e);
        RestResponse resp = new RestResponse(ResultCode.INTERNAL_SERVER_ERROR.getCode(), "系统错误，请联系管理员");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.APPLICATION_JSON).body(resp);
    }

    @ExceptionHandler({HttpRequestMethodNotSupportedException.class})
    public ResponseEntity<RestResponse> httpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.error(e.getMessage());
        RestResponse resp = new RestResponse(ResultCode.METHOD_NOT_ALLOWED.getCode(), e.getLocalizedMessage());
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).contentType(MediaType.APPLICATION_JSON).body(resp);
    }

}

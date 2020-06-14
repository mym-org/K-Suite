package org.mym.ksuite.em;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author zhangchao
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    /**
     * Internal Server Error
     */
    INTERNAL_SERVER_ERROR("500"),

    /**
     * Method Not Allowed
     */
    METHOD_NOT_ALLOWED("405"),

    /**
     * BUSINESS ERROR
     */
    BUSINESS_ERROR("99000"),

    /**
     * response ok
     */
    SUCCESS("000000");

    String code;
}

package org.mym.ksuite.controller.response;

import org.mym.ksuite.em.ResultCode;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * common rest response
 *
 * @author zhangchao
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@NoArgsConstructor
public class CommonResponse<T> extends RestResponse {

    /**
     * response payload
     */
    T data;

    public CommonResponse(T t) {
        super(ResultCode.SUCCESS.getCode(), "OK");
        this.data = t;
    }
}

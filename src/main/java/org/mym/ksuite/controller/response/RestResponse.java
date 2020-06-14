package org.mym.ksuite.controller.response;

import org.mym.ksuite.em.ResultCode;
import lombok.*;
import lombok.experimental.FieldDefaults;


/**
 * @author zhangchao
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestResponse {

    String resultCode;

    String resultMessage;

    /**
     * return ok
     *
     * @return
     */
    public static RestResponse ok() {
        return new RestResponse(ResultCode.SUCCESS.name(), "ok");
    }
}

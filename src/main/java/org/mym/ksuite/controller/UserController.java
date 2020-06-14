package org.mym.ksuite.controller;

import org.mym.ksuite.controller.response.CommonResponse;
import org.mym.ksuite.spring.support.security.utils.AuthenticationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * logged account's info
 *
 * @author zhangchao
 */
@RestController
@Slf4j
public class UserController {

    /**
     * get logged account's info
     *
     * @return
     */
    @GetMapping(value = "/api/v1.0.0/kong/suite/user/current", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getCurrentAccount() {
        return new CommonResponse(AuthenticationUtils.getAccountPrincipal());
    }
}

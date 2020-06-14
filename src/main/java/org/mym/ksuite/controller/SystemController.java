package org.mym.ksuite.controller;

import org.mym.ksuite.controller.response.CommonResponse;
import org.mym.ksuite.service.kong.ISystemSv;
import org.mym.ksuite.spring.support.configuration.customized.KongConfig;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * system's info
 *
 * @author zhangchao
 */
@RestController
@Slf4j
public class SystemController {

    @Autowired
    KongConfig kongConfig;

    @Autowired
    ISystemSv systemSv;

    /**
     * retrieve kong's config
     *
     * @return
     */
    @GetMapping(value = "/api/v1.0.0/kong/suite/system", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse retrieveKongConfig() {
        JSONObject data = (JSONObject) JSONObject.toJSON(kongConfig);
        data.put("version", systemSv.getKongVersion());
        return new CommonResponse(data);
    }


    /**
     * retrieve menus
     *
     * @return
     */
    @GetMapping(value = "/api/v1.0.0/kong/suite/menus", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse menus() {
        return new CommonResponse(systemSv.getMenus());
    }


}

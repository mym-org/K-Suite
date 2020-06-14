package org.mym.ksuite.controller;

import org.mym.ksuite.controller.response.CommonResponse;
import org.mym.ksuite.service.kong.IKongEntityModelSv;
import org.mym.ksuite.service.kong.IKongMainPageModelSv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zhangchao
 */
@RestController
public class KongEntityModelController {

    @Autowired
    IKongEntityModelSv kongEntityModelSv;

    @Autowired
    IKongMainPageModelSv kongMainPageModelSv;

    /**
     * get model of entity
     *
     * @param entityName
     * @return
     */
    @GetMapping(value = "/api/v1.0.0/kong/suite/entity/model/{entityName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getEntityModel(@PathVariable("entityName") String entityName) {
        return new CommonResponse(kongEntityModelSv.getEntityModel(entityName));
    }

    /**
     * get model of one page
     *
     * @param entityName
     * @return
     */
    @GetMapping(value = "/api/v1.0.0/kong/suite/page/model/{entityName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getMainPageModel(@PathVariable("entityName") String entityName) {
        return new CommonResponse(kongMainPageModelSv.getMainPageModel(entityName));
    }
}

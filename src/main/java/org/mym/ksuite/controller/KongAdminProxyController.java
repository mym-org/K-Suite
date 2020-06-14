package org.mym.ksuite.controller;

import org.mym.ksuite.controller.domain.PageInfo;
import org.mym.ksuite.controller.request.KongAdminProxyRequest;
import org.mym.ksuite.controller.request.KongEntityPageRequest;
import org.mym.ksuite.controller.response.CommonResponse;
import org.mym.ksuite.service.kong.IKongAdminProxySv;
import org.mym.ksuite.service.kong.IKongEntityPageQuerySv;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


/**
 * kong admin proxy
 *
 * @author zhangchao
 */
@RestController
@Slf4j
public class KongAdminProxyController {

    @Autowired
    IKongAdminProxySv kongAdminProxySv;

    @Autowired
    IKongEntityPageQuerySv kongEntityPageQuerySv;

    /**
     * kong admin's proxy requests
     *
     * @param proxyRequest
     * @return
     */
    @PostMapping(value = "/api/v1.0.0/kong/suite/proxy", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse proxy(@RequestBody KongAdminProxyRequest proxyRequest) {
        JSONObject result = kongAdminProxySv.execute(proxyRequest);
        return new CommonResponse(result);
    }

    /**
     * query page for kong's entity
     *
     * @param proxyRequest
     * @return
     */
    @PostMapping(value = "/api/v1.0.0/kong/suite/proxy/queryForPage", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse proxy(@RequestBody KongEntityPageRequest proxyRequest) {
        PageInfo pageInfo = kongEntityPageQuerySv.queryForPage(proxyRequest);
        return new CommonResponse(pageInfo);
    }
}

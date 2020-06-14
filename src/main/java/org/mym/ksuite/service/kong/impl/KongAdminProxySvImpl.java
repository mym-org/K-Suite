package org.mym.ksuite.service.kong.impl;

import org.mym.ksuite.controller.request.KongAdminProxyRequest;
import org.mym.ksuite.service.kong.IKongAdminApiCallSv;
import org.mym.ksuite.service.kong.IKongAdminProxySv;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class KongAdminProxySvImpl implements IKongAdminProxySv {

    @Autowired
    IKongAdminApiCallSv kongAdminApiCallSv;

    @Override
    public JSONObject execute(KongAdminProxyRequest proxyRequest) {
        Assert.notNull(proxyRequest, "request must be required");
        Assert.hasText(proxyRequest.getAdminApi(), "kong admin api must be required");
        Assert.notNull(proxyRequest.getHttpMethod(), "kong admin http method must be required");
        log.info("exec admin api={},method={}", proxyRequest.getAdminApi(), proxyRequest.getHttpMethod().name());
        JSONObject result = null;
        switch (proxyRequest.getHttpMethod()) {
            case GET:
                result = kongAdminApiCallSv.get(proxyRequest.getAdminApi(), false);
                break;
            case DELETE:
                kongAdminApiCallSv.delete(proxyRequest.getAdminApi());
                break;
            case PUT:
                result = kongAdminApiCallSv.put(proxyRequest.getAdminApi(), proxyRequest.getRequestBody());
                break;
            case POST:
                result = kongAdminApiCallSv.post(proxyRequest.getAdminApi(), proxyRequest.getRequestBody());
                break;
            case PATCH:
                result = kongAdminApiCallSv.patch(proxyRequest.getAdminApi(), proxyRequest.getRequestBody());
                break;
        }
        return result;
    }
}

package org.mym.ksuite.service.kong;

import org.mym.ksuite.controller.request.KongAdminProxyRequest;
import com.alibaba.fastjson.JSONObject;

/**
 * @author zhangchao
 */
public interface IKongAdminProxySv {

    /**
     * proxy request
     *
     * @param proxyRequest
     * @return
     */
    JSONObject execute(KongAdminProxyRequest proxyRequest);
}

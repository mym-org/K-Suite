package org.mym.ksuite.service.kong.payload.process;

import com.alibaba.fastjson.JSONObject;
import org.mym.ksuite.em.KongEntity;
import org.springframework.http.HttpMethod;

/**
 * @author zhangchao
 */
public interface IKongPayloadProcess {

    /**
     * apply to entity
     *
     * @return
     */
    KongEntity apply();

    /**
     * process payload
     *
     * @param httpMethod
     * @param payload
     */
    void process(HttpMethod httpMethod, JSONObject payload);
}

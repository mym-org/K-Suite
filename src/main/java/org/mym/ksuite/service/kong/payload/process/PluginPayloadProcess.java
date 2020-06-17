package org.mym.ksuite.service.kong.payload.process;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.mym.ksuite.em.KongEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class PluginPayloadProcess implements IKongPayloadProcess {

    private static final String CONFIG_ANONYMOUS = "anonymous";

    @Override
    public KongEntity apply() {
        return KongEntity.PLUGINS;
    }

    @Override
    public void process(HttpMethod httpMethod, JSONObject payload) {
        if (payload == null) {
            return;
        }
        if (!payload.containsKey(CONFIG_ANONYMOUS)) {
            return;
        }
        String anonymous = payload.getString(CONFIG_ANONYMOUS);
        if (anonymous != null) {
            return;
        }
        switch (httpMethod) {
            case PATCH:
                payload.put(CONFIG_ANONYMOUS, "");
                break;
            case POST:
                payload.remove(CONFIG_ANONYMOUS);
                break;
        }
        return;

    }
}

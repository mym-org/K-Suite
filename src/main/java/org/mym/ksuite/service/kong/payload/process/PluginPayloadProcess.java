package org.mym.ksuite.service.kong.payload.process;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.service.kong.IKongPluginModelSv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

/**
 * 不同插件在不同Kong版本的config.anonymous 的schema要求各不一样,必须独立处理
 * @author zhangchao
 */
@Service
@Slf4j
public class PluginPayloadProcess implements IKongPayloadProcess {

    private static final String CONFIG = "config";

    private static final String CONFIG_ANONYMOUS = "anonymous";

    private static final String CONFIG_NAME = "name";

    private static final String FIELD_NONE_VALUE = "none_value";

    @Autowired
    IKongPluginModelSv kongPluginModelSv;

    @Override
    public KongEntity apply() {
        return KongEntity.PLUGINS;
    }

    @Override
    public void process(HttpMethod httpMethod, JSONObject payload) {
        if (payload == null) {
            return;
        }
        if (!payload.containsKey(CONFIG)){
            return;
        }
        JSONObject config = payload.getJSONObject(CONFIG);
        if (!config.containsKey(CONFIG_ANONYMOUS)) {
            return;
        }
        String anonymous = config.getString(CONFIG_ANONYMOUS);
        if (anonymous != null) {
            return;
        }
        String name = payload.getString(CONFIG_NAME);
        JSONObject pluginModel = kongPluginModelSv.getPluginModel(name);
        if (pluginModel==null){
            return;
        }
        JSONObject fieldModel = kongPluginModelSv.getPluginField(pluginModel,CONFIG_ANONYMOUS);
        if (fieldModel==null){
            return;
        }
        if (fieldModel.containsKey(FIELD_NONE_VALUE)){
            config.put(CONFIG_ANONYMOUS,fieldModel.get(FIELD_NONE_VALUE));
        }
        return;

    }
}

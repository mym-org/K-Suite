package org.mym.ksuite.service.kong;

import org.mym.ksuite.controller.request.KongPluginsRequest;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.List;


/**
 * @author zhangchao
 */
public interface IKongPluginModelSv {

    /**
     * get plugin's functionality
     *
     * @return
     */
    JSONArray getFunctions();

    /**
     * get  plugins
     *
     * @param request
     * @return
     */
    List<JSONObject> getPlugins(KongPluginsRequest request);

    /**
     * get plugin's ui model
     *
     * @param pluginName
     * @return
     */
    JSONObject getPluginModel(String pluginName);

    /**
     * get field of model
     *
     * @param model
     * @param fieldName
     * @return
     */
    JSONObject getPluginField(JSONObject model, String fieldName);
}

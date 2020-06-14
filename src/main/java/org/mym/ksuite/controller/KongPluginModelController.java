package org.mym.ksuite.controller;

import org.mym.ksuite.controller.request.KongPluginsRequest;
import org.mym.ksuite.controller.response.CommonResponse;
import org.mym.ksuite.service.kong.IKongPluginModelSv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;


/**
 * @author zhangchao
 */
@RestController
public class KongPluginModelController {

    @Autowired
    IKongPluginModelSv kongPluginSv;

    /**
     * get plugin's functionality
     *
     * @return
     */
    @GetMapping(value = "/api/v1.0.0/kong/suite/plugin/functionality/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getPluginFunctionality() {
        return new CommonResponse(kongPluginSv.getFunctions());
    }

    /**
     * get plugins
     *
     * @param request
     * @return
     */
    @PostMapping(value = "/api/v1.0.0/kong/suite/plugin/list", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getPlugins(@RequestBody KongPluginsRequest request) {
        return new CommonResponse(kongPluginSv.getPlugins(request));
    }


    /**
     * get plugin's model
     *
     * @param pluginName
     * @return
     */
    @GetMapping(value = "/api/v1.0.0/kong/suite/plugin/model/{pluginName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getPluginModel(@PathVariable("pluginName") String pluginName) {
        return new CommonResponse(kongPluginSv.getPluginModel(pluginName));
    }
}

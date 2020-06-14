package org.mym.ksuite.service.kong.impl;

import org.mym.ksuite.controller.request.KongAdminProxyRequest;
import org.mym.ksuite.service.kong.IKongAdminProxySv;
import org.mym.ksuite.service.kong.ISystemSv;
import org.mym.ksuite.utils.MatchUtils;
import org.mym.ksuite.spring.support.initialize.IAfterStartedExecutor;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.parser.Feature;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class SystemSvImpl implements ISystemSv, IAfterStartedExecutor {

    private static JSONArray MENUS;

    @Autowired
    IKongAdminProxySv kongAdminProxySv;

    @Value(value = "classpath:model/menu.json")
    private Resource resource;

    @Override
    public String getKongVersion() {
        KongAdminProxyRequest proxyRequest = new KongAdminProxyRequest();
        proxyRequest.setAdminApi("/");
        proxyRequest.setHttpMethod(HttpMethod.GET);
        JSONObject data = kongAdminProxySv.execute(proxyRequest);
        return data.getString("version");
    }

    @Override
    public List<JSONObject> getMenus() {
        String kongVersion = this.getKongVersion();
        if (MENUS == null) {
            return null;
        }
        return MENUS.stream().filter(o -> {
            JSONObject menu = (JSONObject) o;
            if (MatchUtils.matchPluginKongVersions(menu, kongVersion)) {
                return true;
            }
            return false;
        }).map(o -> (JSONObject) o).collect(Collectors.toList());
    }

    @SneakyThrows
    @Override
    public void load() {
        MENUS = JSONArray.parseObject(resource.getInputStream(), JSONArray.class, Feature.AllowArbitraryCommas);
    }
}

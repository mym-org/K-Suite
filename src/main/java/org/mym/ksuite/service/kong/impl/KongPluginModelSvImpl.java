package org.mym.ksuite.service.kong.impl;

import org.mym.ksuite.controller.request.KongPluginsRequest;
import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.service.kong.IKongAdminApiCallSv;
import org.mym.ksuite.service.kong.IKongPluginModelSv;
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
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class KongPluginModelSvImpl implements IKongPluginModelSv, IAfterStartedExecutor {

    private static Map<String, List<JSONObject>> PLUGIN_MODELS = new ConcurrentHashMap<>();

    private JSONArray PLUGIN_FUNCTIONAL_LIST;

    @Autowired
    ISystemSv systemSv;

    @Value(value = "classpath:model/functionality.json")
    private Resource functionalityResource;

    @Autowired
    IKongAdminApiCallSv kongAdminApiCallSv;

    @SneakyThrows
    @Override
    public void load() {
        this.loadPluginModels();
        this.loadPluginFunctionality();
    }

    @Override
    public JSONArray getFunctions() {
        return PLUGIN_FUNCTIONAL_LIST;
    }

    @Override
    public List<JSONObject> getPlugins(KongPluginsRequest request) {
        String kongVersion = systemSv.getKongVersion();
        Set<String> bindPlugins = this.getEntityPlugins(request.getScope(), request.getId());
        List<JSONObject> plugins = PLUGIN_MODELS.values().stream().flatMap(c -> c.stream()).filter(p -> {
            if (StringUtils.isEmpty(request.getFunctionality())) {
                return true;
            }
            return Objects.equals(p.getString("functionality"), request.getFunctionality());
        }).filter(p -> MatchUtils.matchPluginKongVersions(p, kongVersion))
                .filter(p -> {
                    if (request.getScope() == KongEntity.CONSUMERS) {
                        Boolean noConsumer = p.getBoolean("no_consumer");
                        return noConsumer == null || noConsumer == false;
                    }
                    return true;
                }).filter(p -> !this.checkEntityPluginExists(bindPlugins, p)).map(p -> {
                    JSONObject c = new JSONObject();
                    c.putAll(p);
                    c.fluentRemove("fields");
                    return c;
                }).collect(Collectors.toList());
        return plugins;
    }


    @Override
    public JSONObject getPluginModel(String pluginName) {
        Assert.hasText(pluginName, "plugin name must be required");
        String kongVersion = systemSv.getKongVersion();
        List<JSONObject> plugins = PLUGIN_MODELS.get(pluginName);
        if (CollectionUtils.isEmpty(plugins)) {
            return null;
        }
        return plugins.stream().filter(p -> MatchUtils.matchPluginKongVersions(p, kongVersion)).findFirst().orElse(null);
    }

    @Override
    public JSONObject getPluginField(JSONObject model, String fieldName) {
        if (model == null || fieldName == null) {
            return null;
        }
        JSONArray fields = model.getJSONArray("fields");
        if (CollectionUtils.isEmpty(fields)) {
            return null;
        }
        for (int i = 0; i < fields.size(); i++) {
            JSONObject filed = fields.getJSONObject(i);
            if (Objects.equals(fieldName, filed.getString("name"))) {
                return filed;
            }
        }
        return null;
    }

    /**
     * load plugin's functionality
     *
     * @throws IOException
     */
    private void loadPluginFunctionality() throws IOException {
        PLUGIN_FUNCTIONAL_LIST = JSONArray.parseObject(functionalityResource.getInputStream(), JSONArray.class, Feature.AllowArbitraryCommas);
    }

    /***
     * load ui model's config of plugin
     */
    private void loadPluginModels() throws IOException {
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:model/plugins/**/*.json");
        List<JSONObject> all = new ArrayList<>();
        for (Resource resource : resources) {
            JSONObject model = JSONObject.parseObject(resource.getInputStream(), JSONObject.class, Feature.AllowArbitraryCommas);
            all.add(model);
        }
        PLUGIN_MODELS = all.stream().collect(Collectors.groupingBy(p -> p.getString("name"), Collectors.toList()));
    }


    /**
     * get entity's binding plugins
     *
     * @param kongEntity
     * @param id
     * @return
     */
    private Set<String> getEntityPlugins(KongEntity kongEntity, String id) {
        String api;
        if (kongEntity == null) {
            api = "/plugins";
        } else {
            Assert.hasText(id, "entity's id must be required");
            api = String.join("", "/", kongEntity.name().toLowerCase(), "/", id, "/plugins");
        }
        JSONArray data = kongAdminApiCallSv.listAll(api);
        Set<String> c = new HashSet<>();
        for (int i = 0; i < data.size(); i++) {
            JSONObject d = data.getJSONObject(i);
            String name = d.getString("name");
            c.add(name);
        }
        return c;
    }

    /**
     * check entity's plugin exists
     *
     * @param bindPlugins
     * @param plugin
     * @return
     */
    private boolean checkEntityPluginExists(Set<String> bindPlugins, JSONObject plugin) {
        if (CollectionUtils.isEmpty(bindPlugins)) {
            return false;
        }
        String name = plugin.getString("name");
        return bindPlugins.contains(name);
    }
}

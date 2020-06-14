package org.mym.ksuite.service.kong.impl;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.parser.Feature;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.mym.ksuite.service.kong.IKongMainPageModelSv;
import org.mym.ksuite.service.kong.ISystemSv;
import org.mym.ksuite.spring.support.initialize.IAfterStartedExecutor;
import org.mym.ksuite.utils.MatchUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class KongMainPageModelSvImpl implements IKongMainPageModelSv, IAfterStartedExecutor {

    private static Map<String, List<JSONObject>> MAIN_PAGE_MODELS = new ConcurrentHashMap<>();

    @Autowired
    ISystemSv systemSv;

    @SneakyThrows
    @Override
    public void load() {
        this.loadMainPageModels();
    }

    /**
     * load  models of entities
     *
     * @throws IOException
     */
    private void loadMainPageModels() throws IOException {
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:model/page/**/*.json");
        List<JSONObject> all = new ArrayList<>(10);
        for (Resource resource : resources) {
            JSONObject model = JSONObject.parseObject(resource.getInputStream(), JSONObject.class, Feature.AllowArbitraryCommas);
            all.add(model);
        }
        MAIN_PAGE_MODELS = all.stream().collect(Collectors.groupingBy(p -> p.getString("name"), Collectors.toList()));
    }

    @Override
    public JSONObject getMainPageModel(String entityName) {
        Assert.hasText(entityName, "entity'name must be required");
        Assert.isTrue(MAIN_PAGE_MODELS.containsKey(entityName), String.format("%s's main-page model not exists", entityName));
        List<JSONObject> models = MAIN_PAGE_MODELS.get(entityName);
        if (CollectionUtils.isEmpty(models)) {
            return null;
        }
        String kongVersion = systemSv.getKongVersion();
        JSONObject data = models.stream().filter(p -> MatchUtils.matchPluginKongVersions(p, kongVersion)).findFirst().orElse(null);
        Assert.notNull(data, String.format("%s's main-page model for kong.version=[%s] not exists", entityName, kongVersion));
        return data;
    }
}

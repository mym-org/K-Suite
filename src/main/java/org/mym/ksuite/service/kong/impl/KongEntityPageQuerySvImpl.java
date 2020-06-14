package org.mym.ksuite.service.kong.impl;

import org.mym.ksuite.controller.domain.PageInfo;
import org.mym.ksuite.controller.request.KongEntityPageRequest;
import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.service.kong.IKongAdminApiCallSv;
import org.mym.ksuite.service.kong.IKongEntityPageQuerySv;
import org.mym.ksuite.service.kong.query.process.IKongEntityQueryProcess;
import org.mym.ksuite.service.kong.query.process.KongEntityQueryProcessFactory;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class KongEntityPageQuerySvImpl implements IKongEntityPageQuerySv {

    @Autowired
    IKongAdminApiCallSv kongAdminApiCallSv;

    @Override
    public PageInfo queryForPage(KongEntityPageRequest request) {
        int pageNo = Optional.ofNullable(request.getPageNo()).orElse(1);
        int pageSize = Optional.ofNullable(request.getPageSize()).orElse(50);
        JSONArray data = kongAdminApiCallSv.listAll(request.getAdminApi());
        List<Object> results = data.stream().sorted(Comparator.comparing(obj -> this.getSortValue((JSONObject) obj, request.getSearchTarget())).reversed()).filter(o -> this.filter((JSONObject) o, request.getKeywords(), request.getSearchTarget())).collect(Collectors.toList());
        PageInfo pageInfo = new PageInfo();
        pageInfo.setPageNo(request.getPageNo());
        pageInfo.setPageSize(request.getPageSize());
        pageInfo.setCount(results.size());
        pageInfo.setResults(results.stream().skip((pageNo - 1) * pageSize).limit(pageSize).collect(Collectors.toList()));
        return pageInfo;
    }

    /**
     * filter entity
     *
     * @param entity
     * @param keywords
     * @param kongEntity
     * @return
     */
    private boolean filter(JSONObject entity, String keywords, KongEntity kongEntity) {
        if (StringUtils.isEmpty(keywords)) {
            return true;
        }
        if (entity == null) {
            return false;
        }
        return this.getQueryProcess(kongEntity).filter(keywords, entity);
    }

    /**
     * get sort filed's value
     *
     * @param entity
     * @param kongEntity
     * @return
     */
    private String getSortValue(JSONObject entity, KongEntity kongEntity) {
        String value = this.getQueryProcess(kongEntity).getSortValue(entity);
        return Optional.ofNullable(value).orElse("");
    }

    /**
     * get kong entity query process
     *
     * @param kongEntity
     * @return
     */
    private IKongEntityQueryProcess getQueryProcess(KongEntity kongEntity) {
        if (kongEntity == null) {
            kongEntity = KongEntity.DEFAULTS;
        }
        IKongEntityQueryProcess process = KongEntityQueryProcessFactory.getInstance(kongEntity);
        if (process == null) {
            process = KongEntityQueryProcessFactory.getInstance(KongEntity.DEFAULTS);
        }
        return process;
    }
}

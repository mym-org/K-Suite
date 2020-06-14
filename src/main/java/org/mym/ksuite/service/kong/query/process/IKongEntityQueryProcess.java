package org.mym.ksuite.service.kong.query.process;

import org.mym.ksuite.em.KongEntity;
import com.alibaba.fastjson.JSONObject;

import java.util.Optional;

/**
 * filter
 *
 * @author zhangchao
 */
public interface IKongEntityQueryProcess {

    /**
     * 适用那个kong entity
     *
     * @return
     */
    KongEntity apply();

    /**
     * 匹配关键字
     *
     * @param keywords
     * @param entity
     * @return
     */
    boolean filter(String keywords, JSONObject entity);

    /**
     * 获取排序字段的值
     *
     * @param entity
     * @return
     */
    default String getSortValue(JSONObject entity) {
        String createdAt = "created_at";
        if (entity.containsKey(createdAt)) {
            return entity.getLong(createdAt).toString();
        }
        return Optional.ofNullable(entity).map(e -> e.getString("id")).orElse(null);
    }
}

package org.mym.ksuite.service.kong.query.process;

import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.utils.MatchUtils;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class TagsQueryProcess implements IKongEntityQueryProcess {
    @Override
    public KongEntity apply() {
        return KongEntity.TAGS;
    }

    @Override
    public boolean filter(String keywords, JSONObject entity) {
        return MatchUtils.contains(entity.getString("tag"), keywords)
                || Objects.equals(entity.getString("entity_name"), keywords);
    }

    @Override
    public String getSortValue(JSONObject entity) {
        return Optional.ofNullable(entity).map(e -> e.getString("tag")).orElse(null);
    }
}

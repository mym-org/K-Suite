package org.mym.ksuite.service.kong.query.process;

import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.utils.MatchUtils;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author zhangchao
 */
@Service
public class TargetsQueryProcess implements IKongEntityQueryProcess {

    @Override
    public KongEntity apply() {
        return KongEntity.TARGETS;
    }

    @Override
    public boolean filter(String keywords, JSONObject entity) {
        return MatchUtils.contains(entity.getString("target"), keywords);
    }

    @Override
    public String getSortValue(JSONObject entity) {
        return Optional.ofNullable(entity).map(e -> e.getString("id")).orElse(null);
    }
}

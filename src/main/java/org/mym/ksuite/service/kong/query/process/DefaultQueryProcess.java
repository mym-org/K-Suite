package org.mym.ksuite.service.kong.query.process;

import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.utils.MatchUtils;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Service;

/**
 * entity's default filter
 *
 * @author zhangchao
 */
@Service
public class DefaultQueryProcess implements IKongEntityQueryProcess {

    @Override
    public KongEntity apply() {
        return KongEntity.DEFAULTS;
    }

    @Override
    public boolean filter(String keywords, JSONObject entity) {
        return MatchUtils.contains(entity.getString("name"), keywords);
    }
}

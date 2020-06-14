package org.mym.ksuite.service.kong.query.process;

import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.utils.MatchUtils;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Service;

/**
 * @author zhangchao
 */
@Service
public class ConsumersQueryProcess implements IKongEntityQueryProcess {

    @Override
    public KongEntity apply() {
        return KongEntity.CONSUMERS;
    }

    @Override
    public boolean filter(String keywords, JSONObject entity) {
        return MatchUtils.contains(entity.getString("username"), keywords)
                || MatchUtils.contains(entity.getString("custom_id"), keywords)
                || MatchUtils.filterByArrayField(entity,"tags", keywords);
    }
}

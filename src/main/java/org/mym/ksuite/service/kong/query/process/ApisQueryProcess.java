package org.mym.ksuite.service.kong.query.process;

import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.utils.MatchUtils;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Service;

/**
 * @author zhangchao
 */
@Service
public class ApisQueryProcess implements IKongEntityQueryProcess {

    @Override
    public KongEntity apply() {
        return KongEntity.APIS;
    }

    @Override
    public boolean filter(String keywords, JSONObject entity) {
        return MatchUtils.contains(entity.getString("name"), keywords)
                || MatchUtils.contains(entity.getString("upstream_url"), keywords)
                || MatchUtils.contains(entity.getString("id"), keywords)
                || MatchUtils.filterByArrayField(entity, "uris", keywords)
                || MatchUtils.filterByArrayField(entity, "hosts", keywords);
    }
}

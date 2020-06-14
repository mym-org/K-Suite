package org.mym.ksuite.service.kong.query.process;

import com.alibaba.fastjson.JSONObject;
import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.utils.MatchUtils;
import org.springframework.stereotype.Service;

/**
 * @author zhangchao
 */
@Service
public class CertificatesQueryProcess implements IKongEntityQueryProcess {

    @Override
    public KongEntity apply() {
        return KongEntity.CERTIFICATES;
    }

    @Override
    public boolean filter(String keywords, JSONObject entity) {
        return MatchUtils.filterByArrayField(entity, "tags", keywords)
                || MatchUtils.filterByArrayField(entity, "snis", keywords)
                || MatchUtils.contains(entity.getString("id"), keywords);
    }
}

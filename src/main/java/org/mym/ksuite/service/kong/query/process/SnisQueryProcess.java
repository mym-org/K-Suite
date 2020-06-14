package org.mym.ksuite.service.kong.query.process;

import com.alibaba.fastjson.JSONObject;
import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.utils.MatchUtils;
import org.springframework.stereotype.Service;

/**
 * @author zhangchao
 */
@Service
public class SnisQueryProcess implements IKongEntityQueryProcess {
    @Override
    public KongEntity apply() {
        return KongEntity.SNIS;
    }

    @Override
    public boolean filter(String keywords, JSONObject entity) {
        return MatchUtils.contains(entity.getString("name"), keywords)
                ||  MatchUtils.filterByArrayField(entity,"tags", keywords);
    }

}

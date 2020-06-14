package org.mym.ksuite.service.kong.query.process;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.utils.MatchUtils;
import org.springframework.stereotype.Service;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class BasicAuthQueryProcess implements IKongEntityQueryProcess {
    @Override
    public KongEntity apply() {
        return KongEntity.BASIC_AUTH;
    }

    @Override
    public boolean filter(String keywords, JSONObject entity) {
        return MatchUtils.contains(entity.getString("username"), keywords);
    }
}

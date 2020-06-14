package org.mym.ksuite.service.kong.query.process;

import org.mym.ksuite.em.KongEntity;
import org.mym.ksuite.utils.MatchUtils;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class AclsQueryProcess implements IKongEntityQueryProcess {
    @Override
    public KongEntity apply() {
        return KongEntity.ACLS;
    }

    @Override
    public boolean filter(String keywords, JSONObject entity) {
        return MatchUtils.contains(entity.getString("group"), keywords);
    }
}

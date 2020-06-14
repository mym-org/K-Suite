package org.mym.ksuite.service.kong.query.process;

import org.mym.ksuite.em.KongEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * filter factory
 *
 * @author zhangchao
 */
@Service
public class KongEntityQueryProcessFactory {

    private static Map<KongEntity, IKongEntityQueryProcess> m = new ConcurrentHashMap<>();

    @Autowired
    public KongEntityQueryProcessFactory(Map<String, IKongEntityQueryProcess> map) {
        m.clear();
        for (String beanId : map.keySet()) {
            IKongEntityQueryProcess filter = map.get(beanId);
            m.put(filter.apply(), filter);
        }
    }

    /**
     * get instance
     *
     * @param kongEntity
     * @return
     */
    public static IKongEntityQueryProcess getInstance(KongEntity kongEntity) {
        Assert.notNull(kongEntity, "kongEntity must be required");
        IKongEntityQueryProcess filter = m.get(kongEntity);
        return filter;
    }
}

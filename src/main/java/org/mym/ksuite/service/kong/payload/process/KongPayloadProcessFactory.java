package org.mym.ksuite.service.kong.payload.process;

import lombok.extern.slf4j.Slf4j;
import org.mym.ksuite.em.KongEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class KongPayloadProcessFactory {

    private static Map<KongEntity, IKongPayloadProcess> m = new ConcurrentHashMap<>();

    @Autowired
    public KongPayloadProcessFactory(Map<String, IKongPayloadProcess> map) {
        m.clear();
        for (String beanId : map.keySet()) {
            IKongPayloadProcess process = map.get(beanId);
            m.put(process.apply(), process);
        }
    }

    /**
     * get instance
     *
     * @param kongEntity
     * @return
     */
    public static IKongPayloadProcess getInstance(KongEntity kongEntity) {
        Assert.notNull(kongEntity, "kongEntity must be required");
        IKongPayloadProcess process = m.get(kongEntity);
        return process;
    }
}

package org.mym.ksuite.service.kong;

import com.alibaba.fastjson.JSONObject;

/**
 * @author zhangchao
 */
public interface IKongEntityModelSv {

    /**
     * get model of entity
     *
     * @param kongEntity
     * @return
     */
    JSONObject getEntityModel(String kongEntity);
}

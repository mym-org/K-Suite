package org.mym.ksuite.service.kong;

import com.alibaba.fastjson.JSONObject;

/**
 * @author zhangchao
 */
public interface IKongMainPageModelSv {

    /**
     * get page model
     *
     * @param entityName
     * @return
     */
    JSONObject getMainPageModel(String entityName);
}

package org.mym.ksuite.service.kong;

import com.alibaba.fastjson.JSONObject;

import java.util.List;

/**
 * k-suite系统服务
 *
 * @author zhangchao
 */
public interface ISystemSv {

    /**
     * 获取当前管理的kong's version
     *
     * @return
     */
    String getKongVersion();

    /**
     * get menus
     *
     * @return
     */
    List<JSONObject> getMenus();
}

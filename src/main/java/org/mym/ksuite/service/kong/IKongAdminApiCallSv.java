package org.mym.ksuite.service.kong;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * kong admin api
 *
 * @author zhangchao
 */
public interface IKongAdminApiCallSv {

    /**
     * list all entities
     *
     * @param path
     * @return
     */
    JSONArray listAll(String path);

    /**
     * add an entity
     *
     * @param path
     * @param payload
     * @return
     */
    JSONObject post(String path, JSONObject payload);

    /**
     * get
     *
     * @param path
     * @param full
     * @return
     */
    JSONObject get(String path, boolean full);

    /**
     * modify an entity
     *
     * @param path
     * @param payload
     * @return
     */
    JSONObject patch(String path, JSONObject payload);

    /**
     * create or update an entity
     *
     * @param path
     * @param payload
     * @return
     */
    JSONObject put(String path, JSONObject payload);


    /**
     * delete an entity
     *
     * @param path
     */
    void delete(String path);


}

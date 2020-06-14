package org.mym.ksuite.controller.request;


import com.alibaba.fastjson.JSONObject;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpMethod;

/**
 * @author zhangchao
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@NoArgsConstructor
public class KongAdminProxyRequest {

    /**
     * kong admin api
     */
    String adminApi;

    /**
     * http method
     */
    HttpMethod httpMethod;

    /**
     * request body
     */
    JSONObject requestBody;
}

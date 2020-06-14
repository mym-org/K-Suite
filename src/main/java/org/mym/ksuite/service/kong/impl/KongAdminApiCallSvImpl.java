package org.mym.ksuite.service.kong.impl;

import com.alibaba.fastjson.serializer.SerializerFeature;
import org.mym.ksuite.service.kong.IKongAdminApiCallSv;
import org.mym.ksuite.utils.OkHttpCliGen;
import org.mym.ksuite.spring.support.configuration.customized.KongConfig;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


/**
 * call admin api
 *
 * @author zhangchao
 */
@Service
@Slf4j
public class KongAdminApiCallSvImpl implements IKongAdminApiCallSv {

    private static final String URL_SUFFIX = "/";

    @Autowired
    KongConfig kongConfig;

    @Override
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
    public JSONArray listAll(String path) {
        JSONObject response = this.get(path, false);
        JSONArray array = response.getJSONArray("data");
        String offset = response.getString("offset");
        while (StringUtils.hasText(offset)) {
            response = this.get(String.join("", path, "?", "offset=", offset), false);
            offset = response.getString("offset");
            array.addAll(response.getJSONArray("data"));
        }
        return array;
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public JSONObject post(String path, JSONObject payload) {
        if (payload == null) {
            payload = new JSONObject();
        }
        String body = JSONObject.toJSONString(payload, SerializerFeature.WriteNullStringAsEmpty, SerializerFeature.WriteNullListAsEmpty);
        RequestBody requestBody = RequestBody.create(okhttp3.MediaType.parse(MediaType.APPLICATION_JSON_VALUE), body);
        Request request = new Request.Builder().addHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE).post(requestBody).url(this.buildAdminApi(path)).build();
        return this.call(request);
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
    public JSONObject get(String path, boolean full) {
        Request request = new Request.Builder().addHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE).get().url(full ? path : this.buildAdminApi(path)).build();
        return this.call(request);
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public JSONObject patch(String path, JSONObject payload) {
        Assert.notNull(payload, "patch data must be required");
        String body = JSONObject.toJSONString(payload, SerializerFeature.WriteNullStringAsEmpty, SerializerFeature.WriteNullListAsEmpty);
        RequestBody requestBody = RequestBody.create(okhttp3.MediaType.parse(MediaType.APPLICATION_JSON_VALUE), body);
        Request request = new Request.Builder().addHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE).patch(requestBody).url(this.buildAdminApi(path)).build();
        return this.call(request);

    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public JSONObject put(String path, JSONObject payload) {
        Assert.notNull(payload, "put data must be required");
        String body = JSONObject.toJSONString(payload, SerializerFeature.WriteNullStringAsEmpty, SerializerFeature.WriteNullListAsEmpty);
        RequestBody requestBody = RequestBody.create(okhttp3.MediaType.parse(MediaType.APPLICATION_JSON_VALUE), body);
        Request request = new Request.Builder().addHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE).put(requestBody).url(this.buildAdminApi(path)).build();
        return this.call(request);

    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public void delete(String path) {
        Request request = new Request.Builder().addHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE).delete().url(this.buildAdminApi(path)).build();
        this.call(request);
    }


    /**
     * execute call api
     *
     * @param request
     * @return
     */
    private JSONObject call(Request request) {
        Assert.notNull(request, "request must be required");
        Response response = null;
        String result = null;
        try {
            response = OkHttpCliGen.OKHTTP.getClient().newCall(request).execute();
            result = response.body().string();
        } catch (Exception e) {
            log.error("An error happened when called kong admin api[{}]", request.url().fragment(), e);
            throw new RuntimeException(String.format("An error happened when called kong admin api[%s]", request.url().fragment()));
        } finally {
            if (!response.isSuccessful()) {
                String message = response.message();
                JSONObject data = JSONObject.parseObject(result);
                String errors = this.acquireErrors(data);
                Assert.isTrue(response.isSuccessful(), String.join("=>", message, errors));
            }
            try {
                if (response != null) {
                    response.close();
                }
            } catch (Exception ex) {
                log.error("close response error", ex);
            }

        }
        if (StringUtils.hasText(result)) {
            JSONObject data = JSONObject.parseObject(result);
            Assert.isTrue(!data.containsKey("message"), data.getString("message"));
            return JSON.parseObject(result);
        } else {
            return null;
        }
    }

    /**
     * get full admin api
     *
     * @param path
     * @return
     */
    private String buildAdminApi(String path) {
        Assert.hasText(kongConfig.getAdmin_endpoint(), "kong admin endpoint must be configured");
        if (StringUtils.isEmpty(path)) {
            return kongConfig.getAdmin_endpoint();
        }
        if (path.startsWith(URL_SUFFIX)) {
            return String.join("", kongConfig.getAdmin_endpoint(), path);
        } else {
            return String.join("", kongConfig.getAdmin_endpoint(), URL_SUFFIX, path);
        }

    }

    /**
     * acquire kong's errors
     *
     * @param error
     * @return
     */
    private String acquireErrors(JSONObject error) {
        if (error == null) {
            return null;
        }
        List<String> errors = new ArrayList<>(10);
        for (String key : error.keySet()) {
            if (error.get(key) instanceof String) {
                String e = error.getString(key);
                if (StringUtils.hasText(e)) {
                    errors.add(key + ":" + e);
                }
            }
        }
        return errors.stream().collect(Collectors.joining(","));
    }
}

package org.mym.ksuite.utils;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * object matcher
 *
 * @author zhangchao
 */
public final class MatchUtils {

    /**
     * 验证是否匹配Kong.version
     *
     * @param model
     * @param kongVersion
     * @return
     */
    public static boolean matchPluginKongVersions(JSONObject model, String kongVersion) {
        Assert.hasText(kongVersion, "kongVersion must be required");
        List<String> supportKongVersions = getSupportKongVersions(model);
        if (CollectionUtils.isEmpty(supportKongVersions)) {
            return true;
        }
        for (String supportVersion : supportKongVersions) {
            if (kongVersion.startsWith(supportVersion) || kongVersion.equals(supportVersion)) {
                return true;
            }
        }
        return false;
    }


    /**
     * get supportKongVersions of model
     *
     * @param model
     * @return
     */
    private static List<String> getSupportKongVersions(JSONObject model) {
        if (model == null) {
            return null;
        }
        JSONArray d = model.getJSONArray("supportKongVersions");
        if (d == null) {
            return null;
        }
        List<String> supportKongVersions = d.toJavaList(String.class);
        return supportKongVersions;
    }

    /**
     * string match
     *
     * @param source
     * @param matcher
     * @return
     */
    public static boolean contains(String source, String matcher) {
        if (StringUtils.isEmpty(source)) {
            return false;
        }
        if (StringUtils.isEmpty(matcher)) {
            return false;
        }
        return source.trim().toLowerCase().contains(matcher.trim().toLowerCase());
    }

    /**
     * filter by tags
     *
     * @param entity
     * @param field
     * @param matcher
     * @return
     */
    public static boolean filterByArrayField(JSONObject entity, String field, String matcher) {
        if (!entity.containsKey(field)) {
            return false;
        }
        Object object = entity.get(field);
        if (object instanceof JSONObject) {
            String e = entity.getString(field);
            return contains(e, matcher);
        } else if (object instanceof JSONArray) {
            List<String> tags = entity.getJSONArray(field).toJavaList(String.class);
            if (CollectionUtils.isEmpty(tags)) {
                return false;
            }
            return tags.stream().filter(t -> contains(t, matcher)).findAny().isPresent();
        }
        return false;
    }
}

package org.mym.ksuite.controller.request;

import org.mym.ksuite.em.KongEntity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * query page for entity
 *
 * @author zhangchao
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@NoArgsConstructor
public class KongPluginsRequest {

    /**
     * 作用目标对象
     */
    KongEntity scope;

    /**
     * 对象id
     */
    String id;

    /**
     * 插件分类
     */
    String functionality;


}

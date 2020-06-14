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
public class KongEntityPageRequest {

    /**
     * admin api
     */
    String adminApi;

    /**
     * search target entity
     */
    KongEntity searchTarget;

    /**
     * pageSize
     */
    int pageSize;

    /**
     * page no
     */
    int pageNo;

    /**
     * keywords
     */
    String keywords;
}

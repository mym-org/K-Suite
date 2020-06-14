package org.mym.ksuite.service.kong;

import org.mym.ksuite.controller.domain.PageInfo;
import org.mym.ksuite.controller.request.KongEntityPageRequest;


/**
 * query kong's entity for page
 * @author zhangchao
 */
public interface IKongEntityPageQuerySv {


    /**
     * query kong's entity for page
     *
     * @param request
     * @return
     */
    PageInfo queryForPage(KongEntityPageRequest request);
}

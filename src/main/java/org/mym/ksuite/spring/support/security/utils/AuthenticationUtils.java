package org.mym.ksuite.spring.support.security.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.Assert;

/**
 * @author zhangchao
 */
public final class AuthenticationUtils {

    /**
     * 获取当前登录用户的信息
     *
     * @return
     */
    public static final Object getAccountPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Assert.notNull(authentication, "Login timeout or not logged, please login again");
        return authentication.getPrincipal();
    }
}

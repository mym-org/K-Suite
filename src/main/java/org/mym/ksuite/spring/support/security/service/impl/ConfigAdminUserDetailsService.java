package org.mym.ksuite.spring.support.security.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.parser.Feature;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.mym.ksuite.spring.support.configuration.customized.SuiteConfig;
import org.mym.ksuite.spring.support.initialize.IAfterStartedExecutor;
import org.mym.ksuite.spring.support.security.principal.AccountPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author zhangchao
 */
@Service
@Slf4j
public class ConfigAdminUserDetailsService implements IAfterStartedExecutor, UserDetailsService {

    /**
     * users
     */
    private static List<AccountPrincipal> LOCAL_USERS;

    @Autowired
    SuiteConfig suiteConfig;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("username={}", username);
        Map<String, AccountPrincipal> m = this.getLocalUsers();
        Assert.notEmpty(m, "You are not allowed");
        Assert.isTrue(m.containsKey(username), "You are not allowed");
        return m.get(username);
    }

    /**
     * get local users
     *
     * @return
     */
    private Map<String, AccountPrincipal> getLocalUsers() {
        if (CollectionUtils.isEmpty(LOCAL_USERS)) {
            return Collections.EMPTY_MAP;
        }
        return LOCAL_USERS.stream().collect(Collectors.groupingBy(AccountPrincipal::getUsername, Collectors.collectingAndThen(Collectors.toList(), c -> c.get(0))));

    }

    /**
     * load all local users
     */
    private void mapToLocalUsers() {
        List<AccountPrincipal> localUsers = new ArrayList<>();

        try {
            List<AccountPrincipal> c = this.mapToLocalUsersByFile();
            localUsers.addAll(c);
        } catch (Exception ex) {
            log.error("An error happened when loading local users from file={}", suiteConfig.getLocal_users_file());
        }

        localUsers.addAll(this.mapToLocalUsersByVar());

        LOCAL_USERS = localUsers;

    }

    /**
     * map users
     *
     * @return
     */
    @SneakyThrows
    public List<AccountPrincipal> mapToLocalUsersByFile() {
        if (StringUtils.isEmpty(suiteConfig.getLocal_users_file())) {
            return Collections.EMPTY_LIST;
        }
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource resource = resolver.getResource(suiteConfig.getLocal_users_file());
        JSONArray data = JSONArray.parseObject(resource.getInputStream(), JSONArray.class, Feature.AllowArbitraryCommas);
        if (CollectionUtils.isEmpty(data)) {
            return Collections.EMPTY_LIST;
        }
        return data.toJavaList(AccountPrincipal.class);
    }

    /**
     * map users
     *
     * @return
     */
    public List<AccountPrincipal> mapToLocalUsersByVar() {
        List<AccountPrincipal> c = new ArrayList<>();
        if (!CollectionUtils.isEmpty(suiteConfig.getLocal_users())) {
            for (String userConf : suiteConfig.getLocal_users()) {
                String[] arr = userConf.split("##");
                if (arr.length == 0) {
                    continue;
                }
                AccountPrincipal accountPrincipal = new AccountPrincipal();
                for (int i = 0; i < arr.length; i++) {
                    if (i == 0) {
                        accountPrincipal.setUsername(arr[i]);
                    }
                    if (i == 1) {
                        accountPrincipal.setAdmin(Boolean.valueOf(arr[i]));
                    }
                    if (i == 2) {
                        accountPrincipal.setPassword(arr[i]);
                    }
                }
                c.add(accountPrincipal);
            }
        }
        return c;
    }

    @Override
    public void load() {
        log.info("loading local users");
        this.mapToLocalUsers();
    }
}

package org.mym.ksuite.spring.support.configuration;

import lombok.extern.slf4j.Slf4j;
import org.mym.ksuite.spring.support.security.service.impl.ConfigAdminUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.ldap.LdapProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.ldap.authentication.ad.ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;
import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;

import java.util.Collection;

/**
 * @author zhangchao
 */
@EnableWebSecurity
@Slf4j
@Order(1)
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@EnableConfigurationProperties(LdapProperties.class)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    ConfigAdminUserDetailsService configAdminUserDetailsService;

    @Autowired
    private LdapProperties ldapProperties;

    @Autowired(required = false)
    DaoAuthenticationProvider daoAuthenticationProvider;

    @Autowired(required = false)
    ActiveDirectoryLdapAuthenticationProvider activeDirectoryLdapAuthenticationProvider;


    @Bean
    @ConditionalOnProperty(name = "spring.customized.suite.auth_type", havingValue = "local_user")
    DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(configAdminUserDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(new BCryptPasswordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public UserDetailsContextMapper userDetailsContextMapper() {
        return new LdapUserDetailsMapper() {
            @Override
            public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> authorities) {
                UserDetails userDetails = super.mapUserFromContext(ctx, username, authorities);
                try {
                    userDetails = configAdminUserDetailsService.loadUserByUsername(userDetails.getUsername());
                    return userDetails;
                } catch (Exception ex) {
                    throw new DisabledException(ex.getMessage());
                }
            }
        };
    }

    @Bean
    @ConditionalOnProperty(name = "spring.customized.suite.auth_type", havingValue = "ldap")
    ActiveDirectoryLdapAuthenticationProvider activeDirectoryLdapAuthenticationProvider() {
        ActiveDirectoryLdapAuthenticationProvider activeDirectoryLdapAuthenticationProvider = new ActiveDirectoryLdapAuthenticationProvider(null, ldapProperties.getUrls() != null && ldapProperties.getUrls().length >= 1 ? ldapProperties.getUrls()[0] : null, ldapProperties.getBase());
        activeDirectoryLdapAuthenticationProvider.setUserDetailsContextMapper(userDetailsContextMapper());
        return activeDirectoryLdapAuthenticationProvider;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        if (daoAuthenticationProvider != null) {
            auth.authenticationProvider(daoAuthenticationProvider);
        }
        if (activeDirectoryLdapAuthenticationProvider != null) {
            auth.authenticationProvider(activeDirectoryLdapAuthenticationProvider);
        }
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.headers().frameOptions().disable();
        http.authorizeRequests()
                .antMatchers("/login").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/login")
                .loginProcessingUrl("/doLogin")
                .successForwardUrl("/")
                .defaultSuccessUrl("/")
                .failureUrl("/login?error")
                .and()
                .logout()
                .logoutUrl("/logout")
                .clearAuthentication(true)
                .logoutSuccessUrl("/login")
                .and()
                .csrf()
                .disable();
    }

    @Override
    public void configure(WebSecurity webSecurity) throws Exception {
        webSecurity.ignoring().antMatchers("/static/**");
        super.configure(webSecurity);
    }
}

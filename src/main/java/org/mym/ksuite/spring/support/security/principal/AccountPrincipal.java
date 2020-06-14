package org.mym.ksuite.spring.support.security.principal;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mym.ksuite.spring.support.security.em.AuthorityRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * account info
 *
 * @author zhangchao
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountPrincipal implements UserDetails {

    /**
     * account.username
     */
    String username;

    /**
     * account.password
     */
    String password;

    /**
     * who is an admin
     */
    boolean admin;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(admin ? AuthorityRole.ROLE_ADMIN.name() : AuthorityRole.ROLE_USER.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

package org.mym.ksuite.spring.support.configuration.customized;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.util.List;


/**
 * k-suite config
 *
 * @author zhangchao
 */
@Component
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@ConfigurationProperties(prefix = "spring.customized.suite")
public class SuiteConfig {

    /**
     * local users
     */
    List<String> local_users;

    /**
     * local users' file
     */
    String local_users_file;

}

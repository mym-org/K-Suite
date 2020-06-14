package org.mym.ksuite.spring.support.configuration.customized;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


/**
 * kong config
 *
 * @author zhangchao
 */
@Component
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@ConfigurationProperties(prefix = "spring.customized.kong")
public class KongConfig {

    /**
     * kong admin endpoint
     */
    String admin_endpoint;

    /**
     * gateway name
     * for reminding the user which gateway it is!
     */
    String name;

}

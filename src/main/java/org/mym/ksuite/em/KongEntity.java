package org.mym.ksuite.em;

import lombok.Getter;

/**
 * @author zhangchao
 */
@Getter
public enum KongEntity {

    /**
     * default when not defined
     */
    DEFAULTS,

    /**
     * apis
     * kong.version<=0.12.x
     */
    APIS,

    /**
     * tags
     * kong.version>=1.2.x
     */
    TAGS,

    /**
     * services
     * kong.version>=0.13.x
     */
    SERVICES,

    /**
     * routes
     * kong.version>=0.13.x
     */
    ROUTES,

    /**
     * plugins
     */
    PLUGINS,

    /**
     * consumers
     */
    CONSUMERS,

    /**
     * acls
     */
    ACLS,

    /**
     * basic_auth
     */
    BASIC_AUTH,

    /**
     * key_auth
     */
    KEY_AUTH,

    /**
     * oauth2
     */
    OAUTH2,

    /**
     * certificates
     */
    CERTIFICATES,

    /**
     * snis
     */
    SNIS,

    /**
     * targets
     */
    TARGETS,


    /**
     * upstreams
     */
    UPSTREAMS;

}

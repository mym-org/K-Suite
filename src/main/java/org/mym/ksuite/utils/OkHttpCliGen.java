package org.mym.ksuite.utils;

import okhttp3.OkHttpClient;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

/**
 * HTTP请求
 *
 * @author zhangchao
 */
public enum OkHttpCliGen {

    /**
     * http
     */
    OKHTTP;
    private OkHttpClient client = null;

    OkHttpCliGen() {
        X509TrustManager xtm = new X509TrustManager() {
            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType) {
            }

            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType) {
            }

            @Override
            public X509Certificate[] getAcceptedIssuers() {
                return new X509Certificate[0];
            }
        };

        SSLContext sslContext = null;
        try {
            sslContext = SSLContext.getInstance("SSL");

            sslContext.init(null, new TrustManager[]{xtm}, new SecureRandom());
            HostnameVerifier DO_NOT_VERIFY = (hostname, session) -> true;
            client = new OkHttpClient.Builder()
                    .sslSocketFactory(sslContext.getSocketFactory(), xtm)
                    .hostnameVerifier(DO_NOT_VERIFY)
                    .connectTimeout(60, TimeUnit.SECONDS)
                    .readTimeout(60, TimeUnit.SECONDS)
                    .followRedirects(false)
                    .followSslRedirects(false)
                    .build();
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            e.printStackTrace();
        }
    }

    public OkHttpClient getClient() {
        return client;
    }
}

package org.mym.ksuite.spring.support.initialize;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author zhangchao
 */
@Slf4j
@Service
public class InitApplicationRunner implements ApplicationRunner {

    private final Map<String, IAfterStartedExecutor> m = new ConcurrentHashMap<>();

    @Autowired
    public InitApplicationRunner(Map<String, IAfterStartedExecutor> map) {
        this.m.clear();
        map.forEach(this.m::put);
    }

    @Override
    public void run(ApplicationArguments args) {
        List<CompletableFuture> futures = new ArrayList<>(m.size());
        for (IAfterStartedExecutor executor : m.values()) {
            CompletableFuture future = CompletableFuture.runAsync(() -> this.load(executor));
            futures.add(future);
        }
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[futures.size()])).whenCompleteAsync((c, e) -> log.info("all config's loaded...."));
    }

    /**
     * 加载数据
     *
     * @param executor
     */
    private void load(IAfterStartedExecutor executor) {
        try {
            log.info("loading.clazz={}", executor.getClass().getName());
            executor.load();
        } catch (Exception ex) {
            log.error("loading failure... clazz=[{}]", executor.getClass().getName(), ex);
        }
    }
}

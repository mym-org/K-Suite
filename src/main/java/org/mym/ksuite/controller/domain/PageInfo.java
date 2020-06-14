package org.mym.ksuite.controller.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

/**
 * @param <T>
 * @author zhangchao
 */
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class PageInfo<T> implements Serializable {

    /**
     * pageNo.
     * default:1
     */
    private Integer pageNo = 1;

    /**
     * pageSize.
     * default:10
     */
    private Integer pageSize = 10;

    /**
     * count
     */
    private long count = 0L;

    /**
     * pageCount
     */
    private int pageCount = 0;

    /**
     * results of one page
     */
    private List<T> results;


    /**
     * get pageCount
     *
     * @return
     */
    public int getPageCount() {
        Long totalCount = this.count;
        Double pages = Math.ceil(totalCount.doubleValue() / (double) this.pageSize);
        this.pageCount = pages.intValue();
        return this.pageCount;
    }
}

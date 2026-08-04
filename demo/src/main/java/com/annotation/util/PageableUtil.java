package com.annotation.util;

import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PageableUtil {

    private PageableUtil() {
    }

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt",
            "updatedAt",
            "author",
            "resolved"
    );

    public static Pageable buildPageable(
            int page,
            int size,
            String sortBy,
            String direction) {

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException(
                    "Invalid sort field: " + sortBy
            );
        }

        Sort.Direction sortDirection =
                Sort.Direction.fromString(direction);

        return PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy)
        );
    }
}
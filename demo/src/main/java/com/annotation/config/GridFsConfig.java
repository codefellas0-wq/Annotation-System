package com.annotation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.MongoConverter;

@Configuration
public class GridFsConfig {

    @Bean
    public GridFsTemplate gridFsTemplate(
            MongoDatabaseFactory mongoDatabaseFactory,
            MongoConverter mongoConverter) {

        return new GridFsTemplate(
                mongoDatabaseFactory,
                mongoConverter
        );
    }
}
package com.annotation.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        return new OpenAPI()
                .info(
                        new Info()
                                .title("Collaborative Document Annotation System API")
                                .version("1.0.0")
                                .description(
                                        "REST API for uploading documents, creating annotations, "
                                                + "managing document collaboration, and future user authentication."
                                )
                                .contact(
                                        new Contact()
                                                .name("Naresh Patel")
                                                .email("naresh@example.com")
                                                .url("https://github.com/your-github")
                                )
                                .license(
                                        new License()
                                                .name("Apache 2.0")
                                                .url("https://www.apache.org/licenses/LICENSE-2.0")
                                )
                );
    }
}
package com.komori.predictions.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String frontendUrl;
    private String firstApiKey;
    private String secondApiKey;
    private String fixtureListBaseUrl;
    private String fixtureBaseUrl;
    private String externalFixtureBaseUrl;
}

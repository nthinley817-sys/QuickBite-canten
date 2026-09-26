package com.quickbite.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Allows the Vite dev server (any localhost port) and the deployed frontend
 * to call this API. Set FRONTEND_URL to the deployed frontend's origin.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Value("${FRONTEND_URL:https://dragon-block.onrender.com}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*", frontendUrl)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return this;
    }
}

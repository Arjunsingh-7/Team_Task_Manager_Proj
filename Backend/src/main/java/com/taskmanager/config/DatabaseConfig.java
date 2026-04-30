package com.taskmanager.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        HikariConfig config = new HikariConfig();
        
        // If DATABASE_URL exists (Railway), parse it
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            URI dbUri = new URI(databaseUrl);
            
            String username = dbUri.getUserInfo().split(":")[0];
            String password = dbUri.getUserInfo().split(":")[1];
            String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
            
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(username);
            config.setPassword(password);
        } else {
            // Local development fallback
            config.setJdbcUrl("jdbc:postgresql://localhost:5432/taskmanager");
            config.setUsername("postgres");
            config.setPassword("changeme");
        }
        
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        
        return new HikariDataSource(config);
    }
}

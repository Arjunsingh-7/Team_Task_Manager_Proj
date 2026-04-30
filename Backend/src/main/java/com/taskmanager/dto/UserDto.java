package com.taskmanager.dto;

import lombok.Data;

public class UserDto {

    @Data
    public static class Summary {
        private Long id;
        private String name;
        private String email;
    }
}

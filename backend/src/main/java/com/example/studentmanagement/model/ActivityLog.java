package com.example.studentmanagement.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;

@Embeddable
public class ActivityLog {
    @NotBlank
    private String id;

    @NotBlank
    private String action;

    @NotBlank
    private String timestamp;

    public ActivityLog() {
    }

    public ActivityLog(String id, String action, String timestamp) {
        this.id = id;
        this.action = action;
        this.timestamp = timestamp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}

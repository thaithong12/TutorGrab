package com.thaithong.datn.task;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {
    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    //@Scheduled(fixedRate = 2000)
    public void scheduleTaskWithFixedRate() {
        // call send email method here
        logger.info("Send email to producers to inform quantity sold items");
    }
}

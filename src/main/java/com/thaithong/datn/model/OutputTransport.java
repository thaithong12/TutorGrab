package com.thaithong.datn.model;

import com.thaithong.datn.enums.TransportAction;

public class OutputTransport {
    private TransportAction action;

    private Object object;

    public TransportAction getAction() {
        return action;
    }

    public void setAction(TransportAction action) {
        this.action = action;
    }

    public Object getObject() {
        return object;
    }

    public void setObject(Object object) {
        this.object = object;
    }
}

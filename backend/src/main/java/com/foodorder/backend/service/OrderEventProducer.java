package com.foodorder.backend.service;

import com.foodorder.backend.model.Order;
import org.springframework.stereotype.Component;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Component
public class OrderEventProducer {

    private final BlockingQueue<Order> orderQueue = new LinkedBlockingQueue<>();

    public void publishOrder(Order order) {
        try {
            orderQueue.put(order);
            System.out.println("Order pushed to queue: " + order.getId());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Failed to push order to queue: " + e.getMessage());
        }
    }

    public BlockingQueue<Order> getOrderQueue() {
        return orderQueue;
    }
}

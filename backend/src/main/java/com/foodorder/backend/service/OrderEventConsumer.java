package com.foodorder.backend.service;

import com.foodorder.backend.model.Order;
import com.foodorder.backend.model.OrderStatus;
import com.foodorder.backend.repository.OrderRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class OrderEventConsumer {

    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;
    private final ExecutorService executorService = Executors.newFixedThreadPool(3); // 3 concurrent workers

    public OrderEventConsumer(OrderRepository orderRepository, OrderEventProducer orderEventProducer) {
        this.orderRepository = orderRepository;
        this.orderEventProducer = orderEventProducer;
        startConsumers();
    }

    private void startConsumers() {
        for (int i = 0; i < 3; i++) {
            executorService.submit(this::processOrders);
        }
    }

    private void processOrders() {
        BlockingQueue<Order> queue = orderEventProducer.getOrderQueue();
        while (!Thread.currentThread().isInterrupted()) {
            try {
                Order order = queue.take(); // Blocks until an order is available
                processOrder(order);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    private void processOrder(Order order) {
        try {
            // Update to PROCESSING
            updateStatus(order, OrderStatus.PROCESSING);
            System.out.println("Processing order: " + order.getId());

            // Simulate processing time (e.g., 5 seconds)
            Thread.sleep(5000);

            // Update to COMPLETED
            updateStatus(order, OrderStatus.COMPLETED);
            System.out.println("Completed order: " + order.getId());

        } catch (Exception e) {
            System.err.println("Error processing order: " + order.getId());
            updateStatus(order, OrderStatus.FAILED);
        }
    }

    private void updateStatus(Order order, OrderStatus status) {
        order.setStatus(status);
        orderRepository.save(order);
    }
}

package com.shopez.repository;

import com.shopez.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository; // ✅ This is required!

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
}
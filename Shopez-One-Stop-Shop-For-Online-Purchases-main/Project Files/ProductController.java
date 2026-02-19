package com.shopez.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.shopez.model.Product;
import com.shopez.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable String id) {
        return productRepository.findById(id).orElse(null);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product updatedProduct) {
    return productRepository.findById(id)
            .map(product -> {
                product.setName(updatedProduct.getName());
                product.setPrice(updatedProduct.getPrice());
                product.setDescription(updatedProduct.getDescription());
                product.setImageUrl(updatedProduct.getImageUrl());
                Product saved = productRepository.save(product);
                return ResponseEntity.ok(saved);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable String id) {
        productRepository.deleteById(id);
    }
}
package com.naalonh.pos.controller;

import com.naalonh.pos.entity.Product;
import com.naalonh.pos.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    // GET ALL PRODUCTS
    @GetMapping
    public List<Product> getProducts(Authentication authentication) {
        return productService.getProducts(authentication);
    }

    // GET PRODUCT BY ID
    @GetMapping("/{id}")
    public Map<String, Object> getProductById(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        return productService.getProductById(id, authentication);
    }

    // CREATE PRODUCT
    @PostMapping
    public Product createProduct(
            @RequestParam UUID categoryId,
            @RequestParam String name,
            @RequestParam BigDecimal price,
            @RequestParam String currency,
            @RequestParam String description,
            @RequestParam String status,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) String imageBase64,
            @RequestParam(required = false) String optionGroups,
            Authentication authentication
    ) {

        return productService.createProduct(
                categoryId,
                name,
                price,
                currency,
                description,
                status,
                image,
                imageBase64,
                optionGroups,
                authentication
        );
    }

    // UPDATE PRODUCT
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable UUID id,
            @RequestParam UUID categoryId,
            @RequestParam String name,
            @RequestParam BigDecimal price,
            @RequestParam String currency,
            @RequestParam String description,
            @RequestParam String status,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) String imageBase64,
            @RequestParam(required = false) String optionGroups,
            Authentication authentication
    ) {

        return productService.updateProduct(
                id,
                categoryId,
                name,
                price,
                currency,
                description,
                status,
                image,
                imageBase64,
                optionGroups,
                authentication
        );
    }

    // DELETE PRODUCT
    @DeleteMapping("/{id}")
    public String deleteProduct(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        return productService.deleteProduct(id, authentication);
    }
}
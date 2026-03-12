package com.naalonh.pos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.naalonh.pos.entity.Category;
import com.naalonh.pos.repository.CategoryRepository;
import com.naalonh.pos.dto.CategoryResponseDTO;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(Category category) {

        boolean exists = categoryRepository
            .existsByShopIdAndNameIgnoreCase(category.getShopId(), category.getName());

        if (exists) {
            throw new RuntimeException("Category already exists");
        }

        List<Category> categories =
            categoryRepository.findByShopIdOrderBySortOrderAsc(category.getShopId());

        int expected = 1;

        for (Category c : categories) {
            if (c.getSortOrder() != expected) {
                break;
            }
            expected++;
        }

        category.setSortOrder(expected);

        return categoryRepository.save(category);
    }

    public Category updateCategory(UUID id, Category categoryDetails) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryDetails.getName());
        category.setStatus(categoryDetails.getStatus());
        category.setSortOrder(categoryDetails.getSortOrder());

        return categoryRepository.save(category);
    }

    public List<CategoryResponseDTO> getCategoriesByShop(UUID shopId) {

        return categoryRepository
                .findByShopIdOrderBySortOrderAsc(shopId)
                .stream()
                .map(category -> new CategoryResponseDTO(
                        category.getId(),
                        category.getName(),
                        category.getStatus(),
                        category.getSortOrder(),
                        category.getCreatedAt()
                ))
                .toList();
    }

    public void deleteCategory(UUID id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryRepository.delete(category);
    }
}
package com.naalonh.pos.controller;

import com.naalonh.pos.entity.OptionGroup;
import com.naalonh.pos.repository.OptionGroupRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/option-groups")
@CrossOrigin(origins = "http://localhost:5173")
public class OptionGroupController {

    @Autowired
    private OptionGroupRepository optionGroupRepository;

    // Get all groups
    @GetMapping
    public List<OptionGroup> getAllGroups() {
        return optionGroupRepository.findAll();
    }

    // Get groups by shop
    @GetMapping("/shop/{shopId}")
    public List<OptionGroup> getByShop(@PathVariable UUID shopId) {
        return optionGroupRepository.findByShopId(shopId);
    }

    // Create group
    @PostMapping
    public OptionGroup createGroup(@RequestBody OptionGroup group) {
        return optionGroupRepository.save(group);
    }

    // Update group
    @PutMapping("/{id}")
    public OptionGroup updateGroup(@PathVariable UUID id, @RequestBody OptionGroup group) {

        OptionGroup existing = optionGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Option group not found"));

        existing.setTitle(group.getTitle());
        existing.setMinChoice(group.getMinChoice());
        existing.setMaxChoice(group.getMaxChoice());
        existing.setRequired(group.getRequired());

        return optionGroupRepository.save(existing);
    }

    // Delete group
    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable UUID id) {
        optionGroupRepository.deleteById(id);
    }
}
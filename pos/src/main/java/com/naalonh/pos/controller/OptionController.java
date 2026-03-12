package com.naalonh.pos.controller;

import com.naalonh.pos.entity.Option;
import com.naalonh.pos.repository.OptionRepository;
import com.naalonh.pos.service.SupabaseStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/options")
@CrossOrigin(origins = "http://localhost:5173")
public class OptionController {

    private static final String STORAGE_BASE =
        "https://rqjcbxywiogdsobhcqml.supabase.co/storage/v1/object/public/NaalonhPOS/";

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private SupabaseStorageService storageService;

    private void attachImageUrl(Option option) {
        if (option.getImage() != null && !option.getImage().startsWith("http")) {
            option.setImage(STORAGE_BASE + option.getImage());
        }
    }

    // Get all options
    @GetMapping
    public List<Option> getAllOptions() {

        List<Option> options = optionRepository.findAll();

        for (Option option : options) {
            attachImageUrl(option);
        }

        return options;
    }

    // Get options by option group
    @GetMapping("/group/{groupId}")
    public List<Option> getOptionsByGroup(@PathVariable UUID groupId) {

        List<Option> options = optionRepository.findByOptionGroupId(groupId);

        for (Option option : options) {
            attachImageUrl(option);
        }

        return options;
    }

    // Create option
    @PostMapping
    public Option createOption(
            @RequestParam UUID optionGroupId,
            @RequestParam String name,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image
    ) {

        Option option = new Option();
        option.setOptionGroupId(optionGroupId);
        option.setName(name);
        option.setPrice(price);
        option.setDescription(description);

        Option saved = optionRepository.save(option);

        if (image != null && !image.isEmpty()) {

            String path =
                    "options/" +
                    saved.getId() +
                    "/main.png";

            storageService.uploadImage(path, image);

            saved.setImage(path);

            saved = optionRepository.save(saved);
        }

        attachImageUrl(saved);

        return saved;
    }

    // Update option
    @PutMapping("/{id}")
    public Option updateOption(
            @PathVariable UUID id,
            @RequestParam String name,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image
    ) {

        Option option = optionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Option not found"));

        option.setName(name);
        option.setPrice(price);
        option.setDescription(description);

        if (image != null && !image.isEmpty()) {

            String path =
                    "options/" +
                    id +
                    "/main.png";

            storageService.uploadImage(path, image);

            option.setImage(path);
        }

        Option saved = optionRepository.save(option);

        attachImageUrl(saved);

        return saved;
    }

    // Delete option
    @DeleteMapping("/{id}")
    public void deleteOption(@PathVariable UUID id) {

        Option option = optionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Option not found"));

        if (option.getImage() != null) {

            String path = option.getImage();

            if (path.startsWith(STORAGE_BASE)) {
                path = path.replace(STORAGE_BASE, "");
            }

            storageService.deleteImage(path);
        }

        optionRepository.delete(option);
    }
}
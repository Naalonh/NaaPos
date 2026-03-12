package com.naalonh.pos.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naalonh.pos.entity.*;
import com.naalonh.pos.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.math.BigDecimal;

@Service
public class ProductService {

    private static final String STORAGE_BASE =
            "https://rqjcbxywiogdsobhcqml.supabase.co/storage/v1/object/public/NaalonhPOS/";

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private OptionGroupRepository optionGroupRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private ProductOptionGroupRepository productOptionGroupRepository;

    @Autowired
    private SupabaseStorageService storageService;

    // -----------------------------
    // GET PRODUCTS
    // -----------------------------
    public List<Product> getProducts(Authentication authentication) {

        UUID authUserId = UUID.fromString(authentication.getName());

        Shop shop = shopRepository
                .findByOwnerAuthId(authUserId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        List<Product> products = productRepository.findByShopId(shop.getId());

        for (Product product : products) {
            attachImageUrl(product);
        }

        return products;
    }

    // -----------------------------
    // GET PRODUCT BY ID
    // -----------------------------
    public Map<String, Object> getProductById(UUID id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        attachImageUrl(product);

        List<ProductOptionGroup> links =
                productOptionGroupRepository.findByProductId(product.getId());

        List<Map<String, Object>> groups = new ArrayList<>();

        for (ProductOptionGroup link : links) {

            OptionGroup group =
                    optionGroupRepository.findById(link.getOptionGroupId()).orElse(null);

            if (group == null) continue;

            Map<String, Object> groupData = new HashMap<>();

            groupData.put("id", group.getId());
            groupData.put("groupName", group.getTitle());
            groupData.put("required", group.getRequired());
            groupData.put("status", group.getStatus());
            
            List<Option> options =
                    optionRepository.findByOptionGroupId(group.getId());

            List<Map<String, Object>> optionList = new ArrayList<>();

            for (Option o : options) {

                attachOptionImageUrl(o);

                Map<String, Object> opt = new HashMap<>();

                opt.put("id", o.getId());
                opt.put("name", o.getName());
                opt.put("price", o.getPrice());
                opt.put("description", o.getDescription());
                opt.put("image", o.getImage());
                opt.put("status", o.getStatus());

                optionList.add(opt);
            }

            groupData.put("options", optionList);

            groups.add(groupData);
        }

        Map<String, Object> response = new HashMap<>();

        response.put("id", product.getId());
        response.put("name", product.getName());
        response.put("price", product.getPrice());
        response.put("currency", product.getCurrency());
        response.put("description", product.getDescription());
        response.put("status", product.getStatus());
        response.put("imageUrl", product.getImageUrl());
        response.put("categoryId", product.getCategoryId());
        response.put("optionGroups", groups);

        return response;
    }

    // -----------------------------
    // CREATE PRODUCT
    // -----------------------------
    public Product createProduct(
            UUID categoryId,
            String name,
            BigDecimal price,
            String currency,
            String description,
            String status,
            MultipartFile image,
            String imageBase64,
            String optionGroups,
            Authentication authentication
    ) {

        try {

            UUID authUserId = UUID.fromString(authentication.getName());

            Shop shop = shopRepository
                    .findByOwnerAuthId(authUserId)
                    .orElseThrow(() -> new RuntimeException("Shop not found"));

            Product product = new Product();

            product.setShopId(shop.getId());
            product.setCategoryId(categoryId);
            product.setName(name);
            product.setPrice(price);
            product.setCurrency(currency);
            product.setDescription(description);
            product.setStatus(status);

            Product saved = productRepository.save(product);

            // -----------------------------
            // Upload Product Image
            // -----------------------------
            if (image != null && !image.isEmpty()) {

                String path =
                        "shop/" + shop.getId() +
                        "/products/" + saved.getId() +
                        "/main.png";

                storageService.uploadImage(path, image);

                saved.setImageUrl(path);

                saved = productRepository.save(saved);
            }

            // -----------------------------
            // Create Option Groups
            // -----------------------------
            if (optionGroups != null && !optionGroups.isBlank()) {

                ObjectMapper mapper = new ObjectMapper();

                List<Map<String, Object>> groups =
                        mapper.readValue(optionGroups,
                                new TypeReference<List<Map<String, Object>>>() {});

                for (Map<String, Object> g : groups) {

                    OptionGroup group = new OptionGroup();

                    group.setTitle((String) g.get("groupName"));

                    Object requiredObj = g.get("required");
                    boolean required =
                            requiredObj != null &&
                            Boolean.parseBoolean(requiredObj.toString());

                    group.setRequired(required);
                    group.setShopId(shop.getId());

                    Object statusObj = g.get("status");

                    group.setStatus(
                        statusObj != null ? statusObj.toString() : "ACTIVE"
                    );

                    OptionGroup savedGroup = optionGroupRepository.save(group);

                    // link product ↔ option group
                    ProductOptionGroup link = new ProductOptionGroup();
                    link.setProductId(saved.getId());
                    link.setOptionGroupId(savedGroup.getId());

                    productOptionGroupRepository.save(link);

                    // -----------------------------
                    // Create Options
                    // -----------------------------
                    Object optionsObj = g.get("options");

                    if (optionsObj != null) {

                        List<Map<String, Object>> options =
                                mapper.convertValue(
                                        optionsObj,
                                        new TypeReference<List<Map<String, Object>>>() {});

                        for (Map<String, Object> o : options) {

                            Option option = new Option();

                            option.setOptionGroupId(savedGroup.getId());

                            String optionName = (String) o.get("name");

                            if (optionName == null || optionName.isBlank()) {
                                continue;
                            }

                            option.setName(optionName);

                            Object priceObj = o.get("price");

                            BigDecimal priceValue = BigDecimal.ZERO;

                            if (priceObj != null &&
                                    !priceObj.toString().isBlank()) {

                                try {
                                    priceValue = new BigDecimal(priceObj.toString());
                                } catch (Exception ignored) {
                                    priceValue = BigDecimal.ZERO;
                                }
                            }

                            option.setPrice(priceValue);

                            Object desc = o.get("description");

                            option.setDescription(
                                desc != null ? desc.toString() : ""
                            );

                            Object optionStatus = o.get("status");

                            option.setStatus(
                                optionStatus != null ? optionStatus.toString() : "ACTIVE"
                            );

                            option = optionRepository.save(option);

                            // -----------------------------
                            // Upload Option Image
                            // -----------------------------
                            Object img = o.get("image");

                            if (img != null &&
                                    img.toString().startsWith("data:image")) {

                                String path =
                                        "shop/" + shop.getId() +
                                        "/options/" + option.getId() +
                                        "/main.png";

                                storageService.uploadBase64Image(
                                        path,
                                        img.toString()
                                );

                                option.setImage(path);

                                optionRepository.save(option);
                            }
                        }
                    }
                }
            }

            attachImageUrl(saved);

            return saved;

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException("Failed to create product");
        }
    }
    
    // -----------------------------
    // UPDATE PRODUCT
    // -----------------------------
    @Transactional
    public Product updateProduct(
            UUID id,
            UUID categoryId,
            String name,
            BigDecimal price,
            String currency,
            String description,
            String status,
            MultipartFile image,
            String imageBase64,
            String optionGroups,
            Authentication authentication
    ) {

        try {

            UUID authUserId = UUID.fromString(authentication.getName());

            Shop shop = shopRepository
                    .findByOwnerAuthId(authUserId)
                    .orElseThrow(() -> new RuntimeException("Shop not found"));

            Product product = productRepository
                    .findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (!product.getShopId().equals(shop.getId())) {
                throw new RuntimeException("Unauthorized access");
            }

            // -----------------------------
            // Update Product Fields
            // -----------------------------
            product.setCategoryId(categoryId);
            product.setName(name);
            product.setPrice(price);
            product.setCurrency(currency);
            product.setDescription(description);
            product.setStatus(status);

            Product saved = productRepository.save(product);

            // -----------------------------
            // Update Product Image
            // -----------------------------
            String path =
                    "shop/" + shop.getId() +
                    "/products/" + saved.getId() +
                    "/main.png";

            if (imageBase64 != null && imageBase64.startsWith("data:image")) {

                storageService.uploadBase64Image(path, imageBase64);

                saved.setImageUrl(path);

                saved = productRepository.save(saved);

            } else if (image != null && !image.isEmpty()) {

                storageService.uploadImage(path, image);

                saved.setImageUrl(path);

                saved = productRepository.save(saved);
            }

            // -----------------------------
            // Sync Option Groups
            // -----------------------------
            if (optionGroups != null && !optionGroups.isBlank()) {

                ObjectMapper mapper = new ObjectMapper();

                List<Map<String, Object>> groups =
                        mapper.readValue(optionGroups,
                                new TypeReference<List<Map<String, Object>>>() {});

                Set<UUID> incomingGroupIds = new HashSet<>();

                for (Map<String, Object> g : groups) {

                    UUID groupId = null;

                    Object idObj = g.get("id");

                    if (idObj != null) {

                        String idStr = idObj.toString();

                        if (!idStr.startsWith("temp-")) {
                            try {
                                groupId = UUID.fromString(idStr);
                            } catch (Exception ignored) {}
                        }
                    }

                    OptionGroup group = (groupId != null)
                            ? optionGroupRepository.findById(groupId).orElse(new OptionGroup())
                            : new OptionGroup();

                    group.setTitle((String) g.get("groupName"));
                    group.setRequired(Boolean.parseBoolean(
                            String.valueOf(g.getOrDefault("required", false))
                    ));
                    group.setShopId(shop.getId());

                    Object statusObj = g.get("status");

                    group.setStatus(
                        statusObj != null ? statusObj.toString() : "ACTIVE"
                    );

                    OptionGroup savedGroup = optionGroupRepository.save(group);

                    incomingGroupIds.add(savedGroup.getId());

                    // -----------------------------
                    // Ensure product-group link
                    // -----------------------------
                    if (!productOptionGroupRepository
                            .existsByProductIdAndOptionGroupId(saved.getId(), savedGroup.getId())) {

                        ProductOptionGroup link = new ProductOptionGroup();
                        link.setProductId(saved.getId());
                        link.setOptionGroupId(savedGroup.getId());

                        productOptionGroupRepository.save(link);
                    }

                    // -----------------------------
                    // Sync Options
                    // -----------------------------
                    Object optionsObj = g.get("options");

                    if (optionsObj == null) continue;

                    List<Map<String, Object>> options =
                            mapper.convertValue(optionsObj,
                                    new TypeReference<List<Map<String, Object>>>() {});

                    List<Option> existingOptions =
                            optionRepository.findByOptionGroupId(savedGroup.getId());

                    Set<UUID> incomingOptionIds = new HashSet<>();

                    for (Map<String, Object> o : options) {

                        Object optionIdObj = o.get("id");

                        if (optionIdObj != null) {

                            String idStr = optionIdObj.toString();

                            if (!idStr.startsWith("temp-")) {
                                try {
                                    incomingOptionIds.add(UUID.fromString(idStr));
                                } catch (Exception ignored) {}
                            }
                        }
                    }

                    // -----------------------------
                    // Delete Removed Options
                    // -----------------------------
                    for (Option existing : existingOptions) {

                        if (!incomingOptionIds.contains(existing.getId())) {

                            if (existing.getImage() != null) {

                                String imagePath = existing.getImage();

                                if (imagePath.startsWith(STORAGE_BASE)) {
                                    imagePath = imagePath.replace(STORAGE_BASE, "");
                                }

                                storageService.deleteImage(imagePath);
                            }

                            optionRepository.delete(existing);
                        }
                    }

                    // -----------------------------
                    // Create / Update Options
                    // -----------------------------
                    for (Map<String, Object> o : options) {

                        UUID optionId = null;

                        Object optionIdObj = o.get("id");

                        if (optionIdObj != null) {

                            String idStr = optionIdObj.toString();

                            if (!idStr.startsWith("temp-")) {
                                try {
                                    optionId = UUID.fromString(idStr);
                                } catch (Exception ignored) {}
                            }
                        }

                        Option option = (optionId != null)
                                ? optionRepository.findById(optionId)
                                .filter(op -> op.getOptionGroupId().equals(savedGroup.getId()))
                                .orElse(new Option())
                                : new Option();

                        option.setOptionGroupId(savedGroup.getId());
                        option.setName((String) o.get("name"));

                        BigDecimal priceValue = BigDecimal.ZERO;

                        if (o.get("price") != null &&
                                !o.get("price").toString().isBlank()) {

                            priceValue = new BigDecimal(o.get("price").toString());
                        }

                        option.setPrice(priceValue);

                        option.setDescription(
                                o.get("description") != null
                                        ? o.get("description").toString()
                                        : ""
                        );
                        
                        Object optionStatus = o.get("status");

                        if (optionStatus != null) {
                            option.setStatus(optionStatus.toString());
                        }
                        
                        option = optionRepository.save(option);

                        Object img = o.get("image");

                        if (img != null && img.toString().startsWith("data:image")) {

                            String optionPath  =
                                    "shop/" + shop.getId() +
                                    "/options/" + option.getId() +
                                    "/main.png";

                            storageService.uploadBase64Image(optionPath, img.toString());

                            option.setImage(optionPath);

                        } else if (img != null) {

                            String imgStr = img.toString();

                            if (imgStr.startsWith(STORAGE_BASE)) {
                                imgStr = imgStr.replace(STORAGE_BASE, "");
                            }

                            option.setImage(imgStr);
                        }

                        optionRepository.save(option);
                    }
                }

                // -----------------------------
                // Delete Removed Groups
                // -----------------------------
                List<ProductOptionGroup> existingLinks =
                        productOptionGroupRepository.findByProductId(saved.getId());

                for (ProductOptionGroup link : existingLinks) {

                    UUID groupId = link.getOptionGroupId();

                    if (!incomingGroupIds.contains(groupId)) {

                        List<Option> options =
                                optionRepository.findByOptionGroupId(groupId);

                        for (Option option : options) {

                            if (option.getImage() != null) {

                                String optionImagePath = option.getImage();

                                if (optionImagePath.startsWith(STORAGE_BASE)) {
                                    optionImagePath = optionImagePath.replace(STORAGE_BASE, "");
                                }

                                storageService.deleteImage(optionImagePath);
                            }
                        }

                        optionRepository.deleteByOptionGroupId(groupId);

                        productOptionGroupRepository
                                .deleteByProductIdAndOptionGroupId(saved.getId(), groupId);

                        optionGroupRepository.deleteById(groupId);
                    }
                }
            }

            attachImageUrl(saved);

            return saved;

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException("Failed to update product: " + e.getMessage());
        }
    }
    
    // -----------------------------
    // DELETE PRODUCT
    // -----------------------------
    @Transactional
    public String deleteProduct(UUID id, Authentication authentication) {

        UUID authUserId = UUID.fromString(authentication.getName());

        Shop shop = shopRepository
                .findByOwnerAuthId(authUserId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        Product product = productRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getShopId().equals(shop.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        // -----------------------------
        // Delete Product Image
        // -----------------------------
        if (product.getImageUrl() != null) {

            String path = product.getImageUrl();

            if (path.startsWith(STORAGE_BASE)) {
                path = path.replace(STORAGE_BASE, "");
            }

            storageService.deleteImage(path);
        }

        // -----------------------------
        // Get all option groups linked to this product
        // -----------------------------
        List<ProductOptionGroup> links =
                productOptionGroupRepository.findByProductId(product.getId());

        for (ProductOptionGroup link : links) {

            UUID groupId = link.getOptionGroupId();

            // -----------------------------
            // Delete Option Images
            // -----------------------------
            List<Option> options = optionRepository.findByOptionGroupId(groupId);

            for (Option option : options) {

                if (option.getImage() != null) {

                    String path = option.getImage();

                    if (path.startsWith(STORAGE_BASE)) {
                        path = path.replace(STORAGE_BASE, "");
                    }

                    storageService.deleteImage(path);
                }
            }

            // -----------------------------
            // Delete Options
            // -----------------------------
            optionRepository.deleteByOptionGroupId(groupId);
        }

        // -----------------------------
        // Delete Product ↔ OptionGroup links
        // -----------------------------
        productOptionGroupRepository.deleteByProductId(product.getId());

        // -----------------------------
        // Delete Option Groups
        // -----------------------------
        for (ProductOptionGroup link : links) {

            UUID groupId = link.getOptionGroupId();

            if (optionGroupRepository.existsById(groupId)) {
                optionGroupRepository.deleteById(groupId);
            }
        }

        // -----------------------------
        // Delete Product
        // -----------------------------
        productRepository.delete(product);

        return "Product deleted successfully";
    }
    // -----------------------------
    // HELPERS
    // -----------------------------
    private void attachImageUrl(Product product) {

        if (product.getImageUrl() != null && !product.getImageUrl().startsWith("http")) {
            product.setImageUrl(STORAGE_BASE + product.getImageUrl());
        }
    }

    private void attachOptionImageUrl(Option option) {

        if (option.getImage() != null && !option.getImage().startsWith("http")) {
            option.setImage(STORAGE_BASE + option.getImage());
        }
    }
}
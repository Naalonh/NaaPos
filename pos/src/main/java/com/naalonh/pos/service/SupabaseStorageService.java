package com.naalonh.pos.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service.key}")
    private String serviceKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final RestTemplate restTemplate = new RestTemplate();

    public void deleteImage(String path) {

        try {

            String url = supabaseUrl + "/storage/v1/object/" + bucket + "/" + path;

            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", serviceKey);
            headers.set("Authorization", "Bearer " + serviceKey);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            restTemplate.exchange(
                    url,
                    HttpMethod.DELETE,
                    entity,
                    String.class
            );

        } catch (Exception e) {

            // Storage delete should never break business logic
            System.out.println("Storage delete skipped for: " + path);
        }
    }

    public void uploadImage(String path, MultipartFile file) {

        try {

            String url = supabaseUrl + "/storage/v1/object/" + bucket + "/" + path;

            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", serviceKey);
            headers.set("Authorization", "Bearer " + serviceKey);
            headers.set("x-upsert", "true");
            headers.setContentType(MediaType.parseMediaType(file.getContentType()));

            HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            System.out.println("Supabase upload response: " + response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

    public void uploadBase64Image(String path, String base64Image) {

        try {

            String base64Data = base64Image.split(",")[1];
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            String url = supabaseUrl + "/storage/v1/object/" + bucket + "/" + path;

            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", serviceKey);
            headers.set("Authorization", "Bearer " + serviceKey);
            headers.set("x-upsert", "true");
            headers.setContentType(MediaType.IMAGE_JPEG);

            HttpEntity<byte[]> entity = new HttpEntity<>(imageBytes, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            System.out.println("Supabase upload response: " + response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Base64 upload failed: " + e.getMessage());
        }
    }
}
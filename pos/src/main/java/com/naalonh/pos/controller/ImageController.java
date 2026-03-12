package com.naalonh.pos.controller;

import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;

@RestController
@RequestMapping("/api/image")
public class ImageController {

    private final String API_KEY = "ogmEcgeRienNdehsL9vT7tjW";

    @PostMapping(value = "/remove-bg", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> removeBackground(@RequestParam("image") MultipartFile file) {

        try {

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Api-Key", API_KEY);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image_file", resource);
            body.add("size", "auto");

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    "https://api.remove.bg/v1.0/removebg",
                    HttpMethod.POST,
                    requestEntity,
                    byte[].class
            );

            return ResponseEntity
                    .ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();   // important for debugging
            return ResponseEntity.internalServerError().build();
        }
    }
}
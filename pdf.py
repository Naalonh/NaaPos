from pdf2image import convert_from_path
import os

# Input PDF
pdf_path = r"C:\Users\Lonhv\Desktop\POS_system\Dry\niron-new-menu.pdf"

# Output folder
output_folder = "output_images"
os.makedirs(output_folder, exist_ok=True)

# Convert PDF to images
images = convert_from_path(pdf_path)

# Save each page as PNG
for i, image in enumerate(images):
    output_path = os.path.join(output_folder, f"page_{i+1}.png")
    image.save(output_path, "PNG")
    print(f"Saved: {output_path}")

print("Conversion complete!")
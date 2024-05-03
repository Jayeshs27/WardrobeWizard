import requests
from bs4 import BeautifulSoup
import os
from PIL import Image
from io import BytesIO

url = 'https://unsplash.com/s/photos/fashion-trend'

response = requests.get(url)
content = response.content

soup = BeautifulSoup(content, 'html.parser')

os.makedirs('../app-iwm/assets/scrapped_images', exist_ok=True)
os.makedirs('../web-iwm/public/scrapped_images', exist_ok=True)

divs = soup.find_all('div', class_='WxXog')

image_urls = []

for div in divs:
    img_tag = div.find('img')
    if img_tag:
        img_url = img_tag['src']
        image_urls.append(img_url)

    if len(image_urls) >= 20:
        break

for i, url in enumerate(image_urls):
    img_response = requests.get(url)

    if img_response.status_code == 200:
        # Convert WebP binary data to JPEG format and crop
        with BytesIO(img_response.content) as img_io:
            webp_image = Image.open(img_io)

            width, height = webp_image.size
            target_aspect_ratio = 6 / 7

            if width / height > target_aspect_ratio:
                new_width = int(height * target_aspect_ratio)
                left = (width - new_width) // 2
                right = left + new_width
                top = 0
                bottom = height
            else:
                new_height = int(width / target_aspect_ratio)
                top = (height - new_height) // 2
                bottom = top + new_height
                left = 0
                right = width

            cropped_image = webp_image.crop((left, top, right, bottom))
            jpeg_image = cropped_image.convert('RGB')

            img_filename = f'../app-iwm/assets/scrapped_images/image_{i + 1}.jpg'
            jpeg_image.save(img_filename, 'JPEG')
            img_filename = f'../web-iwm/public/scrapped_images/image_{i + 1}.jpg'
            jpeg_image.save(img_filename, 'JPEG')

print("Scraped, cropped and converted 20 images as JPEG successfully.")

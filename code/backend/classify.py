import numpy as np
import cv2
import tensorflow as tf
from collections import *
import sys
import random


cl = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot",
]

model = tf.keras.models.load_model("fashion_mnist_model.keras")


def find_major_color(image_path):
    crop_percentage = 0.1
    num_colors = 3
    image = cv2.imread(image_path)
    height, width, _ = image.shape
    crop_size = int(min(height, width) * crop_percentage / 2)
    crop_top = int(height / 2 - crop_size)
    crop_bottom = int(height / 2 + crop_size)
    crop_left = int(width / 2 - crop_size)
    crop_right = int(width / 2 + crop_size)
    cropped_image = image[crop_top:crop_bottom, crop_left:crop_right]
    cropped_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2RGB)
    pixels = cropped_image.reshape(-1, 3)
    pixels = np.float32(pixels)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
    _, labels, centers = cv2.kmeans(
        pixels, num_colors, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS
    )
    centers = np.uint8(centers)
    labels = labels.flatten()
    counts = Counter(labels)
    rgb_color = centers[np.argmax(counts.values())]
    colors = {
        "red": (255, 0, 0),
        "green": (0, 255, 0),
        "blue": (0, 0, 255),
        "yellow": (255, 255, 0),
        "cyan": (0, 255, 255),
        "magenta": (255, 0, 255),
        "black": (0, 0, 0),
        "white": (255, 255, 255),
        "orange": (255, 165, 0),
    }

    manhattan = lambda x, y: abs(x[0] - y[0]) + abs(x[1] - y[1]) + abs(x[2] - y[2])
    distances = {k: manhattan(v, rgb_color) for k, v in colors.items()}
    color = min(distances, key=distances.get)
    return color


def determine_wear_category(color, clothing_item):
    if clothing_item == "Trouser":
        if color is "black":
            return "Formalwear"
        elif color in ["white", "blue", "green"]:
            return "Partywear"
        else:
            return "Casualwear"
    bright_colors = ["red", "yellow", "orange", "magenta"]
    formal_items = ["Dress", "Coat", "Shirt"]
    is_bright_color = color in bright_colors
    is_formal_item = clothing_item in formal_items
    if is_formal_item:
        if is_bright_color:
            return "Formalwear"
        else:
            return "Partywear"
    else:
        return "Casualwear"


def predict_from_image_file(image_path):
    processed_image = passer(image_path)
    color = find_major_color(image_path)
    type = determine_wear_category(color=color, clothing_item=processed_image)
    return {"type": type, "prediction": processed_image, "color": color}


def passer(img_path):
    img = cv2.imread(img_path)
    img = preprocess_image(img)
    img = cv2.resize(img, (28, 28))
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img_normalized = img_gray / 255.0
    img_reshaped = np.reshape(img_normalized, (1, 28, 28))
    prediction = model.predict(img_reshaped)

    predicted_class_index = np.argmax(prediction, axis=1)[0]
    predicted_class_name = cl[predicted_class_index]
    return predicted_class_name


def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    thresh = cv2.bitwise_not(thresh)
    bgr_image = cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)
    return bgr_image


# Example usage:
# paths = [
#     "a1.jpeg",
#     "a2.jpeg",
#     "a3.jpeg",
#     "a5.jpeg",
#     "abc.png",
#     "a1.png",
#     "a2.png",
#     "a4.jpeg",
#     "a6.jpeg",
# ]

# for file_path in paths:
#     # file_path = "a6.jpeg"
#     result = predict_from_image_file(file_path)
#     print(result)
length = len(sys.argv)

print(predict_from_image_file((sys.argv)[1]))
# print(predict_from_image_file(arg))

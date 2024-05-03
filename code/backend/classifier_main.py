import tensorflow as tf
import numpy as np
# Python 3.10
up_class = ['T-shirt/top', 'Trouser', 'Dress', 'Coat', 'Shirt']

fashion_mnist = tf.keras.datasets.fashion_mnist
(train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data()

classes_to_remove = [5, 8, 9, 7, 2]  # Sandal, Bag, Ankle boot, Sneaker, Pullover are removed

print("Before filtering - Train labels:", train_labels)
print("Before filtering - Test labels:", test_labels)

train_mask = np.isin(train_labels, classes_to_remove, invert=True)
test_mask = np.isin(test_labels, classes_to_remove, invert=True)

train_images = train_images[train_mask]
train_labels = train_labels[train_mask]
test_images = test_images[test_mask]
test_labels = test_labels[test_mask]

print("After filtering - Train labels:", train_labels)
print("After filtering - Test labels:", test_labels)
train_images = train_images / 255.0
test_images = test_images / 255.0


num_classes = len(up_class)
model = tf.keras.Sequential([
    tf.keras.layers.Flatten(input_shape=(28, 28)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])


model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

model.fit(train_images, train_labels, epochs=10)

test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=2)
print('\nTest accuracy:', test_acc)

print("DONE!!")
model.layers[0].batch_input_shape = (None, 28, 28)
tf.keras.models.save_model(model, "fashion_mnist_model.keras")
#!/bin/bash

# python3 -m venv env
# source env/bin/activate

pip3 install numpy
pip3 install tensorflow
pip3 install opencv-python
pip3 install torch
python3 -c "import torch"
pip3 install torchtext
pip3 install nltk
python3 -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
python3 randomGen.py
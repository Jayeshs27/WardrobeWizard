'''
Takes in the text of a user, and the tags of all the clothes in the user's wardrobe and returns a random top and a bottom
'''

import random
import torch
from torchtext.vocab import GloVe
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from string import punctuation
from math import exp, sqrt
import sys

# import nltk
# nltk.download('stopwords')

embeddingDim = 100
glove = GloVe(name='6B', dim=embeddingDim)
stopWords = set(stopwords.words('english'))

classes = ['casual', 'formal', 'party']
dimClass = []
for class_ in classes:
    dimClass.append(glove.vectors[glove.stoi[class_]])

def cosineSimilarity(a, b):
    moda = 0
    for i in a:
        moda += i ** 2
    moda = sqrt(moda)
    modb = 0
    for i in b:
        modb += i ** 2
    modb = sqrt(modb)
    return (a @ b) / (moda * modb)

def getWear(type):
    if type == 'Trouser':
        return 1
    else:
        return 0


def processText(userInput):
    tokens = word_tokenize(userInput)
    filteredTokens = [word.lower() for word in tokens if word not in stopWords]
    base = torch.zeros(embeddingDim)
    divi = 0
    for token in filteredTokens:
        if token in glove.stoi:
            index = glove.stoi[token]
            vec = glove.vectors[index]
            sims = []
            for class_ in dimClass:
                sims.append(cosineSimilarity(class_, vec))
            maxSim = max(sims)
            if maxSim < 0:
                continue
            else:
                divi += maxSim
                base += maxSim * vec
    
    if divi == 0:
        return 'None'
    base /= divi
    similarities = []
    for class_ in dimClass:
        similarities.append(cosineSimilarity(class_, base))
    
    if similarities[0] > similarities[1] and similarities[0] > similarities[2]:
        return 'Casualwear'
    if similarities[1] > similarities[0] and similarities[1] > similarities[2]:
        return 'Formalwear'
    else:
        return 'Partywear'
    

def generateRandom(values, userInput):
    
    
    tag = processText(userInput)
    if tag == 'None':
        return ('', '')
    wears = [[],[]]
    for value in values:

        wear = getWear(value['Tags'][1])
        if value['Tags'][0] == tag:
            wears[wear].append(value['ImageSrc'])
            

    
    if len(wears[0]) == 0 and len(wears[1]) == 0:
        return ('', '')

    elif len(wears[0]) == 0:
        return ('', random.choice(wears[1]))
    
    elif len(wears[1]) == 0:
        return (random.choice(wears[0]), '')
    
    else:
        return (random.choice(wears[0]), random.choice(wears[1]))
    

def main():
    clothCount = len(sys.argv) // 5
    clothes = []
    for i in range(clothCount):
        clothes.append({"id" : sys.argv[5 * i + 1], "Tags" : [sys.argv[5 * i + k] for k in range(2, 5)], "ImageSrc" : sys.argv[5 * i + 5]})
    userInp = sys.argv[-1]
    out = generateRandom(clothes, userInp)
    print(out[0])
    print(out[1])

    
if __name__ == '__main__':
    main()
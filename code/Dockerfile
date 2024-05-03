# ADD classify.py /backend/classify.py 
# ADD classifier_main.py /backend/classifier_main.py 
# ADD randomGen.py /backend/randomGen.py
# ADD new_scrapper.py /backend/new_scrapper.py



# RUN python -m venv /opt/venv

# ENV PATH="/opt/venv/bin:$PATH"
# COPY ./requirements.txt /backend/requirements.txt

# RUN pip install --no-cache-dir -r requirements.txt
FROM node:20
WORKDIR /app/backend
COPY backend/package*.json ./
COPY ./requirements.txt /app/backend/requirements.txt

RUN npm install
RUN apt-get update && \
    apt-get install -y python3-pip  && \
    apt-get install -y libsasl2-dev python-dev-is-python3 libldap2-dev libssl-dev libhdf5-dev
RUN apt install -y python3.11-venv
RUN python3 -m venv .venv
RUN . .venv/bin/activate
# RUN pip install setuptools==59.6.0
# RUN pip install Cython==0.29.16
# RUN python3 -m pip install --no-binary=h5py h5py --break-system-packages
RUN python3 -m pip install --upgrade pip setuptools wheel --break-system-packages
# RUN python3 -m pip install -r requirements.txt --break-system-packages
RUN python3 -m pip install -r requirements.txt --break-system-packages
# RUN pip install numpy

COPY backend .

ENV PORT=8589

EXPOSE $PORT
CMD ["npm", "start"]
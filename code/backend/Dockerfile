FROM python:3.10 as build

WORKDIR /app/backend
RUN python -m venv /app/backend/venv
ENV PATH="/app/backend/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install -r requirements.txt


FROM node:20
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .
EXPOSE 8589
CMD ["npm", "start"]

FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    pkg-config \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

COPY . .

RUN mkdir -p /app/app/static/uploads/avatars \
             /app/app/static/uploads/banners \
             /app/app/static/uploads/posts

FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /install /install
COPY --from=builder /app .

ENV PYTHONPATH=/install/lib/python3.11/site-packages
ENV PATH=/install/bin:$PATH

RUN useradd -m nonroot
USER nonroot

EXPOSE 5000

CMD ["python", "app.py"]
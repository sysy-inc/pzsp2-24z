FROM python:3.10-slim
WORKDIR /app
COPY app.py /app/
RUN pip3 install fastapi uvicorn
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

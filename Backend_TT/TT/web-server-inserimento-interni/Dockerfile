FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install flask flask_session requests

EXPOSE 5050

CMD ["flask", "run", "--host=0.0.0.0"]
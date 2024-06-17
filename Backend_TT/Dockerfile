FROM debian:12

RUN apt-get update && apt-get install -y python3 python3-pip
RUN apt-get install -y maven
RUN apt-get install -y default-jdk

#FROM maven:3.8.7-amazoncorretto-19
COPY . /app
WORKDIR /app
RUN apt-get -y install python3-pdfkit
RUN apt-get -y install python3-pypdf
RUN apt-get install -y wkhtmltopdf
ENTRYPOINT ["mvn", "spring-boot:run"]

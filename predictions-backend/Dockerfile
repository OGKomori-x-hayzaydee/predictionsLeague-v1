# Image containing Java runtime
FROM eclipse-temurin:21-jdk

# Maintainer
LABEL maintainer="Tega Komori <majorogkomori@gmail.com>"

# Set working directory
WORKDIR /app

# Expose port 8080 to the world
EXPOSE 8080

# Copy .jar file into the container
COPY target/predictions_backend-0.0.1-SNAPSHOT.jar app.jar

# Set default command that runs when Docker starts
ENTRYPOINT ["java", "-jar", "app.jar"]
# ============================================================
# Dockerfile - Backend Diário Pessoal (Spring Boot 3 / Java 17)
# Build multi-stage: compila com Maven e roda apenas o JRE,
# gerando uma imagem final pequena e rápida de subir no Render.
# ============================================================

# ---------- Etapa 1: build ----------
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copia primeiro só o pom.xml para aproveitar o cache de dependências
# do Docker (só baixa tudo de novo se o pom.xml mudar)
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Agora copia o restante do código-fonte e builda o jar
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- Etapa 2: runtime ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Usuário não-root por segurança
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

# Copia apenas o jar final gerado na etapa de build
COPY --from=build /app/target/diario-pessoal-backend-*.jar app.jar

# O Render injeta a variável PORT automaticamente; o application.properties
# já lê server.port=${PORT:8080}
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

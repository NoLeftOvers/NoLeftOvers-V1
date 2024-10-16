# Frontend Dockerfile
FROM node:16 AS build

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 전체 소스 코드 복사
COPY . .

# 빌드
RUN npm run build
RUN npm run export  # 정적 파일로 export

# Nginx로 서빙
FROM nginx:alpine
COPY --from=build /usr/src/app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Backend Dockerfile
FROM node:16

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 전체 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 8000

# 서버 시작 명령어
CMD ["node", "app.js"]
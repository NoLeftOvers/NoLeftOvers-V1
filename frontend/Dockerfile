# frontend/Dockerfile
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# Next.js 빌드
RUN npm run build

# 포트 노출
EXPOSE 3000

# 앱 시작
CMD ["npm", "start"]
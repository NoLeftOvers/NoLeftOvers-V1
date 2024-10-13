# 사용할 이미지 선택 (Node.js 최신 LTS 버전으로 변경)
FROM node:20

# 워킹 디렉토리 설정
WORKDIR /usr/src/app

# 앱 의존성 복사 및 설치 
COPY package*.json ./
RUN npm install

# 필요한 라이브러리 설치
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# 앱 소스 추가
COPY . .

# 포트 바인딩
EXPOSE 8000

# 명령문 삽입
CMD ["npm", "start"]

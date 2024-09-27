# 사용할 이미지 선택
FROM node:16
# 워킹 디렉토리 설정
WORKDIR /usr/src/app
# 앱 소스 추가
COPY . .
# 앱 의존성 복사 및 설치 
COPY package*.json ./
RUN npm install
# 포트바인딩
EXPOSE 8000
# 명령문 삽입
CMD ["node", "app.js"]
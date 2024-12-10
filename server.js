// .env 파일에서 환경 변수를 로드하여 process.env에 추가
require("dotenv").config();

const express = require("express");

const server = express();

server.use(express.json());

const PORT = 8080;

const join = require("./join");
const login = require("./login");
const auth = require("./middleware/auth");
const course = require("./course");
const visit = require("./visit");

// 회원 도메인
// 회원 가입 서비스를 제공할 떄 어떤 걸 받을까받을까?
// login_id, login_pw, name
server.post("/api/v1/auth/join", join);
server.post("/api/v1/auth/login", login);
server.post("/api/v1/auth/auth", auth);

// 코스 리스트 (인증이 필요한 enpoint 주소)
server.get("/api/v1/auth/course", auth, course);
server.post("/api/v1/auth/visit", auth, visit);

// QR코드 -> 문자열
// QR코드 -> 문자열 -> 암호화, 거리 계산(유효한 거리에 들어올때 가능) -> 서버로 전송
// QR -> 문자열 -> db에 문자열이 있는지 확인하고 방문처리 (이걸로 진행)

server.listen(PORT, () => {
  console.log(`${PORT} 서버 오픈`);
});

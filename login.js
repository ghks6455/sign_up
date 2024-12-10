const db = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// ID , PW
const login = async (req, res) => {
  const loginId = req.body.id;
  const loginPw = req.body.pw;

  // 유효성 검사
  // ID와 PW가 들어오지 않으면 에러를 송신
  // 400번 에러 BAD REQUEST
  if (!loginId || !loginPw) {
    return res.status(400).json({ status: "error", message: "id,pw는 필수입니다", data: null });
  }

  const QUERY1 = `
    SELECT
        user_id,
        user_login_id,
        user_login_pw,
        user_name
    FROM
        user
    WHERE
        user_login_id=?`;
  const user = await db.execute(QUERY1, [loginId]).then((result) => result[0][0]);

  // 404 NOT FOUND
  if (!user) {
    return res.status(404).json({ status: "error", message: "id,pw가 틀립니다", data: null });
  }

  // PW 확인(비밀번호 비교)
  const isMatch = await bcrypt.compare(loginPw, user.user_login_pw);
  if (!isMatch) {
    // UnAuthorize
    res.status(401).json({ status: "error", message: "비밀번호가 일치하지 않습니다", data: null });
  }

  // 서버는 보통 -> 상태 없이 (Stateless) 설계
  // 로그인 - 인증서 발급 형태
  // sessin - cookie같은
  // JWT token
  // - access token (8시간)
  // - refresh token (일주일)
  // 엑세스 토큰이 만료되면 db에 남아있는 리프래쉬 토큰으로 재발급

  // 정상적으로 로그인 되었습니다.
  // 첫번째 : 넣을 값 (객체) , 두번째 (암호키), 세번째 만료일(객체) - 옵션
  const secretKey = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user.user_id }, secretKey, { expiresIn: "10d" });

  res.status(200).json({ status: "success", message: "로그인 성공", data: { token: token } });
  // 같은 이름은 변수만 넣어도 됨 (token)
};

module.exports = login;

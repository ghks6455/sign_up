const db = require("./config/db");

const visit = async (req, res) => {
  const loginUserId = req.user.user_id;
  const courseQr = req.body.qr;

  if (!courseQr) {
    return res.status(400).json({ status: "error", message: "qr 코드 정보는 필수입니다", data: null });
  }

  // QR 정보 유효성 확인
  const QUERY1 = `
    SELECT
        course_id,
        course_name,
        course_latitude,
        course_longitude,
        course_QR
    FROM
        course
    WHERE
        course_QR=?`;
  const course = await db.execute(QUERY1, [courseQr]).then((result) => result[0][0]);
  if (!course) {
    return res.status(404).json({ status: "error", message: "코스 정보가 없습니다.", data: null });
  }

  // 방문 했으면 방문한 코스입니다 라는 메세지 발송

  // 유저 코스에서 유저 아이디와 코스 아이디가 포함되어 있는 행의 유저 코스 아이디를 가져옴
  const QUERY2 = `
    SELECT
        user_course_id
    FROM
        user_course
    WHERE
        user_id = ?
    AND
        course_id = ? `;
  const isVisited = await db.execute(QUERY2, [loginUserId, course.course_id]).then((result) => result[0][0]);

  // 만약 방문했다면
  if (isVisited) {
    return res.status(400).json({ status: "error", message: "이미 방문한 코스입니다.", data: null });
  }

  // 방문 이력이 없으면 방문 처리
  const QUERY3 = `
    INSERT INTO user_course
    (
        user_id,
        course_id
    )
    VALUES
    (
    ?,
    ?
    )
  `;
  await db.execute(QUERY3, [loginUserId, course.course_id]);

  return res.json({ status: "success", message: "QR 인증이 완료되었습니다.", data: null });
};

module.exports = visit;

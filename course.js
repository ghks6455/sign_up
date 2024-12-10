const db = require("./config/db");

// 코스 추가할때 사용 한 sql
/**  INSERT INTO course
    (
    course_name,course_latitude,course_longitude,course_QR
    )
    VALUES  
  ("test","33.8755512","125.6814907","TEST")
    */

// 유저가 방문한 코스와 방문하지 않은 코스를 모두 가져오고 is_visited라는 키에 true & false로 값을 설정함

const course = async (req, res) => {
  const loginId = req.user.user_id;

  const QUERY = `
    SELECT
        c.course_id,
        c.course_name,
        c.course_latitude,
        c.course_longitude,
        c.course_QR,
	CASE
		WHEN uc.user_course_id IS NOT NULL THEN 'true'
		ELSE "false"
	END AS is_visited
    FROM
        course  c
    LEFT JOIN user_course uc ON c.course_id = uc.course_id AND uc.user_id = ? 
    `;

  // courseList에 sql문으로 받은 값을 넣어 클라이언트에게 전달
  const courseList = await db.execute(QUERY, [loginId]).then((result) => result[0]);
  return res.json({ status: "success", message: "코스 목록 조회에 성공하였습니다.", data: courseList });
};
module.exports = course;

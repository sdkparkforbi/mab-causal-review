// Vercel Serverless Function — DB에 저장된 리뷰 결과 조회 (대시보드용)
// GET /api/results  →  [{id, sample_id, reviewer, verdict, feedback, ...}]
import mysql from 'mysql2/promise';

function dbConfig() {
  if (process.env.DB_HOST) {
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4',
    };
  }
  return process.env.DATABASE_URL;
}

export default async function handler(req, res) {
  const cfg = dbConfig();
  if (!cfg) {
    return res.status(500).json({ error: 'DB 환경변수가 설정되지 않았습니다.', rows: [] });
  }
  let conn;
  try {
    conn = await mysql.createConnection(cfg);
    // 테이블이 아직 없을 수도 있으니 방어적으로 생성
    await conn.execute(`CREATE TABLE IF NOT EXISTS mab_causal_review_results (
      id BIGINT AUTO_INCREMENT PRIMARY KEY, sample_id VARCHAR(50), reviewer VARCHAR(100),
      verdict VARCHAR(20), feedback TEXT, cause VARCHAR(500), effect VARCHAR(500),
      relationship VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) CHARACTER SET utf8mb4`);
    const [rows] = await conn.query(
      `SELECT id, sample_id, reviewer, verdict, feedback, cause, effect, relationship, created_at
       FROM mab_causal_review_results ORDER BY created_at DESC LIMIT 2000`
    );
    return res.status(200).json({ rows });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e), rows: [] });
  } finally {
    if (conn) await conn.end();
  }
}

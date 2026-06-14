// Vercel Serverless Function — 리뷰 판정을 MySQL에 저장
// POST /api/review  body: {sample_id, reviewer, verdict, feedback, cause, effect, relationship}
import mysql from 'mysql2/promise';

function dbConfig() {
  // 권장: 개별 환경변수 (비밀번호에 특수문자가 있어도 안전)
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
  // 대안: 단일 연결 문자열
  return process.env.DATABASE_URL;
}

const CREATE = `CREATE TABLE IF NOT EXISTS mab_causal_review_results (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sample_id    VARCHAR(50),
  reviewer     VARCHAR(100),
  verdict      VARCHAR(20),
  feedback     TEXT,
  cause        VARCHAR(500),
  effect       VARCHAR(500),
  relationship VARCHAR(50),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  const cfg = dbConfig();
  if (!cfg) {
    return res.status(500).json({ error: 'DB 환경변수가 설정되지 않았습니다 (DB_HOST… 또는 DATABASE_URL).' });
  }

  const b = req.body || {};
  if (!b.reviewer || !b.verdict) {
    return res.status(400).json({ error: 'reviewer, verdict는 필수입니다.' });
  }

  let conn;
  try {
    conn = await mysql.createConnection(cfg);
    await conn.execute(CREATE);
    await conn.execute(
      `INSERT INTO mab_causal_review_results
         (sample_id, reviewer, verdict, feedback, cause, effect, relationship)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        String(b.sample_id ?? ''), String(b.reviewer), String(b.verdict),
        String(b.feedback ?? ''), String(b.cause ?? ''),
        String(b.effect ?? ''), String(b.relationship ?? ''),
      ]
    );
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  } finally {
    if (conn) await conn.end();
  }
}

# mab-causal-review

mAb 안정성 인과그래프의 **GPT 해석을 사람이 검수**하고, **리뷰 결과를 DB(MySQL)에 저장**하는 웹앱입니다.
**Vercel**에 배포하면 정적 프론트엔드 + 서버리스 함수(`/api`)가 함께 동작합니다.

## 구성

```
mab-causal-review/
├── index.html        # 검증 UI (적절/부적절 + 의견 → DB 저장, 로컬 백업)
├── dashboard.html    # DB에 쌓인 리뷰 결과 대시보드 (적절율·표·CSV)
├── samples.json      # 검증 샘플 (인과관계 + GPT 해석)
├── api/
│   ├── review.js     # POST: 판정을 mab_causal_review_results 테이블에 INSERT
│   └── results.js    # GET: 저장된 결과 조회 (대시보드용)
└── package.json      # mysql2
```

> ⚠️ **Vercel 전용**: `/api` 서버리스 함수는 Vercel에서만 동작합니다.
> GitHub Pages에 올리면 화면은 보이지만 DB 저장은 작동하지 않습니다(정적 호스팅이라 함수 실행 불가).

## DB 연결 — Vercel 환경변수

코드에는 접속정보가 없습니다. **Vercel 프로젝트 ▸ Settings ▸ Environment Variables**에 입력하세요(권장: 개별 변수).

| 변수 | 예시 |
|---|---|
| `DB_HOST` | `106.247.236.2` |
| `DB_PORT` | `3306` |
| `DB_USER` | `user2` |
| `DB_PASSWORD` | `********` |
| `DB_NAME` | `abswitch` |

또는 단일 문자열 `DATABASE_URL = mysql://user:pass@host:3306/db` 하나로도 됩니다(비밀번호 특수문자는 URL 인코딩 필요).

테이블은 첫 저장 시 자동 생성됩니다:

```sql
CREATE TABLE mab_causal_review_results (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sample_id VARCHAR(50), reviewer VARCHAR(100), verdict VARCHAR(20),
  feedback TEXT, cause VARCHAR(500), effect VARCHAR(500),
  relationship VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Vercel 배포

1. 이 폴더를 GitHub 저장소(public)에 올립니다.
2. [vercel.com](https://vercel.com) → **Add New ▸ Project ▸ Import** → 이 repo 선택
3. Framework Preset: **Other** → **Settings ▸ Environment Variables**에 위 DB 변수 입력
4. **Deploy** → `https://<프로젝트>.vercel.app`
   - 검증: `/` (index.html)
   - 대시보드: `/dashboard.html`

## 내 데이터로 바꾸기

`samples.json`을 3장 결과(`step3_edges.csv` 상위 엣지 + GPT 해석)로 교체하면 됩니다.

## 라이선스 / 용도

GenAIBiC 강의용 학습 자료. © 2026.

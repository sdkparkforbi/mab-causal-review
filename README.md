# mab-causal-review

mAb 안정성 인과그래프의 **GPT 해석을 사람이 검수**하는 **정적 웹앱**입니다.
서버·DB가 필요 없어 **Vercel** 또는 GitHub Pages에 그대로 배포됩니다.

> 주의: 이 앱은 STARG-LEE의 Streamlit 버전(`mab-review-app`)과 다른 **정적 구현**이며,
> 아마존 리뷰용 `review-validation`과도 무관한 별도 앱입니다.

## 구성

```
mab-causal-review/
├── index.html      # 검증 UI (CSS·JS 내장, 단일 파일로 동작)
├── samples.json    # 검증 샘플 (인과관계 + GPT 해석)
└── README.md
```

## 동작

- `samples.json`을 불러와 한 건씩 표시: `cause → [relationship] → effect`, 근거, GPT 해석
- 리뷰어가 **적절/부적절 + 의견**을 입력 → **브라우저 localStorage**에 저장
- 하위범주(physical/chemical/biological) 필터, 진행률, **적절율(%)** 요약
- **JSON 불러오기**(샘플 교체) / **결과 내보내기**(`mab_review_results.json`)

## 내 데이터로 바꾸기

`samples.json`을 아래 형식의 배열로 교체하면 됩니다.

```json
[
  {"id":1,"cause":"thermal stress","relationship":"promotes","effect":"aggregation",
   "subcat":"physical","polarity":"neg","evidence":"...","gpt":"GPT 해석 문장"}
]
```

3장에서 만든 `step3_edges.csv`의 상위 엣지에 GPT 해석을 붙여 생성할 수 있습니다.

## 로컬에서 보기

`fetch`로 `samples.json`을 읽으므로 간단한 서버가 필요합니다(더블클릭 시에도 내장 기본 샘플로 동작).

```bash
python -m http.server 8000   # http://localhost:8000
```

## Vercel 배포

1. 이 폴더를 GitHub 저장소(public)에 올립니다.
2. [vercel.com](https://vercel.com) → Add New ▸ Project ▸ Import → 이 repo 선택
3. Framework Preset: **Other**(정적) → **Deploy**
4. `https://<프로젝트>.vercel.app` 발급, 이후 `git push`마다 자동 재배포

## 라이선스 / 용도

GenAIBiC 강의용 학습 자료. © 2026.

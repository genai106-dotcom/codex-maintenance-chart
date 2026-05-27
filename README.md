# 장비 유지보수 비용 분석 차트

`Module2_데이터분석_실습자료`의 `장비유지보수_2022-2024.csv`를 분석해 만든 정적 HTML 차트입니다.

## 핵심 인사이트

- 2022년: 77건, 18,890,000원, 199.5시간
- 2023년: 79건, 22,283,000원, 222시간
- 2024년: 73건, 27,060,000원, 250시간
- 발생 건수는 비슷하거나 줄었지만 총 비용은 2022년 대비 2024년에 43.2% 증가했습니다.

## 파일

- `index.html`: 빌드 없이 바로 열 수 있는 단일 HTML 대시보드
- `tests/verify-site.mjs`: HTML에 들어간 집계값과 필수 문구를 확인하는 검증 스크립트

## 로컬 실행

브라우저에서 `index.html`을 열면 됩니다.

검증:

```powershell
& "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" .\tests\verify-site.mjs
& "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" .\tests\render-check.mjs
```

## 배포

배포 대상:

- GitHub 저장소: `codex-maintenance-chart`
- Vercel: 정적 사이트 배포

배포 URL: <https://codex-maintenance-chart.vercel.app>

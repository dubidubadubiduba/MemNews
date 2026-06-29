# ChipBird

> **"매일 아침 6시, 12시간 먼저 일어나는 Early bird — Chip bird와 함께 밤새 바뀐 반도체 판도를 확인하세요."**

삼성전자 메모리 반도체 사업부 담당자를 위한 맞춤형 뉴스레터 서비스.
매일 아침 6시(KST, **일요일 제외**), 최근 **18시간** 이내 영어권 뉴스를 한국어로 번역해 이메일로 발송.

- 배포 URL: https://memorynews-chipbird.vercel.app
- GitHub: https://github.com/dubidubadubiduba/memnews

---

## 서비스 흐름

```
비밀번호 입력(asdf) → 이메일 등록(개인정보 동의) → 키워드 선택 → 뉴스 피드 확인
```

매주 월~토 06:00 KST(= UTC 21:00) Vercel Cron이 `/api/send-newsletter`를 호출해 이메일 자동 발송.

---

## 기술 스택

- **Frontend/Backend**: Next.js 16 (App Router, JavaScript) / React 19
- **번역**: Claude Haiku (`claude-haiku-4-5-20251001`) — 고유명사 영문 원칙, Redis 캐시(24h TTL)
- **기사 전문 번역**: Claude Haiku — `/api/translate-article` (입력 12,000자 / 출력 8,192토큰, Redis 24h 캐시)
- **이메일 발송**: Brevo REST API (무료 300통/일, 발신 `gipunbam@gmail.com`)
- **유저 저장·캐시**: Upstash Redis (`@vercel/kv`)
- **배포**: Vercel serverless (관련 API maxDuration: 60s)

---

## 섹션 구조 (현재)

이메일/웹 모두: **The Signal(맨 위 풀폭) + 2×2 그리드(섹션 1~4)** 레이아웃.

| 위치 | 이름 | 상위 키워드 | 비고 |
|------|------|------------|------|
| 맨 위(풀폭) | **The Signal — Memory Impact** | — | 당사 Mem. 영향 분석. 전체 뉴스 기반 자동 분석, 항상 표시 |
| Section 1 | **제품/기술** | 13 (DDR, LPDDR, GDDR, SOCAMM, LPCAMM, HBM, CXL Memory, UFS, eMMC, SSD, ePOP, PIM, **CoWoS**) | |
| Section 2 | **응용** | 13 (Mobile, SVR, HBM, Consumer, **SOC**, **CPU/AP**, **AI·데이터센터**, **Foundry**, **Automotive**, eStorage, SSD, PC, Graphic) | |
| Section 3 | **고객** | 27 (Apple, Xiaomi, **OPPO**, **vivo**, Google, NVIDIA, AMD, Tesla, Hyundai, BYD … ) | |
| Section 4 | **Ref.** | 9 (SK Hynix, Micron, CXMT, YMTC, JHICC, Nanya, Kioxia, SanDisk, Solidigm) | 경쟁사 모니터링 |

- 설정 화면에서 **최대 20개** 키워드 선택. **각 섹션 최소 1개** 선택해야 저장 가능(빠진 섹션 경고).
- 섹션당 최대 10개 기사, 키워드당 최대 1개. 박스 높이 **450px 고정**(섹션 1~4).
- **이전 대비 변경**: `산업` 섹션 제거, 산업의 SOC/AI·데이터센터/Foundry/Automotive를 응용으로 이동, 응용의 Auto 삭제, 제품→제품/기술 개명 + CoWoS 추가, 고객에 OPPO/vivo 추가.

---

## 뉴스 우선순위 로직 (`lib/rss.js`)

각 상위 keyword당 최대 1개 기사를 다음 순서로 선택:

1. **직접소스 우선** — 전문보기가 안 되는 Google News 출처 기사는 후순위 (`isGoogle`)
2. **제목 매칭 수** — keyword 하위 쿼리가 제목에 포함된 수
3. **전체 매칭 수** — 제목+본문 합산 매칭 수
4. **최신순** — 동점 시 발행시각 최신 우선
5. **중복 제거** — **전 섹션 공유** dedup(`seen`)으로 같은 기사가 여러 섹션에 중복 노출되지 않음

### 검색 쿼리 매칭 (`phraseMatches`)
- 정확한 문자열 포함, 또는 쿼리 단어(3자 이상) 전부 본문 포함 시 매칭
- 상위 keyword 이름 자체도 쿼리에 포함

---

## 뉴스 수집 & 캐싱

- **수집 범위**: 최근 **18시간** (`lib/rss.js` cutoff)
- **결과 캐시**: 사용자·키워드 조합별 **30분** (`news:{email}:{hash}`) — 새로고침 깜빡임 방지, 번역 비용 절감. 강제 갱신: `/api/news?email=...&refresh=1`
- **피드 백업 캐시**: 피드별 **1시간** (`feed:{url}`) — 피드 실패 시 마지막 정상 수집분으로 폴백
- **번역 캐시**: 기사별 24h (`tr:{link}`), 전문 번역 24h (`full:{url}`)

---

## RSS 소스 (42개 · 영어)

| 분류 | 매체 |
|------|------|
| Apple | 9to5Mac, MacRumors |
| 기술 종합 | The Verge, Engadget, TechCrunch, Ars Technica, Wired |
| 하드웨어·반도체 | Tom's Hardware, IEEE Spectrum, EE Times, SemiAnalysis, SemiEngineering, TechPowerUp, The Register, The Next Platform, ServeTheHome, ExtremeTech |
| 스토리지·메모리·DC·GPU (직접소스) | StorageReview, Blocks&Files, DatacenterDynamics, TechSpot, VideoCardz |
| AI·비즈니스 | VentureBeat |
| **Google News 검색 RSS** | 반도체 토픽별 19종 (HBM, DDR5, LPDDR, NAND, GDDR, CXL, SSD, Foundry, CoWoS, AI DC, SoC, CPU, 메모리 시황, SK Hynix, Micron, Samsung, NVIDIA, automotive, 수출규제) |

- Google News는 관련 기사를 대량 확보하지만 링크가 암호화돼 **전문보기 불가** → 우선순위 후순위 + 전문보기 시 안내 메시지.

---

## 이메일 양식 (`lib/email-template.js`)

- **상단**: 파란 배경(#1428A0) + **흰색 로고 이미지**(`chipbird-logo-fixed.png`) + 날짜(KST)
- **The Signal — Memory Impact**: 맨 위 풀폭(아래 2열 그리드와 좌우 edge 정렬)
- **2×2 그리드**: 섹션 1~4, 박스 높이 450px 고정
- **각 기사**: 제목 위 **키워드 배지**(웹과 동일) → 한글 제목 → 요약 → 출처 + **📄 전문보기 ›** 버튼(`/read?url=...`)
- **하단**: 웹사이트 바로가기 버튼(로고는 제거됨)
- 모든 날짜 라벨은 `Asia/Seoul` 기준

---

## 발송(Cron) & 정확한 시각

- **스케줄**: `vercel.json` → `0 21 * * 0-5` = **월~토 06:00 KST**(UTC 21:00, 일요일 제외)
- **코드 가드** (`/api/send-newsletter`):
  - KST 일요일이면 발송 스킵
  - **하루 1회 잠금**: `newsletter-sent:{KST날짜}` (NX, 23h) — 다중 스케줄러 중복 발송 방지
- **인증** (셋 중 하나):
  1. 테스트 모드 `?test=send-test-9f3a&to=<email>` — 지정 1명에게만 발송(인증 불필요)
  2. Vercel Cron — `user-agent: vercel-cron` 자동 인식 (CRON_SECRET 미설정이어도 동작)
  3. `Authorization: Bearer <CRON_SECRET>` 또는 `?key=<CRON_SECRET>` — 외부 스케줄러용
- **정확히 06:00 발송**: Vercel Hobby 크론은 정시 ±1시간 오차가 있음. 정확한 :00이 필요하면 **외부 정밀 스케줄러**(예: cron-job.org)로 `…/api/send-newsletter?key=<CRON_SECRET>`를 06:00 Asia/Seoul·월~토로 호출. 하루 1회 잠금 덕분에 Vercel 크론과 동시 운영해도 중복 발송 없음.

### 테스트 발송 (구독자 전체에 안 보내고 1명만)
```
https://memorynews-chipbird.vercel.app/api/send-newsletter?test=send-test-9f3a&to=alwayshp2gth@naver.com
```

---

## 페이지 / API

```
app/
  page.js                    # 비밀번호 입력 (asdf)
  register/page.js           # 이메일 등록
  customize/page.js          # 키워드 선택 (최대 20 · 섹션별 최소 1 검증)
  news/page.js               # 뉴스 피드 (The Signal 풀폭 + 섹션 1~4, 키워드 배지, 번역 전문)
  read/page.js               # 기사 전문 번역 보기 페이지 (이메일 '전문보기' 대상)
  layout.js                  # 메타데이터(title: Chipbird, OG 이미지)
  api/
    users/route.js           # 유저 등록/조회 (Upstash KV)
    news/route.js            # 뉴스 조회 + 번역 + 분석 (+30분 결과 캐시)
    send-newsletter/route.js # 이메일 발송 (Cron/외부/테스트)
    translate-article/route.js # 기사 전문 번역 (Google News·빈본문 안내 처리)
lib/
  keywords.js                # 섹션·키워드·RSS 소스(42) 정의
  rss.js                     # RSS 수집/파싱/우선순위 그루핑(+피드 백업 캐시, 구글 후순위)
  translate.js               # Claude Haiku 번역 + The Signal 분석
  email-template.js          # 이메일 HTML 템플릿
  users.js                   # Upstash KV 유저 CRUD
public/
  chipbird-logo-fixed.png    # 흰색 로고(투명, 헤더용)
  chipbird-logo-white.png    # 원본 흰색 로고
  og.png                     # 공유 썸네일(삼성블루 배경 + 흰색 로고, 1200×630, 불투명)
vercel.json                  # Cron(0 21 * * 0-5) + 함수 maxDuration
```

---

## 로컬 개발

```bash
git clone https://github.com/dubidubadubiduba/memnews.git
cd memnews
npm install
npm run dev   # http://localhost:3000 → 비밀번호: asdf
```

### 환경변수 (`.env.local`)
```
ANTHROPIC_API_KEY=...
BREVO_API_KEY=...
CRON_SECRET=...                 # 외부 스케줄러(?key=) 사용 시 필요
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

---

## 필요한 외부 서비스

| 서비스 | 용도 | 무료 한도 |
|--------|------|-----------|
| Anthropic | 번역·전문번역·The Signal 분석 | 사용량 기반 |
| Brevo | 이메일 발송 | 300통/일 |
| Upstash (KV) | 유저·캐시 저장 | 500,000 req/월 |
| Vercel | 호스팅 + Cron | 무료 |
| (선택) cron-job.org | 정확한 06:00 발송 트리거 | 무료 |

---

## Changelog (이번 작업)

- **발송 안정화**: Cron이 GET을 보내는데 라우트가 POST만 받던 버그 수정 → GET/POST 모두 처리. Vercel Cron user-agent 인증 추가(CRON_SECRET 없이도 발송). 일요일 제외 + 하루 1회 잠금 + `?key=` 인증.
- **레이아웃**: 분석 박스를 **The Signal — Memory Impact**로 개명 + 맨 위 풀폭 이동, `산업` 섹션 제거 → 4섹션 2×2, 박스 450px 고정.
- **키워드**: 제품→제품/기술(+CoWoS), 응용에 SOC/AI·데이터센터/Foundry/Automotive 이동 + CPU/AP 추가(Auto 삭제), 고객에 OPPO/vivo 추가. 최대 20개 선택 + 섹션별 최소 1개 검증.
- **뉴스 품질**: 수집 18시간으로 확대, RSS 42개로 확장(무료 직접소스 + Google News 검색), 섹션 간 중복 제거, 결과 30분 캐시 + 피드 1h 백업, 구글뉴스 후순위.
- **이메일**: 상단 로고 이미지, 키워드 배지, 기사별 전문보기(`/read`), 하단 로고 제거, 날짜 KST.
- **공유 썸네일**: `public/og.png`(삼성블루 + 흰 로고) 정적 이미지로 연결.
- **번역 전문**: Google News·빈 본문일 때 엉뚱한 응답 대신 안내 메시지(캐시보다 먼저 처리).

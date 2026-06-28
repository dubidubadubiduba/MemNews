# ChipBird

> **"매일 아침 6시, 12시간 먼저 일어나는 Early bird — Chip bird와 함께 밤새 바뀐 반도체 판도를 확인하세요."**

삼성전자 메모리 반도체 사업부 담당자를 위한 맞춤형 뉴스레터 서비스.  
매일 아침 6시(KST), 최근 12시간 이내 영어권 뉴스를 한국어로 번역해 이메일로 발송.

배포 URL: https://mem-news-pi3h.vercel.app  
GitHub: https://github.com/dubidubadubiduba/Mem12h

---

## 서비스 흐름

```
비밀번호 입력(asdf) → 이메일 등록(개인정보 동의) → 키워드 선택 → 뉴스 피드 확인
```

매일 UTC 21:00 (한국 오전 6시) Vercel Cron이 `/api/send-newsletter`를 호출해 이메일 자동 발송.

---

## 기술 스택

- **Frontend/Backend**: Next.js 16 (App Router)
- **번역**: Claude Haiku (Anthropic API) — 고유명사 영문 원칙, Redis 캐시(24h TTL)
- **이메일 발송**: Brevo API (무료 300통/일, 도메인 불필요)
- **유저 저장·번역 캐시**: Upstash Redis (Vercel KV 마켓플레이스 연동)
- **배포**: Vercel (serverless maxDuration: 60s)

---

## 섹션 구조

| 섹션 | 이름 | 상위 키워드 수 | 비고 |
|------|------|---------------|------|
| Section 1 | 제품 | 12 (DDR, LPDDR, GDDR, SOCAMM, LPCAMM, HBM, CXL Memory, UFS, eMMC, SSD, ePOP, PIM) | 키워드당 최대 1개 |
| Section 2 | 응용 | 9 (Mobile, SVR, HBM, Consumer, Auto, eStorage, SSD, PC, Graphic) | 키워드당 최대 1개 |
| Section 3 | 고객 | 25 (Apple, NVIDIA, AMD, Tesla, Hyundai 등) | 키워드당 최대 1개 |
| Section 4 | 산업 | 10 (Big Tech, Mobile, SOC, AI·데이터센터, Foundry, 메모리 시황, 첨단 패키징, Automotive, 장비·소재, 지정학·통상) | 키워드당 최대 1개 |
| Section 5 | Ref. | 9 (SK Hynix, Micron, CXMT, YMTC, JHICC, Nanya, Kioxia, SanDisk, Solidigm) | 경쟁사 모니터링 |
| Section 6 | 당사 Mem. 영향 분석 | — | 전체 뉴스 기반 자동 분석 |

설정 화면에서 최대 **13개** 키워드 선택 가능. 섹션당 최대 10개 기사 표시, 카드 내 스크롤.

---

## 뉴스 우선순위 로직

각 상위 keyword당 최대 1개 기사를 다음 순서로 선택:

1. **제목 매칭 수** — 해당 keyword의 하위 검색 쿼리가 기사 제목에 몇 개 포함되는지 (많을수록 우선)
2. **전체 매칭 수** — 제목 + 본문 합산 매칭 수 (관련성 지표)
3. **최신순** — 동점이면 발행시각 최신 기사 우선
4. **중복 제거** — 이미 다른 keyword에서 선택된 기사는 건너뜀

섹션 내 총 10개 초과 시 중단.

---

## Section 6: 당사 Mem. 영향 분석

당일 번역된 모든 기사(최대 30개)를 Claude Haiku에게 전달해 삼성전자 Memory 반도체 사업부에 미칠 영향을 음슴체로 자동 분석. 키워드 선택 없이 항상 표시.

---

## 로컬 개발 환경 세팅

### 1. 레포 클론

```bash
git clone https://github.com/dubidubadubiduba/Mem12h.git
cd Mem12h
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```
ANTHROPIC_API_KEY=여기에_Claude_API_키
BREVO_API_KEY=여기에_Brevo_API_키
CRON_SECRET=Mem12h
KV_REST_API_URL=여기에_Upstash_URL
KV_REST_API_TOKEN=여기에_Upstash_TOKEN
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속 → 비밀번호: `asdf`

---

## Vercel 배포 (새 컴퓨터에서)

### 1. git 설정 및 푸시

```bash
git config --global user.email "gipunbam@gmail.com"
git config --global user.name "dubidubadubiduba"
git add .
git commit -m "커밋 메시지"
git push
```

### 2. Vercel 프로젝트 연결 (CLI)

```bash
vercel link --yes --project mem-news-pi3h --token <VERCEL_TOKEN>
```

### 3. 환경변수 설정

```bash
echo "키값" | vercel env add ANTHROPIC_API_KEY production --yes
echo "키값" | vercel env add BREVO_API_KEY production --yes
echo "Mem12h" | vercel env add CRON_SECRET production --yes
```

Upstash KV 환경변수는 Vercel 대시보드 → Storage → Upstash 연결 시 자동 추가됨.

### 4. 배포

```bash
vercel --prod --yes
```

---

## 필요한 외부 서비스 & API 키

| 서비스 | 용도 | 발급 위치 | 무료 한도 |
|--------|------|-----------|-----------|
| Anthropic | 번역 + 영향 분석 | console.anthropic.com | 사용량 기반 |
| Brevo | 이메일 발송 | app.brevo.com → Settings → API Keys | 300통/일 |
| Upstash | 유저 데이터 저장 (Redis) | Vercel 마켓플레이스 → Upstash 연결 | 500,000 req/월 |
| Vercel | 호스팅 + Cron | vercel.com | 무료 |

---

## 주요 파일 구조

```
app/
  page.js                    # 비밀번호 입력 페이지 (비밀번호: asdf)
  register/page.js           # 이메일 등록 페이지
  customize/page.js          # 키워드 선택 페이지
  news/page.js               # 뉴스 피드 페이지 (6개 섹션)
  api/
    users/route.js           # 유저 등록/조회 API (Upstash KV)
    news/route.js            # 뉴스 조회 + 번역 + 영향 분석 API
    send-newsletter/route.js # 이메일 발송 API (Cron 호출)
lib/
  keywords.js                # 상위 65개 키워드 + 하위 검색 쿼리 + RSS 소스 정의
  rss.js                     # RSS 수집, 파싱, 우선순위 기반 그루핑
  translate.js               # Claude Haiku 번역 + 당사 Mem. 영향 분석
  email-template.js          # 이메일 HTML 템플릿
  users.js                   # Upstash KV 유저 CRUD
vercel.json                  # Cron 설정 (매일 UTC 21:00 = KST 06:00)
memnews_keywords.md          # 키워드 체계 원본 문서 (상위 65 · 하위 630)
```

---

## 뉴스 번역 규칙

- 번역 모델: Claude Haiku (`claude-haiku-4-5-20251001`)
- 제목: 보고서체 (~함/~임/~됨), 40자 이내
- 본문 요약: 2~3문장 보고서체
- **회사명·제품명·브랜드명은 영문 원문 유지** (Samsung, NVIDIA, Apple 등)

---

## RSS 피드 (14개 · 영어 전용)

| 분류 | 매체 |
|------|------|
| 기술 종합 | The Verge, Engadget, TechCrunch, Ars Technica, Wired |
| 하드웨어·반도체 | Tom's Hardware, IEEE Spectrum, EE Times, SemiAnalysis, SemiEngineering |
| AI·비즈니스 | VentureBeat, AnandTech |
| Apple 전문 | 9to5Mac, MacRumors |

---

## Cron 발송 일정

- 발송 시각: 매일 오전 6시 (KST) = UTC 21:00
- 발송 대상: Upstash에 등록된 전체 유저
- 인증: `Authorization: Bearer <CRON_SECRET>` 헤더

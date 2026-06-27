# MemNews

반도체·메모리 업계 맞춤 뉴스레터 서비스.
매일 아침 7시, 선택한 키워드(DRAM/NAND/HBM 등) 관련 뉴스를 한국어로 번역해서 이메일로 발송.

배포 URL: https://mem-news-pi3h.vercel.app

---

## 서비스 흐름

```
비밀번호 입력(asdf) → 이메일 등록 → 키워드 선택 → 뉴스 피드 확인
```

매일 UTC 22:00 (한국 오전 7시) Vercel Cron이 `/api/send-newsletter`를 호출해 이메일 자동 발송.

---

## 기술 스택

- **Frontend/Backend**: Next.js 16 (App Router)
- **번역**: Claude Haiku (Anthropic API)
- **이메일 발송**: Brevo API
- **배포**: Vercel
- **유저 저장**: `data/users.json` (파일 기반)

---

## 로컬 개발 환경 세팅

### 1. 레포 클론

```bash
git clone https://github.com/dubidubadubiduba/MemNews.git
cd MemNews
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```
ANTHROPIC_API_KEY=여기에_Claude_API_키
BREVO_API_KEY=여기에_Brevo_API_키
CRON_SECRET=MemNews
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속 → 비밀번호: `asdf`

---

## Vercel 배포 (새 컴퓨터에서)

### 1. GitHub 푸시

```bash
git config --global user.email "gipunbam@gmail.com"
git config --global user.name "dubidubadubiduba"
git add .
git commit -m "커밋 메시지"
git push
```

### 2. Vercel 환경변수 설정 (CLI)

```bash
vercel link --yes --project mem-news-pi3h
echo "키값" | vercel env add ANTHROPIC_API_KEY production --yes
echo "키값" | vercel env add BREVO_API_KEY production --yes
echo "MemNews" | vercel env add CRON_SECRET production --yes
```

### 3. 배포

```bash
vercel --prod --yes
```

---

## 필요한 외부 서비스 & API 키

| 서비스 | 용도 | 발급 위치 |
|--------|------|-----------|
| Anthropic | 뉴스 한국어 번역 | console.anthropic.com |
| Brevo | 이메일 발송 (무료 300통/일) | app.brevo.com → Settings → API Keys |

---

## 주요 파일 구조

```
app/
  page.js              # 비밀번호 입력 페이지
  register/page.js     # 이메일 등록 페이지
  customize/page.js    # 키워드 선택 페이지
  news/page.js         # 뉴스 피드 페이지
  api/
    users/route.js         # 유저 등록/조회 API
    news/route.js          # 뉴스 조회 API
    send-newsletter/route.js  # 이메일 발송 API (Cron 호출)
lib/
  keywords.js          # 키워드 및 RSS 소스 정의
  rss.js               # RSS 수집 및 파싱
  translate.js         # Claude로 한국어 번역
  email-template.js    # 이메일 HTML 템플릿
  users.js             # 유저 데이터 읽기/쓰기
data/
  users.json           # 유저 데이터 저장소
vercel.json            # Cron 설정 (매일 UTC 22:00)
```

import { SECTIONS } from './keywords'

export function buildEmailHtml(groupedNews, date, analysis) {
  const dateStr = date || new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('. ', '/').replace('.', '')

  const sectionEntries = Object.entries(SECTIONS)

  function getFaviconUrl(link) {
    try {
      const domain = new URL(link).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
    } catch {
      return ''
    }
  }

  function renderArticle(article) {
    const faviconUrl = getFaviconUrl(article.link)
    const faviconImg = faviconUrl
      ? `<img src="${faviconUrl}" width="12" height="12" style="width:12px;height:12px;vertical-align:middle;margin-right:3px;border-radius:2px;display:inline-block;">`
      : ''
    return `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">
          <a href="${article.link}" style="color:#1428A0;text-decoration:none;font-weight:bold;font-size:13px;line-height:1.4;display:block;">
            ${article.title_ko || article.title}
          </a>
          <p style="margin:4px 0 0;font-size:12px;color:#555;line-height:1.5;">
            ${article.summary_ko || ''}
          </p>
          <span style="font-size:11px;color:#999;">${faviconImg}${article.source || ''}</span>
        </td>
      </tr>`
  }

  function renderSection(sectionName, sectionData, articles) {
    const rows = articles.length
      ? articles.map(renderArticle).join('')
      : `<tr><td style="padding:12px 0;color:#aaa;font-size:12px;">해당 뉴스 없음</td></tr>`

    const idx = Object.keys(SECTIONS).indexOf(sectionName) + 1

    return `
      <td valign="top" width="50%" style="padding:8px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background:${sectionData.color};padding:6px 10px;border-radius:4px 4px 0 0;">
              <span style="color:#fff;font-weight:bold;font-size:14px;">Section ${idx} — ${sectionName}</span>
            </td>
          </tr>
          <tr>
            <td style="background:#f9f9f9;padding:8px 10px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 4px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
            </td>
          </tr>
        </table>
      </td>`
  }

  function renderAnalysis(analysis, sectionIndex) {
    const chains = analysis?.chains || []
    const chainRows = chains.map(chain => `
      <tr>
        <td width="44%" style="background:#EEF1FF;border:1px solid #C7CFEE;border-radius:4px;padding:6px 8px;font-size:12px;color:#1428A0;font-weight:500;text-align:center;word-break:keep-all;">
          ${chain.trigger}
        </td>
        <td width="12%" style="text-align:center;font-size:14px;color:#888;padding:0 4px;">
          →<br><span style="font-size:10px;">${chain.positive ? '📈' : '⚠️'}</span>
        </td>
        <td width="44%" style="background:${chain.positive ? '#1428A0' : '#0A1931'};border-radius:4px;padding:6px 8px;font-size:12px;color:#fff;font-weight:600;text-align:center;word-break:keep-all;">
          ${chain.impact}
        </td>
      </tr>
      <tr><td colspan="3" style="height:6px;"></td></tr>`).join('')

    return `
      <td valign="top" width="50%" style="padding:8px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background:#475569;padding:6px 10px;border-radius:4px 4px 0 0;">
              <span style="color:#FBBF24;font-size:13px;">★</span>
              <span style="color:#fff;font-weight:bold;font-size:14px;margin-left:6px;">Section ${sectionIndex} — 당사 Mem. 영향 분석</span>
            </td>
          </tr>
          <tr>
            <td style="background:#f9f9f9;padding:10px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 4px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0">${chainRows || '<tr><td style="color:#aaa;font-size:12px;padding:8px 0;">분석 데이터 없음</td></tr>'}</table>
            </td>
          </tr>
        </table>
      </td>`
  }

  const [s1, s2, s3, s4, s5] = sectionEntries
  const analysisIndex = sectionEntries.length + 1

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ChipBird ${dateStr}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;">
  <tr>
    <td align="center" style="padding:20px 10px;">
      <table width="620" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1428A0;padding:18px 24px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:2px;">ChipBird</h1>
            <p style="margin:4px 0 0;color:#a0b4e8;font-size:12px;">${dateStr} 오늘의 ChipBird</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:12px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <!-- Row 1: Section 1, 2 -->
              <tr>
                ${renderSection(s1[0], s1[1], groupedNews[s1[0]] || [])}
                ${renderSection(s2[0], s2[1], groupedNews[s2[0]] || [])}
              </tr>
              <tr><td colspan="2" style="height:8px;"></td></tr>
              <!-- Row 2: Section 3, 4 -->
              <tr>
                ${renderSection(s3[0], s3[1], groupedNews[s3[0]] || [])}
                ${renderSection(s4[0], s4[1], groupedNews[s4[0]] || [])}
              </tr>
              <tr><td colspan="2" style="height:8px;"></td></tr>
              <!-- Row 3: Section 5, 6 -->
              <tr>
                ${renderSection(s5[0], s5[1], groupedNews[s5[0]] || [])}
                ${renderAnalysis(analysis, analysisIndex)}
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f4;padding:12px 24px;text-align:center;border-top:1px solid #eee;">
            <img src="https://mem-news-pi3h.vercel.app/chipbird-logo-black.png" alt="ChipBird" height="32" style="height:32px;display:block;margin:0 auto 6px;opacity:0.5;">
            <p style="margin:0;font-size:11px;color:#aaa;">본 뉴스레터는 매일 오전 6시에 발송됩니다</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

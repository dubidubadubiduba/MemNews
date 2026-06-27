import { SECTIONS } from './keywords'

export function buildEmailHtml(groupedNews, date) {
  const dateStr = date || new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('. ', '/').replace('.', '')

  const sectionEntries = Object.entries(SECTIONS)

  function renderArticle(article) {
    return `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">
          <a href="${article.link}" style="color:#1428A0;text-decoration:none;font-weight:bold;font-size:13px;line-height:1.4;display:block;">
            ${article.title_ko || article.title}
          </a>
          <p style="margin:4px 0 0;font-size:12px;color:#555;line-height:1.5;">
            ${article.summary_ko || ''}
          </p>
          <span style="font-size:11px;color:#999;">${article.source || ''}</span>
        </td>
      </tr>`
  }

  function renderSection(sectionName, sectionData, articles) {
    const rows = articles.length
      ? articles.map(renderArticle).join('')
      : `<tr><td style="padding:12px 0;color:#aaa;font-size:12px;">해당 뉴스 없음</td></tr>`

    return `
      <td valign="top" width="50%" style="padding:8px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background:${sectionData.color};padding:6px 10px;border-radius:4px 4px 0 0;">
              <span style="color:#fff;font-weight:bold;font-size:14px;">Section ${Object.keys(SECTIONS).indexOf(sectionName) + 1} — ${sectionName}</span>
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

  const [s1, s2, s3, s4] = sectionEntries

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MemNews ${dateStr}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;">
  <tr>
    <td align="center" style="padding:20px 10px;">
      <table width="620" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1428A0;padding:18px 24px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:2px;">MemNews</h1>
            <p style="margin:4px 0 0;color:#a0b4e8;font-size:12px;">${dateStr} 오늘의 MemNews</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:12px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <!-- Row 1 -->
              <tr>
                ${renderSection(s1[0], s1[1], groupedNews[s1[0]] || [])}
                ${renderSection(s2[0], s2[1], groupedNews[s2[0]] || [])}
              </tr>
              <tr><td colspan="2" style="height:8px;"></td></tr>
              <!-- Row 2 -->
              <tr>
                ${renderSection(s3[0], s3[1], groupedNews[s3[0]] || [])}
                ${renderSection(s4[0], s4[1], groupedNews[s4[0]] || [])}
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f4;padding:12px 24px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:11px;color:#aaa;">본 뉴스레터는 매일 오전 7시에 발송됩니다 · MemNews</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

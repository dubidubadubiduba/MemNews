export const SECTIONS = {
  제품: {
    label: '제품',
    color: '#1428A0',
    keywords: {
      DRAM: ['DRAM', 'DDR5', 'DDR4', 'LPDDR', 'LPDDR5', 'dynamic random access memory', 'memory chip', 'memory module'],
      NAND: ['NAND', 'NAND flash', 'flash memory', '3D NAND', 'V-NAND', 'SLC', 'MLC', 'TLC', 'QLC', 'PLC', 'flash storage'],
    },
  },
  응용: {
    label: '응용',
    color: '#0A1931',
    keywords: {
      Mobile: ['mobile memory', 'smartphone memory', '5G modem', 'mobile DRAM', 'mobile chip'],
      SVR: ['server DRAM', 'server memory', 'data center memory', 'RDIMM', 'LRDIMM', 'server storage'],
      HBM: ['HBM', 'High Bandwidth Memory', 'HBM2', 'HBM3', 'HBM2e', 'HBM3e', 'high bandwidth'],
      Consumer: ['consumer electronics', 'PC memory', 'gaming memory', 'desktop RAM', 'laptop memory'],
      Auto: ['automotive memory', 'automotive NAND', 'automotive storage', 'vehicle memory', 'autonomous driving chip'],
      eStorage: ['eMMC', 'UFS', 'embedded storage', 'embedded flash', 'eStorage', 'UFS 4.0'],
      SSD: ['SSD', 'solid state drive', 'NVMe', 'PCIe SSD', 'enterprise SSD', 'consumer SSD'],
    },
  },
  고객: {
    label: '고객',
    color: '#1428A0',
    keywords: {
      Apple: ['Apple', 'iPhone', 'iPad', 'MacBook', 'Tim Cook', 'iOS', 'Apple Silicon', 'M1', 'M2', 'M3', 'M4'],
      Nvidia: ['Nvidia', 'NVIDIA', 'H100', 'H200', 'B100', 'B200', 'Blackwell', 'Jensen Huang', 'AI chip', 'GPU memory'],
      'MS Soft': ['Microsoft', 'Azure', 'Windows', 'Satya Nadella', 'Copilot', 'Azure AI'],
      Google: ['Google', 'Alphabet', 'Android', 'Sundar Pichai', 'Gemini', 'TPU', 'Google Cloud'],
    },
  },
  산업: {
    label: '산업',
    color: '#0A1931',
    keywords: {
      'Big Tech': ['Amazon', 'AWS', 'Meta', 'OpenAI', 'semiconductor industry', 'chip industry', 'memory market'],
      Mobile: ['Qualcomm', 'MediaTek', 'ARM', 'Snapdragon', 'Dimensity', 'mobile processor', 'application processor'],
      SOC: ['SoC', 'SOC', 'system on chip', 'chiplet', 'TSMC', 'Intel Foundry', 'Samsung foundry', 'fab', 'wafer'],
    },
  },
}

export const SECTION_KEYS = Object.keys(SECTIONS)

export const ALL_KEYWORDS = Object.entries(SECTIONS).reduce((acc, [section, data]) => {
  Object.keys(data.keywords).forEach(kw => {
    acc[kw] = section
  })
  return acc
}, {})

export const RSS_SOURCES = [
  // English - Apple
  { url: 'https://9to5mac.com/feed/', tags: ['Apple'] },
  { url: 'https://feeds.macrumors.com/MacRumors-All', tags: ['Apple'] },
  // English - General Tech
  { url: 'https://www.theverge.com/rss/index.xml', tags: ['Mobile', 'Big Tech', 'Consumer'] },
  { url: 'https://www.engadget.com/rss.xml', tags: ['Mobile', 'Consumer'] },
  { url: 'https://techcrunch.com/feed/', tags: ['Big Tech', 'Mobile', 'SVR'] },
  { url: 'http://feeds.arstechnica.com/arstechnica/index.rss', tags: ['Big Tech', 'Consumer', 'Auto'] },
  { url: 'https://www.wired.com/feed/rss', tags: ['Big Tech', 'Consumer', 'Auto'] },
  // English - Hardware / Semiconductor
  { url: 'https://www.tomshardware.com/feeds/all', tags: ['DRAM', 'NAND', 'SSD', 'Consumer'] },
  { url: 'https://spectrum.ieee.org/feeds/feed.rss', tags: ['DRAM', 'NAND', 'SOC', 'HBM'] },
  { url: 'https://www.eetimes.com/feed/', tags: ['DRAM', 'NAND', 'SOC', 'HBM', 'Auto'] },
  { url: 'https://semianalysis.com/feed/', tags: ['DRAM', 'NAND', 'HBM', 'SOC'] },
  { url: 'https://www.semiengineering.com/feed/', tags: ['DRAM', 'NAND', 'SOC', 'HBM'] },
  // English - AI / Nvidia
  { url: 'https://venturebeat.com/feed/', tags: ['Nvidia', 'Big Tech', 'SVR'] },
  // Japanese
  { url: 'https://jp.techcrunch.com/feed/', tags: ['Big Tech', 'Mobile', 'SOC'] },
  { url: 'https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml', tags: ['Mobile', 'Consumer', 'DRAM'] },
  { url: 'https://news.mynavi.jp/rss/index', tags: ['Consumer', 'Mobile', 'DRAM'] },
  { url: 'https://pc.watch.impress.co.jp/data/rss/1.0/pcw/feed.rdf', tags: ['Consumer', 'SSD', 'DRAM'] },
  { url: 'https://ascii.jp/rss.xml', tags: ['Consumer', 'Mobile', 'Big Tech'] },
  // Chinese
  { url: 'https://technode.com/feed/', tags: ['Big Tech', 'Mobile', 'SOC', 'Auto'] },
  { url: 'https://www.cgtn.com/subscribe/rss/technology.xml', tags: ['Big Tech', 'Mobile', 'SOC'] },
  { url: 'https://36kr.com/feed', tags: ['Big Tech', 'Mobile', 'SOC'] },
  { url: 'https://pandaily.com/feed/', tags: ['Big Tech', 'Mobile', 'SOC'] },
  { url: 'https://equalocean.com/feed', tags: ['Big Tech', 'Auto', 'SOC'] },
]

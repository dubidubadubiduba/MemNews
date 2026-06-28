export const SECTIONS = {
  제품: {
    label: '제품',
    color: '#1428A0',
    keywords: {
      DDR: [
        'DDR', 'DDR5', 'DDR4', 'RDIMM', 'MRDIMM',
        'SODIMM', 'UDIMM', 'server DRAM', 'DDR5 price',
        'DDR5 1c nm', 'DDR5 high speed',
      ],
      LPDDR: [
        'LPDDR', 'LPDDR5X', 'LPDDR5', 'LPDDR6', 'mobile DRAM',
        'on-device AI memory', 'LPDDR server', 'low power DRAM',
        'LPDDR price', 'smartphone memory', 'LPDDR5X 10667',
      ],
      GDDR: [
        'GDDR', 'GDDR7', 'GDDR6', 'GDDR6X', 'graphics memory',
        'GPU VRAM', 'GeForce RTX memory', 'Radeon memory',
        'gaming GPU memory', 'GDDR7 capacity', 'console GDDR',
      ],
      SOCAMM: [
        'SOCAMM', 'SOCAMM2', 'NVIDIA SOCAMM', 'SOCAMM Rubin',
        '192GB SOCAMM2', 'LPDDR server module', 'AI server LPDDR',
        'Samsung SK Hynix Micron SOCAMM', 'SOCAMM mass production',
        'SOCAMM RDIMM', 'SOCAMM JEDEC',
      ],
      LPCAMM: [
        'LPCAMM', 'LPCAMM2', 'CAMM2', 'laptop LPCAMM2', 'AI PC LPCAMM2',
        'modular LPDDR', 'LPCAMM2 SODIMM', 'Samsung Micron LPCAMM2',
        'LPCAMM2 JEDEC', 'serviceable LPDDR module', 'LPCAMM2 adoption',
      ],
      HBM: [
        'HBM', 'HBM3E', 'HBM4', 'HBM4E', 'HBM5',
        '16-Hi HBM', 'custom HBM', 'HBM base die',
        'HBM CoWoS', 'NVIDIA HBM supply', 'HBM demand',
      ],
      'CXL Memory': [
        'CXL memory', 'CXL memory module CMM', 'CXL memory expander',
        'CXL memory pooling', 'CXL 3.0', 'CXL memory tiering',
        'Samsung CMM CXL', 'CXL data center memory',
        'CXL switch', 'CXL controller', 'CXL adoption server',
      ],
      UFS: [
        'UFS', 'UFS 4.1', 'UFS 4.0', 'UFS 5.0', 'mobile storage',
        'smartphone NAND storage', 'UFS card', 'on-device AI storage',
        'UFS sequential speed', 'automotive UFS', 'UFS adoption flagship',
      ],
      eMMC: [
        'eMMC', 'eMMC 5.1', 'embedded storage', 'entry smartphone eMMC',
        'IoT eMMC storage', 'automotive eMMC', 'eMMC price',
        'low capacity NAND', 'eMMC UFS transition',
      ],
      SSD: [
        'SSD', 'PCIe Gen5 SSD', 'PCIe Gen6 SSD', 'NVMe SSD',
        'enterprise SSD', 'QLC SSD', 'TLC SSD',
        'SSD controller', 'M.2 SSD', 'portable SSD', 'SSD price',
      ],
      ePOP: [
        'ePOP', 'ePOP memory', 'eMCP', 'uMCP',
        'multichip package memory', 'wearable memory package',
        'IoT memory package', 'LPDDR eMMC package', 'compact memory package',
      ],
      PIM: [
        'PIM', 'processing in memory', 'HBM-PIM', 'LPDDR-PIM', 'CXL-PIM',
        'Samsung Aquabolt PIM', 'AI memory acceleration',
        'processing near memory', 'PIM commercialization',
      ],
    },
  },
  응용: {
    label: '응용',
    color: '#0A1931',
    keywords: {
      Mobile: [
        'mobile memory', 'mobile LPDDR', 'mobile storage', 'on-device AI',
        'Galaxy smartphone', 'iPhone', 'Snapdragon', 'Dimensity',
        'foldable phone', 'smart glasses', 'mobile DRAM',
      ],
      SVR: [
        'server memory', 'server DRAM', 'MRDIMM', 'AI server',
        'data center', 'CXL memory', 'hyperscaler',
        'AI server GPU', 'server CPU', 'enterprise SSD', 'memory shortage',
      ],
      HBM: [
        'HBM high bandwidth memory', 'HBM3E', 'HBM4', 'HBM4E',
        'HBM stack', 'custom HBM', 'HBM base die',
        'SK Hynix HBM', 'Micron HBM', 'HBM packaging', 'HBM5',
      ],
      Consumer: [
        'consumer electronics memory', 'PC DRAM', 'gaming GPU',
        'game console', 'smart TV', 'consumer SSD',
        'memory card', 'wearable', 'smart home', 'desktop RAM', 'RAM price',
      ],
      Auto: [
        'automotive memory', 'autonomous driving', 'ADAS',
        'NVIDIA Drive', 'Qualcomm automotive', 'Mobileye',
        'automotive infotainment', 'automotive grade memory',
        'software defined vehicle', 'EV chip',
      ],
      eStorage: [
        'enterprise storage', 'enterprise SSD', 'QLC SSD',
        'data center storage', 'NVMe SSD', 'EDSFF SSD',
        'all-flash array', 'high capacity SSD', 'AI storage',
        'PCIe Gen6 SSD', 'CXL storage',
      ],
      SSD: [
        'SSD solid state drive', 'PCIe Gen5 SSD', 'NVMe SSD',
        'Samsung SSD', 'M.2 SSD', 'SSD controller',
        'QLC SSD', 'TLC SSD', 'portable SSD', 'SSD price', 'PCIe Gen6 SSD',
      ],
      PC: [
        'PC memory', 'desktop RAM', 'laptop memory', 'AI PC',
        'Copilot PC', 'PC SSD', 'gaming PC',
        'workstation', 'Windows on Arm', 'PC shipments', 'PC DRAM',
      ],
      Graphic: [
        'graphics memory GPU', 'GDDR7', 'GDDR6', 'GPU memory',
        'GeForce RTX', 'Radeon', 'graphics card',
        'gaming GPU', 'workstation GPU', 'discrete GPU', 'VRAM',
      ],
    },
  },
  고객: {
    label: '고객',
    color: '#1428A0',
    keywords: {
      Apple: [
        'Apple', 'iPhone', 'Apple chip', 'Apple Mac', 'iPad',
        'Apple Intelligence', 'Vision Pro', 'Apple unified memory',
        'Apple memory supplier', 'Apple AI server', 'Apple TSMC',
      ],
      Xiaomi: [
        'Xiaomi', 'Xiaomi smartphone', 'Xiaomi flagship', 'Xiaomi memory',
        'Xiaomi storage', 'Xiaomi chip', 'Xiaomi EV',
        'Xiaomi smart home', 'Xiaomi wearable', 'Xiaomi tablet', 'Xiaomi AI',
      ],
      Google: [
        'Google', 'Google TPU', 'Google CPU', 'Google Gemini',
        'Google Pixel', 'Google Cloud', 'Google data center',
        'Google TPU memory', 'Android memory', 'Google custom chip', 'Waymo',
      ],
      Sony: [
        'Sony', 'PlayStation 5', 'PlayStation 6', 'PlayStation memory',
        'Sony image sensor', 'Sony camera', 'Sony TV',
        'Sony headphones', 'PlayStation SSD', 'Sony semiconductor', 'Sony VR',
      ],
      Nintendo: [
        'Nintendo', 'Switch 2', 'Switch 2 memory', 'Switch 2 storage',
        'Nintendo chip', 'Nintendo shipments', 'game card',
        'handheld console', 'Nintendo new hardware', 'Switch 2 RAM', 'Nintendo earnings',
      ],
      Microsoft: [
        'Microsoft', 'Microsoft Azure', 'Microsoft Maia', 'Microsoft Copilot',
        'Microsoft data center', 'Xbox', 'Surface',
        'Microsoft OpenAI', 'Microsoft custom chip', 'Azure storage', 'Copilot PC',
      ],
      Dell: [
        'Dell', 'Dell server', 'Dell AI server', 'Dell server memory',
        'Dell storage', 'Dell enterprise SSD', 'Dell laptop',
        'Dell Copilot PC', 'Dell GPU server', 'Dell data center', 'Dell earnings',
      ],
      HP: [
        'HP Inc', 'HP laptop', 'HP desktop', 'HP PC memory',
        'HP laptop SSD', 'HP Copilot PC', 'HP workstation',
        'HP gaming', 'HP printer', 'HP PC shipments', 'HP earnings',
      ],
      Lenovo: [
        'Lenovo', 'Lenovo laptop', 'Lenovo desktop', 'Lenovo server',
        'Lenovo AI server', 'Lenovo PC memory', 'Lenovo laptop SSD',
        'Lenovo Copilot PC', 'Lenovo gaming', 'Lenovo PC shipments', 'Lenovo earnings',
      ],
      'Amazon (AWS)': [
        'Amazon AWS', 'AWS Trainium', 'AWS Inferentia', 'AWS Graviton',
        'AWS data center', 'Amazon Bedrock', 'AWS custom chip',
        'AWS storage', 'AWS Trainium memory', 'Amazon Anthropic', 'Amazon AI investment',
      ],
      Meta: [
        'Meta Platforms', 'Meta MTIA', 'Meta AI capex', 'Meta Llama',
        'Meta data center', 'Meta GPU order', 'Meta custom chip',
        'Meta Quest', 'Meta HBM', 'Meta AI cluster', 'Meta data center power',
      ],
      NVIDIA: [
        'NVIDIA', 'NVIDIA Rubin', 'NVIDIA Blackwell', 'NVIDIA GB200',
        'NVIDIA HBM', 'NVIDIA data center', 'NVIDIA Drive',
        'GeForce RTX', 'NVIDIA server memory', 'NVIDIA NVLink', 'NVIDIA earnings',
      ],
      AMD: [
        'AMD', 'AMD Instinct', 'AMD HBM', 'AMD EPYC',
        'AMD Ryzen', 'AMD Radeon', 'AMD data center',
        'AMD AI chip', 'AMD Xilinx', 'AMD automotive', 'AMD earnings',
      ],
      Tesla: [
        'Tesla', 'Tesla FSD chip', 'Tesla Dojo', 'Tesla autonomous driving',
        'Tesla memory', 'Tesla Optimus', 'Tesla AI cluster',
        'Tesla Samsung Foundry', 'Tesla infotainment', 'Tesla energy storage', 'Tesla GPU',
      ],
      Hyundai: [
        'Hyundai Motor', 'Hyundai Kia', 'Hyundai SDV', 'Hyundai autonomous driving',
        'Hyundai memory', 'Hyundai EV', 'Hyundai infotainment',
        'Hyundai NVIDIA', 'Hyundai Mobis', 'Hyundai ADAS', 'Hyundai chip',
      ],
      BYD: [
        'BYD', 'BYD EV', 'BYD smart car', 'BYD autonomous driving',
        'BYD memory', 'BYD infotainment', 'BYD battery',
        'BYD chip', 'BYD global expansion', 'BYD ADAS', 'BYD NVIDIA',
      ],
      ByteDance: [
        'ByteDance', 'TikTok', 'ByteDance data center', 'ByteDance GPU',
        'ByteDance chip', 'ByteDance Doubao', 'ByteDance cloud',
        'ByteDance HBM', 'ByteDance AI', 'ByteDance investment', 'ByteDance chip restriction',
      ],
      Alibaba: [
        'Alibaba', 'Alibaba Cloud', 'Alibaba chip', 'Alibaba CPU',
        'Alibaba AI chip', 'Alibaba Qwen', 'Alibaba data center',
        'Alibaba GPU', 'Alibaba storage', 'Alibaba AI', 'Alibaba chip restriction',
      ],
      Tencent: [
        'Tencent', 'Tencent Cloud', 'Tencent chip', 'Tencent Hunyuan',
        'Tencent data center', 'Tencent GPU', 'Tencent HBM',
        'Tencent infrastructure', 'Tencent AI', 'Tencent investment', 'Tencent chip restriction',
      ],
      Toshiba: [
        'Toshiba', 'Kioxia', 'Toshiba HDD', 'Toshiba storage',
        'Toshiba data center', 'Toshiba automotive', 'Toshiba semiconductor',
      ],
      SoftBank: [
        'SoftBank', 'SoftBank Arm', 'SoftBank Stargate', 'SoftBank OpenAI',
        'SoftBank AI infrastructure', 'SoftBank Ampere', 'SoftBank GPU',
        'SoftBank chip', 'SoftBank Vision Fund', 'SoftBank data center', 'SoftBank robotics',
      ],
      Toyota: [
        'Toyota', 'Toyota SDV', 'Toyota autonomous driving', 'Toyota memory',
        'Toyota EV', 'Toyota Woven', 'Toyota infotainment',
        'Toyota NVIDIA', 'Toyota chip', 'Toyota ADAS', 'Toyota earnings',
      ],
      BMW: [
        'BMW', 'BMW SDV', 'BMW autonomous driving', 'BMW memory',
        'BMW EV', 'BMW infotainment', 'BMW Qualcomm',
        'BMW ADAS', 'BMW chip', 'BMW cockpit', 'BMW earnings',
      ],
      'Mercedes-Benz': [
        'Mercedes-Benz', 'Mercedes SDV', 'Mercedes autonomous driving', 'Mercedes memory',
        'Mercedes EV', 'Mercedes infotainment', 'Mercedes NVIDIA',
        'Mercedes ADAS', 'Mercedes chip', 'Mercedes cockpit', 'Mercedes earnings',
      ],
      Volkswagen: [
        'Volkswagen', 'Volkswagen SDV', 'Volkswagen autonomous driving', 'Volkswagen memory',
        'Volkswagen EV', 'Volkswagen software', 'Volkswagen Rivian',
        'Volkswagen infotainment', 'Volkswagen ADAS', 'Volkswagen chip', 'Volkswagen earnings',
      ],
    },
  },
  산업: {
    label: '산업',
    color: '#0A1931',
    keywords: {
      'Big Tech': [
        'Big Tech AI', 'Big Tech capex', 'hyperscaler investment',
        'cloud providers', 'AI bubble', 'Big Tech earnings',
        'data center power', 'Big Tech antitrust', 'AI model competition',
        'custom silicon', 'Big Tech memory',
      ],
      Mobile: [
        'smartphone market', 'smartphone shipments', 'flagship smartphone',
        'mobile DRAM demand', 'Galaxy iPhone', 'China smartphone',
        'AI smartphone', 'foldable phone', 'smartphone storage',
        'mobile SoC', 'XR wearable',
      ],
      SOC: [
        'SoC semiconductor', 'mobile SoC', '2nm chip', 'NPU AI',
        'chiplet', 'Arm chip', 'RISC-V',
        'package on package', 'custom SoC', 'fabless', 'SoC memory bandwidth',
      ],
      'AI·데이터센터': [
        'AI data center', 'AI accelerator', 'data center capex',
        'AI server', 'HBM demand', 'AI inference',
        'data center cooling', 'hyperscaler spending', 'CXL memory',
        'co-packaged optics', 'memory wall',
      ],
      Foundry: [
        'semiconductor foundry', 'TSMC', 'Samsung Foundry', 'Intel Foundry',
        '2nm foundry', 'CoWoS capacity', 'HBM base die',
        'foundry capacity', 'GAA process', 'foundry orders', 'foundry market share',
      ],
      '메모리 시황': [
        'memory market DRAM NAND', 'DRAM price', 'NAND price',
        'memory supercycle', 'memory shortage', 'memory production capacity',
        'memory contract', 'DRAM spot price', 'memory forecast',
        'memory makers earnings', 'memory inventory',
      ],
      '첨단 패키징': [
        'advanced packaging', 'CoWoS', '2.5D 3D packaging', 'TSV',
        'hybrid bonding', 'UCIe chiplet', 'packaging capacity',
        'glass substrate', 'co-packaged optics', 'OSAT', 'HBM packaging',
      ],
      Automotive: [
        'automotive semiconductor', 'autonomous driving', 'software defined vehicle',
        'automotive memory', 'EV', 'ADAS',
        'automotive infotainment', 'automotive grade', 'carmaker chip', 'robotaxi',
      ],
      '장비·소재': [
        'semiconductor equipment materials', 'ASML', 'lithography equipment',
        'chip equipment makers', 'etch deposition', 'HBM equipment',
        'photoresist', 'silicon wafer', 'metrology',
        'Korea chip equipment', 'equipment orders',
      ],
      '지정학·통상': [
        'chip export', 'export control', 'CHIPS Act', 'chip tariff',
        'chip ban', 'chip sanctions', 'China chip', 'HBM export',
        'chip war', 'chip subsidy', 'chip supply chain',
        'semiconductor trade', 'chip restriction', 'chip onshoring',
      ],
    },
  },
  'Ref.': {
    label: 'Ref.',
    color: '#1428A0',
    keywords: {
      'SK Hynix': [
        'SK Hynix', 'SK Hynix HBM', 'SK Hynix DDR5', 'SK Hynix NAND',
        'SK Hynix earnings', 'SK Hynix capacity', 'SK Hynix NVIDIA',
        'SK Hynix fab', 'SK Hynix Solidigm', 'SK Hynix packaging', 'SK Hynix market share',
      ],
      Micron: [
        'Micron', 'Micron HBM', 'Micron DDR5', 'Micron NAND',
        'Micron earnings', 'Micron GDDR7', 'Micron fab',
        'Micron NVIDIA', 'Micron enterprise SSD', 'Micron AI memory', 'Micron market share',
      ],
      CXMT: [
        'CXMT', 'CXMT ChangXin', 'ChangXin Memory', 'CXMT DDR5',
        'CXMT LPDDR', 'CXMT HBM', 'CXMT DRAM',
        'CXMT fab', 'CXMT export curb', 'CXMT price', 'CXMT adoption', 'CXMT Huawei',
      ],
      YMTC: [
        'YMTC', 'Yangtze Memory', 'YMTC NAND', 'YMTC Xtacking',
        'YMTC NAND layers', 'YMTC China', 'YMTC fab',
        'YMTC export curb', 'YMTC equipment', 'YMTC HBM', 'YMTC SSD', 'YMTC market share',
      ],
      JHICC: [
        'JHICC', 'Fujian Jinhua', 'JHICC DRAM', 'JHICC DDR4',
        'JHICC China', 'JHICC sanction', 'JHICC niche memory', 'JHICC fab',
      ],
      Nanya: [
        'Nanya', 'Nanya Technology', 'Nanya DRAM', 'Nanya DDR5',
        'Nanya Taiwan', 'Nanya earnings', 'Nanya consumer', 'Nanya process',
      ],
      Kioxia: [
        'Kioxia', 'Kioxia NAND', 'Kioxia NAND layers', 'Kioxia earnings',
        'Kioxia IPO', 'Kioxia SanDisk', 'Kioxia enterprise SSD',
        'Kioxia HBF', 'Kioxia UFS', 'Kioxia fab', 'Kioxia market share',
      ],
      SanDisk: [
        'SanDisk', 'SanDisk NAND', 'SanDisk SSD', 'SanDisk memory card',
        'SanDisk spinoff', 'SanDisk Kioxia', 'SanDisk HBF',
        'SanDisk earnings', 'SanDisk portable SSD', 'SanDisk flash', 'SanDisk data center',
      ],
      Solidigm: [
        'Solidigm', 'Solidigm QLC', 'Solidigm enterprise SSD', 'Solidigm high capacity SSD',
        'Solidigm data center', 'Solidigm SK Hynix', 'Solidigm AI storage',
        'Solidigm SSD', 'Solidigm earnings',
      ],
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
  { url: 'https://9to5mac.com/feed/' },
  { url: 'https://feeds.macrumors.com/MacRumors-All' },
  // English - General Tech
  { url: 'https://www.theverge.com/rss/index.xml' },
  { url: 'https://www.engadget.com/rss.xml' },
  { url: 'https://techcrunch.com/feed/' },
  { url: 'http://feeds.arstechnica.com/arstechnica/index.rss' },
  { url: 'https://www.wired.com/feed/rss' },
  // English - Hardware / Semiconductor
  { url: 'https://www.tomshardware.com/feeds/all' },
  { url: 'https://spectrum.ieee.org/feeds/feed.rss' },
  { url: 'https://www.eetimes.com/feed/' },
  { url: 'https://semianalysis.com/feed/' },
  { url: 'https://www.semiengineering.com/feed/' },
  { url: 'https://www.techpowerup.com/rss/news.xml' },
  { url: 'https://www.theregister.com/headlines.atom' },
  { url: 'https://www.nextplatform.com/feed/' },
  { url: 'https://www.servethehome.com/feed/' },
  { url: 'https://www.extremetech.com/feed' },
  // English - AI / Business
  { url: 'https://venturebeat.com/feed/' },
]

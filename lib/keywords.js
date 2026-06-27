export const SECTIONS = {
  제품: {
    label: '제품',
    color: '#1428A0',
    keywords: {
      DRAM: [
        'DDR5', 'DDR4', 'LPDDR5X', 'LPDDR6', 'GDDR7',
        'MRDIMM', 'SOCAMM', 'CXL memory', '1c nm DRAM', '3D DRAM',
      ],
      NAND: [
        'V-NAND', '3D NAND', 'QLC NAND', 'TLC NAND', '400-layer NAND',
        'eMMC', 'UFS 4.1', 'UFS 5.0', 'High Bandwidth Flash', 'HBF',
        'NAND controller', 'NAND flash price', 'Kioxia NAND', 'Solidigm NAND',
      ],
    },
  },
  응용: {
    label: '응용',
    color: '#0A1931',
    keywords: {
      Mobile: [
        'mobile LPDDR', 'UFS mobile storage', 'on-device AI memory',
        'Galaxy smartphone memory', 'iPhone memory', 'Snapdragon mobile',
        'MediaTek Dimensity', 'foldable phone memory', 'XR glasses memory', 'mobile DRAM price',
      ],
      SVR: [
        'server DDR5 RDIMM', 'MRDIMM server', 'AI server memory',
        'data center memory', 'CXL memory pooling', 'hyperscaler capex',
        'GB200 NVL Rubin server', 'server CPU memory', 'enterprise SSD server', 'server memory shortage',
      ],
      HBM: [
        'HBM3E', 'HBM4', 'HBM4E', '16-Hi HBM', 'custom HBM',
        'HBM base die', 'SK Hynix HBM', 'Micron HBM', 'CoWoS HBM packaging', 'HBM5',
      ],
      Consumer: [
        'PC DRAM laptop', 'gaming GPU GDDR memory', 'game console memory',
        'smart TV memory', 'consumer SSD', 'memory card USB flash',
        'wearable device memory', 'IoT smart home memory', 'desktop DDR5 RAM', 'RAM price hike consumer',
      ],
      Auto: [
        'automotive memory', 'autonomous driving memory', 'ADAS chip',
        'NVIDIA Drive automotive', 'Qualcomm automotive Snapdragon', 'Mobileye',
        'automotive infotainment memory', 'automotive grade DRAM AEC-Q', 'software defined vehicle', 'EV electric vehicle chip',
      ],
      eStorage: [
        'enterprise SSD', 'QLC enterprise SSD', 'data center storage',
        'NVMe SSD', 'EDSFF E3.S SSD', 'all-flash array',
        '122TB SSD', 'AI storage GPU direct', 'PCIe Gen6 SSD', 'CXL storage tiering',
      ],
      SSD: [
        'PCIe Gen5 SSD', 'Samsung 9100 Pro SSD', 'M.2 SSD',
        'SSD controller', 'QLC SSD', 'TLC SSD',
        'portable SSD', 'SSD price', 'PCIe Gen6 SSD',
      ],
      PC: [
        'desktop DDR5 RAM', 'laptop LPDDR memory', 'AI PC',
        'Copilot+ PC NPU', 'client SSD PC', 'gaming PC memory',
        'workstation memory', 'Windows on Arm PC', 'PC shipments market', 'PC DRAM price',
      ],
      Graphic: [
        'GDDR7', 'GDDR6', 'GPU memory VRAM', 'GeForce RTX GDDR7',
        'AMD Radeon GDDR', 'graphics card memory', 'gaming GPU',
        'workstation GPU memory', 'discrete GPU', 'VRAM capacity',
      ],
    },
  },
  고객: {
    label: '고객',
    color: '#1428A0',
    keywords: {
      Apple: [
        'iPhone memory', 'Apple A19 chip', 'Apple M5 chip memory', 'iPad memory',
        'Apple Intelligence on-device', 'Apple Vision Pro memory', 'Apple unified memory',
        'Apple LPDDR supplier', 'Apple AI server chip', 'Apple TSMC',
      ],
      Xiaomi: [
        'Xiaomi smartphone shipments', 'Xiaomi 16 flagship', 'Xiaomi LPDDR memory', 'Xiaomi UFS storage',
        'Xiaomi XRing chip', 'Xiaomi SU7 EV', 'Xiaomi IoT smart home',
        'Xiaomi wearable', 'Xiaomi tablet', 'Xiaomi on-device AI',
      ],
      Google: [
        'Google TPU', 'Google Axion CPU', 'Google Gemini data center', 'Google Pixel Tensor',
        'Google Cloud AI', 'Google data center capex', 'Google TPU HBM',
        'Android memory', 'Google Broadcom TPU', 'Waymo chip',
      ],
      Sony: [
        'PlayStation 5 memory', 'PlayStation 6', 'PlayStation GDDR memory', 'Sony image sensor',
        'Sony Alpha camera', 'Sony Bravia TV', 'Sony headphones',
        'PS5 SSD storage', 'Sony semiconductor', 'PSVR2',
      ],
      Nintendo: [
        'Nintendo Switch 2', 'Switch 2 LPDDR5', 'Switch 2 storage UFS', 'Nintendo NVIDIA Tegra',
        'Nintendo console shipments', 'Nintendo game card', 'handheld console memory',
        'Nintendo new hardware', 'Switch 2 RAM', 'Nintendo earnings',
      ],
      Microsoft: [
        'Microsoft Azure AI', 'Microsoft Maia accelerator', 'Microsoft Copilot AI infrastructure', 'Microsoft data center capex',
        'Xbox memory', 'Surface device', 'Microsoft OpenAI compute',
        'Microsoft Cobalt CPU', 'Azure storage SSD', 'Copilot+ PC NPU',
      ],
      Dell: [
        'Dell PowerEdge server', 'Dell AI server', 'Dell server DDR5', 'Dell PowerStore storage',
        'Dell enterprise SSD', 'Dell XPS laptop', 'Dell Copilot PC',
        'Dell NVIDIA GPU server', 'Dell data center demand', 'Dell earnings',
      ],
      HP: [
        'HP laptop memory', 'HP desktop PC', 'HP PC DDR5', 'HP laptop SSD',
        'HP Copilot PC NPU', 'HP workstation', 'HP Omen gaming',
        'HP printer', 'HP PC shipments', 'HP earnings',
      ],
      Lenovo: [
        'Lenovo ThinkPad laptop', 'Lenovo desktop PC', 'Lenovo ThinkSystem server', 'Lenovo AI server',
        'Lenovo PC memory', 'Lenovo laptop SSD', 'Lenovo Copilot PC',
        'Lenovo Legion gaming', 'Lenovo PC shipments', 'Lenovo earnings',
      ],
      'Amazon (AWS)': [
        'AWS Trainium', 'AWS Inferentia', 'AWS Graviton', 'AWS data center capex',
        'Amazon Bedrock AI', 'Annapurna Labs chip', 'AWS storage SSD',
        'AWS Trainium HBM', 'Amazon Anthropic compute', 'Amazon AI infrastructure investment',
      ],
      Meta: [
        'Meta MTIA accelerator', 'Meta AI capex', 'Meta Llama compute', 'Meta data center',
        'Meta NVIDIA GPU order', 'Meta custom silicon Broadcom', 'Meta Quest XR memory',
        'Meta HBM', 'Meta networking AI cluster', 'Meta AI data center power',
      ],
      NVIDIA: [
        'NVIDIA Rubin', 'NVIDIA Blackwell B300', 'GB200 NVL72', 'NVIDIA HBM4',
        'NVIDIA data center GPU', 'NVIDIA Drive Thor', 'GeForce RTX GDDR7',
        'NVIDIA SOCAMM', 'NVIDIA NVLink CPO', 'NVIDIA AI demand earnings',
      ],
      AMD: [
        'AMD Instinct MI350', 'AMD Instinct MI400', 'AMD HBM4', 'AMD EPYC memory',
        'AMD Ryzen', 'AMD Radeon GDDR7', 'AMD data center AI',
        'AMD CDNA ROCm', 'AMD Xilinx embedded', 'AMD AI revenue',
      ],
      Tesla: [
        'Tesla FSD chip AI5', 'Tesla Dojo', 'Tesla autonomous driving', 'Tesla automotive memory',
        'Tesla Optimus chip', 'Tesla AI training cluster', 'Tesla Samsung Foundry AI5',
        'Tesla infotainment chip', 'Tesla energy storage', 'Tesla NVIDIA GPU',
      ],
      Hyundai: [
        'Hyundai Kia', 'Hyundai software defined vehicle', 'Hyundai autonomous driving', 'Hyundai automotive memory',
        'Hyundai Ioniq EV', 'Hyundai infotainment', 'Hyundai NVIDIA',
        'Hyundai Mobis', 'Hyundai ADAS', 'Hyundai in-house chip',
      ],
      BYD: [
        'BYD EV sales', 'BYD smart car', "BYD God's Eye autonomous", 'BYD automotive memory',
        'BYD infotainment', 'BYD battery', 'BYD automotive chip',
        'BYD global expansion', 'BYD ADAS', 'BYD NVIDIA chip',
      ],
      ByteDance: [
        'TikTok ByteDance', 'ByteDance AI data center', 'ByteDance NVIDIA GPU order', 'ByteDance custom AI chip',
        'ByteDance Doubao AI', 'ByteDance Volcano Engine cloud', 'ByteDance HBM',
        'ByteDance AI inference', 'ByteDance AI investment', 'ByteDance chip export restriction',
      ],
      Alibaba: [
        'Alibaba Cloud AI', 'Alibaba T-Head chip', 'Alibaba Yitian CPU', 'Alibaba Hanguang AI chip',
        'Alibaba Qwen AI', 'Alibaba data center capex', 'Alibaba HBM GPU',
        'Alibaba cloud storage', 'Alibaba AI inference', 'Alibaba chip restriction',
      ],
      Tencent: [
        'Tencent Cloud AI', 'Tencent Zixiao AI chip', 'Tencent Hunyuan AI', 'Tencent AI data center',
        'Tencent NVIDIA GPU', 'Tencent HBM', 'Tencent WeChat infrastructure',
        'Tencent AI inference', 'Tencent capex investment', 'Tencent chip restriction',
      ],
      Toshiba: [
        'Kioxia NAND', 'Toshiba HDD', 'Toshiba storage',
        'Toshiba data center', 'Toshiba automotive chip', 'Toshiba semiconductor',
      ],
      SoftBank: [
        'SoftBank Arm', 'SoftBank Stargate AI', 'SoftBank OpenAI investment', 'SoftBank AI infrastructure',
        'SoftBank Ampere Computing', 'SoftBank HBM GPU', 'SoftBank Graphcore AI chip',
        'SoftBank Vision Fund chip', 'SoftBank Japan data center', 'SoftBank robotics AI',
      ],
      Toyota: [
        'Toyota software defined vehicle', 'Toyota autonomous driving', 'Toyota automotive memory', 'Toyota bZ EV',
        'Woven by Toyota', 'Toyota infotainment', 'Toyota NVIDIA chip',
        'Toyota automotive semiconductor', 'Toyota ADAS', 'Toyota production earnings',
      ],
      BMW: [
        'BMW software defined vehicle', 'BMW autonomous driving', 'BMW automotive memory', 'BMW Neue Klasse EV',
        'BMW iDrive infotainment', 'BMW Qualcomm Mobileye', 'BMW ADAS',
        'BMW automotive chip', 'BMW digital cockpit', 'BMW production earnings',
      ],
      'Mercedes-Benz': [
        'Mercedes software defined vehicle', 'Mercedes Drive Pilot autonomous', 'Mercedes automotive memory', 'Mercedes EQ EV',
        'Mercedes MB.OS infotainment', 'Mercedes NVIDIA Drive', 'Mercedes ADAS',
        'Mercedes automotive chip', 'Mercedes Hyperscreen', 'Mercedes production earnings',
      ],
      Volkswagen: [
        'Volkswagen software defined vehicle', 'Volkswagen autonomous driving', 'Volkswagen automotive memory', 'Volkswagen ID EV',
        'Volkswagen CARIAD software', 'Volkswagen Rivian', 'Volkswagen infotainment',
        'Volkswagen ADAS', 'Volkswagen automotive chip', 'Volkswagen production earnings',
      ],
    },
  },
  산업: {
    label: '산업',
    color: '#0A1931',
    keywords: {
      'Big Tech': [
        'Big Tech AI capex', 'hyperscaler AI investment', 'AWS Azure Google Cloud',
        'AI bubble spending', 'Big Tech earnings', 'data center power demand',
        'Big Tech antitrust', 'OpenAI Google AI model', 'custom silicon hyperscaler', 'Big Tech memory order',
      ],
      Mobile: [
        'smartphone shipments', 'flagship smartphone launch', 'mobile DRAM demand',
        'Galaxy iPhone sales', 'China smartphone Xiaomi', 'AI smartphone',
        'foldable phone market', 'smartphone UFS adoption', 'mobile SoC competition', 'XR wearable market',
      ],
      SoC: [
        'mobile SoC competition', '2nm 3nm chip', 'NPU on-device AI SoC',
        'chiplet design', 'Arm architecture chip', 'RISC-V',
        'package on package memory', 'custom SoC ASIC', 'fabless semiconductor', 'SoC memory bandwidth LPDDR',
      ],
      'AI·데이터센터': [
        'AI accelerator GPU', 'data center capex', 'AI server demand',
        'HBM demand AI', 'AI inference chip', 'data center power cooling',
        'hyperscaler spending', 'CXL memory data center', 'co-packaged optics data center', 'memory wall AI',
      ],
      Foundry: [
        'TSMC foundry', 'Samsung Foundry 2nm', 'Intel Foundry 18A',
        '2nm foundry race', 'TSMC CoWoS capacity', 'foundry HBM base die',
        'foundry capacity expansion', 'gate all around GAA', 'foundry customer order', 'foundry market share',
      ],
      '메모리 시황': [
        'DRAM price increase', 'NAND flash price', 'memory supercycle',
        'memory shortage allocation', 'memory production capacity', 'memory long-term agreement',
        'DRAM spot price', 'TrendForce memory forecast', 'Samsung SK Hynix Micron earnings', 'memory inventory cycle',
      ],
      '첨단 패키징': [
        'CoWoS packaging', '2.5D 3D packaging', 'TSV HBM stacking',
        'hybrid bonding', 'chiplet UCIe', 'advanced packaging capacity',
        'glass substrate packaging', 'co-packaged optics', 'OSAT advanced packaging', 'custom HBM packaging',
      ],
      Automotive: [
        'automotive semiconductor', 'autonomous driving chip', 'software defined vehicle',
        'automotive memory demand', 'EV electric vehicle', 'ADAS market',
        'automotive infotainment', 'automotive grade chip', 'Tesla Hyundai chip', 'robotaxi Waymo',
      ],
      '장비·소재': [
        'ASML EUV', 'lithography equipment', 'Applied Materials Lam Research',
        'etch deposition equipment', 'HBM bonding equipment', 'photoresist semiconductor material',
        'silicon wafer supply', 'metrology inspection equipment', 'Korean semiconductor equipment', 'chip equipment orders',
      ],
      '지정학·통상': [
        'China chip export restrictions', 'US CHIPS Act', 'semiconductor tariff',
        'CXMT YMTC China memory', 'HBM export control China', 'chip supply chain',
        'semiconductor subsidy investment', 'US China chip war', 'chip onshoring fab US', 'chip export license',
      ],
    },
  },
  'Ref.': {
    label: 'Ref.',
    color: '#1428A0',
    keywords: {
      'SK Hynix': [
        'SK Hynix HBM4', 'SK Hynix DDR5', 'SK Hynix NAND', 'SK Hynix earnings',
        'SK Hynix capacity expansion', 'SK Hynix NVIDIA supply', 'SK Hynix Cheongju fab',
        'SK Hynix Solidigm', 'SK Hynix Indiana packaging', 'SK Hynix market share',
      ],
      Micron: [
        'Micron HBM4', 'Micron 1-gamma DDR5', 'Micron NAND', 'Micron earnings',
        'Micron GDDR7', 'Micron Idaho fab', 'Micron NVIDIA HBM',
        'Micron enterprise SSD', 'Micron HBM4E', 'Micron market share',
      ],
      CXMT: [
        'CXMT DDR5', 'CXMT LPDDR5X', 'CXMT HBM3', 'CXMT China DRAM',
        'CXMT fab expansion', 'CXMT export restriction', 'CXMT price cut DRAM',
        'CXMT HP Dell qualify', 'CXMT IPO', 'CXMT Huawei HBM',
      ],
      YMTC: [
        'YMTC 3D NAND', 'YMTC Xtacking', 'YMTC 294-layer NAND', 'YMTC China NAND',
        'YMTC Wuhan fab', 'YMTC export restriction', 'YMTC domestic equipment',
        'YMTC XMC HBM', 'YMTC Zhitai SSD', 'YMTC market share',
      ],
      JHICC: [
        'JHICC DRAM', 'JHICC DDR4', 'JHICC China memory',
        'JHICC Micron sanction', 'JHICC niche DRAM', 'JHICC fab',
      ],
      Nanya: [
        'Nanya DRAM', 'Nanya DDR5', 'Nanya Taiwan memory',
        'Nanya earnings', 'Nanya consumer DRAM', 'Nanya 10nm DRAM',
      ],
      Kioxia: [
        'Kioxia BiCS NAND', 'Kioxia 218-layer NAND', 'Kioxia earnings', 'Kioxia IPO Tokyo',
        'Kioxia SanDisk JV', 'Kioxia enterprise SSD', 'Kioxia High Bandwidth Flash',
        'Kioxia UFS', 'Kioxia Yokkaichi fab', 'Kioxia NAND market share',
      ],
      SanDisk: [
        'SanDisk NAND', 'SanDisk SSD', 'SanDisk memory card', 'SanDisk Western Digital spinoff',
        'SanDisk Kioxia', 'SanDisk High Bandwidth Flash', 'SanDisk earnings',
        'SanDisk portable SSD', 'SanDisk BiCS NAND', 'SanDisk data center SSD',
      ],
      Solidigm: [
        'Solidigm QLC SSD', 'Solidigm enterprise SSD', 'Solidigm 122TB SSD', 'Solidigm data center',
        'Solidigm SK Hynix', 'Solidigm AI storage', 'Solidigm D5-P5336', 'Solidigm earnings',
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
  // English - AI / Business
  { url: 'https://venturebeat.com/feed/' },
  { url: 'https://www.anandtech.com/rss/' },
  // Japanese
  { url: 'https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml' },
  { url: 'https://news.mynavi.jp/rss/index' },
  { url: 'https://pc.watch.impress.co.jp/data/rss/1.0/pcw/feed.rdf' },
  { url: 'https://ascii.jp/rss.xml' },
  // Chinese
  { url: 'https://technode.com/feed/' },
  { url: 'https://pandaily.com/feed/' },
  { url: 'https://equalocean.com/feed' },
]

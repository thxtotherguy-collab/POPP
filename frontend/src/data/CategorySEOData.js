// 100% original SEO content per category — SA irrigation & pump market focused
// NOT copied from any competitor. Written for POPP Pump & Tank Co.

const CATEGORY_SEO = {
  'booster-pumps': {
    h1: 'Booster Pumps',
    h2: 'Reliable Water Pressure Systems for South African Homes & Businesses',
    intro: `Whether you're dealing with inconsistent municipal supply, low-pressure taps, or a multi-storey building that needs water pushed to every floor, a quality booster pump is the solution. At POPP, we stock a carefully selected range of pressure booster systems from leading manufacturers including DAB, Grundfos, Zilmet, and Pascali — each chosen for proven performance in South African conditions. Our booster pumps cover everything from compact single-household units drawing as little as 0.37 kW, right up to intelligent inverter-driven systems that maintain constant pressure across four or more outlets simultaneously. Many of our units feature built-in dry-run protection, anti-cycling technology, and whisper-quiet operation — critical features for residential installations where noise matters. If you're unsure which system suits your property, use our Pump Finder tool or request a free sizing consultation. We'll recommend the right pump based on your flow requirements, head distance, and the number of taps or outlets you need to serve.`,
    applications: ['Residential pressure boosting', 'Multi-storey buildings', 'Townhouse complexes', 'Rainwater tank pressurisation', 'Commercial washrooms'],
    buyingGuide: {
      title: 'How to Choose the Right Booster Pump',
      points: [
        'Count your outlets — a 2-bathroom home typically needs 40–60 L/min flow rate',
        'Measure total head — include vertical height plus friction losses in your pipe run',
        'Consider inverter models for constant pressure and energy savings of up to 30%',
        'Check inlet/outlet sizes match your existing plumbing (most domestic units use 1" BSP)',
        'For municipal backup, ensure the pump handles intermittent supply without dry-running',
      ],
      link: '/pump-finder',
      linkText: 'Use our Pump Finder tool',
    },
    faq: [
      { q: 'What size booster pump do I need for a 3-bedroom house?', a: 'For a typical 3-bedroom South African home with 2 bathrooms, you need a pump delivering 40–60 L/min at 30–40m head. An inverter-driven unit like the DAB E.SYBOX Mini 3 or Grundfos SCALA2 handles this comfortably while maintaining consistent pressure even when multiple taps run simultaneously.' },
      { q: 'Can I use a booster pump with a JoJo tank?', a: 'Absolutely. Booster pumps are commonly paired with JoJo or similar storage tanks to pressurise water for household use. Connect the tank outlet to the pump inlet, and the pump delivers pressurised water throughout your home. Ensure your pump has dry-run protection in case the tank empties.' },
      { q: 'What is the difference between a peripheral and an inverter booster pump?', a: 'Peripheral pumps are simple, affordable units that run at a fixed speed — ideal for basic single-tap applications. Inverter booster pumps adjust their motor speed to match demand, delivering constant pressure regardless of how many outlets are open. Inverter units are quieter, more energy-efficient, and better suited to whole-house installations.' },
      { q: 'Do booster pumps use a lot of electricity?', a: 'Modern inverter booster pumps are highly efficient, typically consuming 0.37–0.8 kW. They only run when water is flowing, and variable-speed models reduce power consumption during low demand. Monthly running costs are minimal — comparable to a few light bulbs.' },
    ],
    relatedCategories: ['submersible-pumps', 'water-tanks', 'accessories'],
    metaTitle: 'Booster Pumps South Africa | Pressure Pumps for Home & Business | POPP',
    metaDescription: 'Shop quality booster pumps from DAB, Grundfos & Zilmet. Inverter-driven systems for constant water pressure. Free sizing advice. International delivery.',
  },

  'submersible-pumps': {
    h1: 'Submersible Pumps',
    h2: 'Versatile Underwater Pumping for Drainage, Wells & Water Features',
    intro: `Submersible pumps are designed to operate while fully or partially immersed in water, making them the go-to choice for applications ranging from garden features and rainwater harvesting to construction-site dewatering and sewage drainage. POPP stocks a range of submersible units suited to South African conditions — from compact 55-watt fountain pumps for garden ponds through to heavy-duty drainage pumps with float switches rated for dirty water and solids handling. Our submersible range includes clean-water models for pressurisation from tanks and wells, as well as dirty-water variants built to handle suspended particles, sand, and silt. Key features across our range include corrosion-resistant housings, thermal overload protection, and long submersible cable lengths for deep installations. Whether you need to drain a flooded basement, circulate water through a feature, or draw from a shallow well, we have a submersible pump to match. Not sure if you need a submersible or a borehole pump? As a rule of thumb, submersibles work best in open water or shallow wells under 20m, while borehole pumps are purpose-built for narrow deep wells.`,
    applications: ['Garden water features', 'Rainwater tank extraction', 'Basement & site dewatering', 'Sewage & drainage', 'Agricultural irrigation'],
    buyingGuide: {
      title: 'Choosing the Right Submersible Pump',
      points: [
        'Clean water or dirty water? — clean-water pumps have tighter tolerances and higher pressure; dirty-water pumps handle solids',
        'Check the maximum head — this determines how high the pump can push water vertically',
        'Look for a float switch if the pump will run unattended — it auto-stops when water drops',
        'Cable length matters — ensure the cable reaches your power source from the installation depth',
        'For dirty water, check the maximum particle size the pump can pass (typically 10–35mm)',
      ],
      link: '/pump-finder',
      linkText: 'Find the right submersible',
    },
    faq: [
      { q: 'Can I use a submersible pump in a borehole?', a: 'Standard submersible pumps are designed for open water sources, tanks, and shallow wells. For boreholes deeper than 10–15m with narrow casings, you need a dedicated borehole pump with the correct diameter (3" or 4") to fit inside the casing. Check our Borehole Pumps category for purpose-built models.' },
      { q: 'What does the float switch do on a submersible pump?', a: 'A float switch automatically turns the pump on when water rises above a set level and off when it drops below. This prevents the pump from running dry, which would damage the motor. It is essential for unattended drainage applications like sump pits or construction sites.' },
      { q: 'How deep can a submersible pump be installed?', a: 'Standard domestic submersible pumps operate at depths of 1–10 metres. The maximum depth depends on the cable length and the pump\'s head rating. For depths beyond 15m, consider a dedicated borehole pump designed for deep-well operation.' },
    ],
    relatedCategories: ['borehole-pumps', 'booster-pumps', 'accessories'],
    metaTitle: 'Submersible Pumps South Africa | Drainage & Water Feature Pumps | POPP',
    metaDescription: 'Quality submersible pumps for drainage, water features & tanks. Clean and dirty water models. Float switches, long cables. SA delivery from POPP.',
  },

  'borehole-pumps': {
    h1: 'Borehole Pumps',
    h2: 'Deep Well Extraction Systems for Farms, Estates & Off-Grid Properties',
    intro: `Borehole pumps are engineered to extract water from narrow, deep wells — a critical water source for South African farms, smallholdings, game lodges, and residential estates that sit beyond reliable municipal supply. Our range spans from economical 3-inch multi-stage units suitable for domestic boreholes up to 70m depth, through to solar-compatible systems from Grundfos that power remote installations entirely off-grid. Every borehole pump we stock is constructed from stainless steel and corrosion-resistant materials, built to withstand the abrasive conditions found in South African geological formations. Features include built-in check valves to prevent backflow, sand guards to protect against fine sediment, and multi-stage impellers that deliver high head pressure from considerable depths. Selecting the correct borehole pump requires knowing your borehole diameter, static water level, required yield, and total dynamic head. If you have a driller's report, send it through to us and we'll size the right pump for your installation. We also stock the control boxes, cables, and accessories needed for a complete borehole installation — browse our Accessories section for these.`,
    applications: ['Farm water supply', 'Residential estate boreholes', 'Off-grid & solar installations', 'Irrigation from underground sources', 'Game lodge & lodge water supply'],
    buyingGuide: {
      title: 'How to Select a Borehole Pump',
      points: [
        'Know your borehole diameter — 3" pumps fit narrow holes, 4" and 6" suit larger casings',
        'Check the static water level and drawdown to calculate total dynamic head',
        'Match the pump yield (L/min) to your borehole tested yield — never exceed it',
        'For remote sites without Eskom power, consider a solar-compatible system like the Grundfos SQFlex',
        'Include a borehole cable, control box, and non-return valve in your planning',
      ],
      link: '/contact',
      linkText: 'Send us your borehole report for free sizing',
    },
    faq: [
      { q: 'How do I know what size borehole pump I need?', a: 'You need three key numbers from your driller\'s report: borehole diameter, static water level, and tested yield. The pump diameter must fit your casing, its head rating must exceed the static level plus friction losses, and its flow rate must not exceed the borehole yield. Send us your driller\'s report and we\'ll size it for free.' },
      { q: 'Can I run a borehole pump on solar power?', a: 'Yes. The Grundfos SQFlex range is specifically designed for solar and wind power. It accepts 30–300V DC from solar panels or 90–240V AC from a generator or inverter. This makes it ideal for off-grid farms, lodges, and rural homesteads across South Africa.' },
      { q: 'How long does a borehole pump last?', a: 'Quality stainless-steel borehole pumps from brands like DAB and Grundfos typically last 8–15 years depending on water quality, run time, and correct sizing. Sand, iron, and low-pH water accelerate wear. Regular monitoring of flow rate and power consumption helps detect early signs of degradation.' },
      { q: 'What is the difference between a 3-inch and 4-inch borehole pump?', a: 'The measurement refers to the motor diameter. A 3" pump fits boreholes with a minimum 90mm casing — common in domestic and narrow drilled holes. A 4" pump requires a minimum 100mm casing and is typically used in larger agricultural or commercial boreholes where higher flow rates are needed.' },
    ],
    relatedCategories: ['submersible-pumps', 'accessories', 'water-tanks'],
    metaTitle: 'Borehole Pumps South Africa | Solar & Deep Well Pumps | POPP',
    metaDescription: 'Professional borehole pumps for SA farms & estates. 3" and 4" models, solar-compatible options. Free borehole sizing service. Nationwide delivery.',
  },

  'self-priming-pumps': {
    h1: 'Self-Priming Pumps',
    h2: 'Reliable Water Transfer & Irrigation Pumps That Prime Themselves',
    intro: `Self-priming pumps eliminate the hassle of manual priming — they automatically draw water from a source up to 8 metres below the pump, making them perfect for installations where the pump sits above the water level. This is the most common setup for irrigation from dams and rivers, transfer from JoJo tanks, and pressure boosting from ground-level reservoirs. POPP stocks a selected range of self-priming pumps from DAB and Zilmet, chosen for their robust construction and reliable suction capability in South African conditions. Our range includes compact 0.75 kW domestic units ideal for 2–3 taps, as well as larger 1 kW centrifugal models that handle irrigation duties with flow rates up to 80 L/min. Cast-iron housings and technopolymer impellers deliver durability while keeping weight manageable for surface-mounted installations. Self-priming pumps are an excellent choice when you need a surface-mounted unit that can pull water from a tank, dam, or well without needing the pump to sit below the water line. Pair them with an automatic pressure controller for hands-free operation that starts the pump when a tap opens and stops it when flow ceases.`,
    applications: ['Irrigation from dams & rivers', 'JoJo tank pressurisation', 'Rainwater harvesting', 'Garden & smallholding watering', 'General water transfer'],
    buyingGuide: {
      title: 'Selecting a Self-Priming Pump',
      points: [
        'Measure your suction lift — the vertical distance from water surface to pump (max ~8m for most models)',
        'Calculate the total head including delivery height and pipe friction losses',
        'For automatic operation, pair the pump with a pressure controller (sold separately)',
        'Check the pump casing material — cast iron for durability, technopolymer for corrosion resistance',
        'Ensure inlet and outlet sizes match your piping (typically 1" BSP for domestic models)',
      ],
      link: '/pump-finder',
      linkText: 'Use our Pump Finder tool',
    },
    faq: [
      { q: 'How high can a self-priming pump suck water?', a: 'Most self-priming pumps can draw water from up to 7–8 metres below the pump level. This is a physical limitation based on atmospheric pressure. If your water source is deeper than 8m, you\'ll need a submersible or borehole pump installed below the water line.' },
      { q: 'Do I need a controller with a self-priming pump?', a: 'If you want the pump to start and stop automatically when you open or close a tap, yes. A pressure controller detects when pressure drops (tap opened) and starts the pump, then stops it when pressure builds back up (tap closed). Without a controller, you must manually switch the pump on and off.' },
      { q: 'Can I use a self-priming pump for irrigation?', a: 'Absolutely. Self-priming pumps are one of the most popular choices for garden and smallholding irrigation in South Africa. They work well drawing from JoJo tanks, reservoirs, and dams. Choose a model with sufficient flow rate for your sprinkler or drip system requirements.' },
    ],
    relatedCategories: ['booster-pumps', 'accessories', 'water-tanks'],
    metaTitle: 'Self-Priming Pumps South Africa | Irrigation & Transfer Pumps | POPP',
    metaDescription: 'Quality self-priming pumps for irrigation, transfer & tank boosting. DAB & Zilmet models. Up to 8m suction lift. Free advice from POPP.',
  },

  'water-tanks': {
    h1: 'Water Tanks',
    h2: 'Durable Water Storage Solutions for Backup, Rainwater & Farming',
    intro: `With load shedding and inconsistent municipal supply affecting communities across South Africa, a reliable water storage tank has become essential infrastructure for homes, farms, and businesses alike. POPP stocks a range of water tanks from trusted brands, spanning compact 1,000-litre slimline units that fit against walls and fences, through to 10,000-litre vertical tanks for farms and commercial properties. All our tanks are manufactured from UV-stabilised polyethylene — engineered to withstand the intense South African sun without degradation, cracking, or discolouration. They come fitted with inlet strainers and overflow fittings, and carry manufacturer warranties of up to 8 years. We also offer complete backup water solutions that combine a storage tank with an integrated booster pump, giving you a plug-and-play system ready for immediate use. Whether you are storing rainwater, creating a municipal backup supply, or need bulk water for agricultural irrigation, we have the right tank and — if needed — the pump system to pressurise it. Request a consultation and our team will estimate the storage capacity your setup requires.`,
    applications: ['Municipal backup water storage', 'Rainwater harvesting', 'Farm & agricultural storage', 'Commercial water reserves', 'Integrated tank & pump systems'],
    buyingGuide: {
      title: 'Choosing the Right Water Tank',
      points: [
        'Calculate storage needs — a family of 4 uses roughly 800L per day at normal consumption',
        'Consider space constraints — slimline tanks fit narrow areas, vertical tanks need more footprint',
        'For rainwater harvesting, position the tank below your gutter downpipes with a first-flush diverter',
        'Ensure the base is level and can support the full weight (1,000L = 1,000 kg)',
        'If you need pressurised output, pair the tank with a booster pump from our range',
      ],
      link: '/consultation',
      linkText: 'Request a system consultation',
    },
    faq: [
      { q: 'What size water tank do I need for a family of 4?', a: 'A family of 4 uses approximately 600-800 litres per day at normal consumption. For 3 days of essential backup (reduced usage), a 2,500L tank is adequate. For full-comfort backup, consider 5,000L or more. Request a consultation and our team will provide a personalised estimate based on your household requirements.' },
      { q: 'Do JoJo tanks need a pump?', a: 'If the tank is elevated and gravity delivers sufficient pressure, you may not need a pump. However, most ground-level installations require a booster pump to pressurise the water for household use. We stock a range of booster pumps perfectly suited for tank applications.' },
      { q: 'How long do polyethylene water tanks last?', a: 'UV-stabilised polyethylene tanks from reputable manufacturers typically last 15–25 years. They carry warranties of 5–8 years against manufacturing defects. Avoid placing tanks in direct contact with sharp objects or chemicals, and ensure the base is flat and fully supported.' },
      { q: 'Can I connect my tank to the municipal supply for automatic refilling?', a: 'Yes. A ball valve (float valve) installed at the tank inlet will automatically refill the tank from municipal supply when the water level drops. This gives you a continuously topped-up reserve. Ensure a non-return valve is fitted to prevent contamination of the municipal supply.' },
      { q: 'What is the difference between a slimline and vertical tank?', a: 'Slimline tanks are narrow, flat-sided units designed to fit against walls and in tight spaces. Vertical tanks are round and offer more storage per footprint. Slimline tanks are ideal for urban properties with limited space; vertical tanks are better for farms and properties with more room.' },
    ],
    relatedCategories: ['booster-pumps', 'self-priming-pumps', 'accessories'],
    metaTitle: 'Water Tanks South Africa | Storage Tanks & Backup Systems | POPP',
    metaDescription: 'Quality water storage tanks from 1,000L to 10,000L. UV-stabilised polyethylene with 8-year warranty. Complete tank & pump backup systems. SA delivery.',
  },

  'accessories': {
    h1: 'Pump Accessories',
    h2: 'Essential Fittings, Controllers & Components for Your Pump System',
    intro: `A pump is only as reliable as the components supporting it. POPP stocks the essential accessories that complete your water system — from pressure control switches that automate pump operation, to expansion vessels that protect against water hammer and reduce motor cycling. Our accessories range is carefully curated to complement the pumps and tanks in our catalogue, ensuring compatibility and performance across your entire installation. Pressure control switches provide automatic start/stop operation based on system pressure, eliminating the need to manually switch pumps on and off. Pressure vessels (expansion tanks) store a reserve of pressurised water, reducing the frequency of pump starts and smoothing pressure fluctuations throughout your pipe network. We also carry the fittings, connectors, and valves needed for professional installations. Whether you're a homeowner setting up a basic rain tank and booster system or an installer fitting out a complete borehole installation, you'll find the supporting components here. Unsure what you need? Contact our team — we'll help you spec the right accessories for your setup.`,
    applications: ['Pump automation & control', 'Pressure stabilisation', 'Borehole installation accessories', 'Plumbing fittings & connectors', 'System protection & safety'],
    buyingGuide: {
      title: 'Essential Accessories for Your Pump Setup',
      points: [
        'A pressure switch is essential for automatic pump operation — size it to match your pump\'s pressure range',
        'Pressure vessels (expansion tanks) reduce pump cycling and smooth pressure — 24L suits most domestic setups',
        'For borehole installations, include a submersible cable, control box, and non-return valve',
        'Ensure fittings and connectors match your pipe size (BSP thread standard in South Africa)',
        'Consider a dry-run protector if your pump doesn\'t have one built in — it prevents motor damage when water supply runs out',
      ],
      link: '/contact',
      linkText: 'Get accessory advice from our team',
    },
    faq: [
      { q: 'Do I need a pressure vessel with my booster pump?', a: 'Many modern inverter booster pumps (like the DAB E.SYBOX) have a built-in pressure vessel. For standard fixed-speed pumps, adding a 24L pressure vessel is recommended — it reduces pump starts, extends motor life, and prevents the "pulsing" effect when demand is very low.' },
      { q: 'What is a pressure control switch?', a: 'A pressure control switch monitors system pressure and automatically starts the pump when pressure drops below the cut-in point (tap opened) and stops it when pressure reaches the cut-out point (tap closed). It is the most basic form of pump automation and is essential for unattended operation.' },
      { q: 'How do I choose the right pressure vessel size?', a: 'For single-pump domestic systems, a 24L vessel is the standard recommendation. It provides enough reserve to handle brief, low-demand draws (like flushing a toilet) without starting the pump. Larger systems with multiple pumps or high cycling frequency may need 50L or more.' },
    ],
    relatedCategories: ['booster-pumps', 'borehole-pumps', 'self-priming-pumps'],
    metaTitle: 'Pump Accessories South Africa | Controllers, Vessels & Fittings | POPP',
    metaDescription: 'Essential pump accessories — pressure switches, expansion vessels, fittings. Compatible with DAB, Grundfos, Zilmet. Complete your installation with POPP.',
  },
};

// Fallback for "all products" view
CATEGORY_SEO['all'] = {
  h1: 'All Products',
  h2: 'Complete Range of Pumps, Tanks & Accessories',
  intro: 'Browse our complete catalogue of water pumps, storage tanks, and system accessories. Use the filters to narrow down by category, brand, or technical specifications. Every product we stock is chosen for reliability and performance in South African conditions.',
  applications: [],
  buyingGuide: null,
  faq: [],
  relatedCategories: ['booster-pumps', 'submersible-pumps', 'borehole-pumps', 'water-tanks'],
  metaTitle: 'Water Pumps & Tanks South Africa | POPP Pump & Tank Co',
  metaDescription: 'Shop pumps, tanks & accessories from trusted brands. DAB, Grundfos, Zilmet, JoJo. Expert advice and international delivery from POPP.',
};

export default CATEGORY_SEO;

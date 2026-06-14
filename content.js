async function fetchHTML() {
    const searchQuery = new URLSearchParams(window.location.search).get("q");

    const urls = {
        "academic": {
            "urls": [
                "https://www.biodiversityheritagelibrary.org/",
                "https://www.cisl.cam.ac.uk/",
                "https://www.ciel.org/",
                "https://www.cochranelibrary.com/",
                "https://www.birds.cornell.edu/",
                "https://nicholas.duke.edu/",
                "https://www.earthsystemgovernance.org/",
                "https://www.ebsco.com/",
                "https://ehp.niehs.nih.gov/",
                "https://ifu.ethz.ch/en",
                "https://www.anglia.ac.uk/research/groups/global-sustainability-institute",
                "https://scholar.google.com/",
                "https://iclei.org/",
                "https://www.imperial.ac.uk/grantham/",
                "https://daily.jstor.org/",
                "https://www.mpic.de/en",
                "https://climate.mit.edu/",
                "https://www.nrcan.gc.ca/",
                "https://www.doc.govt.nz/",
                "https://www.ncbi.nlm.nih.gov/pmc/",
                "https://www.rainforest-alliance.org/",
                "https://www.researchgate.net/",
                "https://sciencebasedtargets.org/",
                "https://www.nier.go.kr/eng/",
                "https://www.bafu.admin.ch/bafu/en/index.html",
                "https://www.theclimategroup.org/",
                "https://ced.berkeley.edu/",
                "https://www.nus.edu.sg/",
                "https://www.tcd.ie/",
                "https://www.epa.gov/",
                "https://www.cbd.int/",
                "https://www.worldbank.org/en/topic/environment",
                "https://public.wmo.int/",
                "https://www.worldwildlife.org/",
                "https://www.wri.org/",
                "https://apparelcoalition.org/",
            ],
            "desc": [
                "Digital biodiversity resources, historical biological literature",
                "Sustainable business, environmental leadership, organizational change",
                "Environmental law, climate justice, litigation strategy",
                "Evidence - based healthcare, systematic reviews",
                "Bird research, citizen science, avian ecology",
                "Forest ecology, marine conservation, environmental policy",
                "Global environmental governance, sustainability science, policy integration",
                "Multidisciplinary research indexing, scholarly articles",
                "Environmental health, toxicology, public health",
                "Environmental technology, sustainability systems, industrial ecology",
                "Systems thinking, sustainability indicators, global change",
                "Scholarly article search, citation tracking, peer - reviewed content",
                "Municipal sustainability, climate action, local governance",
                "Climate science, policy analysis, carbon management",
                "Academic journal archive, humanities and sciences content",
                "Mexican climate policy, biodiversity, environmental research",
                "Conservation journalism, deforestation reporting, tropical biology",
                "Ocean science, marine biology, coastal research",
                "Climate policy, biodiversity protection, environmental monitoring",
                "Clean energy policy, grid modernization, energy transition",
                "Corporate climate targets, net - zero commitments, emissions reduction validation",
                "Environmental science news, research summaries, lay audience",
                "Air pollution, waste management, water quality research",
                "Corporate sustainability disclosure, ESG reporting",
                "Fashion sustainability, supply chain transparency, environmental impact reduction",
                "Academic expertise translation, environmental commentary, public education",
                "Urban planning, green infrastructure, environmental justice",
                "Climate negotiations, Paris Agreement, emissions reduction commitments",
                "Science - based advocacy, climate action, nuclear safety",
                "Science - based advocacy, climate action, nuclear safety",
                "Ocean science, weather, climate data, fisheries",
                "International weather cooperation, climate standards, atmospheric observations",
                "Environmental research collaboration, open science, data sharing",
                "Environmental research, climate solutions, sustainable resource use",
                "Corporate climate leadership, clean energy policy, emissions reduction",
                "Wildlife conservation, ecosystem protection, climate adaptation "
            ]
        },
        "government": {
            "urls": [
                "https://www.bom.gov.au/",
                "http://www.cma.gov.cn/en/",
                "https://www.climate.gov/",
                "https://www.energy.gov/",
                "https://www.dcceew.gov.au/",
                "https://www.canada.ca/en/services/environment/weather/ec-meteorological-service-canada.html",
                "https://www.eea.europa.eu/",
                "https://www.umweltbundesamt.de/en",
                "https://mausam.imd.gov.in/",
                "https://www.ipcc.ch/",
                "https://www.iea.org/",
                "https://www.imo.org/",
                "https://www.jma.go.jp/jma/en/",
                "https://www.inecc.gob.mx/",
                "https://www.gov.br/mma/pt-br",
                "https://www.nationalgeographic.org/",
                "https://www.nasa.gov/",
                "https://www.miljodirektoratet.no/en/",
                "https://www.oecd.org/environment/",
                "https://oceanconservancy.org/",
                "https://www.eci.ox.ac.uk/",
                "https://www.permalink.org.uk/",
                "https://www.fsb-tcfd.org/",
                "https://climateactiontracker.org/",
                "https://www.theecologist.org/",
                "https://www.usgs.gov/",
                "https://www.unep.org/",
                "https://unfccc.int/",
                "https://www.metoffice.gov.uk/",
                "https://www.mongabay.com/",
                "https://www.whoi.edu/",
                "https://www.gfi.org/",
            ],
            "desc": [
                "Weather forecasting, climate monitoring, cyclone tracking",
                "Weather forecasting, climate monitoring, atmospheric research",
                "Climate science education, U.S. climate data and impacts",
                "Energy efficiency, renewable energy research, nuclear technology",
                "Australian environmental protection, threatened species, environmental legislation",
                "Canadian environmental policy, air quality, water resources",
                "EU environmental monitoring, policy support, state of environment reporting",
                "Air quality, noise pollution, chemical safety, environmental standards",
                "Monsoon forecasting, weather prediction, climate services",
                "Climate science assessment, global warming projections",
                "Global energy analysis, renewable energy, energy efficiency",
                "Shipping regulations, marine pollution, maritime safety",
                "Seismic monitoring, weather prediction, climate analysis",
                "Brazilian environmental policy, Amazon protection, biodiversity management",
                "Climate solutions, research summaries, interactive tools",
                "Environmental financing, sustainable development, climate finance",
                "Native species protection, land management, conservation planning",
                "Ocean cleanup, marine protection, sustainable fishing, coastal conservation",
                "Environmental policy analysis, sustainability indicators, country comparisons",
                "Environmental change, sustainability science, policy research",
                "Climate adaptation, environmental change, policy integration",
                "Sustainable agriculture, forest certification, supply chain impact",
                "Climate financial risk, investor disclosure, climate accounting",
                "Environmental journalism, sustainability commentary, policy analysis",
                "Asian environmental technology, green engineering, urban ecology",
                "Urban sustainability, renewable energy, sustainable transport",
                "Earth observation, climate satellites, atmospheric science",
                "Environmental research collaboration, open science, data sharing",
                "Biomedical literature, life sciences research, open access",
                "Environmental journalism, documentaries, science communication",
                "Public lands protection, biodiversity conservation, environmental advocacy",
                "Environmental technology, climate science, renewable energy",
            ]
        },
        "private": {
            "urls": [
                "https://www.awf.org/",
                "https://www.anroev.org/",
                "https://www.birdlife.org/",
                "https://www.calacademy.org/",
                "https://www.cdp.net/",
                "https://www.carbontrust.com/",
                "https://www.ceres.org/",
                "https://cleanairasia.org/",
                "https://climatenetwork.org/",
                "https://www.climaterealityproject.org/",
                "https://www.conservation.org/",
                "https://www.coolearth.org/",
                "https://www.ellenmacarthurfoundation.org/",
                "https://www.edf.org/",
                "https://www.globalforestwatch.org/",
                "https://www.greenpeace.org/",
                "https://www.irena.org/",
                "https://www.iucn.org/",
                "https://ncar.ucar.edu/",
                "https://www.nrdc.org/",
                "https://www.noaa.gov/",
                "https://www.ox.ac.uk/",
                "https://www.sierraclub.org/",
                "https://www.si.edu/",
                "https://sustainability.stanford.edu/",
                "https://www.theconversation.com/us/environment",
                "https://www.nature.org/",
                "https://www.wilderness.org/",
                "https://www.titech.ac.jp/english/",
                "https://www.tsinghua.edu.cn/en/",
                "https://www.ucsusa.org/",
                "https://www.bio.ku.dk/english/",
                "https://pursuit.unimelb.edu.au/",
                "https://www5.usp.br/english/",
                "https://www.audubon.org/",
                "https://www.weizmann.ac.il/",
                "https://www.wiley.com/en-us/",
                "https://www.globalreporting.org/standards/",
                "https://www.ucs.org/resources/reports"
            ],
            "desc": [
                "African species protection, community conservation, habitat management",
                "Environmental justice, worker rights, pollution impacts on vulnerable communities",
                "Bird conservation, habitat restoration, environmental advocacy",
                "Museum science, biodiversity research, climate education",
                "Corporate emissions reporting, climate risk disclosure, investor engagement",
                "Carbon footprint assessment, emissions reduction, business sustainability",
                "Sustainable investing, corporate accountability, climate finance",
                "Asian air quality, transportation emissions, public health advocacy",
                "Global climate advocacy, coalition building, policy coordination",
                "Climate advocacy, education, grassroots mobilization",
                "Biodiversity hotspots, indigenous rights, ecosystem protection",
                "Rainforest conservation, indigenous partnerships, carbon preservation",
                "Circular economy principles, sustainable business models, systems redesign",
                "Environmental advocacy, market-based solutions, litigation support",
                "Forest monitoring, deforestation tracking, satellite data analysis",
                "Environmental campaigns, corporate accountability, climate action",
                "New renewable energy technologies and sustainable energy solutions",
                "Species conservation, Red List, ecosystem management standards",
                "Atmospheric science, weather modeling, climate research",
                "Forest management, minerals, energy, water resources",
                "Nordic environmental governance, regional cooperation, pollution control",
                "Researcher networking, academic paper sharing, collaboration platform",
                "Wilderness conservation, clean air/water advocacy, environmental justice:",
                "Natural history, ecology, conservation, biodiversity",
                "Sustainability education, environmental solutions, innovation",
                "Alternative proteins, sustainable food systems, food security",
                "Ecological research, biodiversity science, environmental studies",
                "Chinese climate policy, energy systems, economic sustainability",
                "Air quality, water protection, hazardous waste, environmental regulations",
                "Geological hazards, water resources, ecosystem monitoring",
                "Meteorology, climate projections, extreme weather forecasting",
                "Global environmental policy, ozone layer, chemicals management",
                "Southeast Asia sustainability, climate adaptation, development",
                "Biodiversity targets, ecosystem services, genetic resources",
                "Environmental law, clean energy, water protection",
                "Land/water conservation, climate solutions, habitat protection",
                "Scientific Journals",
                "Brazilian environmental research, tropical ecology, sustainability",
                "Wildlife conservation, ecosystem protection, climate adaptation"
            ]
        }

    };

    const response = await chrome.runtime.sendMessage({
        action: "getSimilarity",
        payload: [searchQuery, urls]
    });

    console.log("Model Response:", response);
    const topResult = response?.best;

    async function initSearch() {

        const sources = (response?.top || []).map((item) => item.url);

        const enriched = [];
        let successes = 0;
        for (const source of sources) {
            const result = await searchSite(searchQuery, source).catch((err) => ({
                error: String(err),
                fn: 'searchSite',
                url: source,
            }));
            if (!result) continue;
            enriched.push(result);
            if (!result.error && ++successes >= 3) break;
        }

        const enrichErrors = enriched.filter((r) => r && r.error);
        if (enrichErrors.length) {
            console.warn("Enrichment errors:", enrichErrors);
        }

        const validEnriched = enriched.filter((r) => r && r.url && !r.error);
        const cards = validEnriched.length
            ? validEnriched
            : (response?.top || []).map((r) => ({
                url: r.url,
                title: new URL(r.url).hostname.replace(/^www\./, ""),
                desc: r.desc,
                image: "",
            }));

        return cards;

    }

    // Score set based on experimentation
    // Used to identify environment focused results
    const minSimilarity = 0.2;
    if (topResult.score > minSimilarity) {

        const template = await fetch(chrome.runtime.getURL("sampleStructures/googleItem.html")).then(r => r.text());
        const doc = new DOMParser().parseFromString(template, "text/html");
        const styleEl = doc.querySelector("style");
        const cardTemplate = doc.querySelector(".g");

        const wrapper = document.createElement("div");
        if (styleEl) wrapper.appendChild(styleEl.cloneNode(true));

        const cards = await initSearch();

        cards.slice(0, 3).forEach((result) => {
            const card = cardTemplate.cloneNode(true);

            const href = result.link || result.url;
            const domain = new URL(href).hostname.replace(/^www\./, "");

            const titleEl = card.querySelector("#articleTitle");
            const descEl = card.querySelector("#articleDescription");
            const imgEl = card.querySelector("#articleImage");
            const link = card.querySelector("a.zReHs");
            const cont = card.querySelector(".cont");

            // Drop the template ids so the injected cards don't share duplicates.
            titleEl.removeAttribute("id");
            descEl.removeAttribute("id");
            if (imgEl) imgEl.removeAttribute("id");

            titleEl.textContent = result.title || domain;
            titleEl.style.whiteSpace = "nowrap";
            descEl.textContent = result.desc;
            if (link) link.href = href;

            if (imgEl && result.image) {
                imgEl.src = result.image;
                imgEl.alt = result.title || domain;
            }

            // Container hugs its title instead of stretching to full width.
            if (cont) cont.style.width = "fit-content";

            wrapper.appendChild(card);
        });

        const TopStuff = document.querySelector("#topstuff");
        TopStuff.style = "background-color: #87FF65; border-radius: 20px; padding: 20px; border: 2px solid black; margin-bottom: 20px; width: fit-content;";
        TopStuff.replaceChildren(wrapper);
    }
}

function extractTopResult(doc, source) {
    const organicCont = doc.querySelector('#search');
    if (!organicCont) {
        return {
            error: `No search results found: ${doc.documentElement.outerHTML.slice(0, 500)}`,
            fn: "extractTopResult",
            url: source
        };
    }
    const topCont = organicCont.querySelector('.yuRUbf');
    if (!topCont) {
        return {
            error: `Top Container is missing: ${organicCont.outerHTML.slice(0, 500)}`,
            fn: 'extractTopResult',
            url: source
        };
    }

    const botCont =
        organicCont.querySelector('.IsZvec') ||
        organicCont.querySelector('.VwiC3b') ||
        organicCont.querySelector('[data-sncf]');

    if (!botCont) {
        return {
            error: `Bottom Container is missing: ${organicCont.outerHTML.slice(0, 500)}`,
            fn: 'extractTopResult',
            url: source
        };
    }

    const findings = {
        title: topCont.querySelector('h3')?.textContent ?? null,
        link: topCont.querySelector('a')?.href ?? null,
        image: topCont.querySelector('img')?.src ?? null,
        desc: botCont.textContent ?? null,
        fn: 'extractTopResult',
        url: source
    };

    console.log('extractTopResult findings:', findings);
    return findings;
}

async function searchSite(searchQuery, source) {
    const q = encodeURIComponent(`${searchQuery} site:${source}`);

    let res;
    try {
        res = await fetch(`https://www.google.com/search?q=${q}&hl=en`, {
            credentials: 'include'
        });
    } catch (e) {
        return { error: `Fetch failed: ${e.message}`, fn: 'searchSite', url: source };
    }

    if (!res.ok) return { error: `HTTP ${res.status}`, fn: 'searchSite', url: source };

    const html = await res.text();

    if (!html) {
        return { error: 'Empty response body', fn: 'searchSite', url: source };
    }

    let doc;
    try {
        doc = new DOMParser().parseFromString(html, 'text/html');
    } catch (e) {
        doc = document.implementation.createHTMLDocument('');
        doc.documentElement.innerHTML = html;
    }

    if (!doc || !doc.body) {
        return { error: 'doc failed to initialize', fn: 'searchSite', url: source };
    }

    if (doc.querySelector('parsererror')) {
        return { error: 'Failed to parse HTML structure', fn: 'searchSite', url: source };
    }

    if (
        /consent\.google\.|\/sorry\//.test(res.url) ||
        doc.getElementById('recaptcha') ||
        doc.body.textContent.includes('unusual traffic')
    ) {
        return { error: 'Blocked by Google consent/bot wall', fn: 'searchSite', url: source };
    }

    const searchCont = doc.querySelector('#gevUs')

    if (!searchCont) {
        return {
            error: `Search container is missing: ${doc.documentElement.innerHTML.slice(0, 500)}`,
            fn: 'searchSite',
            url: source
        };
    }

    return extractTopResult(searchCont, source);
}

fetchHTML();
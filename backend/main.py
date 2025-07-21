import csv
import requests
from datetime import datetime
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import tempfile
import os

app = FastAPI()

# Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def build_ultra_advanced_perplexity_prompt(curator_csv, custom_date=None):
    # ...existing code from your backend...
    with open(curator_csv, newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)
        brand = None
        influencers, competitors = [], []
        influencer_links, competitor_links = [], []
        for row in reader:
            this_brand = row['brand'].strip()
            if not brand:
                brand = this_brand
            entry = f"{row['name']} "
            url_fields = ['youtube','instagram','reddit','twitter','linkedin']
            urls = [row[u] for u in url_fields if row.get(u)]
            if urls: entry += "(" + ", ".join(urls) + ")"
            if row['type'].lower().strip() == "influencer":
                influencers.append(row['name'])
                influencer_links.append(entry)
            elif row['type'].lower().strip() == "competitor":
                competitors.append(row['name'])
                competitor_links.append(entry)
    today = custom_date or datetime.now().strftime('%A, %B %d, %Y, %I:%M %p')
    influencer_block = "\n  - " + "\n  - ".join(influencer_links) if influencer_links else "None provided"
    competitor_block = "\n  - " + "\n  - ".join(competitor_links) if competitor_links else "None provided"
    prompt = f"""
You are an industry-leading executive intelligence analyst, specializing in deep competitor monitoring, public opinion mining, risk mapping, perception analysis, and market strategy for technology brands.

BRAND OF FOCUS: {brand}
As of {today}.

### Monitored Competitors:
{competitor_block}
### Monitored Influencers:
{influencer_block}

---

#### TASK INSTRUCTIONS (be exhaustive, nuanced, and critically evaluative):

1. **Priority Competitor & Influencer Expansion**
    - Surface and name the 10 most currently relevant, emergent, or high-risk competitors and influencers not already listed who have recently affected, threatened, or criticized {brand}. For every new entry: state the factor/trend/event that justifies their addition, and what segment of the public or what platforms have amplified their effect or risk.

2. **Negative Sentiment & Brand Critique Mapping (Deep Dive)**
    - For _each_ competitor and influencer (existing and new), identify and thoroughly dissect all major criticisms, negative viral topics, sarcastic social media posts, negative reviews, failed feature launches, negative comparisons, or public sentiment dips impacting {brand} in the last six months.
    - Provide direct quotes, paraphrased controversies, and explain precisely why consumers or press have chosen _not_ to select {brand} and instead favored a competitor (e.g., missing features, reliability, after-sales service, price, ecosystem lock-in, support cycles, incompatibility, community toxicity, privacy, innovation lag, anti-consumer moves, marketing missteps, etc.).
    - Where possible, cross-reference and cite which competitors or influencers originated or amplified each negative theme, and whether it appears to be a genuine concern, a competitor attack, an influencer's honest review, or an online rumor.
    - Specifically highlight _new_ or _escalating_ pain points, repeated customer complaints, trust failures, or technical loopholes that are causing churn or poor sentiment for {brand}.

3. **Why Consumers Choose Others: Switch-Out and Brand Erosion Analysis**
    - Analyze and summarize real, cited reasons (from reviews, forums, survey snapshots, or influencer posts) why people actively _switch away from_ {brand} or decline to choose it versus main competitors.
    - For at least three main rivals, detail their strengths (whether perceived or real) that are motivating customers to defect, such as better value, ecosystem integration, innovation cycles, feature maturity, critical marketing differentiation, or influencer advocacy.
    - If notable, highlight the _emotional motivators_ behind switching—whether stemming from peer trends, bad experiences, brand fatigue, or identity associations expressed online.

4. **Brand Vulnerability Matrix & Table**
    - Construct a matrix/table analyzing critical pain points, risks, and weaknesses unique to {brand} versus each primary competitor. Structure by row: pain point/risk, brand's status, comparison with each key competitor, short commentary (with supporting evidence).
    - Provide an executive summary beneath this table highlighting "red zones" (urgent, critical issues), "amber" (emerging risks), and "green" (areas where {brand} has recovered or improved recently).

5. **Detailed Brand vs. Competitor Specs, Positioning, and Marketing Table**
    - For each major competitor, compare product spec highlights, launch timelines, USP claims, influencer coverage frequency, pricing categories, ecosystem stickiness, innovation perception, customer loyalty, and major ongoing campaigns.

6. **Current Activities, Innovations, and Viral Moves**
    - For every top competitor/influencer, provide detailed outlines of their most important product releases, viral campaign launches, patent news, software updates, aggressive promotional pushes, and any moves that have directly or indirectly targeted {brand}'s customers.

7. **Integrated Public Sentiment & Narrative Analysis**
    - Compose a structured summary of _public image_ for {brand}. Split this into positive and negative sub-headings. For negative image, elaborate on:
        - The major recurring criticisms—citing precise influencer, reviewer, or community voices where possible
        - The role of user communities, tech press, or online rumors in amplifying problems
        - Qualitative sentiment trend analysis (trending negative or improving? overblown or genuine?)
        - Impactful incidents/events that shaped sentiment (scandals, product recalls, viral reviews.)

8. **Actionable Brand Recovery and Defense Recommendations**
    - Based on all above, recommend urgent comms, product, influencer, and support moves to address, mitigate, or reverse each major negative perception.
    - Suggest both outbound (new campaigns, partnerships) and inbound (customer experience, product roadmap, public apology if needed) responses, calibrated by the risk rating of each negative narrative mapped above.

---

**Format the output as an executive-level investigative report, with numbered headings, bullet-lists, tables, direct quoted evidence, sub-headings for negative themes, and bolded/flagged risk items. Maintain clear, fact-grounded, and actionable insight throughout. Clearly distinguish sourced negatives from general market buzz, and never “balance” for positivity if real market indicators or voices are negative or deteriorating.**
"""
    return prompt

def run_advanced_perplexity_brand_analysis(curator_csv, perplexity_api_key, custom_date=None):
    prompt = build_ultra_advanced_perplexity_prompt(curator_csv, custom_date=custom_date)
    api_url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {perplexity_api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "sonar",
        "messages": [
            {"role": "system", "content": "You are an expert LLM for rigorous, granular brand and reputation risk analysis, with competitive intelligence and deep sentiment tracking."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1
    }
    response = requests.post(api_url, headers=headers, json=data)
    response.raise_for_status()
    answer = response.json()["choices"][0]["message"]["content"]
    return answer

PERPLEXITY_API_KEY = os.environ.get("PERPLEXITY_API_KEY", "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")

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp.flush()
        tmp_path = tmp.name
    try:
        analysis = run_advanced_perplexity_brand_analysis(tmp_path, PERPLEXITY_API_KEY)
        return JSONResponse({"analysis": analysis})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    finally:
        os.unlink(tmp_path)

import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def fetch_html(url: str) -> BeautifulSoup:
    resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")

def parse_generic_recipe(url: str) -> dict:
    soup = fetch_html(url)

    title = soup.find("h1").get_text(strip=True) if soup.find("h1") else "Untitled"
    image_url = None
    if (img := soup.find("img")):
        image_url = img.get("src")

    ingredients = []
    for li in soup.select("li"):
        text = li.get_text(" ", strip=True).lower()
        if any(word in text for word in ["cup", "tbsp", "tsp", "g", "ml", "salt", "oil", "onion"]):
            ingredients.append(text)

    instructions = []
    for p in soup.select("p"):
        txt = p.get_text(" ", strip=True)
        if len(txt.split()) > 5 and any(word in txt.lower() for word in ["cook", "heat", "mix", "serve"]):
            instructions.append(txt)

    return {
        "title": title,
        "ingredients": ingredients,
        "instructions": "\n".join(instructions),
        "image_url": image_url,
        "source_url": url,
    }

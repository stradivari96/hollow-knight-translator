import json
import xml.etree.ElementTree as ET

from pathlib import Path

if __name__ == "__main__":
    xml_folder = Path("./DecodedText/")
    langs = [
        "DE",
        "EN",
        "ES",
        "FR",
        "IT",
        "JA",
        "KO",
        "PT",
        "RU",
        "ZH_TW",
        "ZH",
    ]

    result = {l: {} for l in langs}
    for file in xml_folder.iterdir():
        lang = file.name[:5]
        if lang != "ZH_TW":
            lang = file.name[:2]
        if lang not in langs:
            continue
        tree = ET.parse(file)
        root = tree.getroot()
        for i in root:
            if not i.text:
                continue
            text = i.text.replace("<br>", "\n")
            text = text.replace("<page>", "\n\n")
            text = text.replace("<Page>", "\n\n").strip()
            if text:
                result[lang][i.get("name")] = text
    with open("src/all_text.json", "w", encoding="UTF-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

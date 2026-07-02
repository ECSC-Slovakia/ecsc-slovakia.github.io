# Slovak Cyber Team — web

Nová statická stránka pre [Slovak Cyber Team](https://cyberteam.sk) — slovenskú reprezentáciu na European Cybersecurity Challenge (ECSC).

Čistá statika: **HTML + CSS + vanilla JS, žiadny build, žiadne závislosti.** Stačí nahrať súbory na akýkoľvek statický hosting.

## Štruktúra

```
index.html          hlavná one-page stránka (hero, tím, úspechy, o ECSC, história, galéria, partneri, pridaj sa)
ecsc-2022.html      archív ročníka — Viedeň
ecsc-2023.html      archív ročníka — Hamar
ecsc-2024.html      archív ročníka — Turín
ecsc-2025.html      archív ročníka — Varšava (4. miesto 🎉)
css/style.css       celý dizajn (farby/typografia hore v :root premenných)
js/main.js          menu, animácie, modaly, lightbox, easter eggy
js/i18n.js          prepínanie SK/EN
assets/             obrázky, circuit.svg (pozadie), favicon
```

## Jazyky (SK/EN)

- Slovenčina je zapísaná priamo v HTML (funguje aj bez JavaScriptu).
- Angličtina žije v slovníku `window.I18N_EN` na konci každej stránky; prvky sú spárované cez `data-i18n="kľúč"`.
- Jazyk sa volí automaticky podľa jazyka prehliadača (`sk*` → SK, inak EN), dá sa prepnúť tlačidlom SK/EN (uloží sa do `localStorage`) alebo vynútiť cez `?lang=en` / `?lang=sk`.

**Úprava textu:** zmeň slovenský text v HTML a k nemu prislúchajúci kľúč v `I18N_EN` na tej istej stránke.

## Ako pridať člena tímu

Skopíruj blok `<article class="member">…</article>` v `index.html`, vymeň fotku (`assets/img/`), meno, rolu a školu. Bio patrí do `<div class="member__bio" hidden data-i18n="bio.priezvisko">` + anglická verzia do `I18N_EN` pod rovnakým kľúčom. Karty bez `member__bio` modal neotvárajú.

## Nasadenie na GitHub Pages

1. Vytvor repozitár na GitHube (napr. `slovakcyberteam/web`).
2. ```bash
   git remote add origin git@github.com:ORG/REPO.git
   git push -u origin main
   ```
3. Na GitHube: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / root**.
4. Stránka beží na `https://ORG.github.io/REPO/`.

### Vlastná doména (cyberteam.sk)

1. V **Settings → Pages → Custom domain** zadaj `cyberteam.sk` (GitHub vytvorí súbor `CNAME`).
2. V DNS nastav `A` záznamy na GitHub Pages IP (185.199.108.153, .109., .110., .111.) alebo `CNAME` na `ORG.github.io` pre subdoménu `www`.
3. Zapni **Enforce HTTPS**.

## Lokálny vývoj

```bash
python3 -m http.server 4173
# → http://localhost:4173
```

## Easter eggs 🥚

Otvor konzolu… alebo skús ↑↑↓↓←→←→BA.

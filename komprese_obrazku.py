import os
from PIL import Image

SKRIPT_ADRESAR = os.path.dirname(os.path.abspath(__file__))
SLOZKA_OBRAZKU = os.path.join(SKRIPT_ADRESAR, "images")

MAX_SIRKA = 1920
KVALITA_WEBP = 82
PODPOROVANE_PRIPONY = (".png", ".jpg", ".jpeg")
IGNOROVANE_SLOZKY = {"favicon"}

print(f"Zahajuji kontrolu a pročištění složky: {SLOZKA_OBRAZKU}\n")

pocet_nove_prevedenych = 0
pocet_smazanych_originalu = 0
pocet_chyb = 0

for root, dirs, files in os.walk(SLOZKA_OBRAZKU):
    # Ponechání složky favicon bez zásahu
    dirs[:] = [d for d in dirs if d.lower() not in IGNOROVANE_SLOZKY]

    for file in files:
        if file.lower().endswith(PODPOROVANE_PRIPONY):
            cesta_ke_zdroji = os.path.join(root, file)
            jmeno_bez_pripony, _ = os.path.splitext(cesta_ke_zdroji)
            cesta_k_webp = f"{jmeno_bez_pripony}.webp"

            pripraveno_ke_smazani = False

            # Případ 1: WebP verze již byla vytvořena dříve
            if os.path.exists(cesta_k_webp) and os.path.getsize(cesta_k_webp) > 0:
                pripraveno_ke_smazani = True
            else:
                # Případ 2: WebP chybí, je nutné jej nejprve vygenerovat
                try:
                    with Image.open(cesta_ke_zdroji) as img:
                        if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                            img_export = img.convert("RGBA")
                        else:
                            img_export = img.convert("RGB")

                        if img_export.width > MAX_SIRKA:
                            pomer = MAX_SIRKA / float(img_export.width)
                            nova_vyska = int(float(img_export.height) * pomer)
                            img_export = img_export.resize((MAX_SIRKA, nova_vyska), Image.Resampling.LANCZOS)

                        img_export.save(cesta_k_webp, "WEBP", quality=KVALITA_WEBP, method=6)

                    # Bezpečnostní kontrola, že nový soubor existuje na disku
                    if os.path.exists(cesta_k_webp) and os.path.getsize(cesta_k_webp) > 0:
                        pocet_nove_prevedenych += 1
                        pripraveno_ke_smazani = True
                except Exception as e:
                    print(f"✗ Chyba při převodu {file}: {e}")
                    pocet_chyb += 1

            # Smazání původního souboru proběhne pouze při stoprocentní existenci WebP
            if pripraveno_ke_smazani:
                try:
                    os.remove(cesta_ke_zdroji)
                    relativni_cesta = os.path.relpath(cesta_ke_zdroji, SKRIPT_ADRESAR)
                    print(f"✓ Odstraněn originál: {relativni_cesta}")
                    pocet_smazanych_originalu += 1
                except Exception as e:
                    print(f"✗ Soubor {file} se nepodařilo smazat: {e}")
                    pocet_chyb += 1

print(f"\nHotovo.")
print(f"Nově zkomprimováno: {pocet_nove_prevedenych}")
print(f"Odstraněno původních souborů: {pocet_smazanych_originalu}")
if pocet_chyb > 0:
    print(f"Chyby: {pocet_chyb}")
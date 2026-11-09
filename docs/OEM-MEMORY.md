# Mémoire Samsung OEM : provenance et limites

Le complément `src/data/catalogOemMemory.ts` contient des **barrettes individuelles réellement référencées**, pas des kits créés artificiellement. Le prix courant en euros est inconnu et n'est pas remplacé par un prix américain, une conversion ou une estimation présentée comme une offre.

Les caractéristiques électriques proviennent d'échantillons SPD publics du dépôt [passnet-spd/Unsorted-SPD-Dumps](https://github.com/passnet-spd/Unsorted-SPD-Dumps), figé au commit `a5391203743ec9a263fe922d8a9fd55ad7891c68` du 6 septembre 2024. Le dépôt avertit que certains fichiers peuvent être endommagés : seuls les échantillons dont **les deux CRC DDR4 correspondent** sont retenus ci-dessous. La date du commit est une date de provenance, jamais une date de commercialisation.

Ce sont des mesures rapportées par des utilisateurs, pas des fiches certifiées par Samsung. Un CRC valide établit l'intégrité interne du SPD, pas l'authenticité commerciale de chaque exemplaire vendu. Les numéros de série et dates de fabrication des exemplaires ne sont ni importés dans le catalogue, ni publiés ici. Les formes et couleurs des rendus restent des illustrations de modules OEM nus ; les rangs ne permettent pas de déduire le placement des puces sur les faces du circuit.

## Références retenues

Toutes les références suivantes sont des DDR4 UDIMM non enregistrées, non ECC, avec bus primaire de 64 bits, puces x8, alimentation de 1,2 V et profil JEDEC 3200 MT/s. Une barrette n'est pas un canal mémoire. Pour une mémoire DDR, 3200 MT/s correspond à une horloge de 1600 MHz ; la fréquence réellement appliquée reste déterminée par la plateforme.

| Référence fabricant | Capacité d'une barrette | Organisation | Fichier sous le commit ci-dessus | CRC base / module |
| --- | --- | --- | --- | --- |
| M378A1K43EB2-CWE | 8 Go | 1Rx8 | `Dumps/SPD 2021-10-22/Samsung M378A1K43EB2-CWE.thp` | `514d` / `b9c3` |
| M378A2G43AB3-CWE | 16 Go | **1Rx8** | `Dumps/SPD 2021-01-01/Samsung M378A2G43AB3-CWE.thp` | `1787` / `4169` |
| M378A2G43BB3-CWE | 16 Go | **1Rx8** | `Dumps/Samsung M378A2G43BB3-CWE.thp` | `1787` / `4169` |
| M378A2K43EB1-CWE | 16 Go | **2Rx8** | `Dumps/Samsung M378A2K43EB1-CWE.thp` | `19b6` / `df74` |
| M378A4G43AB2-CWE | 32 Go | 2Rx8 | `Dumps/SPD 2020-12-01/Samsung M378A4G43AB2-CWE.thp` | `5f7c` / `c6ab` |

Ne pas attribuer « 2Rx8 » à toutes les Samsung de 16 Go : les `M378A2G43AB3-CWE` et `M378A2G43BB3-CWE` de cette source sont explicitement **1Rx8**, tandis que le `M378A2K43EB1-CWE` est **2Rx8**. Une référence ne permet pas d'identifier les barrettes personnelles d'un utilisateur qui n'a pas communiqué leur numéro de modèle.

Le deuxième échantillon `Dumps/Samsung M378A2K43EB1-CWE (1).thp` confirme les mêmes caractéristiques et les deux mêmes CRC. Son SHA-256 est `e8bd77dce5708a1c6584c7c6637ad6400caf22563d3f83940211cd60aa5e9960`. Il ne crée pas un deuxième produit : le catalogue conserve une seule référence pour ce modèle.

Empreintes SHA-256 des fichiers THP originaux, dans l'ordre du tableau :

```text
abb548155320c18e54cd4beed8e74fde28469e5f7c6ffd568999959a690fe7d6
929ec7609eca1a368c3e4fea57a5e284cf98db7813fc2a57e47071181caae9b7
2f8e5a02773f2df1101346c1c70afcb3c7c5db7133ff1818deb16adc6a51940a
4b7c85fc6ea3971d52c8219b72bc19f7ed7b06f26e41ae1817ef66cc00c33035
8fd0a5bd827d3a85da7e231688fb7f83546fe73d6e28f45d7d78ec80369909a3
```

## Vérification reproductible des données

Les fichiers utilisent les conteneurs THP1 ou THP3 de 518 octets. Pour THP1 (`04 54 48 34 31`), le premier octet SPD est à l'offset 5 et le masque XOR de 82 octets se retrouve dans la zone réservée nulle aux offsets 140 à 221. Pour THP3 (`04 54 48 34 33`), les octets 5 à 516 sont démasqués par un état 16 bits initialisé à 471, mis à jour après chaque octet chiffré avec la constante 12719. Le démasquage doit ensuite satisfaire **les deux CRC** ; une organisation mémoire plausible seule ne suffit pas à accepter un fichier. Les deux décodeurs ont été revérifiés indépendamment sur les échantillons retenus.

Exemple de vérification locale après téléchargement d'un fichier original depuis le commit indiqué (Python 3, aucun programme provenant du dépôt source exécuté) :

```python
from pathlib import Path
import hashlib

def crc16(data):
    result = 0
    for value in data:
        result ^= value << 8
        for _ in range(8):
            result = ((result << 1) ^ 0x1021) & 0xffff if result & 0x8000 else (result << 1) & 0xffff
    return result

raw = Path("module.thp").read_bytes()
assert len(raw) == 518
if raw[:5] == b"\x04TH41":
    mask = raw[140:222]
    spd = bytes([raw[5]]) + bytes(raw[p] ^ mask[(p - 140) % 82] for p in range(6, 517))
elif raw[:5] == b"\x04TH43":
    state, decoded = 471, []
    for value in raw[5:517]:
        decoded.append(value ^ (state >> 8))
        state = (state + value + 12719) & 0xffff
    spd = bytes(decoded)
else:
    raise ValueError("Conteneur non pris en charge par cet exemple")
assert crc16(spd[:126]) == int.from_bytes(spd[126:128], "little")
assert crc16(spd[128:254]) == int.from_bytes(spd[254:256], "little")
assert spd[2] == 0x0c and spd[3] & 0x0f == 2  # DDR4 / UDIMM
assert spd[6] == 0 and spd[17] == 0             # boîtier monolithique / bases de temps DDR4
assert spd[320:322] == b"\x80\xce"           # identifiant JEDEC Samsung
rank_count = ((spd[12] >> 3) & 7) + 1
device_bits = 4 << (spd[12] & 7)
bus_bits = 8 << (spd[13] & 7)
density_mbits = 256 << (spd[4] & 0x0f)
capacity_gb = density_mbits / 8 * bus_bits / device_bits * rank_count / 1024
fine_tck_ps = int.from_bytes(spd[125:126], "little", signed=True)
tck_ps = spd[18] * 125 + fine_tck_ps
transfer_rate = round(2_000_000 / tck_ps)
print(hashlib.sha256(raw).hexdigest())
print(spd[329:349].decode("ascii").strip(), capacity_gb, f"{rank_count}Rx{device_bits}", transfer_rate)
```

Champs communs vérifiés : octet 11 `03` (1,2 V), octet 13 `03` (64 bits sans extension ECC), octet 18 `05` et correction 125 `00` (tCK minimal 625 ps), octet 24 `6e` et correction 123 `00` (tAA minimal 13,75 ns). Le masque CAS des octets 20–23 est `f8 ff 02 00` : CL22 est supporté et `13,75 ns / 0,625 ns = 22`.

Les dimensions physiques précises, la date de lancement et la disponibilité marchande ne sont pas fournies par cette extraction et restent inconnues. Aucun fichier SPD binaire ni dump matériel personnel complet n'est redistribué avec le site.

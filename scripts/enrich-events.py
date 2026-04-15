import json, re

GENRE = {
    'Chiikawa': 'mixed',
    'Detective Conan': 'shonen',
    'Jujutsu Kaisen': 'shonen',
    'Hololive': 'vtuber',
    'Rilakkuma': 'mixed',
    'Blue Lock': 'shonen',
    'Gintama': 'shonen',
    'Yu-Gi-Oh!': 'shonen',
    'Yu-Gi-Oh! ZEXAL': 'shonen',
    "L'Arc-en-Ciel": 'mixed',
    'My Hero Academia': 'shonen',
    'SPY×FAMILY': 'shonen',
    'One Piece': 'shonen',
    'Natsume Yuujinchou': 'shojo',
    'AnimeJapan': 'mixed',
    'Super Mario': 'gaming',
    'TRIGUN STARGAZE': 'seinen',
    'IDOLiSH7': 'shojo',
    'Arina Tanemura Works': 'shojo',
    'Sanrio': 'mixed',
    'Demon Slayer': 'shonen',
    'Kaichou wa Maid-sama!': 'shojo',
    'Oshi no Ko': 'seinen',
}
HOT = {'One Piece', 'Jujutsu Kaisen', 'My Hero Academia', 'Demon Slayer', 'SPY×FAMILY', 'AnimeJapan', 'Chiikawa'}
NICHE = {'TRIGUN STARGAZE', 'Natsume Yuujinchou', "L'Arc-en-Ciel", 'IDOLiSH7', 'Arina Tanemura Works', 'Kaichou wa Maid-sama!', 'Yu-Gi-Oh! ZEXAL'}

with open('data/events.json', encoding='utf-8') as f:
    data = json.load(f)

for e in data['events']:
    ip = e.get('ip', '')
    e['genre'] = GENRE.get(ip, 'mixed')
    if ip in HOT:
        e['badge'] = 'hot'
    elif ip in NICHE:
        e['badge'] = 'niche'
    elif e.get('type') == 'pop-up' or e.get('type') == 'collab-food':
        e['badge'] = 'limited'
    else:
        e.pop('badge', None)
    src = e.get('source', '')
    # Prefer non-aggregator URL as officialUrl
    if src and 'collabo-cafe.com' not in src:
        e['officialUrl'] = src
    else:
        e.pop('officialUrl', None)

data['lastUpdated'] = '2026-04-15'

with open('data/events.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write('\n')

print('Enriched', len(data['events']), 'events')
print('Badges:', sum(1 for e in data['events'] if e.get('badge')))
print('Official URLs:', sum(1 for e in data['events'] if e.get('officialUrl')))

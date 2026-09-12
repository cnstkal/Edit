from pathlib import Path
# trigger spacing fix
p = Path('twitter-profile.html')
s = p.read_text(encoding='utf-8')
marker = 'TW_PROFILE_SPACING_SCRIPT_FINAL'
if marker not in s:
    patch = '''<style id="TW_PROFILE_SPACING_SCRIPT_FINAL">
.tw-action-icons{width:100%!important;max-width:none!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:0!important;align-items:center!important;justify-items:center!important;margin:0!important;padding:0!important;box-sizing:border-box!important}
.tw-action-icons>.tw-action{width:100%!important;display:flex!important;justify-content:center!important;align-items:center!important;margin:0!important;padding:0!important}
.tw-action-icons>.tw-bookmark-share-group{width:100%!important;display:flex!important;justify-content:flex-end!important;align-items:center!important;gap:8px!important;margin:0!important;padding:0!important}
.tw-action-icons>.tw-bookmark-share-group .tw-action{width:auto!important;min-width:20px!important;margin:0!important;padding:0!important;display:flex!important;justify-content:center!important;align-items:center!important}
.tw-action-icons img.tw-supplied-action-icon{width:20px!important;height:20px!important;object-fit:contain!important}
.tw-action-icons>.tw-action img.tw-supplied-action-icon{filter:drop-shadow(.3px 0 0 #536471) drop-shadow(-.3px 0 0 #536471)!important}
.tw-action-icons>.tw-bookmark-share-group img.tw-supplied-action-icon{filter:none!important}
</style>'''
    s = s.replace('</head>', patch + '\n</head>', 1)
    p.write_text(s, encoding='utf-8')

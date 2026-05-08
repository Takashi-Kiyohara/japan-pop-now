# Cycle D' Day 2 — verify + Day 1 reconcile

Generated: 2026-05-08T12:12:47Z

## 4xx surface
✓ All sitemap URLs 200.

## Day 1 vs Day 2 redirect bucket reconcile
Day 1 bucket counts:
| 0 | 200 | 98 |
| 0 | 403 | 2 |
| 0 | 410 | 4 |
| 1 | 200 | 115 |
| 2 | 200 | 115 |

Day 2 bucket counts:
| 0 | 200 | 98 |
| 0 | 403 | 2 |
| 0 | 410 | 4 |
| 1 | 200 | 115 |
| 2 | 200 | 115 |

✓ Identical bucket distribution (no regression).

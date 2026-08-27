# Hive Protocol — Ultimatum Floor

Канон снят с Munder Difflin HIVE.md. Здесь — агентский контракт Ultimatum.

## Кто пишет куда
- Агент пишет ТОЛЬКО в `hive/agents/<id>/` (identity.md, memory.md, outbox/).
- Router (человек или GOD-процесс) переносит `outbox/*.json` → `to/inbox/`.
- Коммитит один: владелец или main-процесс harness. Агенты git не трогают.

## Акты
request | query | propose | inform | agree | refuse | done

## Когда needs_human=true
spend, destructive, scope/price/promise, AdSense LIVE, чужие ассеты, OF, смена канона.

## Hop cap
hops > 4 → GOD эскалирует владельцу. Ping-pong запрещён.

## Изоляция Free Apps
Сообщение «собери два приложения в одном дереве» = refuse.

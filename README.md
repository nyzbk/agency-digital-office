# Ultimatum Floor

Один цифровой штаб агентства Ultimatum.

- Репо: https://github.com/nyzbk/agency-digital-office
- Live: https://ultimatum-floor.vercel.app
- Шлюз: `POST https://ultimatum-floor.vercel.app/v1/chat/completions`

Не Free App. AdSense не подключать. Не второй офис.

`digital-product-agent-office` — мёртвый черновик. Штаб только здесь.

## Контракт

1. Один GitHub-репозиторий.
2. Один Vercel-проект (`ultimatum-floor`).
3. Один OpenAI-совместимый шлюз в этом же проекте.
4. Вход только владельца: `nyzza`. Нет Google, нет X, нет публичной регистрации.
5. Ключи бесплатные, на сервере. Ротация не делается, пока ими не начнут пользоваться чужие.
6. OmniRoute / FCC — обязательный контур, не «по желанию».

## Что делает шлюз

1. `OMNI_GATEWAY_URL` — свой OmniRoute (Docker из `deploy/omniroute`).
2. Free/FCC цепочка: OpenRouter → NIM → Groq → HF → Cerebras → Gemini → DeepSeek → Together → SiliconFlow → Mistral → SambaNova → Pollinations → xAI.
3. Circuit breaker 90с на 429/5xx, sticky last-ok 10 мин.

Полный демон OmniRoute — процесс. Он не живёт как Vercel Function. Поэтому Docker из этого же репо, а офис бьёт в него первым хопом. Пока VPS не прописан, офис уже отвечает через `/v1` на Vercel.

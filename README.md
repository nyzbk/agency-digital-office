# Ultimatum Floor

Единый цифровой штаб агентства Ultimatum.

Один репозиторий. Один Vercel. Один шлюз.

- Live: https://ultimatum-floor.vercel.app
- Repo: https://github.com/nyzbk/agency-digital-office

Это не Free App. AdSense не подключать.

## Что внутри

- Вход только владельца (`nyzza`)
- Пол: Michael / Pam / Jim / Ryan / Kelly / Oscar / Stanley
- Мозг с auto-fallback (OpenRouter → NIM → Groq → HF → Gemini → Mistral → xAI)
- OpenAI-совместимый шлюз: `POST /v1/chat/completions`

## Env на Vercel (не в git)

`OPENROUTER_API_KEY` `NVIDIA_NIM_API_KEY` `GROQ_API_KEY` `HUGGINGFACE_API_KEY` `GEMINI_API_KEY` `MISTRAL_API_KEY` `XAI_API_KEY` `GATEWAY_TOKEN`

Ключи также можно вставить во вкладке Ключи после входа.

## Не второй офис

`digital-product-agent-office` — черновик другого контура. Штаб агентства = этот репо.

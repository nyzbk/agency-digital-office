# Ultimatum Floor

Command surface for Ultimatum agency digital employees.

- **Layer A (workers):** official [Munder Difflin](https://github.com/chaitanyagiri/munder-difflin) on the owner machine. Electron + node-pty + your existing CLI subscriptions.
- **Layer B (this repo):** roster, Eisenhower board, hive protocol, hire JSON, static floor UI.
- **Not a Free App.** Do not attach AdSense. Do not treat Vercel as a PTY host.

## Local workers

```bash
git clone https://github.com/chaitanyagiri/munder-difflin.git
cd munder-difflin
npm install
npm run dev
```

Import JSON from `/hires` via Add Agent → Import hire.

## Live surface

https://agency-digital-office.vercel.app

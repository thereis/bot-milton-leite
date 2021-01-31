# Milton Leite BOT

This bot was originally created to narrate soccer matches from Brasileirão Série A. But the main idea is under development.

## Wanna test it?

If you just want to test it, just chat with me on Telegram! Just search for: `@MiltonLeite_bot` and start chatting!

# Current commands

| Command            | Description                                              |
| ------------------ | -------------------------------------------------------- |
| /hoje              | It will display the all the matches for the current day. |
| /proximas_partidas | It will display the week upcoming matches.               |

# Development mode

Install all the dependencies running the following command:
`yarn`

To run this BOT you must have a created bot in Telegram. To create a new bot, just talk with the `@BotFather` on Telegram and copy the generated token.

**Running on Windows**:
`$env:TELEGRAM_API_KEY="YOUR KEY HERE"; yarn dev;`

**Running on MacOS**:
`export TELEGRAM_API_KEY=YOUR_KEY_HERE && yarn dev`

# Production mode

To run this bot on production mode, just run the following commands:

**Windows**:

```sh
yarn build
$env:TELEGRAM_API_KEY="YOUR KEY HERE"; yarn start;
```

**MacOS**:

```sh
yarn build;
export TELEGRAM_API_KEY=YOUR_KEY_HERE && yarn start
```

# Credits

Special thanks to **[Ricardo Ribeiro](https://github.com/ricardoar7)** because it was his idea. I just replicated it in NodeJS ;)

# Set

🎰 A real-time card game Set on web!

![Solo](https://img.shields.io/badge/solo-finished-green.svg) ![Multiplayer](https://img.shields.io/badge/multiplayer-finished-green.svg)

![screenshot2](https://cloud.githubusercontent.com/assets/11247099/19839549/fcddd586-9f1e-11e6-829e-7841bb0f01f7.png)

## Rule

Wikipedia: [Set (game)][1]

In-game Help: [Help - Set Game](https://set.antnf.com/help)

## Deploy

Clone this repo and:

```sh
npm install
npm run run
```

## Deploy with Docker

### Build yourself
Clone this repo:

```
sudo docker build set-game .
sudo docker run set-game -p 3000:[port you want to have the game on]
```

### Dockerhub
There also is a alraedy build image

```sh 
docker pull thijstops/set
docker run thijstops/set -p 3000:[port you want to have the game on]
```

## Other Games
Uno Game: https://github.com/antfu/uno-game
Hex Game: https://github.com/antfu/hex-game

## License

MIT

[1]: https://en.wikipedia.org/wiki/Set_(game)

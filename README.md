# react-three-fiber Game Demo

![Game Demo](/media/game-demo.gif)

This repo shows an example implementation of a top-down 2d game made with React and [react-three-fiber](https://github.com/pmndrs/react-three-fiber).

I used the core functionality to create [Colmen's Quest](https://coldigames.itch.io/colmens-quest) and wanted to give you an idea of how a game can be done with React.

This is by no means the best way to build a game, it's just my way. 😊

**I suggest you use this code as an inspiration and not as a starting point to build your game on top of it. I also do not intend to maintain this code base in any way.**

## Get started

You can start the game by `yarn && yarn start`, then [open your Browser](http://localhost:3000/).

To get a better understanding of the architecture I used, you may want to read [this thread on Twitter](https://twitter.com/coldi/status/1254446313955119104).

👉 Also Florent Lagrede ([@flagrede](https://twitter.com/flagrede)) did an **amazing job** in writing an [in-depth walkthrough about this demo](https://dev.to/flagrede/making-a-2d-rpg-game-with-react-tree-fiber-4af1).<br />
Make sure to check it out! 👀

I'm happy to answer your specific questions about this demo. Just [@coldi](https://twitter.com/coldi) me. 👋

## Known issues

For this demo I used the current version of Colmen's Quest and stripped everything from it except my core "game engine" files. Some code, especially the player movement, might be buggy because there is no turn-based logic anymore.

I don't use a physics engine and the whole collision and movement logic solely relies on tile positions. Therefore you can only move full tiles in this demo.

There are great libraries like [use-cannon](https://github.com/pmndrs/use-cannon) that enable physics-based collisions with react-three-fiber. Check it out! I would love to hear what you made with it!

The game works by purchasing a plot which contains random NFT's from a spread of brands. The game rewards players for successfully mining and terraforming their section of the map. The multiplayer aspect is that everyone can see the map and the terraforming as well. For anyone who played the old flash game motherload, it's going to be similar gameplay with some modifications. Instead of fuel however, the limiting resource will be oxygen, and in order to venture out further into the tar, you will need to plant tree's to replenish your supply of oxygen. Tree's planted in game will also mimic a tree planted in real life. 

In the way far future, a space faring human race left earth as it was destroyed and overtaken by a mysterious Tar. Over a millenium later, a small terraforming/mining consortum visits earth unknown that it's the source of all space faring life. The earth is not as we know it, and has been severly containimated by polution. The consortum sells plots (similar to gold rush claims) to endeavoring persons looking to make it big. By teraforming a section of the earth, and unlocking the artifacts hidden beneath -- you can hope to make it big by finding relics from the past. 


# Magic the Gathering Quizzer
A dynamically generated Magic the Gathering card guessing game where you have to guess the name of the card from the artwork. How well do you remember your Mana Flare from your Mana Clash?




[![Demo](assets/demo.gif)](https://youtu.be/mYl4Ay8XPi8)


## How does it work?

*First the game shows you a random card from the selected edition:*

![Blank card](assets/guess.png)


*As the time ticks down, the progress bar will indicate remaining time. If the time runs out, or you give up, it will reveal the card.*

![Answered Card](assets/answer.png)

*After answering a set of questions, it will assign the player a ranking according to their proficiency.* 


You can also play the game online here:
[MTG Quiz](https://mtg-quiz.specr.net)

## Building the Project

### Prerequisites
- Node.js (v12 or higher)
- npm (comes with Node.js)

### Installation
First, install the project dependencies:

```bash
npm install
```

### Build Commands

Build the production version:
```bash
npm run build
```

Clean the build directory:
```bash
npm run clean
```

Clean and rebuild:
```bash
npm run clean-build
```

### Development

The project uses Gulp for build tasks. The build process:
- Minifies JavaScript files (main.js, editions.js)
- Minifies CSS files
- Minifies JSON card data files
- Copies all assets and libraries to the build directory

To serve the built files locally for testing:
```bash
npm run serve
```

This will start a Python HTTP server on port 8000. Open http://localhost:8000 in your browser.

Alternatively, you can use any static file server of your choice to serve the `build/` directory.

### Production Deployment

After running `npm run build`, the entire `build/` directory contains all the files needed for deployment. Simply upload the contents of the `build/` directory to your web server.

# TODO 

- [ ] Ability to post high-scores
- [ ] Account for on-screen keyboard for mobiles
- [X] Fix autocomplete on mobiles
- [X] Hyperlink canvas to link to WOTC site for card
- [ ] Retry on images that have been removed by WOTC (using md5 hash b0284f3a137f1d8040f3a6d5055b307a) 
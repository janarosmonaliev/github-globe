# Pandemic Globe Map

Pandemic tracking information projected on a globe map.

## Inspiration

This personal project was inspired by Github's homepage, where they display Github activity on a globe map.
![Github website homepage](https://janarosmonaliev.github.io/pandemic-globe/src/files/github-home.png)

## First steps

As of January 18th, I have successfully implemented the globe with a dot map using [three-globe](https://github.com/vasturiano/three-globe) and added my own shading to it.
![Pandemic globe v1](https://janarosmonaliev.github.io/pandemic-globe/src/files/pandemic-globe-v1.png)

### [Live demo](https://janarosmonaliev.github.io/pandemic-globe/)

## Usage

This project is bundled with [Webpack](https://webpack.js.org/):

```bash
  "scripts": {
    "build": "webpack --config=webpack.prod.js",
    "build-dev": "webpack --config=webpack.dev.js",
    "start": "webpack serve webpack-dev-server --open --config=webpack.dev.js"
  },
```

and

```cmd
  npm start        # development build (live on localhost)
  npm run build    # static production build
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

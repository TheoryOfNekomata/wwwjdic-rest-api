# wwwjdic-rest-api
A REST API to complement with Jim Breen's KANJIDIC data (and others).

## Platforms
- NodeJS
- Express
- SQLite3

## Directories

`wwwjdic-reader` is based on the default directory structure of `express-generator`.

| Directory      | Description                                                                                                                          |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `bin`          | The Express binary directory. Used by `npm start`.                                                                                   |
| `input`        | Input data. Subdirectories are: `dl` where downloaded data files are stored and `extract` where data are extracted through building. |
| `middleware`   | Express middleware.                                                                                                                  |
| `node_modules` | Node dependencies.                                                                                                                   |
| `routes`       | Express routes.                                                                                                                      |
| `src`          | Source files.                                                                                                                        |

## License

MIT. `wwwjdic-reader` is licensed as to become compatible with WWWJDIC's dictionary files (CC-BY-SA v3).

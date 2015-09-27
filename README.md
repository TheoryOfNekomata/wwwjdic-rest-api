# wwwjdic-rest-api
A REST API to complement with Jim Breen's KANJIDIC data (and others).

## Why I Did This
I'm trying to build apps and services that make use of KANJIDIC/EDICT data. Instead of bundling it to the apps, I'd
rather make a centralized data repository--a server that has the ability to retrieve WWWJDIC data, and process it in
order to deliver data asynchronously to its clients.

## Platforms
- [NodeJS](https://nodejs.org) (using `v.0.12.7` on development)
- [Express](http://expressjs.com) `v.4.13.1`
- [SQLite](https://www.sqlite.org/index.html) (using NodeJS [`sqlite3` module](https://www.npmjs.com/package/sqlite3) `v.3.1.0`)

See `package.json` for versions of Node dependencies.

## Installation

Just run `npm install`.

## Directories

`wwwjdic-reader` is based on the default directory structure of `express-generator`.

| Directory      | Description                                           |
|----------------|-------------------------------------------------------|
| `bin`          | The Express binary directory. Used by `npm start`.    |
| `input`        | Retrieved and prepared data go here.                  |
| `node_modules` | Node dependencies. This is generated on installation. |
| `output`       | Built data go here.                                   |
| `routes`       | Express routes.                                       |
| `scripts`      | The project's scripts.                                |

## Shell Commands

Run commands with `$ npm run <command>`, where `<command>` is any of the following:

| `<command>` | Description                                                                                                                                                                                                                         |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `update`    | Prepares retrieved data (as well as to retrieve them in case they don't exist yet with the `-D` parameter).                                                                                                                         |
| `build`     | Builds data from `update` to common data formats. Accepts an extra argument which is any of the following: `db-sqlite`, `db-nosql`, `json`, `sql`, `csv`, or `xml`. If this parameter is omitted or invalid, it defaults to `json`. |

## Tasks

- [ ] Readers
    - [X] **KANJIDIC**
    - [X] **EDICT**
    - [X] **KRAD** (KRADFILE)
    - [X] **Yojijukugo** (see [this page](http://home.earthlink.net/~4jword/index3.htm))
    - [ ] CSV (for [WaKan](http://wakan.manga.cz) files)
    - [ ] Tanaka Corpus
- [X] **Downloaders**
- [ ] **Builders** *(needs to be faster)*
    - [X] **JSON**
    - [ ] SQLite
    - [ ] SQL script (maximum compatibility among SQL variants)
    - [ ] **XML**
        - [ ] XML DTD/Namespace declarations
    - [ ] CSV/Plain Text
- [ ] REST API

Legend:
- [ ] Not Done
- [ ] **In Progress**
- [X] **Done**

## Endpoints

TODO

## References and Sources

- [Monash Nihongo Archive](http://ftp.edrdg.org/pub/Nihongo/00INDEX.html)
- [Tanaka Corpus](http://www.edrdg.org/wiki/index.php/Tanaka_Corpus)
- [WaKan Project Site](http://wakan.manga.cz)

## License

MIT. `wwwjdic-rest-api` is licensed as to become compatible with WWWJDIC's dictionary files (CC-BY-SA v3).

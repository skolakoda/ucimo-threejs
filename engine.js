// TODO: napraviti platformski nezavisan slash / ili \

const fs = require('fs')
const chokidar = require('chokidar')
const cheerio = require('cheerio')

/** KONFIG **/

const putDoFoldera = '40-rad-sa-modelima/90-modeli-dae/modeli/'
const indexFajl = '40-rad-sa-modelima/90-modeli-dae/index.html'
const chokidarOpcije = {
  depth: 0,
  ignoreInitial: true,
  persistent: true
}
const nadgledac = chokidar.watch(`./${putDoFoldera}`, chokidarOpcije)

let sadrzajFajla = ''
let $ = {}

/** FUNKCIJE **/

const praviSablon = put => {
  return (
    `<option id="${put}" value="modeli/${put}/model.dae">${put}</option>
    `
  )
}

const sredjujePut = put => {
  put = put.replace(putDoFoldera, '') // otklanja prefix
  if (put.indexOf('/')) put = put.split('/')[0] // otklanja sufix
  return put
}

const azuriraFajl = (put, istina) => {
  put = sredjujePut(put)
  if (istina) $('#probni-modeli').append(praviSablon(put))
  else $(`#${put}`).remove()
  sadrzajFajla = $.html()
  fs.writeFile(indexFajl, sadrzajFajla)
}

/** INIT **/

fs.readFile(`./${indexFajl}`, 'utf8', (err, data) => {
  if (err) throw err
  sadrzajFajla = data
  $ = cheerio.load(sadrzajFajla)
})

/** EVENTS **/

nadgledac
  .on('addDir', put => azuriraFajl(put, true))
  .on('unlinkDir', put => azuriraFajl(put, false))

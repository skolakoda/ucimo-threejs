// TODO: napraviti platformski nezavisan slash / ili \

const fs = require('fs')
const chokidar = require('chokidar')
const cheerio = require('cheerio')
const path = require('path')

/** KONFIG **/

const osnovniPut = path.join('40-rad-sa-modelima', '90-modeli-dae')
const putDoFoldera = path.join(osnovniPut, 'modeli', '/')
const putDoFajla = path.join(osnovniPut, 'index.html')
const chokidarOpcije = {
  depth: 0,
  ignoreInitial: true,
  persistent: true
}
const nadgledac = chokidar.watch(putDoFoldera, chokidarOpcije)

let sadrzajFajla = ''
let $ = {}

/** FUNKCIJE **/

const praviSablon = put => {
  const value = path.join('modeli', put, 'model.dae')
  return `<option id="${put}" value="${value}">${put}</option>
  `
}

const azuriraFajl = (put, dodaje) => {
  const nazivFoldera = put.replace(putDoFoldera, '')
  if (dodaje) $('#probni-modeli').append(praviSablon(nazivFoldera))
  else $(`#${nazivFoldera}`).remove()
  sadrzajFajla = $.html()
  fs.writeFile(putDoFajla, sadrzajFajla)
}

/** INIT **/

fs.readFile(putDoFajla, 'utf8', (err, data) => {
  if (err) throw err
  sadrzajFajla = data
  $ = cheerio.load(sadrzajFajla)
})

/** EVENTS **/

nadgledac
  .on('addDir', put => azuriraFajl(put, true))
  .on('unlinkDir', put => azuriraFajl(put, false))

// TODO: napraviti platformski nezavisan slash / ili \

const fs = require('fs')
const chokidar = require('chokidar')
const cheerio = require('cheerio')

/** KONFIG **/

const putDoFoldera = '40-rad-sa-modelima/90-modeli-dae/modeli/'
const indexFajl = '40-rad-sa-modelima/90-modeli-dae/index.html'
const nadgledac = chokidar.watch(`./${putDoFoldera}`, {
  // ignoreInitial: true,
  persistent: true
})

let sadrzajFajla = ''
let $

/** FUNKCIJE **/

const praviSablon = put => {
  `<option value="modeli/${put}/model.dae">${put}</option>`
}

/** INIT **/

fs.readFile(`./${indexFajl}`, 'utf8', (err, data) => {
  if (err) throw err
  sadrzajFajla = data
  $ = cheerio.load(sadrzajFajla)
  // console.log(sadrzajFajla)
})

/** EVENTS **/

nadgledac
  .on('addDir', put => {
    put = put.replace(putDoFoldera, '') // otklanja prefix
    if (put.indexOf('/')) put = put.split('/')[0] // otklanja sufix
    console.log(praviSablon(put))
    // apenduje padajuci meni
    $('#test').append(praviSablon(put))
    // azurira sadrzajFajla
    sadrzajFajla = $.html()
    // upisuje fajl
    fs.writeFile(indexFajl, sadrzajFajla, function (err) {
      if (err) return console.log(err)
    })
  })
  // .on('unlink', put => {
  //   console.log(`fajl: ${put} je obrisan.`)
  // })
  // .on('change', function (put) {
  //   console.log('File', put, 'has been changed')
  // })
  // .on('error', function (error) {
  //   console.error('Error happened', error)
  // })

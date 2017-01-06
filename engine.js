var chokidar = require('chokidar')

var watcher = chokidar.watch('./40-rad-sa-modelima/90-modeli-dae/modeli', {
  // cwd: '40-rad-sa-modelima/90-modeli-dae/',
  // ignoreInitial: true,
  persistent: true
})

watcher
  .on('addDir', putanja => {
    putanja = putanja.replace('40-rad-sa-modelima/90-modeli-dae/modeli', '')
    console.log(`fajl: ${putanja} je dodat.`)
    // apendovati u padajuci meni
  })
  .on('unlink', putanja => {
    console.log(`fajl: ${putanja} je obrisan.`)
  })
  // .on('change', function (putanja) {
  //   console.log('File', putanja, 'has been changed')
  // })
  // .on('error', function (error) {
  //   console.error('Error happened', error)
  // })

navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
)

/** KONFIG **/

const camvideo = document.getElementById('monitor')
const video = document.getElementById('monitor')
const videoCanvas = document.getElementById('videoCanvas')
const videoContext = videoCanvas.getContext('2d')
const layer2Canvas = document.getElementById('layer2')
const layer2Context = layer2Canvas.getContext('2d')
const blendCanvas = document.getElementById('blendCanvas')
const blendContext = blendCanvas.getContext('2d')
const messageArea = document.getElementById('messageArea')

videoContext.translate(320, 0)
videoContext.scale(-1, 1)
videoContext.fillRect(0, 0, videoCanvas.width, videoCanvas.height)

const buttonModel = {
  image: new Image(),
  y: 10,
  w: 32,
  h: 32
}

const button1 = {
  color: 'red',
  x: 320 - 96 - 30
}
Object.assign(button1, buttonModel)
button1.image.src = 'images/SquareRed.png'

const button2 = {
  color: 'green',
  x: 320 - 64 - 20
}
Object.assign(button2, buttonModel)
button2.image.src = 'images/SquareGreen.png'

const button3 = {
  color: 'blue',
  x: 320 - 32 - 10
}
Object.assign(button3, buttonModel)
button3.image.src = 'images/SquareBlue.png'

const buttons = [button1, button2, button3]
let lastImageData

/** FUNCTIONS **/

function noStream (e) {
  let msg = 'No camera available.'
  if (e.code === 1) {
    msg = 'User denied access to use camera.'
  }
  console.log(msg)
}

function gotStream (stream) {
  camvideo.src = window.URL ? window.URL.createObjectURL(stream) : stream
  camvideo.onerror = function () {
    stream.stop()
  }
  stream.onended = noStream
}

function render () {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    // mirror video
    videoContext.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height)
    for (let i = 0; i < buttons.length; i++) {
      layer2Context.drawImage(
        buttons[i].image, buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h)
    }
  }
}

function fastAbs (value) {
  return (value ^ (value >> 31)) - (value >> 31)
}

function threshold (value) {
  return (value > 0x15) ? 0xFF : 0
}

function differenceAccuracy (target, data1, data2) {
  if (data1.length !== data2.length) {
    return null
  }
  let i = 0
  while (i < (data1.length * 0.25)) {
    const average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3
    const average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3
    const diff = threshold(fastAbs(average1 - average2))
    target[4 * i] = diff
    target[4 * i + 1] = diff
    target[4 * i + 2] = diff
    target[4 * i + 3] = 0xFF
    ++i
  }
}

function blend () {
  const width = videoCanvas.width
  const height = videoCanvas.height
  // get current webcam image data
  const sourceData = videoContext.getImageData(0, 0, width, height)
  // create an image if the previous image doesn't exist
  if (!lastImageData) lastImageData = videoContext.getImageData(0, 0, width, height)
  // create a ImageData instance to receive the blended result
  const blendedData = videoContext.createImageData(width, height)
  // blend the 2 images
  differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data)
  // draw the result in a canvas
  blendContext.putImageData(blendedData, 0, 0)
  // store the current webcam image
  lastImageData = sourceData
}

// check if white region from blend overlaps triggers
function checkAreas () {
  for (let b = 0; b < buttons.length; b++) {
    // get the pixels in a note area from the blended image
    const blendedData = blendContext.getImageData(
      buttons[b].x, buttons[b].y, buttons[b].w, buttons[b].h
    )
    // calculate the average lightness of the blended data
    let i = 0
    let sum = 0
    const countPixels = blendedData.data.length * 0.25
    while (i < countPixels) {
      sum += (blendedData.data[i * 4] + blendedData.data[i * 4 + 1] + blendedData.data[i * 4 + 2])
      ++i
    }
    // calculate an average between of the color values of the note area [0-255]
    const average = Math.round(sum / (3 * countPixels))
    if (average > 50) { // more than 20% movement detected
      console.log('Button ' + buttons[b].color + ' triggered.') // do stuff
      messageArea.innerHTML = `
        <font color='${buttons[b].color}'>
          <b>Button ${buttons[b].color} triggered.</b>
        </font>
      `
    }
  }
}

function animate () {
  window.requestAnimationFrame(animate)
  render()
  blend()
  checkAreas()
}

/** LOGIC **/

navigator.getUserMedia({video: true}, gotStream, noStream)
animate()

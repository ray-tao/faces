// Credit to Chat GPT and Stack Overflow for portions of the code
document.querySelector('body').style.display = 'none'

const colorThief = new ColorThief()
const eyes = document.getElementById('eyes-carousel')
const nose = document.getElementById('nose-carousel')
const mouth = document.getElementById('mouth-carousel')
const imageAmount = 30
window.colorMap = {}
window.sliders = []

function getNumberString(i) {
	if (i >= 10) return i
	else return '0' + i
}
function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('')
	var color = '#'
	for (var i = 0; i < 6; i++) {
		color += letters[Math.round(Math.random() * 15)]
	}
	return color
}
function createImgWrapper(number) {
	const div = document.createElement('div')
	div.classList.add('carousel-item')
	if (number === 1) {
		div.classList.add('active')
	}
	return div
}
function createImage(directory, number) {
	const image = document.createElement('img')
	const filename = directory + getNumberString(number)
	image.src = `./faces/${directory}/${filename}.png`
	image.classList.add('d-block', 'w-100')
	image.alt = filename
	return image
}

function createToneWrapper(color) {
	const div = document.createElement('div')
	div.classList.add('carousel-item', 'w-100', 'h-100')
	div.dataset['color'] = color
	return div
}
function createTone(color) {
	const tone = document.createElement('div')
	tone.classList.add('w-100', 'h-100')
	tone.style = `background-color: ${color}`
	return tone
}
function createToneItem(tone) {
	const wrapper = createToneWrapper(tone)
	const toneElement = createTone(tone)
	wrapper.appendChild(toneElement)
	return wrapper
}

async function getColors(img) {
	if (img.complete) {
		const [r, g, b] = await colorThief.getColor(img)
		return [`rgb(${r}, ${g}, ${b})`, `rgb(${r - 10}, ${g}, ${b})`]
	} else {
		return new Promise((res, rej) => {
			img.addEventListener('load', async function () {
				const [r, g, b] = await colorThief.getColor(img)
				res([
					`rgb(${r}, ${g}, ${b})`,
					`rgb(${r - 30}, ${g - 30}, ${b - 30})`
				])
			})
		})
	}
}

function setupVerticalWeaveColors() {
	document.querySelectorAll('.vertical-weave-group-3').forEach((group) => {
		group.querySelectorAll('.vertical-weave').forEach((weave, i) => {
			switch (i + 1) {
				case 1:
					weave.style.borderRight = '16px solid white'
					break
				case 2:
					weave.style.outline = '16px solid white'
					break
				case 3:
					weave.style.borderLeft = '16px solid white'
					break
			}
		})
	})
	document.querySelectorAll('.vertical-weave-group-2').forEach((group) => {
		group.querySelectorAll('.vertical-weave').forEach((weave, i) => {
			switch (i + 1) {
				case 1:
					weave.style.borderRight = '16px solid white'
					weave.style.boxShadow = '-16px 0px 0px 0px white'
					break
				case 2:
					weave.style.borderLeft = '16px solid white'
					weave.style.boxShadow = '16px 0px 0px 0px white'
					break
			}
		})
	})
}

function setupSlidingRow(id1, id2, id3, interval) {
	let delay = 150

	const carousel1 = new bootstrap.Carousel(id1, {
		interval: false,
		pause: false
	})
	const carousel2 = new bootstrap.Carousel(id2, {
		interval: false,
		pause: false
	})
	const carousel3 = new bootstrap.Carousel(id3, {
		interval: false,
		pause: false
	})

	function nextSlide() {
		carousel3.next()

		setTimeout(() => {
			carousel2.next()
		}, delay)

		setTimeout(() => {
			carousel1.next()
		}, delay * 2)
	}

	return setInterval(nextSlide, interval)
}

function slideEyes() {
	window.sliders.push(
		setupSlidingRow(
			'#eyes-tone-carousel1',
			'#eyes-carousel',
			'#eyes-tone-carousel2',
			3500
		)
	)
}
function slideNose() {
	window.sliders.push(
		setupSlidingRow(
			'#nose-tone-carousel1',
			'#nose-carousel',
			'#nose-tone-carousel2',
			4500
		)
	)
}
function slideMouth() {
	window.sliders.push(
		setupSlidingRow(
			'#mouth-tone-carousel1',
			'#mouth-carousel',
			'#mouth-tone-carousel2',
			4000
		)
	)
}

async function setupEyes() {
	const leftTone = document.querySelector('#eyes-tone-carousel1')
	const rightTone = document.querySelector('#eyes-tone-carousel2')

	for (let i = 1; i <= imageAmount; i++) {
		const imgWrapper = createImgWrapper(i)
		const img = createImage('eyes', i)
		const [c1, c2] = await getColors(img)
		colorMap[img.src] = [c1, c2]
		const left = createToneItem(c1)
		leftTone.querySelector('.carousel-inner').appendChild(left)
		const right = createToneItem(c2)
		rightTone.querySelector('.carousel-inner').appendChild(right)
		imgWrapper.appendChild(img)
		eyes.querySelector('.carousel-inner').appendChild(imgWrapper)
	}
	for (const carousel of [leftTone, rightTone]) {
		carousel.querySelectorAll('.carousel-item')[0].classList.add('active')
	}
	slideEyes()
}

async function setupNose() {
	const leftTone = document.querySelector('#nose-tone-carousel1')
	const rightTone = document.querySelector('#nose-tone-carousel2')

	for (let i = 1; i <= imageAmount; i++) {
		const imgWrapper = createImgWrapper(i)
		const img = createImage('nose', i)
		const [c1, c2] = await getColors(img)

		window.colorMap[img.src] = [c1, c2]
		const left = createToneItem(c1)
		leftTone.querySelector('.carousel-inner').appendChild(left)
		const right = createToneItem(c2)
		rightTone.querySelector('.carousel-inner').appendChild(right)
		imgWrapper.appendChild(img)
		nose.querySelector('.carousel-inner').appendChild(imgWrapper)
	}
	for (const carousel of [leftTone, rightTone]) {
		carousel.querySelectorAll('.carousel-item')[0].classList.add('active')
	}
	slideNose()
}

async function setupMouth() {
	const leftTone = document.querySelector('#mouth-tone-carousel1')
	const rightTone = document.querySelector('#mouth-tone-carousel2')

	for (let i = 1; i <= imageAmount; i++) {
		const imgWrapper = createImgWrapper(i)
		const img = createImage('mouth', i)
		const [c1, c2] = await getColors(img)

		colorMap[img.src] = [c1, c2]
		const left = createToneItem(c1)
		leftTone.querySelector('.carousel-inner').appendChild(left)
		const right = createToneItem(c2)
		rightTone.querySelector('.carousel-inner').appendChild(right)
		imgWrapper.appendChild(img)
		mouth.querySelector('.carousel-inner').appendChild(imgWrapper)
	}
	for (const carousel of [leftTone, rightTone]) {
		carousel.querySelectorAll('.carousel-item')[0].classList.add('active')
	}
	slideMouth()
}

setupVerticalWeaveColors()
await Promise.all([setupEyes(), setupNose(), setupMouth()])

window.randomImages = function () {
	for (const part of ['eyes', 'nose', 'mouth']) {
		const imgs = document
			.getElementById(part + '-carousel')
			.querySelectorAll('.carousel-item')
		imgs.forEach((img) => {
			img.classList.remove('active')
		})

		const random = Math.floor(Math.random() * (imageAmount - 1 - 0 + 1) + 0)
		const img = imgs[random]
		img.classList.add('active')

		const src = img.querySelector('[src]').src
		const [c1, c2] = window.colorMap[src]
		const leftTones = document.getElementById(part + '-tone-carousel1')
		leftTones.querySelectorAll('.carousel-item').forEach((tone) => {
			tone.classList.remove('active')
		})
		leftTones.querySelector(`[data-color="${c1}"]`).classList.add('active')

		const rightTones = document.getElementById(part + '-tone-carousel2')
		rightTones.querySelectorAll('.carousel-item').forEach((tone) => {
			tone.classList.remove('active')
		})
		rightTones.querySelector(`[data-color="${c2}"]`).classList.add('active')
	}
}

window.stopImages = function () {
	document.getElementById('start').checked = false
	for (const slider of window.sliders) {
		clearInterval(slider)
	}
	window.sliders = []
}
window.startImages = function () {
	document.getElementById('stop').checked = false
	window.sliders = []
	slideEyes()
	slideNose()
	slideMouth()
}

window.randomImages()
document.querySelector('body').style.display = 'flex'

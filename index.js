const puppeteer = require('puppeteer')
const fs = require('fs')
const downloader = require('image-downloader')

const config = require('./config/config')

async function main() {
  // Open new page, go to that page
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(config.URL)
  
  // create folder if it not exist
  if (!fs.existsSync(config.FOLDER)) {
    fs.mkdirSync(config.FOLDER)
  }

  // create folder if it not exist
  if (!fs.existsSync(config.FOLDER_QUOTE)) {
    fs.mkdirSync(config.FOLDER_QUOTE)
  }

  // Get image attribute
  const imageSrcSets = await page.evaluate( () => {
    const imgs = Array.from(document.querySelectorAll('article img'))
    const srcSetAttribute = imgs.map( i => i.getAttribute('srcset'))
    return srcSetAttribute
  })
  await page.goto(config.URL_QUOTE)

  const quote = await page.evaluate( () => {
    const img = document.querySelectorAll('.oncl_q img')[0].src;

    return img;
  })

  await browser.close()

  downloader({
    url: quote,
    dest: config.FOLDER_QUOTE
  })

  // process and download iamge
  for (let i = 0; i < imageSrcSets.length; i++) {
    const srcSet = imageSrcSets[i]
    const splitedSrcs = srcSet.split(',')
    const imgSrc = splitedSrcs[splitedSrcs.length -1].split(' ')[0]
    downloader({
      url: imgSrc,
      dest: config.FOLDER
    })
  }
}

main()
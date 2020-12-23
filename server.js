const http = require('http')
const fs = require('fs')
const url = require('url')
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate.js')

const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8'
)
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8'
)
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	'utf-8'
)

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const productObj = JSON.parse(productData)

const slugs = productObj.map(({ productName }) =>
	slugify(productName, { lower: true })
)

console.log(slugs)

const server = http.createServer((req, res) => {
	const {
		query: { id },
		pathname,
	} = url.parse(req.url, true)

	//overview page
	if (pathname == '/' || pathname == '/overview') {
		const cardsHtml = productObj
			.map((el) => replaceTemplate(tempCard, el))
			.join('')

		const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

		res.writeHead(200, { 'Content-Type': 'text/html' })
		res.end(output)
	}

	//product page
	else if (pathname == '/product') {
		const product = productObj[id]
		const output = replaceTemplate(tempProduct, product)
		res.writeHead(200, { 'Content-Type': 'text/html' })
		res.end(output)
	}

	//not found
	else {
		res.writeHead(404, {
			'Content-Type': 'text/html',
		})
		res.end('<h1 style="text-align:center;">404</h1>')
	}
})

server.listen(8000, () => {
	console.log('Listen 8000 port...')
})

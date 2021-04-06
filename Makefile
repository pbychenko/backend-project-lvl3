install: 
	npm install

start:
	node src/bin/page-loader.js  --output /sys https://ru.hexlet.io/courses

publish: 
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
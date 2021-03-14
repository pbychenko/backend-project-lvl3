install: 
	npm install

start: 
	# npx src/bin/page-loader.js
	node src/bin/page-loader.js

publish: 
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
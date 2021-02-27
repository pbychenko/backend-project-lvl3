install: 
	npm install

start: 
	npx babel-node src/bin/page-loader.js

publish: 
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
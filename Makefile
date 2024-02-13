default: build

.env: node_modules
	@cp .env.example .env

node_modules:
	@pnpm i

build: .env
	@pnpm ionic cap sync

clean:
	@rm -rf build

.PHONY: build install

build:
	OPENCODE_CHANNEL=ocv bun run packages/opencode/script/build.ts --single

install:
	sudo cp ./packages/opencode/dist/opencode-linux-x64/bin/opencode /usr/bin/opencode

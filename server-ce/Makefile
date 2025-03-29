# Define the root directory of the monorepo
MONOREPO_ROOT := ../

# Get the current working directory
HERE := $(shell pwd)

# Export the current Git revision
export MONOREPO_REVISION := $(shell git rev-parse HEAD)

# Export the current Git branch name
export BRANCH_NAME ?= $(shell git rev-parse --abbrev-ref HEAD)

# Detect the system architecture
ARCH := $(shell uname -m)

# Set Docker image names based on architecture
ifeq ($(ARCH),x86_64)
    export OVERLEAF_BASE_BRANCH := sharelatex/sharelatex-base:$(BRANCH_NAME)
    export OVERLEAF_BASE_LATEST := sharelatex/sharelatex-base
    export OVERLEAF_BASE_TAG := sharelatex/sharelatex-base:$(BRANCH_NAME)-$(MONOREPO_REVISION)
    export OVERLEAF_BRANCH := sharelatex/sharelatex:$(BRANCH_NAME)
    export OVERLEAF_LATEST := sharelatex/sharelatex
    export OVERLEAF_TAG := sharelatex/sharelatex:$(BRANCH_NAME)-$(MONOREPO_REVISION)
else ifeq ($(ARCH),aarch64)
    export OVERLEAF_BASE_BRANCH := sharelatex/sharelatex-base-arm:$(BRANCH_NAME)
    export OVERLEAF_BASE_LATEST := sharelatex/sharelatex-base-arm
    export OVERLEAF_BASE_TAG := sharelatex/sharelatex-base-arm:$(BRANCH_NAME)-$(MONOREPO_REVISION)
    export OVERLEAF_BRANCH := sharelatex/sharelatex-arm:$(BRANCH_NAME)
    export OVERLEAF_LATEST := sharelatex/sharelatex-arm
    export OVERLEAF_TAG := sharelatex/sharelatex-arm:$(BRANCH_NAME)-$(MONOREPO_REVISION)
endif

# Default target to build both base and community images
all: build-base build-community

# Target to build the base Docker image
build-base:
	cp .dockerignore $(MONOREPO_ROOT)
	docker build \
	  --build-arg BUILDKIT_INLINE_CACHE=1 \
	  --progress=plain \
	  --file Dockerfile-base \
	  --pull \
	  --cache-from $(OVERLEAF_BASE_LATEST) \
	  --cache-from $(OVERLEAF_BASE_BRANCH) \
	  --tag $(OVERLEAF_BASE_TAG) \
	  --tag $(OVERLEAF_BASE_BRANCH) \
	  $(MONOREPO_ROOT)

# Target to build the community Docker image
build-community:
	cp .dockerignore $(MONOREPO_ROOT)
	docker build \
	  --build-arg BUILDKIT_INLINE_CACHE=1 \
	  --progress=plain \
	  --build-arg OVERLEAF_BASE_TAG=$(OVERLEAF_BASE_TAG) \
	  --build-arg MONOREPO_REVISION=$(MONOREPO_REVISION) \
	  --cache-from $(OVERLEAF_LATEST) \
	  --cache-from $(OVERLEAF_BRANCH) \
	  --file Dockerfile \
	  --tag $(OVERLEAF_TAG) \
	  --tag $(OVERLEAF_BRANCH) \
	  $(MONOREPO_ROOT)

# ShellCheck options for linting shell scripts
SHELLCHECK_OPTS = \
	--shell=bash \
	--external-sources \
	--exclude=SC1091

# Determine ShellCheck color option based on CI environment
SHELLCHECK_COLOR := $(if $(CI),--color=never,--color)

# Find all shell script files for linting
SHELLCHECK_FILES := $(shell { git ls-files "*.sh" -z; git grep -Plz "\A\#\!.*bash"; } | sort -zu)

# Target to run ShellCheck on shell scripts
shellcheck:
	@echo "$(SHELLCHECK_FILES)" | xargs -0 -r docker run --rm -v $(HERE):/mnt -w /mnt \
		koalaman/shellcheck:stable $(SHELLCHECK_OPTS) $(SHELLCHECK_COLOR)

# Target to automatically fix issues found by ShellCheck
shellcheck_fix:
	@echo "$(SHELLCHECK_FILES)" | while IFS= read -r -d '' file; do \
		diff=$$(docker run --rm -v $(HERE):/mnt -w /mnt koalaman/shellcheck:stable $(SHELLCHECK_OPTS) --format=diff "$$file" 2>/dev/null); \
		if [ -n "$$diff" ] && ! echo "$$diff" | patch -p1 >/dev/null 2>&1; then echo "\033[31m$$file\033[0m"; \
		elif [ -n "$$diff" ]; then echo "$$file"; \
		else echo "\033[2m$$file\033[0m"; fi \
	done

# Declare phony targets to avoid conflicts with files of the same name
.PHONY: all build-base build-community shellcheck shellcheck_fix

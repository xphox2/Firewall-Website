# =============================================================================
# Firewall-Mon Marketing Website — Makefile
# =============================================================================
# Convenient entrypoints for building, running, and validating the static site.
#
# Conventions:
#   * `make` (no args)            -> `help`
#   * `make up`                  -> production stack (immutable nginx image)
#   * `make dev`                 -> dev stack with bind-mounted source (live edits)
#   * `make test`                -> i18n + JSON validation (no Docker required)
#
# Override defaults from the environment, e.g.:
#   PORT=9000 make up
#   IMAGE_TAG=local make build
# =============================================================================

# ---------- Configuration (override via env or `make VAR=value ...`) ---------
IMAGE_NAME    ?= firewall-mon/website
IMAGE_TAG     ?= latest
PORT          ?= 8080
CONTAINER_NAME ?= firewall-mon-website
DEV_PORT      ?= 3000
COMPOSE_FILE  ?= docker-compose.yml

# ---------- Auto-detect container runtime ------------------------------------
# Preference order: docker compose -> podman compose (built-in 4.7+) -> podman-compose.
# `?=` only runs the shell when COMPOSE isn't already set, so users can still
# override via the environment or command line:
#   make COMPOSE='docker compose' up
#   COMPOSE='podman-compose' make up
COMPOSE ?= $(shell \
    if command -v docker >/dev/null 2>&1; then \
        echo 'docker compose'; \
    elif command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then \
        echo 'podman compose'; \
    elif command -v podman-compose >/dev/null 2>&1; then \
        echo 'podman-compose'; \
    fi)

# Pretty banner color (auto-disabled when stdout isn't a TTY)
BOLD  := \033[1m
DIM   := \033[2m
GREEN := \033[32m
CYAN  := \033[36m
RESET := \033[0m
ifndef FORCE_COLOR
	ifeq ($(shell tty -s 2>/dev/null && echo yes),yes)
		COLOR := 1
	else
		COLOR := 0
	endif
endif
ifeq ($(COLOR),0)
	BOLD  :=
	DIM   :=
	GREEN :=
	CYAN  :=
	RESET :=
endif

.DEFAULT_GOAL := help

# Phony targets are not files
.PHONY: _require-runtime help up down stop restart build rebuild pull logs ps shell \
        exec dev dev-up dev-down dev-logs dev-shell dev-stop \
        clean clean-images clean-all prune \
        check-i18n check test validate validate-json verify \
        format compose-config install-tools

# Fail fast with a helpful message if no container runtime was detected.
# Added as a prerequisite to every target that invokes $(COMPOSE).
_require-runtime:
	@if [ -z "$(COMPOSE)" ]; then \
		echo "$(BOLD)ERROR:$(RESET) No container runtime detected." 1>&2; \
		echo "" 1>&2; \
		echo "  Install one of:" 1>&2; \
		echo "    * Docker (https://docs.docker.com/get-docker/) with Compose v2" 1>&2; \
		echo "    * Podman 4.7+ (https://podman.io/) — 'podman compose' is built-in" 1>&2; \
		echo "    * podman-compose (Python: 'pip install podman-compose')" 1>&2; \
		echo "" 1>&2; \
		echo "  Or override: make COMPOSE='docker compose' <target>" 1>&2; \
		exit 1; \
	fi

# =============================================================================
# Help
# =============================================================================
help: ## Show this help message
	@echo "$(BOLD)Firewall-Mon Website$(RESET) — available targets:"
	@echo ""
	@grep -E '^[-a-zA-Z0-9_]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-18s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(DIM)Variables (override on command line):$(RESET)"
	@echo "  PORT=$(PORT)  IMAGE_NAME=$(IMAGE_NAME)  IMAGE_TAG=$(IMAGE_TAG)"
	@echo "  DEV_PORT=$(DEV_PORT)  COMPOSE=$(COMPOSE)"

# =============================================================================
# Production stack (immutable nginx image)
# =============================================================================
up: _require-runtime ## Start the production stack (detached) on port $(PORT)
	@echo "$(GREEN)▶ Starting production stack on http://localhost:$(PORT)$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) up -d

down: _require-runtime ## Stop and remove the production stack containers
	@echo "$(GREEN)▶ Stopping production stack$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) down

stop: _require-runtime ## Stop the production stack containers (preserve them)
	$(COMPOSE) -f $(COMPOSE_FILE) stop

restart: down up ## Restart the production stack

build: _require-runtime ## Build the nginx image (tag: $(IMAGE_NAME):$(IMAGE_TAG))
	@echo "$(GREEN)▶ Building image $(IMAGE_NAME):$(IMAGE_TAG)$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) build

rebuild: _require-runtime ## Rebuild the nginx image from scratch (no cache)
	@echo "$(GREEN)▶ Rebuilding image from scratch$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) build --no-cache --pull

pull: _require-runtime ## Pull the base nginx image
	$(COMPOSE) -f $(COMPOSE_FILE) pull

logs: _require-runtime ## Tail logs from the running container
	$(COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=200

ps: _require-runtime ## List containers for this project
	$(COMPOSE) -f $(COMPOSE_FILE) ps

shell: _require-runtime ## Open an interactive shell inside the running container
	$(COMPOSE) -f $(COMPOSE_FILE) exec website sh

exec: _require-runtime ## Run a one-off command inside the container (use: make exec CMD='ls /usr/share/nginx/html')
	$(COMPOSE) -f $(COMPOSE_FILE) exec website sh -c '$(CMD)'

# =============================================================================
# Development stack (bind-mounted source for live edits)
# =============================================================================
dev: dev-up ## Start dev stack with live reload on port $(DEV_PORT)

dev-up: _require-runtime ## Run dev stack (bind mount source, expose port $(DEV_PORT))
	@echo "$(GREEN)▶ Starting dev stack on http://localhost:$(DEV_PORT)$(RESET)"
	@echo "$(DIM)  Source is bind-mounted — edits are reflected immediately.$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) --profile dev up

dev-down: _require-runtime ## Stop and remove dev containers
	$(COMPOSE) -f $(COMPOSE_FILE) --profile dev down

dev-stop: _require-runtime ## Stop dev containers (preserve them)
	$(COMPOSE) -f $(COMPOSE_FILE) --profile dev stop

dev-logs: _require-runtime ## Tail logs from the dev container
	$(COMPOSE) -f $(COMPOSE_FILE) --profile dev logs -f --tail=200

dev-shell: _require-runtime ## Open a shell in the dev container
	$(COMPOSE) -f $(COMPOSE_FILE) --profile dev exec website-dev sh

# =============================================================================
# Cleanup
# =============================================================================
clean: _require-runtime ## Remove project containers and the local image
	@echo "$(GREEN)▶ Removing containers and image$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) down --rmi local --remove-orphans

clean-images: ## Remove only the project images (no runtime required)
	-docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true

clean-all: clean prune ## Remove containers, images, and prune the runtime

prune: _require-runtime ## Aggressively prune runtime (containers, images, volumes, build cache)
	@echo "$(GREEN)▶ Pruning $(firstword $(COMPOSE)) system (this is aggressive!)$(RESET)"
	@read -p "  Are you sure? [y/N] " ans && [ "$$ans" = "y" ] || (echo "Aborted." && exit 1)
	$(firstword $(COMPOSE)) system prune -af --volumes

# =============================================================================
# Validation & tests (no Docker required)
# =============================================================================
check-i18n: ## Verify all locale files have matching keys vs en.json
	@echo "$(GREEN)▶ Checking i18n locale parity$(RESET)"
	@command -v node >/dev/null 2>&1 || { \
		echo "$(BOLD)ERROR:$(RESET) node is required for i18n checks. Install Node.js 18+."; \
		exit 1; }
	node scripts/check-i18n.js

check: check-i18n ## Alias for `make check-i18n`

validate-json: ## Validate every file in locales/ is well-formed JSON
	@echo "$(GREEN)▶ Validating JSON locale files$(RESET)"
	@for f in locales/*.json; do \
		node -e "JSON.parse(require('fs').readFileSync('$$f','utf8'))" \
			&& echo "  ✅ $$f" \
			|| { echo "  ❌ $$f"; exit 1; }; \
	done

validate: validate-json check-i18n ## Run all validations (JSON + i18n parity)

test: validate ## Run the full test suite (alias for `validate`)

verify: _require-runtime ## Validate docker-compose.yml syntax
	@echo "$(GREEN)▶ Validating $(COMPOSE_FILE)$(RESET)"
	$(COMPOSE) -f $(COMPOSE_FILE) config -q && echo "  ✅ compose file is valid"

compose-config: _require-runtime ## Print the resolved docker-compose config
	$(COMPOSE) -f $(COMPOSE_FILE) config

# =============================================================================
# Misc
# =============================================================================
install-tools: ## Print install hints for optional tooling
	@echo "Optional tools:"
	@echo "  - Node.js 18+ (for i18n checks)"
	@echo "  - One of: docker (with Compose v2), podman 4.7+, or podman-compose"
	@echo "  - jq (for ad-hoc locale inspection)"
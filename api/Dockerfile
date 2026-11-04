FROM ubuntu:26.04

ARG RUST_VERSION=1.93.0
ARG STELLAR_CLI_VERSION=27.0.0
ARG NODE_VERSION=24.18.0

RUN apt-get update && \
    apt-get install -y curl

# rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > rust_install.sh
RUN sh rust_install.sh -y --default-toolchain ${RUST_VERSION}
RUN echo $PATH
ENV PATH="$PATH:/root/.cargo/bin"

# stellar cli
RUN rustup target add wasm32-unknown-unknown --toolchain ${RUST_VERSION}
RUN apt-get install -y build-essential libssl-dev pkg-config
RUN cargo install --locked --version ${STELLAR_CLI_VERSION} stellar-cli --no-default-features

# nodejs
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
    && . ~/.bashrc \
    && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# wabt
ARG WABT_VERSION=1.0.37
WORKDIR /
RUN curl -sL https://github.com/WebAssembly/wabt/releases/download/${WABT_VERSION}/wabt-${WABT_VERSION}-ubuntu-20.04.tar.gz | tar xz


# minijail0: hardened sandbox launcher (Google/ChromeOS) that wraps the wabt
# tools at runtime — rlimits + uid drop + Landlock fs rules + seccomp
# allowlist (see api/sandbox/run-minijail.sh and README). Built from a pinned
# upstream commit (the linux-v9 release tag predates a fix for newer kernel
# headers, so we pin master); needs libcap at build time and libcap2 at
# runtime. Binaries installed to /usr/local; the wrapper finds them there.
RUN apt-get update \
    && apt-get install -y --no-install-recommends git libcap-dev libcap2 \
    && git init /tmp/minijail-src \
    && git -C /tmp/minijail-src remote add origin https://github.com/google/minijail \
    && git -C /tmp/minijail-src fetch --depth 1 origin 8787d1a4fdd7c64791607a1122d2408b3b35ade4 \
    && git -C /tmp/minijail-src checkout FETCH_HEAD \
    && cd /tmp/minijail-src \
    && make -j"$(nproc)" all \
    && cp /tmp/minijail-src/minijail0 /usr/local/bin/ \
    && cp /tmp/minijail-src/libminijailpreload.so /usr/local/lib/ \
    && rm -rf /tmp/minijail-src \
    && apt-get purge -y --auto-remove git libcap-dev
ENV WABT_SANDBOX_BIN=/api/sandbox/run-minijail.sh

# Startup probe: logs whether the kernel supports Landlock, so a degraded
# sandbox (seccomp+uid only) is visible in `fly logs` rather than implicit.
COPY sandbox/landlock-probe.c /tmp/landlock-probe.c
RUN cc -O2 -o /usr/local/bin/landlock-probe /tmp/landlock-probe.c \
    && rm -f /tmp/landlock-probe.c
ENV LANDLOCK_PROBE_BIN=/usr/local/bin/landlock-probe

# api
WORKDIR /api
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY . .

EXPOSE 3001

# clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]

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


# api
WORKDIR /api
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY . .
EXPOSE 3001

# clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]

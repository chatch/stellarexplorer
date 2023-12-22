FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y curl

# rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > rust_install.sh
RUN sh rust_install.sh -y
RUN echo $PATH
ENV PATH="$PATH:/root/.cargo/bin"

# soroban
RUN rustup target add wasm32-unknown-unknown
RUN apt-get install -y build-essential
RUN cargo install --locked --version 20.0.0-rc2 soroban-cli

# nodejs
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
    && . ~/.bashrc \
    && nvm install 18.18.0 && nvm use 18.18.0
ENV NODE_VERSION=18.18.0
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# wabt
WORKDIR /
RUN curl -sL https://github.com/WebAssembly/wabt/releases/download/1.0.33/wabt-1.0.33-ubuntu.tar.gz | tar xz


# api
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001

# clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]

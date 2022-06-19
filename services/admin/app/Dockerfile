ARG packagePath=services/admin/app
ARG baseDir=/usr/src

FROM node:16

ARG packagePath
ARG baseDir

RUN corepack enable

WORKDIR ${baseDir}/${packagePath}
COPY ${packagePath}/package.json ./

WORKDIR ${baseDir}
COPY package.json ./
COPY turbo.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn ./.yarn
COPY scripts ./scripts
RUN yarn install

WORKDIR ${baseDir}/${packagePath}
COPY ${packagePath}/tsconfig.json ./
COPY ${packagePath}/tsconfig.node.json ./
COPY ${packagePath}/vite.config.ts ./
COPY ${packagePath}/index.html ./
COPY ${packagePath}/src ./src

WORKDIR ${baseDir}
RUN yarn build

CMD [ "echo", "Admin App built successfully" ]

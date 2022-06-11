ARG packagePath=services/admin/api
ARG baseDir=/usr/src

FROM node:16 as build

ARG packagePath
ARG baseDir

RUN corepack enable

WORKDIR ${baseDir}
COPY package.json ./
COPY turbo.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn ./.yarn
COPY scripts ./scripts

WORKDIR ${baseDir}/${packagePath}
COPY ${packagePath}/package.json ./
COPY ${packagePath}/tsconfig.json ./
COPY ${packagePath}/src ./src

RUN yarn install
RUN yarn build

FROM node:16-alpine AS production

ARG packagePath
ARG baseDir

WORKDIR ${baseDir}
COPY --from=build ${baseDir}/package.json ./
COPY --from=build ${baseDir}/yarn.lock ./
COPY --from=build ${baseDir}/.yarnrc.yml ./
COPY --from=build ${baseDir}/.yarn ./.yarn

WORKDIR ${baseDir}/${packagePath}
COPY --from=build ${baseDir}/${packagePath}/package.json ./
COPY --from=build ${baseDir}/${packagePath}/dist ./dist

RUN yarn workspaces focus --production

CMD [ "node", "dist/main.js" ]

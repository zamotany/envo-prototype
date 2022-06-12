ARG packagePath=services/admin/api
ARG baseDir=/usr/src

FROM node:16 as build

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
COPY ${packagePath}/prisma ./prisma
COPY ${packagePath}/src ./src
RUN yarn prisma generate

WORKDIR ${baseDir}
RUN yarn build

FROM node:16 AS production

ARG packagePath
ARG baseDir

WORKDIR ${baseDir}
COPY --from=build ${baseDir}/package.json ./
COPY --from=build ${baseDir}/yarn.lock ./
COPY --from=build ${baseDir}/.yarnrc.yml ./
COPY --from=build ${baseDir}/.yarn ./.yarn

WORKDIR ${baseDir}/${packagePath}
COPY --from=build ${baseDir}/${packagePath}/package.json ./
RUN yarn workspaces focus --production
COPY --from=build ${baseDir}/${packagePath}/prisma ./prisma
RUN yarn prisma generate
COPY --from=build ${baseDir}/${packagePath}/dist ./dist

ENV NODE_ENV=production

CMD [ "node", "dist/main.js" ]

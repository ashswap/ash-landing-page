FROM node:16.18 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:16.18 AS runner
WORKDIR /app
RUN yarn global add serve@13.0.4

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "build", "-p", "3000"]

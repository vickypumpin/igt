FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

COPY lib/db/package.json ./lib/db/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/object-storage-web/package.json ./lib/object-storage-web/
COPY lib/integrations-openai-ai-server/package.json ./lib/integrations-openai-ai-server/
COPY lib/integrations-openai-ai-react/package.json ./lib/integrations-openai-ai-react/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/igotrend/package.json ./artifacts/igotrend/
COPY artifacts/mockup-sandbox/package.json ./artifacts/mockup-sandbox/

RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV BASE_PATH=/
ENV PORT=3000

RUN pnpm --filter @workspace/api-server run build
RUN pnpm --filter @workspace/igotrend run build


FROM node:20-alpine AS runtime

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN apk add --no-cache nginx supervisor

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

COPY lib/db/package.json ./lib/db/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/object-storage-web/package.json ./lib/object-storage-web/
COPY lib/integrations-openai-ai-server/package.json ./lib/integrations-openai-ai-server/
COPY lib/integrations-openai-ai-react/package.json ./lib/integrations-openai-ai-react/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/igotrend/package.json ./artifacts/igotrend/
COPY artifacts/mockup-sandbox/package.json ./artifacts/mockup-sandbox/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/igotrend/dist/public /usr/share/nginx/html

COPY lib/db/migrations ./lib/db/migrations

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

RUN mkdir -p /var/log/supervisor /run/nginx

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

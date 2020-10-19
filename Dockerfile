FROM node:14-stretch

WORKDIR /root

COPY . .

RUN npm install

RUN npm run build

CMD ["bash", "-c", "NODE_TLS_REJECT_UNAUTHORIZED=0 node_modules/.bin/gql-gen --config codegen.yml && npx prettier src/graphql.generated.tsx --write"]
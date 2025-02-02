FROM denoland/deno:alpine

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno install --entrypoint main.ts

CMD ["run", "--allow-env", "--allow-net", "--allow-read", "--allow-sys", "main.ts"]
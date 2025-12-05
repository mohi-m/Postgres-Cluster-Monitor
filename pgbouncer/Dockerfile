FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y pgbouncer gettext-base && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /etc/pgbouncer && chown -R postgres:postgres /etc/pgbouncer
COPY pgbouncer.ini.template /etc/pgbouncer/pgbouncer.ini.template
COPY userlist.txt.template /etc/pgbouncer/userlist.txt.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && chown postgres:postgres /entrypoint.sh
USER postgres
EXPOSE 6432
ENTRYPOINT ["/entrypoint.sh"]

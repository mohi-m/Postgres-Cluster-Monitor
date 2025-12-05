#!/bin/sh
set -e

# Substitute env vars in templates
envsubst < /etc/pgbouncer/pgbouncer.ini.template > /etc/pgbouncer/pgbouncer.ini
envsubst < /etc/pgbouncer/userlist.txt.template > /etc/pgbouncer/userlist.txt

# Start pgbouncer
exec pgbouncer /etc/pgbouncer/pgbouncer.ini

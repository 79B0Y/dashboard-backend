#!/usr/bin/env bash
set -e
npm install
[ -f .env ] || cp .env.example .env
docker-compose up -d

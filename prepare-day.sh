#!/usr/bin/env bash

usage () { echo "Copies a template project to specified day

HOW TO USE:
$ prepare-day.sh <daynum>
EXAMPLE:
$ prepare-day.sh 06
"; }

if [[ $# -eq 0 ]]; then
  usage; exit;
fi

echo "cp -r template/* day${1}/"
cp -r template/* day${1}/
cd "day${1}"

old=${1}
shortDay=$(echo $old | sed 's/^0*//')

echo "Fetching problem input..."
nog -d "${shortDay}" -y 2021 -i > input.txt

echo "Fetching problem puzzle..."
nog -d "${shortDay}" -y 2021 -p | sed '1,20d' > puzzle.ansi
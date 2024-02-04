#!/bin/sh
# ./.git/hooks/pre-commit-format-javascript
# Assumption: npm/yarn has installed the prettier package
# Based on the bash script prescribed at https://prettier.io/docs/en/precommit.html#option-5-bash-script

jsfiles=$(git diff --cached --name-only --diff-filter=ACM "*.js" "*.jsx" | tr '\n' ' ')
[ -z "$jsfiles" ] && exit 0

# Prettify all staged .js files
echo "💅 Automatically formatting staged Javascript files using prettier ($(echo $jsfiles | wc -w | awk '{print $1}') total)"
echo "$jsfiles" | xargs ./node_modules/.bin/prettier --write --loglevel=error

# Add back the modified/prettified files to staging
echo "$jsfiles" | xargs git add

exit 0

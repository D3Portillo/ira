#!/bin/sh

echo "Replacing jump lines for jsDocs"
sed -i 's/*\/;/*\/\n/g' src/index.min.js
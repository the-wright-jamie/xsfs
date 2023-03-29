#!/bin/zsh
for filename in */*.md; do
    file=${filename:0:-3}
    echo "- $filename ➜ ../articles/$file.html"
    pandoc $filename -o ../articles/$file.html --verbose
done

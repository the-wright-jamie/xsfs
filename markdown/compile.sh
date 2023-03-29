#!/bin/zsh
for filename in */*.md; do
    file=${filename:0:-3}
    pandoc $filename -o ../articles/$file.html
done

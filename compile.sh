#!/bin/zsh

cd markdown

for filename in */*.md; do
    file=${filename:0:-3}
    echo "+ $filename ➜ ../articles/$file.html"
    pandoc $filename -o ../articles/$file.html --verbose
done

cd ../articles

for filename in */*.html; do
    file=${filename:0:-5}
    echo "+ header ➜ $filename"
    echo "$(cat ../templates/header.html)
$(cat $filename)" > $filename
    echo "+ footer ➜ $file.html"
    echo "$(cat $filename)
$(cat ../templates/footer.html)" > $filename
done
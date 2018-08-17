mv ../shared ./src/

sed -i '' 's/..\/..\/..\/shared/..\/shared/g' ./src/handlers/*.ts ./src/utils/*.ts


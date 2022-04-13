## Typoteka project

### Перед запуском проекта

1. Утсановить зависимости `npm`
   ```bash
   npm i
   ```
2. Инициализировать переменные окружения в файле `.env` либо 
   взять из `environments.md`
   ```bash
   cp .env.example .env
   ```
3. Протестировать проект на наличие ошибок `jest`
   ```bash
   npm run test
   ```
4. Запустить проект в режиме разработки
   ```bash
   npm run dev
   ```

### Запуск проекта в Docker

1. Установить зависимости в .env
2. Запустиь сборку 
   ```bahs
   docker-compose build
   ```
3. Запуск проекта 
   ```bash
   docker-comppose up
   // or
   docker-compose up -d
   ```

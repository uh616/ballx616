# Инструкции по настройке GitHub репозитория

## Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Название репозитория: `ballx616`
3. Выберите "Public" (для GitHub Pages)
4. НЕ добавляйте README, .gitignore или лицензию (они уже есть)
5. Нажмите "Create repository"

## Шаг 2: Подключите локальный репозиторий к GitHub

Замените `YOUR_USERNAME` на ваш GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ballx616.git
git branch -M main
git push -u origin main
```

## Шаг 3: Включите GitHub Pages

1. Перейдите в Settings вашего репозитория
2. В разделе "Pages" выберите:
   - Source: "GitHub Actions"
3. GitHub Actions автоматически задеплоит сайт после первого push

## Шаг 4: Проверьте сайт

После деплоя (обычно через 1-2 минуты) ваш сайт будет доступен по адресу:
`https://YOUR_USERNAME.github.io/ballx616/`

## Примечания

- Убедитесь, что в Settings > Actions > General включены "Workflow permissions"
- Первый деплой может занять несколько минут
- Если что-то не работает, проверьте вкладку "Actions" в репозитории


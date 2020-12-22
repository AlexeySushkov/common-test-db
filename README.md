# common-test-db
## Установка и запуск на локольном хосте 

Если на локальном хосте установленны npm и node, то все просто:

- git clone https://github.com/AlexeySushkov/common-test-db

в каталоге server-db запускаем: 
- npm install 
- npm start

в каталоге client: 
- npm install 
- npm run serve

При имеющихся настройках клиент запустится на порту 8080, cервер порту 8081. Далее в браузере идем по адресу:
- http://localhost:8080/

Подробная инструкция по настройке в следующем разделе

## Установка в облаке, например Amazon
### Запуск инстанса и установка вспомогательного софта 
Заказываем виртуальную машину, достаточно совсем небольшой:

- t2.micro (RAM 1Gb, 1 vCPU) + 10 Gb HDD
- RedHat 8
- Security - открываем только нужные порты 22, 80, 8081
- Выбираем имеющийся "key pair" для доступа к инстансу по SSH

Запускаем инстанс:
- Смотрим Public IP, например: 38.205.39.247

Заходим по SSH:
- Используем свою "key pair"
- Имя user:  ec2-user

Устанавливаем node и npm

- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
- . ~/.bashrc
- nvm install node

Проверяем, что ok:
- npm -v
- node -v

Устанавливаем Git:
- sudo yum install git

Файловый менеджер:
- sudo yum install mc

Apache:
- sudo yum install httpd
- sudo systemctl start httpd.service
- sudo systemctl enable httpd.service

Настройка Apache:

Конфигурируем "connect-history-api-fallback" для того, чтобы можно было ходить в GUI ходить по прямым адресамю. Для этого в файле:

- /etc/httpd/conf/httpd.conf  

Внести:
```javascript
<Directory "var/www/html">
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
</Directory>
```


### Конфигурирование и подготовка к запуску "Common Test DB"

Так же как и при локальном запуске сначала клонируем git репозиторий:
- git clone https://github.com/AlexeySushkov/common-test-db

- Далее переименовываем example.env файл в .env файл 
- В файле .env gараметры GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET заполняем правильными значениями, полученными от Google. Для этого надо со своего Google аккаунта зарегистрировать приложение и получить Client ID и Client Secret, например по инструкции https://developers.google.com/identity/protocols/oauth2/openid-connect 
- В параметрах GOOGLE_REDIRECT_URI и GOOGLE_REDIRECT_TO_CLIENT меняем значение localhost на значение публичного IP: 38.205.39.247
- В параметр JWT_SECRET записываем произвольную секретную строку

Для использования reCaptсha

- На сайте Google зарегистрировать приложение: https://www.google.com/recaptcha/ и получить sitekey 


#### Настройка client
- Для использования reCaptсha необходимо прописать полученный sitekeyв настройках (config.js) клиента:
```javascript
recaptchaSitekey: '6LQ_4x-nERP_Lnw5WUlziH7'
```
- Чтобы клиент не показывал reCaptcha надо установить в пустое значение
```javascript
recaptchaSitekey: ''
```
- в параметре baseURL вместо localhost прописать публичный IP: 
```javascript
baseURL: 'https://38.205.39.247:8081/commontest/v1/'
```
- Скомпилировать код для production. Для этого в каталоге client выполнить:

npm install 

npm run build

- Будет создан каталог distr, содержимое которого надо скопировать в каталог с Apache: var/www/html

#### Настройка server-db

- В файле app.js прописать HTTPS порт
```javascript
const httpsPort = 3000
```

- В файле config.js установить настройки logger и cors:
```javascript
consoleLog: false, // log to files
db: {
logging: sequelizeLogger, // log db output to file
},
cors: {
"origin": "*"
"methods": "GET,POST,PUT,DELETE"
}
```

#### Запуск server-db

- В каталоге server-db выполнить:
npm install 
npm install forever -g
forever start src/app.js

#### Проверка успешного запуска
- Заняты соответствующие порты:
ss -tupln

#### В браузере идем по адресу публичного IP:

http://38.205.39.247


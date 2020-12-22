# common-test-db

## Установка в облаке Amazon
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
- User:  ec2-user

Устанавливаем node и npm

- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
- . ~/.bashrc
- nvm install node

Проверяем, что OK:
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

Конфигурируем "connect-history-api-fallback" для того, чтобы можно было ходить в GUI ходить по прямым адресам. Для этого в файле:

- /etc/httpd/conf/httpd.conf  

Вносим раздел:
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

- Клонируем git репозиторий:

git clone https://github.com/AlexeySushkov/common-test-db

- Далее переименовываем example.env файл в .env файл 
- В файле .env gараметры GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET заполняем правильными значениями, полученными от Google. Для этого надо со своего Google аккаунта зарегистрировать приложение и получить Client ID и Client Secret, например по инструкции https://developers.google.com/identity/protocols/oauth2/openid-connect 
- В параметрах GOOGLE_REDIRECT_URI и GOOGLE_REDIRECT_TO_CLIENT меняем значение localhost на значение публичного IP: 38.205.39.247
- В параметр JWT_SECRET записываем произвольную секретную строку

Для использования reCaptсha

- На сайте Google регистрируем приложение: https://www.google.com/recaptcha/ и получаем sitekey 


#### Настройка client
- Для использования reCaptсha необходимо прописать полученный sitekeyв в настройках (config.js) клиента:
```javascript
recaptchaSitekey: '6LQ_4x-nERP_Lnw5WUlziH7'
```
- Чтобы клиент не показывал reCaptcha надо установить в пустое значение
```javascript
recaptchaSitekey: ''
```
- в параметре baseURL вместо localhost прописываем публичный IP: 
```javascript
baseURL: 'https://38.205.39.247:8081/commontest/v1/'
```
- Компилируем код для production. Для этого в каталоге client выполняем команды:

npm install 

npm run build

- Будет создан каталог distr, содержимое которого надо скопировать в каталог с Apache: var/www/html

#### Настройка server-db
- в каталоге server-db генерируем ключ и сертификат для HTTPS и копируем их в каталог src/certs:
```javascript
- openssl req -nodes -new -x509 -keyout server.key -out server.crt
```

- В файле app.js прописываем HTTPS порт
```javascript
const httpsPort = 3000
```

- В файле config.js устанавливаем настройки logger и cors:
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

- В каталоге server-db выполняем:
```javascript
npm install 
npm install forever -g
forever start src/app.js
```
- Если надо остановить сервер:
```javascript
ps -aef | grep app | grep -v grep | awk '{print $2}' | xargs kill
```
#### Проверка успешного запуска
- Заняты соответствующие порты:
ss -tupln

#### В браузере идем по адресу публичного IP:

http://38.205.39.247

## Установка и запуск на локольном хосте 

Действия по установке и настройке аналогичны предыдущему разделу, но запускать можно в режиме отладки:

в каталоге client: 
```javascript
npm run serve
```

в каталоге server-db запускаем: 
```javascript
npm install 
npm start
```


При имеющихся настройках клиент запустится на порту 8080, cервер порту 8081. Далее в браузере идем по адресу:
- http://localhost:8080/


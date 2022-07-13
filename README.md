# RatuFileSaver2
The bot generates shareable links in Telegram for videos, photos, documents and can be shared in groups.
<hr>

Installation required
1. NGINX</br>
2. SSL</br>
3. Domains</br>
4. NodeJS</br>
5. PM2 <code>npm install -g pm2</code></br>
6. NPM required. Don't forget to install it where package.json is stored in the bot folder</br>
<code>npm install dotenv@8.6.0</code></br>
<code>npm install mongodb@3.7.3</code></br>
<code>npm install nodemon&2.0.15</code></br>
<code>npm install telegraf@4.8.2</code></br>
<code>npm install crypto@1.0.1</code></br>
<code>npm install pm2@5.1.2</code></br>
<hr>

<b>~ WINDOWS ~</b></br>
<b>STEP 1</b></br>
- NGINX</br>

<b>Skip this step if you don't have a domain.</b></br>

Before you install the bot, first download the Windows version of nginx <a href="https://nginx.org/en/download.html">here</a>.</br>
After the download is complete, extract the zip and move it to the C:\ folder and don't forget to rename the nginx folder name to "nginx". Run nginx in cmd with the following command.

    C:\nginx\.\nginx.exe -s start

<b>STEP 2</b></br>
- SSL</br>

<b>Skip this step if you don't have a domain.</b></br>

Create SSL first and make sure you have a public ip and domain that is connected to the server and can be accessed from anywhere.</br>

Since the server is Windows we recommend that you create ssl on this web <a href="https://punchsalad.com/ssl-certificate-generator/">Free SSL Certificate Generator</a> and tutorial is here <a href="https http://punchsalad.com/ssl-certificate/install-lets-encrypt-godaddy/#chapter2">Tutorial</a>. Skip the cpanel tutorial section, download the required files there and put them in the C:\nginx\html folder then access the verification link to get the .crt and .key. and save it to the C:\nginx\ssl folder.</br>

Open the file in the nginx-conf folder that you downloaded then open the windows folder again and open the bot.conf file using the editor in windows. You will see the code below, replace the words <b>MY_DOMAIN</b> with your domain, because we have placed the ssl folder PATH so you just have to put it according to the PATH we wrote.


    server {
        listen 80;
        server_name MY_DOMAIN;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name MY_DOMAIN;

        error_log C:/nginx/bot.error.log error;

        ssl_session_timeout 5m;

        ssl_certificate C:/nginx/html/ssl/ca-bundle.crt;
        ssl_certificate_key C:/nginx/html/ssl/private-key.key;

        location / {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_pass http://localhost:8443;
        }
    }


If it has been replaced, move all the contents in the windows folder to the C:\nginx\conf folder then in cmd type this.
    
    C:\nginx\.\nginx.exe -s reload

<b>STEP 3</b></br>
- config.js</br>

Installation is in the config.js file</br>

<code>DOMAIN</code> - Domain obtained from when you set up nginx earlier.</br>
<code>PORT</code> - Port obtained from when you set up nginx earlier.</br>
<code>TOKEN</code> - Get Bot Token from Bot father.</br>

<code>BOTUSERNAME</code> - Your bot username without the '@' and must be lowercase.</br>
<code>DB_URL</code> - Create an account at https://www.mongodb.com/cloud/atlas , database name - RatuMediaFile ,collection name - RatuFileBackup.Click Connect and select 'Connect your app'.copy the link and replace "<password >" with the password of the user who has access to the DB and replace "myFirstDatabase" for "RatuMediaFile". If you want to change the database name you want, it's in the config folder.</br>
<b>DB_URL Link</b>

    mongodb+srv://login:password@bot.qnbbq.mongodb.net/database?retryWrites=true&w=majority

<code>LOG_CHANNEL</code> - create private channel and get channel ID (if you can't pass any channel ID from channel to @getidsbot it might look like -1001234567899).</br>
<code>ADMIN</code> - Your Account ID (if you can't find it using a bot like @getmyid_bot). <b>If there is an additional ADMIN1 ADMIN2 and so on, write it according to the example in the Heroku config and just put a number behind it</b></br>

<b>STEP 4</b></br>
Move some that are in the bot folder</br>
Make sure this moves all to PATH C:\nginx\html\hooks\bot</br>
- databases</br>
- config</br>
- package-lock.json</br>
- package.json</br>
- help.js</br>
- config.js</br>
- index.js</br>
<hr>

Don't forget to use this command to run the bot. Make sure it's in the bot folder, if not, type

    cd C:\nginx\html\hooks\bot pm2 start index.js --name ratufilesaver --watch --ignore-watch="node_modules"

<b>INFO</b></br>
You can use bots without domain and SSL by changing the code below in index.js to <b>bot.launch()</b>. Just skip the NGINX and SSL steps, just skip the <b>DOMAIN</b> and <b>PORT</b> in config.js.

    bot.launch({
        webhook:{
        domain:`${config.domain}`,
        port:`${config.PORT}`
        }
    })
<hr>

<b>~ LINUX ~</b></br>
<b>LANGKAH 1</b></br>
- NGINX</br>

<b>Skip this step if you don't have a domain.</b></br>

Before you install the bot, first download the Linux version of nginx with the command.

    sudo apt install nginx -y

Then run it with the command.

    sudo systemctl enable nginx && sudo systemctl start nginx

<b>STEP 2</b></br>
- SSL</br>

<b>Skip this step if you don't have a domain.</b></br>

Create SSL first and make sure you have a public ip and domain that is connected to the server and can be accessed from anywhere.</br>

Since the server is Linux and you don't want any trouble we suggest you create ssl on this web <a href="https://punchsalad.com/ssl-certificate-generator/">Free SSL Certificate Generator</a> and the tutorial is here <a href="https://punchsalad.com/ssl-certificate/install-lets-encrypt-godaddy/#chapter2">Tutorial</a>. Skip the cpanel tutorial section, download the required files there and put them in the /var/www/html folder then access the verification link to get the .crt and .key. and save it to the /etc/ssl folder.</br>


Open the file in the nginx-conf folder that you downloaded and then open the linux folder again and open the bot.conf file using the editor on your computer. You will see the code below, replace the words <b>MY_DOMAIN</b> with your domain, because we have placed the ssl folder PATH so you just have to put it according to the PATH we wrote.

    server {
        listen 80;
        server_name MY_DOMAIN;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name MY_DOMAIN;

        error_log /etc/nginx/bot.error.log error;

        ssl_session_timeout 5m;

        ssl_certificate /etc/ssl/ca-bundle.crt;
        ssl_certificate_key /etc/ssl/private-key.key;

        location / {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_pass http://localhost:8443;
        }
    }


Then run it with this command and don't forget the bot.conf has moved to the /etc/nginx/ folder
    
    systemctl restart nginx

<b>STEP 3</b></br>
- config.js</br>

Installation is in the config.js file</br>

<code>DOMAIN</code> - Domain obtained from when you set up nginx earlier.</br>
<code>PORT</code> - Port obtained from when you set up nginx earlier.</br>
<code>TOKEN</code> - Get Bot Token from Bot father.</br>

<code>BOTUSERNAME</code> - Your bot username without the '@' and must be lowercase.</br>
<code>DB_URL</code> - Create an account at https://www.mongodb.com/cloud/atlas , database name - RatuMediaFile ,collection name - RatuFileBackup.Click Connect and select 'Connect your app'.copy the link and replace "<password >" with the password of the user who has access to the DB and replace "myFirstDatabase" for "RatuMediaFile". If you want to change the database name you want, it's in the config folder.</br>
<b>DB_URL Link</b>

    mongodb+srv://login:password@bot.qnbbq.mongodb.net/database?retryWrites=true&w=majority
    
<code>LOG_CHANNEL</code> - create private channel and get channel ID (if you can't pass any channel ID from channel to @getidsbot it might look like -1001234567899).</br>
<code>ADMIN</code> - Your Account ID (if you can't find it using a bot like @getmyid_bot). <b>If there is an additional ADMIN1 and ADMIN2, write it according to the example in the Heroku config and just put a number behind it</b></br>

<b>STEP 4</b></br>
Move some that are in the bot folder</br>
Make sure this moves all to PATH /var/www/html/hooks/bot</br>
- databases</br>
- config</br>
- package-lock.json</br>
- package.json</br>
- help.js</br>
- config.js</br>
- index.js</br>
<hr>

Don't forget to use this command to run the bot. Make sure it's in the bot folder, if not, type

    cd /var/www/html/hooks/bot pm2 start index.js --name ratufilesaver --watch --ignore-watch="node_modules"

<b>INFO</b></br>
You can use bots without domain and SSL by changing the code below in index.js to <b>bot.launch()</b>. Just skip the NGINX and SSL steps, just skip the <b>DOMAIN</b> and <b>PORT</b> in config.js.

    bot.launch({
        webhook:{
        domain:`${config.domain}`,
        port:`${config.PORT}`
        }
    })
<hr>

<h2>Here are some admin commands and usage.</h2>

~ How users ban, unban and kick from bots and groups.
<code>/ban</code> userID caption if any.</br>
<code>/banchat</code> userID (private).</br>
<code>/unban</code> userID.</br>
<code>/unbanchat</code> userID (private).</br>
<code>/kick</code> userID.</br>
<b>Get UserID from log channel.</b></br>

~ How to use pin and unpin in groups.</br>
<code>/pin</code> reply to the message you want to pin.</br>
<code>/unpin</code> reply to the message you want to unpin.</br>

~ How to send a message to a user from a group.</br>
<code>/send</code> message. send messages in the group.</br>

<h2>How to delete files from bot.</h2>
You can delete files 4 ways.</br>

  Delete individual files with file_id.
  
  Delete group files with mediaId.
  
  Delete all files Send by user.
  
  Delete all files Send to bot.


~ Delete individual files with file_id.</br>
<code>/rem</code> file_id. It will delete files one by one when you provide file_id, get file_id from log channel.</br>

~ Delete group files with mediaId.</br>
<code>/remgrp</code> mediaId. This will delete the media in the group, get the mediaId from the log channel.</br>

~ Delete all files Send by user.</br>
<code>/remall</code> userID. You can delete all files sent by specific user if user send abusive content or spam get userid from log channel.</br>

~ Delete all files Send to B0T.</br>
<code>/clear</code>. This will permanently delete all files sent to the bot.</br>

<h2>Send a message to the user</h2>

<code>/broadcast</code>. You can broadcast text messages to your users, messages will be sent from the last joined user to the first joined user to reduce spam. Try not to send too many messages at once if you have a large number of users.

<h2>How to find out the total number of bot users.</h2>

<code>/stats</code>. You will get total users started your bot, real time data will be updated after successful broadcast.
<hr>

<b>If you want to support us, follow us on GitHub for support.</b>
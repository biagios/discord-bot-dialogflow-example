<h1 align="center"> Dialogflow Integration for Discord Bot. </h1>

<p align="center"> A simple Discord bot that can be used as an example when connecting Dialogflow. </p>


## 📝 Installation

1) Fork this repo using:
```
git clone https://github.com/biagios/discord-bot-dialogflow-example
```
2) Once forked browse to the directory where it was installed:
```
cd /yourdirectoryforthefilehere/
```
3) Install the required dependencies using npm:   
> If you are only using the repo as an example and just want the basic main dependencies needed these are: `dialogflow` & `@google-cloud/storage` (and of course `discord.js`)   
```
npm install
```

4) Once installed please compile your `config.js` file.

5) Follow the instructions found [here](https://cloud.google.com/docs/authentication/production#creating_a_service_account) in order to create a Google Cloud service account.  
**Dialogflow *should* normally automatically create one for you!** If you are certain it has then you should be able to simply execute the following command (***populating the fields `[NAME]` and `[PROJECT_ID]`.***)   
```
gcloud iam service-accounts keys create keyfile.json --iam-account [NAME]@[PROJECT_ID].iam.gserviceaccount.com
```

6) Once you have a keyfile.json you must define it. (It should automatically find it and log you in but it's best to define it)
Run the following in your terminal, populating `[PATH]` with the path to the `keyfile.json`, I recommend leaving this in wherever you put your `config.js`:   
```
export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"
```

7) Once you have completed the above steps, head to `/modules/dialog.js` (or your equivalent module) and head to line `10` to `13`.   
On the line containing: `const projectId = '[PROJECT_ID]'` replace `[PROJECT_ID]` with the project ID you used in **step 5**.   
On the line containing: `const keyFilename = './keyfile.json'` make sure the path defined is where your `keyfile.json` is found.



## 🗄 Usage
If you have followed the installation process above the las thing you need to do is start the bot. This is easily done by executing the following:

```
node bot.js
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/biagios/discord-bot-dialogflow-example/issues). You can also take a look at the [contributing guide](https://github.com/biagios/discord-bot-dialogflow-example/blob/master/CONTRIBUTING.md).

<h6 align="center">
Copyright © 2020 <a href="https://github.com/MiddayClouds">Midday</a> | Bot forked from older verion of <a href="https://github.com/MiddayClouds/pal/">Pal</a>
<br/>
Node.js client for Dialogflow can be found <a href="https://github.com/googleapis/nodejs-dialogflow">here.</a></h6>

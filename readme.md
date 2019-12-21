# Startup Messenger
Startup Messenger is a free messenger written with NodeJs and ReactJs for your company. The current version is only a simple broadcast and supports sending multiline messages and files and shows image previews.
## Installation
You must have NodeJs and MongoDB installed in your server.\
Download NodeJs from here [NodeJs](https://nodejs.org/en/).\
And MongoDB from here (don't forget to run VPN for this!) [MongoDB Community Server](https://www.mongodb.com/download-center/community)\
Then just clone the project!
## Initializing
1. Go to project directory and run
```bash
npm install
```
2. You have to generate a privake key and put it in "pv.key" file in the project root directory. There are many online tools for this like [Online RSA Key Generator](https://travistidwell.com/jsencrypt/demo/). Press the "Generate New Keys" and copy the generated "Private Key" to "pv.key" file and save it.
3. Open "config.js" file in the root folder of project and edit IP to your server IP. If you want you can change the Port here too.
```bash
let IP = '192.168.1.27';
let PORT = 8000;
```
## Start Project
For starting project run
```bash
npm start
```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
## License
[MIT](https://choosealicense.com/licenses/mit/)
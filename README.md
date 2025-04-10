# 🐘 Animal Quiz App

## 📖 Description
The **Animal Quiz App** is an interactive learning tool designed to educate users about various animals through engaging quizzes. Covering mammals like **elephants, lions, giraffes, and tigers**, the app provides informative descriptions and multiple-choice questions to test users' knowledge. Each animal category includes facts about their habitat, diet, behaviors, and unique characteristics, making learning fun and engaging for all ages.

## 🌟 Features
- 🧠 **Informative Content**: Learn about different animals with rich descriptions.  
- 🎯 **Multiple Quiz Levels**: Challenge yourself with different question sets.  
- 📊 **Interactive Learning**: Gain knowledge through detailed explanations after each question.  
- 🌍 **Diverse Topics**: Covers a wide range of species with scientifically accurate information.

Perfect for students, wildlife enthusiasts, and anyone curious about the animal kingdom! 🐾✨



# Prerequisites
Before you begin, ensure you have met the following requirements:

* Node.js and npm installed
* Nest.js CLI installed (npm install -g @nestjs/cli)
* MySQL database accessible

## Getting Started
### Installation
* Fork the repository
Click the "Fork" button in the upper right corner of the repository page. This will create a copy of the repository under your GitHub account.


* Clone this repository:
```
https://github.com/MadgicalSwift/animal-fact-bot.git
```
* Navigate to the Project Directory:
```
cd animal-fact-bot
```
* Install Project Dependencies:
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Add the following environment variables:

```bash
USERS_TABLE=
REGION= 
ACCESS_KEY_ID= 
SECRET_ACCESS_KEY=
API_URL= 
BOT_ID=
API_KEY= 
```
# API Endpoints
```
POST api/message: Endpoint for handling user requests. 
GET /api/status: Endpoint for checking the status of  api
```
# folder structure

```bash
src/
├── app.controller.ts
├── app.module.ts
├── main.ts
├── chat/
│   ├── chat.service.ts
│   └── chatbot.model.ts
├── common/
│   ├── exceptions/
│   │   ├── custom.exception.ts
│   │   └── http-exception.filter.ts
│   ├── middleware/
│   │   ├── log.helper.ts
│   │   └── log.middleware.ts
│   └── utils/
│       └── date.service.ts
├── config/
│   └── database-config.service.ts
├── datasource/
│   └── Animal.json
├── i18n/
│   ├── buttons/
│   │   └── button.ts
│   ├── en/
│   │   └── localised-strings.ts
│   └── hi/
│       └── localised-strings.ts
├── intent/
│   └── intent.classifier.ts
├── localization/
│   ├── localization.service.ts
│   └── localization.module.ts
│
├── message/
│   ├── message.module.ts
│   └── message.service.ts
└── mixpanel/
│   ├── mixpanel.services.ts
│   └── mixpanel.service.specs.ts 
└── model/
│   ├── user.entity.ts
│   ├── user.module.ts
│   └── user.service.ts
└── swiftchat/
    ├── swiftchat.module.ts
    └── swiftchat.service.ts

```

# Link
* [Documentation](https://app.clickup.com/43312857/v/dc/199tpt-7824/199tpt-19527)


﻿const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongo = require('./db');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

const articles = [
    {
        id: "1",
        title: "Исполнителей приговорили к пожизненному.",
        summary: "Исполнителей двойного убийства в Минске приговорили к пожизненному, заказчицу — к 12 годам",
        createdAt: new Date(2017, 3, 6, 14, 51),
        author: "Соболевский",
        tags: ["криминал", "суд", "Минск"],
        content: "Напомним, по версии следствия, причиной трагедии в Минске стала ревность:" +
        " 27-летняя воспитательница детсада Алина Шульганова хотела вернуть бывшего парня." +
        " Она попросила соседа по дому Александра Жильникова (ранее судимого) и его " +
        "приятеля Вячеслава Сухарко «отправить» соперницу в больницу на пару недель — избить."+
        "Но исполнители перестарались и убили обоих в одной из квартир по улице Алибегова."+
        "На теле убитых эксперты насчитали десятки ножевых ранений. Погибшей было 24 года, парню — 32.",
        isHidden: false,
    },
    {
        id: "2",
        title: "На торгах 6 марта рубль окреп.",
        summary: "На торгах 6 марта рубль окреп только к доллару.",
        createdAt: new Date(2017, 2, 3, 23, 14),
        author: "Петровский",
        tags: ["торги", "экономика", "Беларусь"],
        content: "На Белорусской валютно-фондовой бирже 6 марта прошли очередные торги валютами." +
        "Курс рубля снизился к евро и российскому рублю.Доллар снизился на BYN0,011 — до 1,9031 рубля."+
        "Евро вырос на BYN0,0072 — до 2,0203 рубля.Российский рубль укрепился"+
        "на BYN0,0146 — до 3,2651 за 100 российских рублей.В курсообразовании Нацбанк"+
        "использует механизм сглаживания дневных колебаний курса рубля к корзине валют,"+
        "в которой удельный вес российского рубля составляет 50%, доллара США — 30%, евро — 20%.",
        isHidden: false,
    },
    {
        id: "3",
        title: "Минское «Динамо» обыграло ярославский «Локомотив»",
        summary: "Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2.",
        createdAt: new Date(2017, 2, 27, 20, 1),
        author: "Иван Иванов",
        tags: ["КХЛ", "хоккей", "спорт"],
        content: "Гости создали больше опасных моментов и в два раза перебросали минчан," +
        " но «зубры» на этот раз очень эффективно использовали свои моменты.",
        isHidden: false,
    },
    {
        id: "4",
        title: "Министр Заяц гарантирует Данкверту",
        summary: "Министр Заяц гарантирует Данкверту, что тот вернется в Россию после визита в Беларусь.",
        createdAt: new Date(2016, 11, 1, 14, 12),
        author: "Похомчик",
        tags: ["сельское", "хозяйство", "Беларусь"],
        content: "Беларусь на совместной с Минсельхозом России коллегии планирует обсудить" +
        " поставки своей продукции. Глава Минсельхозпрода Беларуси Леонид Заяц также пригласил" +
        " на коллегию своего российского коллегу Александра Ткачева и руководителя Россельхознадзора" +
        " Сергея Данкверта. Об этом Леонид Заяц рассказал в интервью РИА «Новости».",
        isHidden: false,
    },
    {
        id: "5",
        title: "Минтранс не будет вносить изменения",
        summary: "Минтранс не будет вносить изменения в механизм сбора дорожного налога",
        createdAt: new Date(2017, 2, 27, 11, 9),
        author: "Тихонович",
        tags: ["минсктранс", "Беларусь"],
        content: "Минтранс не будет вносить изменения в механизм сбора дорожного налога," +
        " при этом ведомство уделит внимание ремонту местных дорог. Об этом на пресс-конференции " +
        "сказал министр транспорта и коммуникаций Беларуси Анатолий Сивак.",
        isHidden: false,
    },
    {
        id: "6",
        title: "МАРТ подготовил революционный проект",
        summary: "МАРТ подготовил революционный проект указа для предприятий ритейла, общепита и бытовых услуг",
        createdAt: new Date(2017, 2, 13, 15, 27),
        author: "Сидорович",
        tags: ["указ", "Беларусь", "экономика"],
        content: "Министерство антимонопольного регулирования и торговли подготовило проект" +
        " указа президента, предполагающий мораторий на проверки до конца 2020 года и широкие" +
        " налоговые льготы для субъектов ритейла, общепита и бытовых услуг. Об этом сообщается в" +
        " пресс-релизе Бизнес союза предпринимателей и нанимателей имени профессора М. С. Кунявского.",
        isHidden: false,
    },
    {
        id: "7",
        title: "В Бресте идут суды",
        summary: "В Бресте идут суды над участниками Марша нетунеядцев",
        createdAt: new Date(2017, 3, 5, 13, 37),
        author: "Калиновский",
        tags: ["Брест", "суд", "марш"],
        content: "Суд Ленинского района Бреста 6 марта рассматривает административные дела" +
        " в отношении представителей анархистского движения, которые принимали участие" +
        " в «Марше нетунеядцев» в Бресте в прошлые выходные.",
        isHidden: false,
    },
    {
        id: "8",
        title: "Умерла одна из пострадавших",
        summary: "Умерла одна из пострадавших при взрыве на Скидельском сахарном комбинате",
        createdAt: new Date(2017, 3, 5, 20, 36),
        author: "Врач",
        tags: ["взрыв", "Гродно"],
        content: "44-летняя женщина скончалась в ночь с пятницы на субботу." +
        " Пострадавшая проходила лечение в Гродненской БСМП.",
        isHidden: false,
    },
    {
        id: "9",
        title: "Стройка остановлена, лагерь свернут",
        summary: "Стройка остановлена, лагерь свернут: противостояние в Куропатах закончено",
        createdAt: new Date(2017, 3, 6, 16, 11),
        author: "Сталин",
        tags: ["Минск", "стройка", "протест"],
        content: "На пятнадцатый день противостояния в Куропатах активисты, протестовавшие против" +
        " строительства бизнес-центра, решили убрать лагерь, передает корреспондент TUT.BY." +
        " Стройка сейчас полностью остановлена, забор планируют разобрать в ближайшее время.",
        isHidden: false,
    },
    {
        id: "10",
        title: "Южнокорейские военные сообщили",
        summary: "Южнокорейские военные сообщили о запуске ракеты КНДР",
        createdAt: new Date(2017, 3, 6, 4, 52),
        author: "КимЧенЫн",
        tags: ["КНДР", "Корея", "политика"],
        content: "КНДР осуществила запуск ракеты неизвестного типа. Об этом сообщает в понедельник," +
        " 6 марта, агентство «Ёнхап» со ссылкой на заявление комитета начальников штабов Южной Кореи.",
        isHidden: false,
    },
    {
        id: "11",
        title: "Исполнителей приговорили к пожизненному.",
        summary: "Исполнителей двойного убийства в Минске приговорили к пожизненному, заказчицу — к 12 годам",
        createdAt: new Date(2017, 3, 7, 14, 51),
        author: "Соболевская",
        tags: ["криминал", "суд", "Минск"],
        content: "Напомним, по версии следствия, причиной трагедии в Минске стала ревность:" +
        " 27-летняя воспитательница детсада Алина Шульганова хотела вернуть бывшего парня." +
        " Она попросила соседа по дому Александра Жильникова (ранее судимого) и его " +
        "приятеля Вячеслава Сухарко «отправить» соперницу в больницу на пару недель — избить."+
        "Но исполнители перестарались и убили обоих в одной из квартир по улице Алибегова."+
        "На теле убитых эксперты насчитали десятки ножевых ранений. Погибшей было 24 года, парню — 32.",
        isHidden: false,
    },
    {
        id: "12",
        title: "На торгах 6 марта рубль окреп.",
        summary: "На торгах 6 марта рубль окреп только к доллару.",
        createdAt: new Date(2017, 4, 3, 23, 14),
        author: "Марков",
        tags: ["торги", "экономика", "Беларусь"],
        content: "На Белорусской валютно-фондовой бирже 6 марта прошли очередные торги валютами." +
        "Курс рубля снизился к евро и российскому рублю.Доллар снизился на BYN0,011 — до 1,9031 рубля."+
        "Евро вырос на BYN0,0072 — до 2,0203 рубля.Российский рубль укрепился"+
        "на BYN0,0146 — до 3,2651 за 100 российских рублей.В курсообразовании Нацбанк"+
        "использует механизм сглаживания дневных колебаний курса рубля к корзине валют,"+
        "в которой удельный вес российского рубля составляет 50%, доллара США — 30%, евро — 20%.",
        isHidden: false,
    },
    {
        id: "13",
        title: "Минское «Динамо» обыграло ярославский «Локомотив»",
        summary: "Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2.",
        createdAt: new Date(2017, 2, 27, 20, 51),
        author: "Иванов",
        tags: ["КХЛ", "хоккей", "спорт"],
        content: "Гости создали больше опасных моментов и в два раза перебросали минчан," +
        " но «зубры» на этот раз очень эффективно использовали свои моменты.",
        isHidden: false,
    },
    {
        id: "14",
        title: "Министр Заяц гарантирует Данкверту",
        summary: "Министр Заяц гарантирует Данкверту, что тот вернется в Россию после визита в Беларусь.",
        createdAt: new Date(2016, 11, 1, 4, 12),
        author: "Данец",
        tags: ["сельское", "хозяйство", "Беларусь"],
        content: "Беларусь на совместной с Минсельхозом России коллегии планирует обсудить" +
        " поставки своей продукции. Глава Минсельхозпрода Беларуси Леонид Заяц также пригласил" +
        " на коллегию своего российского коллегу Александра Ткачева и руководителя Россельхознадзора" +
        " Сергея Данкверта. Об этом Леонид Заяц рассказал в интервью РИА «Новости».",
        isHidden: false,
    },
    {
        id: "15",
        title: "Минтранс не будет вносить изменения",
        summary: "Минтранс не будет вносить изменения в механизм сбора дорожного налога",
        createdAt: new Date(2017, 2, 17, 11, 54),
        author: "Пятницкая",
        tags: ["минсктранс", "Беларусь"],
        content: "Минтранс не будет вносить изменения в механизм сбора дорожного налога," +
        " при этом ведомство уделит внимание ремонту местных дорог. Об этом на пресс-конференции " +
        "сказал министр транспорта и коммуникаций Беларуси Анатолий Сивак.",
        isHidden: false,
    },
    {
        id: "16",
        title: "МАРТ подготовил революционный проект",
        summary: "МАРТ подготовил революционный проект указа для предприятий ритейла, общепита и бытовых услуг",
        createdAt: new Date(2017, 2, 10, 15, 27),
        author: "Петрович",
        tags: ["указ", "Беларусь", "экономика"],
        content: "Министерство антимонопольного регулирования и торговли подготовило проект" +
        " указа президента, предполагающий мораторий на проверки до конца 2020 года и широкие" +
        " налоговые льготы для субъектов ритейла, общепита и бытовых услуг. Об этом сообщается в" +
        " пресс-релизе Бизнес союза предпринимателей и нанимателей имени профессора М. С. Кунявского.",
        isHidden: false,
    },
    {
        id: "17",
        title: "В Бресте идут суды",
        summary: "В Бресте идут суды над участниками Марша нетунеядцев",
        createdAt: new Date(2017, 2, 5, 13, 37),
        author: "Костюшко",
        tags: ["Брест", "суды", "марш"],
        content: "Суд Ленинского района Бреста 6 марта рассматривает административные дела" +
        " в отношении представителей анархистского движения, которые принимали участие" +
        " в «Марше нетунеядцев» в Бресте в прошлые выходные.",
        isHidden: false,
    },
    {
        id: "18",
        title: "Умерла одна из пострадавших",
        summary: "Умерла одна из пострадавших при взрыве на Скидельском сахарном комбинате",
        createdAt: new Date(2016, 11, 5, 20, 36),
        author: "Медсестра",
        tags: ["взрыв", "Гродно"],
        content: "44-летняя женщина скончалась в ночь с пятницы на субботу." +
        " Пострадавшая проходила лечение в Гродненской БСМП.",
        isHidden: false,
    },
    {
        id: "19",
        title: "Стройка остановлена, лагерь свернут",
        summary: "Стройка остановлена, лагерь свернут: противостояние в Куропатах закончено",
        createdAt: new Date(2017, 1, 6, 16, 11),
        author: "Сталинка",
        tags: ["Минск", "стройка", "протест"],
        content: "На пятнадцатый день противостояния в Куропатах активисты, протестовавшие против" +
        " строительства бизнес-центра, решили убрать лагерь, передает корреспондент TUT.BY." +
        " Стройка сейчас полностью остановлена, забор планируют разобрать в ближайшее время.",
        isHidden: false,
    },
    {
        id: "20",
        title: "Южнокорейские военные сообщили",
        summary: "Южнокорейские военные сообщили о запуске ракеты КНДР",
        createdAt: new Date(2017, 3, 4, 4, 52),
        author: "Брат КимЧенЫн-а",
        tags: ["КНДР", "Корея", "политика"],
        content: "КНДР осуществила запуск ракеты неизвестного типа. Об этом сообщает в понедельник," +
        " 6 марта, агентство «Ёнхап» со ссылкой на заявление комитета начальников штабов Южной Кореи.",
        isHidden: false,
    }

];

const tags =  ["криминал","суд", "Минск","торги","экономика","КХЛ", "хоккей", "спорт",
    "сельское", "хозяйство", "Беларусь",
    "минсктранс","указ", "Беларусь","Брест","марш","взрыв", "Гродно",
    "стройка", "протест","КНДР", "Корея", "политика"];

const users = [
    {
        login: "a",
        password: "a"
    },
    {
        login: "b",
        password: "b"
    },
    {
        login: "c",
        password: "c"
    },
    {
        login: "d",
        password: "d"
    },
    {
        login: "e",
        password: "e"
    },
    {
        login: "f",
        password: "f"
    },
    {
        login: "g",
        password: "g"
    },
    {
        login: "h",
        password: "h"
    },
    {
        login: "j",
        password: "j"
    },
    {
        login: "k",
        password: "k"
    },
    {
        login: "l",
        password: "l"
    },
    {
        login: "m",
        password: "m"
    },
    {
        login: "n",
        password: "n"
    },
    {
        login: "o",
        password: "o"
    }
];

passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            session: false,
        }, (username, password, done) => {
            let user;
            mongo.getUsers()
                .then(value => {
                user = value.find(userCur => userCur.login === username);
                done(null, (!user || user.password !== password) ? false : user);
            })
                .catch(error => console.log(error));
    }));

passport.serializeUser((user, done) => done(null, user.login));

passport.deserializeUser((login, done) => {
            let user;
            mongo.getUsers()
                .then(value => {
            user = value.find(userCur => userCur.login === login);
            done(null, (user) ? user : false);
        })
                .catch(error => console.log(error));
    });

app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());


    mongo.connect('mongodb://localhost:27017', (err) => { ///siteEP
       if (err) {
            console.log(err);
        } else {
            app.listen(app.get('port'), () => console.log("Server running in the 90's on port: ", app.get('port')));
        }
    });

    app.get('/user', (req, res) => mongo.getUsers()
        .then(value => res.json(value.sort((a, b) => {
            if (a.login.toLowerCase() < b.login.toLowerCase()) {
        return -1;
        }
            if (a.login.toLowerCase() > b.login.toLowerCase()) {
        return 1;
        }
        return 0;
        })))
        .catch(error => console.log(error)));

    app.get('/authors', (req, res) => mongo.getUsers()
        .then(value => res.json(value.map(user => user.login).sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
            return -1;
        }
            if (a.toLowerCase() > b.toLowerCase()) {
            return 1;
        }
        return 0;
        })))
        .catch(error => console.log(error)));

    app.get('/article', (req, res) => mongo.getArticles()
    .then(value => res.json(value.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())))
    .catch(error => console.log(error)));

    app.get('/article/:id', (req, res) => mongo.getArticleById(req.query.id)
    .then(value => res.json(value))
    .catch(error => console.log(error)));

    app.get('/length', (req, res) => mongo.getArticles()
    .then(value => res.json(value.length))
    .catch(error => console.log(error)));

    app.get('/tags', (req, res) => mongo.getTags()
    .then(value => res.json((req.query.tag) ? value.map(tagObj => tagObj.tag).find(tag => req.query.tag === tag) :
        value.map(tagObj => tagObj.tag).sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
        if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
        return 0;
    })))
    .catch(error => console.log(error)));

    //запросы health checks (HTTP) - get
    app.get('/login', (req, res) => res.json(null));
    //запросы health checks (HTTP) - post для новостей
    app.post('/article',(req, res) => {
            const article = {
                    id: req.body.id,
                    title: req.body.title,
                    summary: req.body.summary,
                    createdAt: new Date(req.body.createdAt),
                    author: req.body.author,
                    tags: req.body.tags,
                    content: req.body.content,
                    isHidden: false
            };
        mongo.insertArticle(article)
            .then(() => mongo.getArticles()
            .then(value => res.json(value.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())))
            .catch(error => console.log(error)))
            .catch(error => console.log(error));
    });
    //запросы health checks (HTTP) - post для тегов
app.post('/tag', (req, res) => mongo.insertTag({tag: req.body.tag})
        .then(() => mongo.getTags()
        .then(value => res.json(value.map(tagObj => tagObj.tag).sort((a, b) => {
                if (a.toLowerCase() < b.toLowerCase()) {
                        return -1;
                    }
                if (a.toLowerCase() > b.toLowerCase()) {
                        return 1;
                    }
                return 0;
})))
        .catch(error => console.log(error)))
        .catch(error => console.log(error))
);
    //запросы health checks (HTTP) - post
    app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => res.json(req.user.login));
    //запросы health checks (HTTP) - put для новостей
app.put('/article', (req, res) => mongo.getArticleById(req.body.id)
    .then(value => {
        value.summary = req.body.summary;
        value.title = req.body.title;
        value.tags = req.body.tags;
        value.content = req.body.content;
        mongo.editArticle(value.id, value)
            .then(() => mongo.getArticles()
                .then(articles => res.json(articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())))
                .catch(error => console.log(error)))
            .catch(error => console.log(error))
        })
    .catch(error => console.log(error))
);



    app.delete('/article', (req, res) => mongo.getArticleById(req.body.id)
    .then(value => {
        value.isHidden = true;
        mongo.editArticle(value.id, value)
            .then(() => mongo.getArticles()
                .then(articles => res.json(articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())))
                .catch(error => console.log(error)))
            .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
);
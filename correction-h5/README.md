# correction-h5

### Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```

### EMQ X Cloud Setting

Sql in editing rules:

```mysql
SELECT

topic,
username,
timestamp as create_time,
clientid as client_id,
payload.duration as duration,
payload.success as success,
payload.remark as remark

FROM

"correction/record"
```

Response action:

```
INSERT INTO record(duration, success, remark, topic, username, client_id) VALUES (${duration}, ${success}, ${remark}, ${topic}, ${username}, ${client_id})
```

### Acknowledgments

- Thanks for [UmiJS](https://umijs.org/zh-CN/docs)
- Thanks for [MQTT.js](https://github.com/mqttjs/MQTT.js)
- Thanks for [Font Awesome](https://fontawesome.com/)

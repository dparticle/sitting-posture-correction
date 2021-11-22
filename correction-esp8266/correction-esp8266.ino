#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define TRIG 12  //引脚 Trig 连接 IO
#define ECHO 13  //引脚 Echo 连接 IO
#define START_DURATION 2000
#define ADJUST_DURATION 5000
#define EXCEPTION_DURATION 10000

const char* ssid = "***";
const char* password = "***";
const char* mqtt_server = "***";
const char* topic_pub = "***";

WiFiClient esp_client;
PubSubClient client(esp_client);
StaticJsonDocument<200> doc;
String client_id;
float cm;
unsigned long now, keep;  // 用于状态更改时间判断、记录正常坐姿维持开始时间
bool flag = false;

// 连接 Wi-Fi
void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// mqtt 订阅回调函数
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

// 连接 mqtt
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    client_id = "ESP8266Client-";
    client_id += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(client_id.c_str(), "***", "***")) {
      Serial.println("connected");
      // Once connected, publish an announcement...
    //   client.publish("outCL", "hello world");
      // ... and resubscribe
    //   client.subscribe("inCL");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void send_keep_record(unsigned long duration, bool ok, char* remark) {
  //TODO 发送数据后端记录本次坐姿维持时间
  String output;

  doc.clear();
  doc["clientId"] = client_id;
  doc["topic"] = topic_pub;
  doc["ok"] = ok;
  JsonObject data = doc.createNestedObject("data"); //添加一个对象节点
  data["duration"] = duration;
  data["remark"] = remark;
  serializeJson(doc ,output);

  serializeJsonPretty(doc, Serial);

  client.publish(topic_pub, output.c_str());
  // Serial.print(ok ? "成功" : "异常");
  // Serial.print("结束！");
  // Serial.print("本次正确坐姿维持时间：");
  // Serial.print(duration);
  // Serial.print("，详情信息：");
  // Serial.print(remark);
}

float get_distance() {
  digitalWrite(TRIG, LOW);   // 给 Trig 发送一个低电平
  delayMicroseconds(5);      // 等待 5 微妙
  digitalWrite(TRIG, HIGH);  // 给 Trig 发送一个高电平
  delayMicroseconds(10);     // 等待 10微妙
  digitalWrite(TRIG, LOW);   // 给 Trig 发送一个低电平

  float temp = float(pulseIn(ECHO, HIGH));
  return (temp * 17) / 1000;  // 把回波时间换算成 cm
}

void normal_handle() {
  Serial.print("坐姿正常，距离为：");
  Serial.println(cm);
  // 2s 内稳定处于正常距离
  if (!flag) {
    now = millis();
    while (millis() - now < START_DURATION) {
      cm = get_distance();
      // 过滤异常
      if (cm < 30 && !(cm >= 7 && cm <= 13)) {
        break;
      }
      // 提示
      Serial.print("继续保持");
      delay(250);
    }
    if (millis() - now >= START_DURATION) {
      Serial.print("开始专注！");
      flag = true;
      keep = millis();
    }
  }
}

void near_handle() {
  Serial.print(flag ? "你驼背了" : "远于正常距离");
  Serial.print("，距离为：");
  Serial.println(cm);
  // 5s 内调整即恢复，否则结束
  if (flag) {
    now = millis();
    while (millis() - now < ADJUST_DURATION) {
      cm = get_distance();
      if (cm >= 7 && cm <= 13) {
        break;
      }
      // 提示
      Serial.print("远于正常距离");
      Serial.print("，距离为：");
      Serial.println(cm);
      delay(250);
    }
    if (millis() - now >= ADJUST_DURATION) {
      flag = false;
      send_keep_record(millis() - keep, false, "远于正常距离");
    }
  }
}

void far_handle() {
  Serial.print(flag ? "离桌子太近了" : "近于正常距离");
  Serial.print("，距离为：");
  Serial.println(cm);
  // 5s 内调整即恢复，否则结束
  if (flag) {
    now = millis();
    while (millis() - now < ADJUST_DURATION) {
      cm = get_distance();
      if (cm >= 7 && cm <= 13) {
        break;
      }
      // 提示
      Serial.print("近于正常距离");
      Serial.print("，距离为：");
      Serial.println(cm);
      delay(250);
    }
    if (millis() - now >= ADJUST_DURATION) {
      flag = false;
      send_keep_record(millis() - keep, false, "近于正常距离");
    }
  }
}

void exception_handle() {
  Serial.println("数据异常");
  // 异常数据 10 秒后自动结束
  if (flag) {
    now = millis();
    while (millis() - now < EXCEPTION_DURATION) {
      cm = get_distance();
      if (cm < 30) {
        break;
      }
      Serial.print("数据异常");
      delay(250);
    }
    if (millis() - now >= EXCEPTION_DURATION) {
      Serial.println("数据异常");
      send_keep_record(millis() - keep, false, "数据异常");
      flag = false;
    }
  }
}

void setup() {
  Serial.begin(115200);
  // 设置 HC-SR04 引脚
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  setup_wifi();
  client.setServer(mqtt_server, 11922);
  client.setCallback(callback);
  // delay(2000);
  now = millis();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  cm = get_distance();

  if (cm < 30) {
    if (cm >= 7 && cm <= 13) {
      normal_handle();
    } else if (cm > 13) {
      near_handle();
    } else {
      far_handle();
    }
  } else {
    exception_handle();
  }

  delay(250);
}
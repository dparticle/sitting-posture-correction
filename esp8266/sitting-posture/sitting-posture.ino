#define TRIG 12  //引脚 Trig 连接 IO
#define ECHO 13  //引脚 Echo 连接 IO
#define START_DURATION 2000
#define ADJUST_DURATION 5000
#define EXCEPTION_DURATION 10000

float cm;
unsigned long now, keep;  // 用于状态更改时间判断、记录正常坐姿维持开始时间
bool flag = false;

void send_keep_record(unsigned long duration, bool ok, char* remark) {
  //TODO 发送数据后端记录本次坐姿维持时间
  Serial.print(ok ? "成功" : "异常");
  Serial.print("结束！");
  Serial.print("本次正确坐姿维持时间：");
  Serial.print(duration);
  Serial.print("，详情信息：");
  Serial.print(remark);
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
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  delay(2000);
  now = millis();
}

void loop() {
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
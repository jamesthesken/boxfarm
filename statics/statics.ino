
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);


  digitalWrite(9, HIGH);
  digitalWrite(10, HIGH);
  digitalWrite(11, HIGH);
  digitalWrite(12, HIGH);
  
}

void loop() {
  // put your main code here, to run repeatedly:

  if (Serial.available()) {
    int state = Serial.parseInt();

    if (state == 1){
     digitalWrite(9, LOW);

    }

    if (state == 10){
     digitalWrite(9, HIGH);

    }


    if (state == 2){
     digitalWrite(10, LOW);

    }

    if (state == 20){
     digitalWrite(10, HIGH);

    }

    
    if (state == 3){
     digitalWrite(11, LOW);

    }

    if (state == 30){
     digitalWrite(11, HIGH);

    }

    if (state == 4){
     digitalWrite(12, LOW);

    }

    if (state == 40){
     digitalWrite(12, HIGH);

    }


  }

  

}

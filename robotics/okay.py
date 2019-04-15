import serial
import time


with serial.Serial('/dev/ttyACM1', 115200, timeout=1) as ser:
    time.sleep(2) # wait for this bullshit to wakeup...
    ser.write('1\n')
    line = ser.readline()

    if len(line) > 0:
        print("got it: {}".format(line))

    else:
        print('wut') # add an actual error handle with try and exception

    while line != "OK\n":
        ser.write('1\n')
        line = ser.readline()
        if line == "OK\n":
            print("OK")
            
    
ser.close()
                   

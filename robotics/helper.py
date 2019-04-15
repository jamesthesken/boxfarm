import serial
import time

#ra = serial.Serial('/dev/ttyACM0', 115200)
#rb = serial.Serial('/dev/ttyACM2',115200)


def grbl_init(rb):
    # Open g-code file
    f = open('calibrate.gcode','r'); # calibration file: contains the settings

    # Wake up grbl
    rb.write("\r\n\r\n")
    time.sleep(2)   # Wait for grbl to initialize 
    rb.flushInput()  # Flush startup text in serial input

    # send settings file to grbl
    for line in f:
        l = line.strip() # Strip all EOL characters for consistency
        print('Sending: ' + l)
        rb.write(l + '\n') # Send g-code block to grbl
        rb.write('?')
        grbl_out = rb.readline() # Wait for grbl response with carriage return
        print(' : ' + grbl_out.strip())

    rb.write('$HX\n')
    print("Calibrating...")

    time.sleep(37)

    f.close()

    return
 



def retract(ra):
    ra.write('3\n')
    response = ra.readline() # holds the response string from the robot
    print('Retracting arm')

    while response != "OK\n":
        ra.write('3\n') # maybe it didn't wake up lets call it again
        response = ra.readline()
        if response == "OK\n":
            print('Got it..')

    return response


def close_grip(ra):
    ra.write('2\n')
    response = ra.readline() # holds the response string from the robot
    print('Closing gripper')

    while response != "OK\n":
        ra.write('2\n') # maybe it didn't wake up lets call it again
        response = ra.readline()
        if response == "OK\n":
            print('Got it..')
            

def harvest_front(ra):
    ra.write('1\n')
    response = ra.readline() # holds the response string from the robot
    print('Moving to harvest position')

    while response != "OK\n":
        ra.write('1\n') # maybe it didn't wake up lets call it again
        response = ra.readline()
        if response == "OK\n":
            print('Got it..')

def harvest_second_front(ra):
    ra.write('4\n')
    response = ra.readline() # holds the response string from the robot
    print('Moving to harvest position')

    while response != "OK\n":
        ra.write('4\n') # maybe it didn't wake up lets call it again
        response = ra.readline()
        if response == "OK\n":
            print('Got it..')


def second_open(ra):
    ra.write('5\n')
    response = ra.readline() # holds the response string from the robot
    print('Moving to harvest position')

    while response != "OK\n":
        ra.write('5\n') # maybe it didn't wake up lets call it again
        response = ra.readline()
        if response == "OK\n":
            print('Got it..')


def front_image(ra):
    ra.write('6\n')
    response = ra.readline() # holds the response string from the robot
    print('Imaging front row')

    while response != "OK\n":
        ra.write('6\n') # maybe it didn't wake up lets call it again
        response = ra.readline()
        if response == "OK\n":
            print('Got it..')


def back_image(ra):
    ra.write('7\n')
    response = ra.readline() # holds the response string from the robot
    print('Imaging back row')

    while response != "OK\n":
        ra.write('7\n') # maybe it didn't wake up lets call it again
        response = ra.readline()
        if response == "OK\n":
            print('Got it..')



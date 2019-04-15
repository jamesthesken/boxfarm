# WARNING: SET 0 ON UGS GUI FIRST
# TODO: Replace the time sleeps with something more reliable.. try to poll GRBL for real time position.

import serial
import time

def polling(rb):

    r = rb.readline()

    while True:
    # takes a few times for the call to go through
        while len(r) < 20:
            rb.write('?')
            r = rb.readline()
            
        r = r.split("|") # split the returned string
        
        r = r[1][5:] # get the work position
    
    return r    


# Open grbl serial port for the robotic base
rb = serial.Serial('/dev/ttyACM0',115200)

# Open the robotic arm serial port
ra = serial.Serial('/dev/ttyACM1', 115200)

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

'''
r = polling(rb)

if r != '0.0000,0.0000,0.0000':
    raise ValueError('Reset origin before it kills itself!')
'''


rb.write('G92 X0 Y0\n') # set the origin

i = 0

# first row operations
for plant in range(10):
    
    rb.write('G00 X{}\n'.format(i))

    print('G00 X{}\n'.format(i))  

    time.sleep(15)

    '''
    r = polling(rb)

    print(r)
    print('{}.0000'.format(i))

    print("Swerving on over...")
    while r[0:6] != '{}.0000'.format(i):
        r = polling(rb)
        print(r[0:6])
         # waiting for the base to reach the coordinate

    '''
    
    # call response from robot arm to continue
    ra.write('1\n')
    response = ra.readline() # holds the response string from the robot
    print('Waiting for robot..')

    while response != "OK\n":
        ra.write('1\n') # maybe it didn't wake up lets call it again
        response = ra.readline()
        if response == "OK\n":
            print('Still here.. swerving on over dude')

    i += 3

import sys
sys.exit()

rb.write('G00 X0\n')
time.sleep(30) 

rb.write('G00 Y20\n')
time.sleep(30)

i = 0

# second row ops
for plant in range(10):
    
    rb.write('G00 X{}\n'.format(i))

    print('G00 X{}\n'.format(i))

    i +=3

    print('Imaging...')
    time.sleep(15)

    # call response from robot arm to continue
    ra.write('1\n')
    response = ra.readline() # holds the response string from the robot 

    while response != "OK\n":
        ra.write('1\n') # maybe it didn't wake up lets call it again
        response = ra.readline()
        if response == "OK\n":
            print('Still here.. swerving on over dude')

rb.write('G00 X0 Y0\n') # return home


# Close file and serial port
f.close()
rb.close()
ra.close()

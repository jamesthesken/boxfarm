# WARNING: SET 0 ON UGS GUI FIRST
# TODO: Replace the time sleeps with something more reliable.. try to poll GRBL for real time position.

import serial
import time
import socket
from helper import *

#first row=[3, 5.7, 8.9, 11.5, 15, 17.6, 21.08, 27.48, 30.78, 33.48, 36.78, 39.4, 42.8, 45.6, 48.82]

# after an offset of 6mm from the switch. the first plant is actually at 2.6in from 0.

#second row = [3, 5.5, 9, 11.55, 15.05, 17.55, 28.15, 30.71, 34.21, 36.67, 40.21, 46.22, ]


# Open grbl serial port for the robotic base
rb = serial.Serial('/dev/ttyACM2',115200)

# Open the robotic arm serial port
ra = serial.Serial('/dev/ttyACM0', 115200)

grbl_init(rb)

rb.write('G92 X0 Y0 Z0\n') # set the origin

rb.write('G00 X23\n')
time.sleep(30)


### Imaging Demo ###

rb.write('G00 Y4.5\n')
time.sleep(15)

print('Front row imaging position')
front_image(ra)
time.sleep(2)

rb.write('G00 Y0\n')
time.sleep(15)

rb.write('G00 X3\n')
time.sleep(20)


front_plants = [3, 5.7, 8.9, 11.5, 15, 17.6, 21.08]


for i in range(len(front_plants)):
    s = socket.socket()         # Create a socket object
    host = '192.168.4.15' # Get local machine name
    port = 12345                 # Reserve a port for your service.

    print('Moving to plant...')
    rb.write('G00 X{}\n'.format(front_plants[i]))
    time.sleep(5)

    s.connect((host, port))
    time.sleep(2)

    print('Done capturing...')

    s.shutdown(socket.SHUT_WR)
    s.close()                     # Close the socket when done

    time.sleep(10)


back_image(ra)
time.sleep(2)

rb.write('G00 X3\n')
time.sleep(25)

back_plants = [3, 5.5, 9, 11.55, 15.05, 17.55]

for i in range(len(back_plants)):
    s = socket.socket()         # Create a socket object
    host = '192.168.4.15' # Get local machine name
    port = 12345                 # Reserve a port for your service.


    print('Moving to plant...')
    rb.write('G00 X{}\n'.format(back_plants[i]))
    time.sleep(5)

    s.connect((host, port))
    time.sleep(2)

    print('Done capturing...')
    s.shutdown(socket.SHUT_WR)
    s.close()                     # Close the socket when done

    time.sleep(10)

retract(ra)
time.sleep(2)

print("Ending image demo")
rb.write('G00 X0\n')
time.sleep(40)

#### End Imaging demo ######
# Close file and serial port
rb.close()
ra.close()

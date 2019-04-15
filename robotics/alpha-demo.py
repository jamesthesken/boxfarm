# WARNING: SET 0 ON UGS GUI FIRST
# TODO: Replace the time sleeps with something more reliable.. try to poll GRBL for real time position.

import serial
import time
import socket
from helper import *

#first row=[3, 5.7, 8.9, 11.5, 15, 17.6, 21.08, 27.48, 30.78, 33.48, 36.78, 39.4, 42.8, 45.6, 48.82]

# after an offset of 6mm from the switch. the first plant is actually at 2.6in from 0.



#second row = [3, 5.5, 9, 11.55, 15.05, 17.55, 28.15, 30.71, 34.21, 36.67, 40.21, 46.22, ]


# static system timing and demo
statics = serial.Serial('/dev/ttyACM0', 115200)
time.sleep(2)
'''
print('opened')

statics.write(b'3') # turn on the first outlet
time.sleep(60) # for a minute
statics.write(b'30') # then off
print('off')
time.sleep(30)
statics.write(b'3') # it's dark..
time.sleep(2)

print('Pumps')
statics.write(b'2') # turn on the main pumps
time.sleep(300) # for 5 minutes
print('off')
statics.write(b'20') # then off

print('Draining...')
time.sleep(300)

print('Nursery')
statics.write(b'4') # turn on the nursery pumps
time.sleep(300) # for 5 minutes
statics.write(b'40') # then off

print('Statics demo complete. Moving to Robotics')
time.sleep(5)
'''

statics.write(b'3') # turn on the first outlet
time.sleep(3)

# Open grbl serial port for the robotic base
rb = serial.Serial('/dev/ttyACM1',115200)

# Open the robotic arm serial port
ra = serial.Serial('/dev/ttyACM2', 115200)

grbl_init(rb)


rb.write('G92 X0 Y0 Z0\n') # set the origin

rb.write('G00 X23\n')
time.sleep(30)


### Imaging Demo ###

rb.write('G00 Y4.5\n')
time.sleep(15)

print('Front row harvest position')
front_image(ra)
time.sleep(2)

rb.write('G00 Y0\n')
time.sleep(15)

rb.write('G00 X3\n')
time.sleep(20)


front_plants = [3, 5.7, 8.9, 11.5, 15, 17.6, 21.08]


for i in range(len(front_plants)):
    s = socket.socket()         # Create a socket object
    host = '10.42.0.219' # Get local machine name
    port = 12345                 # Reserve a port for your service.
    
    print('Moving to plant...')
    rb.write('G00 X{}\n'.format(front_plants[i]))
    time.sleep(5)

    s.connect((host, port))

    f = open('{}-{}.jpg'.format(time.time(), i), 'wb')

    print('Receiving...')
    l = s.recv(1024)
    while (l):
        f.write(l) # write data
        l = s.recv(1024)
            
    f.close()
    print('Done receiving')

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
    host = '10.42.0.219' # Get local machine name
    port = 12345                 # Reserve a port for your service.

    
    print('Moving to plant...')
    rb.write('G00 X{}\n'.format(back_plants[i]))
    time.sleep(5)

    s.connect((host, port))

    f = open('{}-{}.jpg'.format(time.time(), i), 'wb')

    print('Receiving...')
    l = s.recv(1024)
    while (l):
        f.write(l) # write data
        l = s.recv(1024)
            
    f.close()
    print('Done receiving')

    s.shutdown(socket.SHUT_WR)
    s.close()                     # Close the socket when done

    time.sleep(10)

retract(ra)
time.sleep(2)

print("Ending image demo")
rb.write('G00 X0\n')
time.sleep(40)

#### End Imaging demo ######



print("Steppin out")
rb.write('G00 X6\n')
time.sleep(15)


print('Rotating BOA')
rb.write('G00 Z-0.15748\n') # CHANGE VALUE
time.sleep(2)

print('Moving to nursery')
rb.write('G00 X11 Y-20.7\n')
time.sleep(30)

harvest_front(ra)   # move to the harvest position for the front row
time.sleep(2)

print('Rotating BOA')
rb.write('G00 Z0\n') # CHANGE VALUE
time.sleep(2)

print('Lowering base')
rb.write('G00 Y-16.75\n')
time.sleep(20)

close_grip(ra)  # close the EE gippers
time.sleep(2)

print('Raising base')
rb.write('G00 Y-20.7\n')
time.sleep(20)

print('Rotating BOA')
rb.write('G00 Z-0.15748\n') # CHANGE VALUE
time.sleep(3)

print('Lowering base')
rb.write('G00 X10.658 Y0\n')
time.sleep(35)

print('Rotating BOA')
rb.write('G00 Z0\n') # CHANGE VALUE
time.sleep(5)

print('Placing plant..')
rb.write('G00 Y6.75\n')
time.sleep(15)

harvest_front(ra)
time.sleep(2)

print('Raising base')
rb.write('G00 Y0\n')
time.sleep(5)


rb.write('G00 X0\n')


time.sleep(30)


##### Nursery complete ############


print('Moving to first plant')
rb.write('G00 X5\n')
time.sleep(15)

harvest_front(ra)   # move to the harvest position for the front row
time.sleep(2)

print('Lowering base')
rb.write('G00 Y6.75\n')
time.sleep(11)

close_grip(ra)  # close the EE gippers
time.sleep(2)

print('Raising base')
rb.write('G00 Y0\n')

print('Rotating BOA')
rb.write('G00 Z-0.15748\n') # CHANGE VALUE
time.sleep(5)

print('Traveling to next shelf')
rb.write('G00 X4.9 Y20\n')
time.sleep(40)

print('Rotating BOA')
rb.write('G00 Z0\n') # CHANGE VALUE
time.sleep(5)

print('Second shelf harvest position')
harvest_second_front(ra)
time.sleep(5)

print('Lowering into position')
rb.write('G00 Y26.421\n')
time.sleep(11)

print('Opening gripper')
second_open(ra)
time.sleep(5)

print('Raising base')
rb.write('G00 Y20\n')
time.sleep(11)

print('Rotating BOA')
rb.write('G00 Z-0.15748\n') # CHANGE VALUE
time.sleep(2)


print('Going home...')
rb.write('G00 X5.3 Y0\n')
time.sleep(25)


print('Rotating BOA')
rb.write('G00 Z0\n') # CHANGE VALUE
time.sleep(2)


rb.write('G00 X0\n')

print('First transfer complete..')

time.sleep(10)


# Close file and serial port
rb.close()
ra.close()
statics.close()


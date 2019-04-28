import serial
import time
from helper import *

# Open grbl serial port for the robotic base
rb = serial.Serial('/dev/ttyACM3',115200)

# Open the robotic arm serial port
ra = serial.Serial('/dev/ttyACM4', 115200)

grbl_init(rb)


rb.write('G92 X0 Y0 Z0\n') # set the origin

print('First plant...')
rb.write('G00 X10.6\n')
time.sleep(30)

harvest_front(ra)   # move to the harvest position for the front row
time.sleep(2)

print('Lowering base')
rb.write('G00 Y8\n')
time.sleep(20)

close_grip(ra)  # close the EE gippers
time.sleep(2)

print('Raising base')
rb.write('G00 Y0\n')
time.sleep(20)

print('Rotating BOA')
rb.write('G00 Z0.32\n') 
time.sleep(3)



print('Swerving on over..')
rb.write('G00 X35.8\n')
time.sleep(30)

print('Rotating BOA')
rb.write('G00 Z0\n') 
time.sleep(30)

print('Lowering base')
rb.write('G00 Y8.25\n')
time.sleep(20)

harvest_front(ra)   # open grips
time.sleep(2)

print('Raising base')
rb.write('G00 Y0\n')
time.sleep(20)

print('Pose!')
rb.write('G00 Z-0.32\n') 
time.sleep(15)

print('Rotate back')
rb.write('G00 Z0\n') 
time.sleep(2)

print('Lowering base')
rb.write('G00 Y8.25\n')
time.sleep(20)

close_grip(ra)  # close the EE gippers
time.sleep(2)

print('Raising base')
rb.write('G00 Y0\n')
time.sleep(20)

print('Rotate back')
rb.write('G00 Z-0.32\n') 
time.sleep(2)

print('First plant...')
rb.write('G00 X10.6\n')
time.sleep(35)

print('Rotate back')
rb.write('G00 Z0\n') 
time.sleep(2)

print('Lowering base')
rb.write('G00 Y8.25\n')
time.sleep(20)

harvest_front(ra)   # move to the harvest position for the front row
time.sleep(2)

print('Raising base')
rb.write('G00 Y0\n')
time.sleep(20)

print('All done..')
rb.write('G00 X0\n') 
time.sleep(3)



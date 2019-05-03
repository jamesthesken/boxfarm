# serves images to the BoxBrain upon successful connection by request

import RPi.GPIO as gp
import os
import time
import socket

# run on startup until connection with the BoxBrain is made
connection = None
while connection is None:
    try:
        print('Attempting connection...')
        s = socket.socket()         # Create a socket object
        host = '192.168.4.15' # Get local machine name
        port = 12345                 # Reserve a port for your service.
        s.bind((host, port))        # Bind to the port
        connection = host

        gp.setwarnings(False)
    except:
        pass


if __name__ == "__main__":
    print("Waiting for command..")
    s.listen(5)                 # Now wait for client connection.
    while True:
        c, addr = s.accept()     # Establish connection with client.


        print('Got connection from', addr)
        print('Capturing images')

        os.system('python3 imager.py')
        time.sleep(1)
        print('Done')
        os.system('scp -r images/* pi@192.168.4.1:boxfarm/gui/images')


        c.close()                # Close the connection

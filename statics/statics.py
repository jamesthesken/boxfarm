# -*- coding: utf-8 -*-

import serial
import schedule
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import json
from datetime import datetime
import requests
import csv
import glob
import os
import socketio


# lights to make everything look excellent
from pretty import *
pixels = neopixel.NeoPixel(board.D18, 65, brightness=0.2, auto_write=False,
                           pixel_order=neopixel.GRB)
rainbow_cycle(0.001)

pixels.fill((0,255,0))


SETTINGS_PATH = '../gui/'
SETTINGS_JSON_FILE = 'settings.json'
settings = open(SETTINGS_PATH + SETTINGS_JSON_FILE) # read the configuration file

# connect the backend client to the GUI
sio = socketio.Client()
sio.connect('http://localhost:4004')

# Watchdog to monitor changes made to configuration JSON file
class MyHandler(FileSystemEventHandler):
   def on_modified(self, event):
     settings = open(SETTINGS_PATH + SETTINGS_JSON_FILE) # read the configuration file
     data = json.load(settings)        # load the settings as a dictionary

     # debug prints
     #print('New settings: {}'.format(data))
     #print('event type: {}  path : {}'.format(event.event_type, event.src_path))

     # get amount of given by the user
     lightCycles  = len(data['lightCycles'])
     pumpCycles  = len(data['pumpCycles'])

     # reset settings for pumps and lights
     loadSettings(data)

     print('Settings successfully changed.')
     sio.emit('Status', 'Settings successfully changed.')


def loadSettings(data):
   # debug prints
   #print('New settings: {}'.format(data))

   # get amount of given by the user
   lightCycles  = len(data['lightCycles'])
   pumpCycles  = len(data['pumpCycles'])

   if lightCycles  == 1:
      schedule.every().day.at("{}".format(data['lightCycles'][0]['startTime'])).do(lightsOn)
      schedule.every().day.at("{}".format(data['lightCycles'][0]['endTime'])).do(lightsOff)

   elif lightCycles == 2:
      schedule.every().day.at("{}".format(data['lightCycles'][0]['startTime'])).do(lightsOn)
      schedule.every().day.at("{}".format(data['lightCycles'][0]['endTime'])).do(lightsOff)

      schedule.every().day.at("{}".format(data['lightCycles'][1]['startTime'])).do(lightsOn)
      schedule.every().day.at("{}".format(data['lightCycles'][1]['endTime'])).do(lightsOff)

   elif lightCycles == 3:
      schedule.every().day.at("{}".format(data['lightCycles'][0]['startTime'])).do(lightsOn)
      schedule.every().day.at("{}".format(data['lightCycles'][0]['endTime'])).do(lightsOff)

      schedule.every().day.at("{}".format(data['lightCycles'][1]['startTime'])).do(lightsOn)
      schedule.every().day.at("{}".format(data['lightCycles'][1]['endTime'])).do(lightsOff)

      schedule.every().day.at("{}".format(data['lightCycles'][2]['startTime'])).do(lightsOn)
      schedule.every().day.at("{}".format(data['lightCycles'][2]['endTime'])).do(lightsOff)


   if pumpCycles  == 1:
      schedule.every().day.at("{}".format(data['pumpCycles'][0]['startTime'])).do(pumpsOn)
      schedule.every().day.at("{}".format(data['pumpCycles'][0]['endTime'])).do(pumpsOff)

   elif pumpCycles == 2:
      schedule.every().day.at("{}".format(data['pumpCycles'][0]['startTime'])).do(pumpsOn)
      schedule.every().day.at("{}".format(data['pumpCycles'][0]['endTime'])).do(pumpsOff)

      schedule.every().day.at("{}".format(data['pumpCycles'][1]['startTime'])).do(pumpsOn)
      schedule.every().day.at("{}".format(data['pumpCycles'][1]['endTime'])).do(pumpsOff)

   elif pumpCycles == 3:
      schedule.every().day.at("{}".format(data['pumpCycles'][0]['startTime'])).do(pumpsOn)
      schedule.every().day.at("{}".format(data['pumpCycles'][0]['endTime'])).do(pumpsOff)

      schedule.every().day.at("{}".format(data['pumpCycles'][1]['startTime'])).do(lightsOn)
      schedule.every().day.at("{}".format(data['pumpCycles'][1]['endTime'])).do(pumpsOff)

      schedule.every().day.at("{}".format(data['pumpCycles'][2]['startTime'])).do(pumpsOn)
      schedule.every().day.at("{}".format(data['pumpCycles'][2]['endTime'])).do(pumpsOff)

def pumpsOn():
   ser.write(b'2')
   print('Pumps on at %s' % datetime.now())
   time.sleep(1)

def pumpsOff():
   ser.write(b'20')
   print('Pumps off at %s' % datetime.now())
   time.sleep(1)

def lightsOn():
   ser.write(b'1')
   print('Lights on at %s' % datetime.now())
   time.sleep(1) # wait for command to upload

def lightsOff():
   ser.write(b'10')
   print('Lights off at %s' % datetime.now())
   time.sleep(1) # wait for command to upload

# JSON string format:
data = json.load(settings)
#print(type(data))

loadSettings(data)

ser = serial.Serial('/dev/ttyACM0', 112500)
#ser.write('10') # turn off pumps on start of script

if __name__ == "__main__":
   event_handler = MyHandler()
   observer = Observer()
   observer.schedule(event_handler, path=SETTINGS_PATH, recursive=False)
   observer.start()

   print('Statics control subsystem scheduler has started.')

   try:
      while True:

         # read latest csv file saved by bluelab connect
         list_of_files = glob.glob('../gui/*csv')
         BLUELAB = max(list_of_files, key=os.path.getctime)

         # reading in bluelab nutrient tank data
         with open(BLUELAB, newline='') as csvfile:
             sysData = csv.reader(csvfile, delimiter=' ')
             for row in sysData:
                 row = ','.join(row)
                 row = row.split(',')

             print(row[4:7])
             # setting the JSON format
             row = {"tank":{"EC": '{} ppm'.format(row[4]), "ph": '{}'.format(row[5]), "temp": '{} '.format(row[6])+'\u2103'}}
             row = json.dumps(row)
             print(row)

             # saving the JSON file to be read by the server
             js = open('../gui/public/data.json', 'w')
             js.write(row)
             js.close()

         schedule.run_pending()
         time.sleep(60)

   except KeyboardInterrupt:
      pixels.fill((255,0,0))
      observer.stop()

   observer.join()

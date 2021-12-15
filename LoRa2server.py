#!/usr/bin/env python3
import serial
import time
import sys

ser = serial.Serial()
ser.port = '/dev/ttyS0'
ser.baudrate = 9600
parity = serial.PARITY_NONE,
stopbits = serial.STOPBITS_ONE,
bytesize = serial.EIGHTBITS,

try:
	ser.close()
	ser.open()
	print("open " + ser.port )
except:
	print("cannot open " + ser.port )
	sys.exit(0)

try:
	while True:
		s = ser.readline().decode('utf-8') 
		if s != "":
				print(s)
				time.sleep(0.1)
			else:
				time.sleep(0.1)
				pass
		sys.stdout.flush()
		
except Exception as e:
	print(e)

finally:
	ser.close()
	print("serial connection closed")
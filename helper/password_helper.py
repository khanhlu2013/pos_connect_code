import os, random, string

def generate_password():
	length = 13
	chars = string.ascii_letters + string.digits + '!@#$%^&*()'
	random.seed = (os.urandom(1024))

	return ''.join(random.choice(chars) for i in range(length))

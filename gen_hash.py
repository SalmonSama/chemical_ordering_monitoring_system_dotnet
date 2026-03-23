import subprocess, sys
subprocess.call([sys.executable, '-m', 'pip', 'install', 'bcrypt', '-q'])
import bcrypt

password = "Chemwatch1!"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=11))
print(hashed.decode('utf-8'))

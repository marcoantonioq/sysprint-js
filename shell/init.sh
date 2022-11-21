#iniciando cups e smb

/usr/sbin/cupsd
/usr/sbin/smbd
/usr/sbin/nmbd

#criando impressora default
sleep 20
lpadmin -p cups-pdf -v cups-pdf:/ -E -P /usr/share/ppd/cups-pdf/CUPS-PDF.ppd

# Atualiza servidor
git stash
git pull --ff-only

# Atualiza app
npm install

# Start
npm run build
npm run start

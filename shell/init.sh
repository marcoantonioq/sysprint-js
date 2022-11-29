#iniciando cups e smb

/usr/sbin/cupsd
/usr/sbin/smbd
/usr/sbin/nmbd

#criando impressora default
sleep 20
lpadmin -p cups-pdf -v cups-pdf:/ -E -P /usr/share/ppd/cups-pdf/CUPS-PDF.ppd

# Atualiza servidor
UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "Need to pull"
elif [ $REMOTE = $BASE ]; then
    echo "Need to push"
else
    echo "Diverged"
fi

git stash
git pull --ff-only

# Atualiza app
npm install

# Start
npm run build
npm run start

#iniciando cups e smb

/usr/sbin/cupsd
/usr/sbin/smbd
/usr/sbin/nmbd

#criando impressora default
sleep 20
lpadmin -p cups-pdf -v cups-pdf:/ -E -P /usr/share/ppd/cups-pdf/CUPS-PDF.ppd

while true; do
    # Atualiza servidor
    git fetch
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse @{u})

    if [ $LOCAL = $REMOTE ]; then
        echo "Aplicação atualizada!"
    else
        echo "Atualizando instalação:"
        git stash
        git pull --ff-only
        chmod +x $0
        # Atualiza app
        npm install
        # Build
        npm run build
    fi

    # Start
    npm run start || npm run build
done

sed -i 's/JobPrivateValues default/JobPrivateValues none/g' /etc/cups/cupsd.conf
systemctl restart cups

FROM node:12.18.0
RUN mkdir -p /app/shell/config
WORKDIR /app

RUN  apt-get update \
    && apt-get install -y wget git gnupg ca-certificates \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
    && chmod +x /usr/sbin/wait-for-it.sh \
    && apt-get install -y zlib1g-dev libmcrypt-dev libicu-dev g++ cups vim net-tools smbclient \
    samba samba-common-bin libldb-dev libldap-dev sudo printer-driver-cups-pdf cups-filters foomatic-db-compressed-ppds printer-driver-all \
    openprinting-ppds hpijs-ppds hpijs-ppds hp-ppd hplip \
    && apt-get clean && sudo apt-get autoremove \
    && rm -rf /var/lib/apt/lists/*

RUN sudo useradd -g lpadmin cupsadmin
RUN echo 'admin\nadmin' | passwd cupsadmin
COPY shell/cups/config/cupsd.conf /etc/cups

EXPOSE 3010
EXPOSE 80
EXPOSE 135
EXPOSE 136
EXPOSE 137
EXPOSE 138
EXPOSE 139
EXPOSE 445
EXPOSE 631

CMD ["shell/init.sh"]
FROM node:18.12.1
WORKDIR /app

RUN  apt-get update \
    && apt-get install -y wget git openssl gnupg ca-certificates zlib1g-dev libmcrypt-dev libicu-dev g++ cups vim net-tools smbclient \
    samba samba-common-bin libldb-dev libldap-dev sudo printer-driver-cups-pdf cups-filters foomatic-db-compressed-ppds printer-driver-all \
    openprinting-ppds hpijs-ppds hpijs-ppds hp-ppd hplip \
    && apt-get clean && sudo apt-get autoremove \
    && rm -rf /var/lib/apt/lists/*

RUN sudo useradd -g lpadmin cupsadmin
RUN echo 'admin\nadmin' | passwd cupsadmin
COPY ./shell/cupsd.conf /etc/cups

ENV HOST 0.0.0.0

EXPOSE 3000
EXPOSE 80
EXPOSE 135
EXPOSE 136
EXPOSE 137
EXPOSE 138
EXPOSE 139
EXPOSE 445
EXPOSE 631

CMD ["shell/init.sh"]
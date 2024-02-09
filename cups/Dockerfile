FROM debian:buster

ARG ADMIN_USER=${ADMIN_USER}
ARG ADMIN_PASS=${ADMIN_PASS}
ENV TZ="America/Sao_Paulo" \
    LANG="pt_BR.UTF-8" \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    build-essential \
    libpoppler-dev \
    libssl-dev \
    libtool \
    libusb-1.0-0-dev

WORKDIR /cups
RUN curl -L https://github.com/OpenPrinting/cups/releases/download/v2.4.7/cups-2.4.7-source.tar.gz | tar xzvf -
WORKDIR /cups/cups-2.4.7  
RUN ./configure --prefix=/usr --sysconfdir=/etc

RUN make -j $(nproc)

RUN make install

RUN ldconfig

COPY cupsd.conf /etc/cups/cupsd.conf

RUN useradd -g root $ADMIN_USER && \
    echo "$ADMIN_USER:$ADMIN_PASS" | chpasswd

RUN apt install -y --no-install-recommends  printer-driver-all \
    openprinting-ppds hpijs-ppds hpijs-ppds hp-ppd 

RUN apt install -y --no-install-recommends foomatic-db-compressed-ppds

RUN apt install -y --no-install-recommends hplip
#     git curl gnupg poppler-utils zlib1g-dev libmcrypt-dev libicu-dev g++ cups cups-pdf cups-client vim net-tools smbclient \
# samba samba-common-bin libldb-dev libldap-dev printer-driver-cups-pdf cups-filters foomatic-db-compressed-ppds printer-driver-all \
# openprinting-ppds hpijs-ppds hpijs-ppds hp-ppd hplip && \

EXPOSE 3000 136 137 138 139 445 631

CMD ["/usr/sbin/cupsd", "-f"]

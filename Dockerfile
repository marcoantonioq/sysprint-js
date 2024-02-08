FROM ubuntu:22.04
LABEL maintainer="Marco Antônio <ti.goias@ifg.edu.br>"

# Variáveis
ARG ADMIN_USER=${ADMIN_USER}
ARG ADMIN_PASS=${ADMIN_PASS}
ENV TZ="America/Sao_Paulo" \
    LANG="pt_BR.UTF-8" \
    DEBIAN_FRONTEND=noninteractive

# Pacotes
RUN apt-get update && apt-get install -y \
    curl gnupg poppler-utils zlib1g-dev libmcrypt-dev libicu-dev g++ cups cups-pdf cups-client vim net-tools smbclient \
    samba samba-common-bin libldb-dev libldap-dev printer-driver-cups-pdf cups-filters foomatic-db-compressed-ppds printer-driver-all \
    openprinting-ppds hpijs-ppds hpijs-ppds hp-ppd hplip && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Timezone
RUN ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

# Admin
RUN useradd -g lpadmin $ADMIN_USER && \
    echo "$ADMIN_USER:$ADMIN_PASS" | chpasswd

# CUPS
COPY config/start /start
COPY config/cupsd.conf /etc/cups/cupsd.conf
RUN chmod +x /start

# Set working directory
WORKDIR /app

# Copiando
COPY client /app/client
COPY server /app/server

WORKDIR /app/client
RUN npm install && npm run build

WORKDIR /app/server
RUN npm install && npm run build

# Portas
EXPOSE 3000 136 137 138 139 445 631

# Run
CMD ["/start"]

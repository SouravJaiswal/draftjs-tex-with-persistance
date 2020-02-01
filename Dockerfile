FROM ubuntu
# Install all the locales and update the system
RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.utf8
RUN apt-get update && apt-get -y upgrade
# Install curl, git to install n (for node)
RUN apt-get install -y git curl screen
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs
RUN curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
# Run the container on port 3000
ADD tconfig/* /root/
EXPOSE 3000
WORKDIR /app

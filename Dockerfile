FROM ubuntu:20.04
LABEL maintainer "Thijs Tops"

# Set the timezone to Amsterdam
ENV TZ=Europe/Amsterdam
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Update apt, so we can install things
RUN apt-get -y update
RUN apt-get -y install git curl

# Clone the git repository
RUN git clone https://github.com/antfu/set-game 

# Set the working directory
WORKDIR set-game

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get -y install nodejs

RUN npm install

# Run the game
CMD ["npm", "run", "run"]
